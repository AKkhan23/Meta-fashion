import { useState, useEffect, Suspense, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { getAllProducts } from '../features/products/productSlice'
import { LoadingScreen } from '../components/LoadingScreen'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const AVATAR_GLB = "/still_human.glb"
const AVATAR_TSHIRT_GLB = "/still_human.glb"  // 3819 verts — from avatar_model/avatar (1).zip (also copied to /avatar-tshirt.glb + /avatar_tshirt.glb)
const AVATAR_JACKET_GLB = "/avatar_jacket_variant.glb"  // 7037 verts — from products/try-on/avatar.zip (also copied to /avatar-jacket.glb + /avatar_jacket.glb)
// Also register hyphen copies for future (after dev server restart they will be available)
const AVATAR_TSHIRT_HYPHEN = "/avatar-tshirt.glb"
const AVATAR_JACKET_HYPHEN = "/avatar-jacket.glb"
// Preload both so switching is instant — use working files first, hyphen as secondary (needs restart to be served)
try { useGLTF.preload(AVATAR_TSHIRT_GLB); useGLTF.preload(AVATAR_JACKET_GLB); useGLTF.preload(AVATAR_TSHIRT_HYPHEN); useGLTF.preload(AVATAR_JACKET_HYPHEN); } catch(e) {}

// Exact mesh names for new avatar — single mesh per clothing slot, no layered hoodie
const OUTFIT_TOP = 'outfit_top'       // shirts/hoodies/jackets/dresses — Y ~0.93 to 1.62
const OUTFIT_BOTTOM = 'outfit_bottom' // pants/jeans — Y ~0.07 to 1.05
const OUTFIT_SHOES = 'outfit_shoes'   // footwear — Y ~0 to 0.13

// Variant GLBs — 2 alag models jo user ne diye hain:
//  - TShirt model: client/public/avatar_model/avatar (1).zip  -> 3819 verts (tshirt proper)
//  - Jacket model: client/public/products/try-on/avatar.zip -> 7037 verts (jacket/hoodie)
//  Verified: avatar.zip = 7037 verts, avatar (1).zip = 3819 verts
//  Public me ab 4 aliases hain (same content, different names for compatibility):
//    TShirt: /still_human.glb = /avatar-tshirt.glb = /avatar_tshirt.glb (3819)
//    Jacket: /avatar_jacket_variant.glb = /avatar-jacket.glb = /avatar_jacket.glb (7037)
//  Restart ke baad hyphen wale bhi serve honge; abhi working files use karo taaki 404 na aaye
const VARIANT_GLB = {
  tshirt: "/still_human.glb",
  hoodie: "/avatar_jacket_variant.glb",
  jacket: "/avatar_jacket_variant.glb",
  shirt: "/still_human.glb",
}
// Hyphen aliases — dev server restart ke baad available honge
const VARIANT_GLB_HYPHEN = {
  tshirt: "/avatar-tshirt.glb",
  hoodie: "/avatar-jacket.glb",
  jacket: "/avatar-jacket.glb",
  shirt: "/avatar-tshirt.glb",
}
const VARIANT_FALLBACK = {
  "/avatar-tshirt.glb": "/still_human.glb",
  "/avatar-jacket.glb": "/avatar_jacket_variant.glb",
  "/avatar_tshirt.glb": "/still_human.glb",
  "/avatar_jacket.glb": "/avatar_jacket_variant.glb",
}
const outfitTopGeometryVariants = {} // shape -> BufferGeometry, cached once per spec
const outfitGeometryVariants = outfitTopGeometryVariants // alias for backward compat
let variantsLoading = false

function getGarmentShapeForProduct(product) {
  if (product?.garmentShape) {
    // Explicit data-driven mapping — no guessing
    // Dress currently maps to tshirt until dress-shaped variant exists
    if (product.garmentShape === 'dress' || product.garmentShape === 'saree') {
      console.warn(`[Variant] Product '${product.name}' is ${product.garmentShape}-shaped — using tshirt geometry as closest fallback.`)
      return 'tshirt'
    }
    if (product.garmentShape === 'jacket') return 'hoodie' // normalize jacket → hoodie for now
    if (product.garmentShape === 'shirt') return 'tshirt'
    return product.garmentShape // "tshirt" | "hoodie" (explicit)
  }
  console.warn(`[Variant] Product '${product?.name || product?._id}' missing garmentShape — defaulting to 'tshirt'`)
  return 'tshirt'
}

async function loadVariantGeometry(shape, url) {
  if (outfitTopGeometryVariants[shape]) return outfitTopGeometryVariants[shape]
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader()
    loader.load(
      url,
      (gltf) => {
        let found = null
        gltf.scene.traverse((child) => {
          if (child.isMesh && child.name === OUTFIT_TOP) found = child
        })
        if (!found) {
          gltf.scene.traverse((child) => {
            if (!found && child.isMesh && child.name.toLowerCase().includes('top')) found = child
          })
        }
        if (found && found.geometry) {
          const geom = found.geometry.clone()
          if (found.geometry.attributes.skinIndex && !geom.attributes.skinIndex) {
            geom.setAttribute('skinIndex', found.geometry.attributes.skinIndex.clone())
          }
          if (found.geometry.attributes.skinWeight && !geom.attributes.skinWeight) {
            geom.setAttribute('skinWeight', found.geometry.attributes.skinWeight.clone())
          }
          outfitTopGeometryVariants[shape] = geom
          // keep alias in sync
          outfitGeometryVariants[shape] = geom
          console.log(`[Variant] Cached geometry for shape '${shape}' from ${url} — verts=${geom.attributes.position.count}`)
          resolve(geom)
        } else {
          console.warn(`[Variant] No '${OUTFIT_TOP}' mesh found in ${url} for shape '${shape}'`)
          reject(new Error(`No outfit_top in ${url}`))
        }
      },
      undefined,
      (err) => {
        console.warn(`[Variant] Failed to load ${url} for shape '${shape}':`, err?.message || err)
        reject(err)
      }
    )
  })
}

function preloadOutfitVariants() {
  if (variantsLoading) return
  variantsLoading = true
  const uniqueUrls = [...new Set(Object.values(VARIANT_GLB))]
  console.log('[Variant] Preload initiated for:', uniqueUrls)
  uniqueUrls.forEach(url => {
    const shape = Object.keys(VARIANT_GLB).find(k => VARIANT_GLB[k] === url) || 'tshirt'
    if (url === AVATAR_GLB) return // base already cached from main scene (avatar-tshirt.glb)
    loadVariantGeometry(shape, url).catch(() => {
      const fallback = VARIANT_FALLBACK[url]
      if (fallback) {
        console.warn(`[Variant] ${url} failed — trying fallback ${fallback}`)
        loadVariantGeometry(shape, fallback).catch(() => {
          console.warn(`[Variant] Shape '${shape}' will fallback to base tshirt geometry`)
        })
      } else {
        console.warn(`[Variant] Shape '${shape}' will fallback to base tshirt geometry until ${url} is provided`)
      }
    })
  })
}

function findTargetMeshes(scene, productOrCategory) {
  const allMeshes = []
  scene.traverse((child) => { if (child.isMesh) allMeshes.push(child) })
  if (!findTargetMeshes.logged) {
    console.log('[AvatarTryOn] GLB meshes:', allMeshes.map(m => m.name || '(unnamed)'))
    const hasTop = allMeshes.some(m => m.name === OUTFIT_TOP)
    const hasBottom = allMeshes.some(m => m.name === OUTFIT_BOTTOM)
    const hasShoes = allMeshes.some(m => m.name === OUTFIT_SHOES)
    console.log(`[AvatarTryOn] outfit_top:${hasTop} outfit_bottom:${hasBottom} outfit_shoes:${hasShoes}`)
    findTargetMeshes.logged = true
  }
  // If no product specified (initial mount), return all three for bbox setup
  if (!productOrCategory) {
    return allMeshes.filter(m => [OUTFIT_TOP, OUTFIT_BOTTOM, OUTFIT_SHOES].includes(m.name))
  }
  const cat = typeof productOrCategory === 'string' ? productOrCategory : productOrCategory?.category
  const name = typeof productOrCategory === 'string' ? '' : (productOrCategory?.name || '').toLowerCase()
  // Category → exact mesh mapping per spec
  if (cat === 'Shoes') {
    const shoes = allMeshes.find(m => m.name === OUTFIT_SHOES)
    return shoes ? [shoes] : []
  }
  if (cat === "Men's Fashion" || cat === "Women's Fashion" || cat === "Hoodies") {
    // Hoodies sab hoodie shape (7037) pe jayenge; TShirt tshirt pe
    // Pants/Jeans → outfit_bottom, everything else upper wear (tshirt/hoodie/jacket/dress) → outfit_top
    if (/\bjeans\b/.test(name) || /\bpants?\b/.test(name) || /\btrousers?\b/.test(name) || /\bbottoms?\b/.test(name)) {
      const bot = allMeshes.find(m => m.name === OUTFIT_BOTTOM)
      return bot ? [bot] : []
    }
    const top = allMeshes.find(m => m.name === OUTFIT_TOP)
    return top ? [top] : []
  }
  // Bags/accessories → no bag mesh exists on this avatar
  if (cat === 'Bags') return []
  return []
}

// --- Planar projection — confined TOP 28% band for legacy, full-bbox for separated outfit meshes ---
function ensurePlanarUV(mesh, image) {
  let geom = mesh.geometry
  if (!geom.userData._avatarCloned) {
    geom = mesh.geometry = geom.clone()
    geom.userData._avatarCloned = true
  }
  if (geom.attributes.uv && !geom.userData.originalUV) {
    geom.userData.originalUV = geom.attributes.uv.array.slice()
  }
  if (!geom.userData.bbox) {
    geom.computeBoundingBox()
    const bbox = geom.boundingBox
    if (!bbox) return
    geom.userData.bbox = { min: bbox.min.clone(), max: bbox.max.clone() }
  }
  const bboxMin = geom.userData.bbox.min
  const bboxMax = geom.userData.bbox.max
  const pos = geom.attributes.position
  const count = pos.count

  if (!geom.userData.bboxLogged && [OUTFIT_TOP, OUTFIT_BOTTOM, OUTFIT_SHOES].includes(mesh.name)) {
    console.log(`[AvatarTryOn] ${mesh.name} bbox.min`, bboxMin, 'bbox.max', bboxMax, `verts:${count}`)
    console.log(`[AvatarTryOn] ${mesh.name} rangeX=${(bboxMax.x - bboxMin.x).toFixed(2)} rangeY=${(bboxMax.y - bboxMin.y).toFixed(2)} rangeZ=${(bboxMax.z - bboxMin.z).toFixed(2)}`)
    geom.userData.bboxLogged = true
  }

  const minX = bboxMin.x, maxX = bboxMax.x
  const minY = bboxMin.y, maxY = bboxMax.y
  let rangeX = maxX - minX
  let rangeY = maxY - minY
  if (rangeX < 1e-6) rangeX = 1
  if (rangeY < 1e-6) rangeY = 1

  // Preserve image aspect
  let imageAspect = 1
  if (image && image.width && image.height) imageAspect = image.width / image.height
  const aspectKey = imageAspect.toFixed(4)
  if (geom.userData.planarUV && geom.userData.planarUVAspect === aspectKey && geom.userData.planarUVApplied) return
  if (geom.userData.planarUV && geom.userData.planarUVAspect === aspectKey && !geom.userData.planarUVApplied) {
    geom.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(geom.userData.planarUV), 2))
    geom.attributes.uv.needsUpdate = true
    geom.userData.planarUVApplied = true
    return
  }

  // Separated meshes: full-bbox planar (no band needed — each mesh already scoped to its garment)
  const meshAspect = rangeX / rangeY
  const scaleU = imageAspect / meshAspect
  const newUV = new Float32Array(count * 2)
  for (let i = 0; i < count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const uRaw = (x - minX) / rangeX
    const u = 0.5 + (uRaw - 0.5) * scaleU
    const v = (y - minY) / rangeY
    newUV[i * 2] = u
    newUV[i * 2 + 1] = v
  }
  geom.userData.planarUV = newUV.slice()
  geom.userData.planarUVAspect = aspectKey
  geom.userData.planarUVApplied = true
  geom.setAttribute('uv', new THREE.BufferAttribute(newUV, 2))
  geom.attributes.uv.needsUpdate = true
}

function restoreOriginalUV(mesh) {
  const geom = mesh.geometry
  if (geom.userData.originalUV) {
    geom.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(geom.userData.originalUV), 2))
    geom.attributes.uv.needsUpdate = true
    geom.userData.planarUVApplied = false
  }
}

function AutoFit({ target, controlsRef }) {
  const { camera } = useThree()
  useEffect(() => {
    if (!target) return
    if (target.userData._autoFitted) return
    // 1. Compute actual bounding box via Box3().setFromObject(model)
    const box = new THREE.Box3().setFromObject(target)
    const center = new THREE.Vector3()
    const size = new THREE.Vector3()
    box.getCenter(center)
    box.getSize(size)
    console.log('[AutoFit] BEFORE bbox center', center, 'size', size, 'min', box.min, 'max', box.max)
    // 2. Auto-center: ground feet at y=0 via min.y, center x/z at 0
    target.position.x -= center.x
    target.position.z -= center.z
    target.position.y -= box.min.y
    target.updateMatrixWorld(true)
    // 3. Auto-scale to consistent target height 1.7m
    const targetHeight = 1.7
    const scaleFactor = targetHeight / size.y
    target.scale.setScalar(scaleFactor)
    target.updateMatrixWorld(true)
    console.log('[AutoFit] scaleFactor', scaleFactor, 'targetHeight', targetHeight, 'original size.y', size.y)
    // 4. Recompute bbox post-scale for camera
    const box2 = new THREE.Box3().setFromObject(target)
    const center2 = new THREE.Vector3()
    const size2 = new THREE.Vector3()
    box2.getCenter(center2)
    box2.getSize(size2)
    const fov = camera.fov * (Math.PI / 180)
    const distance = (size2.y / (2 * Math.tan(fov / 2))) * 1.3
    const verticalCenterY = box2.min.y + size2.y * 0.5
    console.log('[AutoFit] AFTER bbox center', center2, 'size', size2, 'distance', distance, 'verticalCenterY', verticalCenterY)
    if (controlsRef?.current) {
      controlsRef.current.target.set(center2.x, verticalCenterY, center2.z)
      controlsRef.current.update()
    }
    camera.position.set(center2.x, verticalCenterY, center2.z + distance)
    camera.lookAt(center2.x, verticalCenterY, center2.z)
    camera.updateProjectionMatrix()
    target.userData._autoFitted = true
    target.userData._autoFitScale = scaleFactor
    target.userData._autoFitCenter = center2.clone()
  }, [target, camera, controlsRef])
  return null
}

function createCheckerTexture() {
  const size = 512
  const grid = 8
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const cell = size / grid
  for (let y = 0; y < grid; y++) {
    for (let x = 0; x < grid; x++) {
      const isRed = (x + y) % 2 === 0
      ctx.fillStyle = isRed ? '#ef4444' : '#ffffff'
      ctx.fillRect(x * cell, y * cell, cell, cell)
      ctx.fillStyle = isRed ? '#ffffff' : '#111827'
      ctx.font = `${Math.round(cell * 0.28)}px monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(`${x},${y}`, x * cell + cell / 2, y * cell + cell / 2)
      ctx.strokeStyle = '#111827'
      ctx.lineWidth = 1
      ctx.strokeRect(x * cell, y * cell, cell, cell)
    }
  }
  // center cross for front orientation
  ctx.strokeStyle = '#00ff00'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(size / 2, 0); ctx.lineTo(size / 2, size)
  ctx.moveTo(0, size / 2); ctx.lineTo(size, size / 2)
  ctx.stroke()
  // border
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 4
  ctx.strokeRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.ClampToEdgeWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  tex.colorSpace = THREE.SRGBColorSpace
  tex.needsUpdate = true
  tex.flipY = false
  return tex
}

function logOutfitDiagnostics(clonedScene, mesh) {
  const geom = mesh.geometry
  // ensure bbox computed for log
  if (!geom.userData.bbox) {
    geom.computeBoundingBox()
    const bbox = geom.boundingBox
    if (bbox) geom.userData.bbox = { min: bbox.min.clone(), max: bbox.max.clone() }
  }
  const bbox = geom.userData.bbox ? { min: geom.userData.bbox.min, max: geom.userData.bbox.max } : geom.boundingBox
  console.log(`[DIAG] BEFORE apply — ${mesh.name} position.count =`, geom.attributes.position.count)
  if (bbox) {
    console.log(`[DIAG] ${mesh.name} bbox.min`, bbox.min, `bbox.max`, bbox.max)
    console.log(`[DIAG] ${mesh.name} bbox range`, {
      x: (bbox.max.x - bbox.min.x).toFixed(4),
      y: (bbox.max.y - bbox.min.y).toFixed(4),
      z: (bbox.max.z - bbox.min.z).toFixed(4)
    })
  } else {
    console.log('[DIAG] bbox unavailable')
  }
  console.log(`[DIAG] ${mesh.name} geometry.groups`, geom.groups, `groups.length=${geom.groups?.length || 0}`)
  console.log(`[DIAG] ${mesh.name} geometry.index`, geom.index ? `indexed count ${geom.index.count}` : 'non-indexed')

  let outfitCount = 0
  const outfitNames = []
  clonedScene.traverse((child) => {
    if (child.isMesh && child.name && [OUTFIT_TOP, OUTFIT_BOTTOM, OUTFIT_SHOES].includes(child.name)) {
      outfitCount++
      outfitNames.push(child.name)
    }
  })
  console.log(`[DIAG] Outfit meshes found: ${outfitCount}`, outfitNames)
  const nameCounts = {}
  clonedScene.traverse((child) => { if (child.isMesh) nameCounts[child.name] = (nameCounts[child.name]||0)+1 })
  Object.entries(nameCounts).forEach(([name,cnt])=> { if(cnt>1 && [OUTFIT_TOP, OUTFIT_BOTTOM, OUTFIT_SHOES].includes(name)) console.warn(`[DIAG] DUPLICATE ${name} x${cnt} — overlapping!`) })
}

function AvatarModel({ modelUrl, selectedProduct, debugChecker, controlsRef }) {
  const { scene } = useGLTF(modelUrl)
  // Remount clonedScene when modelUrl changes — keyed wrapper also does this, but keep in sync
  const [clonedScene, setClonedScene] = useState(() => scene.clone(true))
  const { camera } = useThree()

  // When modelUrl changes, scene reference updates — rebuild clone
  useEffect(() => {
    const next = scene.clone(true)
    // reset flags so pose+autofit re-run for new model
    next.userData._poseFixed = false
    next.userData._autoFitted = false
    delete next.userData._autoFitScale
    setClonedScene(next)
    console.log(`[AvatarModel] Switched modelUrl=${modelUrl} — outfit_top verts=${next.getObjectByName(OUTFIT_TOP)?.geometry?.attributes?.position?.count ?? '?'}`)
  }, [scene, modelUrl])

  // Store original colors/maps to restore — recompute when clonedScene changes (model switch)
  const [originalState, setOriginalState] = useState(() => {
    const map = new Map()
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material = child.material.map(m => m.clone())
        } else {
          child.material = child.material.clone()
        }
        const mats = Array.isArray(child.material) ? child.material : [child.material]
        mats.forEach(m => {
          map.set(m.uuid, { color: m.color.clone(), map: m.map })
        })
      }
    })
    return map
  })
  useEffect(() => {
    const map = new Map()
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        // ensure material is cloned for this instance
        if (child.material && !child.material.userData?._clonedForTryOn) {
          if (Array.isArray(child.material)) {
            child.material = child.material.map(m => { const c=m.clone(); c.userData._clonedForTryOn=true; return c })
          } else {
            const c=child.material.clone(); c.userData._clonedForTryOn=true; child.material=c
          }
        }
        const mats = Array.isArray(child.material) ? child.material : [child.material]
        mats.forEach(m => {
          if (!map.has(m.uuid)) map.set(m.uuid, { color: m.color.clone(), map: m.map })
        })
      }
    })
    setOriginalState(map)
    console.log(`[AvatarModel] originalState refreshed for ${modelUrl} — mats=${map.size}`)
  }, [clonedScene, modelUrl])

  // Fix pose + Auto-fit (combined for correct bbox after posing)
  useEffect(() => {
    if (clonedScene.userData._poseFixed) return
    const setRot = (name, x, y, z) => {
      const bone = clonedScene.getObjectByName(name)
      if (bone) bone.rotation.set(x, y, z)
    }
    ;['LeftShoulder','RightShoulder','LeftArm','RightArm','LeftForeArm','RightForeArm'].forEach(n => {
      const b = clonedScene.getObjectByName(n)
      if (b) console.log(`[PoseFix] BEFORE ${n}`, b.rotation.x.toFixed(3), b.rotation.y.toFixed(3), b.rotation.z.toFixed(3))
    })
    setRot('LeftShoulder', 0, 0, 0.12)
    setRot('RightShoulder', 0, 0, -0.12)
    setRot('LeftArm', 0, 0, -1.35)
    setRot('RightArm', 0, 0, 1.35)
    setRot('LeftForeArm', 0, 0, -0.05)
    setRot('RightForeArm', 0, 0, 0.05)
    clonedScene.updateMatrixWorld(true)
    ;['LeftShoulder','RightShoulder','LeftArm','RightArm'].forEach(n => {
      const b = clonedScene.getObjectByName(n)
      if (b) console.log(`[PoseFix] AFTER ${n}`, b.rotation.x.toFixed(3), b.rotation.y.toFixed(3), b.rotation.z.toFixed(3))
    })
    clonedScene.userData._poseFixed = true
    // Auto-fit after pose is fixed — so bbox reflects A-pose not T-pose
    if (clonedScene.userData._autoFitted) return
    const box = new THREE.Box3().setFromObject(clonedScene)
    const center = new THREE.Vector3()
    const size = new THREE.Vector3()
    box.getCenter(center)
    box.getSize(size)
    console.log('[AutoFit] BEFORE bbox center', center, 'size', size, 'min', box.min, 'max', box.max)
    clonedScene.position.x -= center.x
    clonedScene.position.z -= center.z
    clonedScene.position.y -= box.min.y
    clonedScene.updateMatrixWorld(true)
    const targetHeight = 1.7
    const scaleFactor = targetHeight / size.y
    clonedScene.scale.setScalar(scaleFactor)
    clonedScene.updateMatrixWorld(true)
    console.log('[AutoFit] scaleFactor', scaleFactor.toFixed(4), 'targetHeight', targetHeight)
    const box2 = new THREE.Box3().setFromObject(clonedScene)
    const center2 = new THREE.Vector3()
    const size2 = new THREE.Vector3()
    box2.getCenter(center2)
    box2.getSize(size2)
    const fov = camera.fov * (Math.PI / 180)
    const distance = (size2.y / (2 * Math.tan(fov / 2))) * 1.3
    const verticalCenterY = box2.min.y + size2.y * 0.5
    console.log('[AutoFit] AFTER bbox center', center2, 'size', size2, 'distance', distance.toFixed(3), 'verticalCenterY', verticalCenterY.toFixed(3))
    if (controlsRef?.current) {
      controlsRef.current.target.set(center2.x, verticalCenterY, center2.z)
      controlsRef.current.update()
    }
    camera.position.set(center2.x, verticalCenterY, center2.z + distance)
    camera.lookAt(center2.x, verticalCenterY, center2.z)
    camera.updateProjectionMatrix()
    clonedScene.userData._autoFitted = true
    clonedScene.userData._autoFitScale = scaleFactor
  }, [clonedScene, camera, controlsRef])

  // STEP 1 — Full diagnostic (run first, no texture changes yet)
  useEffect(() => {
    const allMeshes = []
    clonedScene.traverse((child) => { if (child.isMesh) allMeshes.push(child) })
    console.log('[MODEL MESH INVENTORY]')
    allMeshes.forEach(mesh => {
      const verts = mesh.geometry.attributes.position?.count ?? '?'
      const visible = mesh.visible
      const groups = mesh.geometry.groups
      console.log(`- ${mesh.name || '(unnamed)'}: verts=${verts}, visible=${visible}, groups=${groups?.length || 0}`)
    })
    // Flag by name patterns — don't assume just one
    const flag = (keywords, label) => {
      const matches = allMeshes.filter(m => keywords.some(k => (m.name||'').toLowerCase().includes(k)))
      if (matches.length) console.log(`[FLAG] ${label}:`, matches.map(m => `${m.name} (verts=${m.geometry.attributes.position.count}, visible=${m.visible})`).join(' | '))
      else console.log(`[FLAG] ${label}: (none)`)
    }
    flag(['hoodie','hood','top','shirt','upper','torso','chest'], 'TOP/HOODIE/SHIRT candidates')
    flag(['pant','jean','bottom','trouser','lower'], 'PANTS/JEANS candidates')
    flag(['shoe','sneaker','foot'], 'SHOES candidates')
    flag(['hair','eyelash','scalp'], 'HAIR candidates')
    flag(['skin','body','head','teeth','cornea','eyeball'], 'SKIN/BODY candidates')
    flag(['ground','floor'], 'GROUND candidates')
    const outfitCount = allMeshes.filter(m => ['outfit_top','outfit_bottom','outfit_shoes'].includes(m.name)).length
    console.log(`[DIAG] 'outfit_*' matches: ${outfitCount} — outfit_top/bottom/shoes`)
    // Check duplicate exact names
    const nameCounts = {}
    allMeshes.forEach(m => { nameCounts[m.name] = (nameCounts[m.name]||0)+1 })
    Object.entries(nameCounts).forEach(([name,cnt])=> { if(cnt>1) console.warn(`[DIAG] DUPLICATE name '${name}' appears ${cnt}x — overlapping instances!`) })
    // Also log total
    console.log(`[DIAG] Total meshes: ${allMeshes.length}, outfit_top visible=${allMeshes.find(m=>m.name==='outfit_top')?.visible}, outfit_bottom visible=${allMeshes.find(m=>m.name==='outfit_bottom')?.visible}, outfit_shoes visible=${allMeshes.find(m=>m.name==='outfit_shoes')?.visible}`)
  }, [clonedScene])

  // Part 2 Step 2-3: compute planar UVs ONCE at model load, cache in geometry.userData.planarUV
  useEffect(() => {
    const targets = findTargetMeshes(clonedScene)
    targets.forEach(mesh => ensurePlanarUV(mesh))
    // Cache base tshirt geometry from this model for variant swapping
    const topMesh = clonedScene.getObjectByName(OUTFIT_TOP)
    if (topMesh && topMesh.geometry && !outfitTopGeometryVariants['tshirt']) {
      outfitTopGeometryVariants['tshirt'] = topMesh.geometry.clone()
      outfitGeometryVariants['tshirt'] = outfitTopGeometryVariants['tshirt']
      console.log(`[Variant] Cached base tshirt geometry — verts=${topMesh.geometry.attributes.position.count} from ${AVATAR_GLB}`)
      const missing = Object.entries(VARIANT_GLB).filter(([shape, url]) => url !== AVATAR_GLB && !outfitTopGeometryVariants[shape])
      if (missing.length) {
        console.warn(`[Variant] CODE READY — waiting for variant GLBs to be provided: ${missing.map(([s,u])=> `${s} → ${u}`).join(', ')}`)
        console.warn(`[Variant] Until provided, jacket/hoodie products will fallback to tshirt shape (texture only)`)
      }
    }
  }, [clonedScene])

  // Diagnostic: UV checker — uses SAME planar projection, logs diagnostics BEFORE applying
  useEffect(() => {
    if (!debugChecker) return
    const targets = findTargetMeshes(clonedScene)
    if (targets.length === 0) {
      console.warn('[DIAG] No target mesh for checker')
      return
    }
    const checker = createCheckerTexture()
    // Log diagnostics BEFORE applying anything (position.count, bbox, groups)
    targets.forEach(mesh => logOutfitDiagnostics(clonedScene, mesh))
    // Apply SAME per-mesh full-bbox planar projection with checker aspect
    targets.forEach(mesh => ensurePlanarUV(mesh, checker.image))
    console.log('[DIAG] Applying 8x8 checker texture (red/white, numbered) per-mesh full bbox to', targets.map(m => m.name))

    targets.forEach((mesh) => {
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      mats.forEach((m) => {
        const orig = originalState.get(m.uuid)
        if (m.map && m.map !== orig?.map) {
          // don't dispose checker here — keep alive while debug on
          if (m.map !== checker) m.map.dispose?.()
        }
        m.map = checker
        m.color.set(0xffffff)
        m.needsUpdate = true
      })
    })

    return () => {
      // when toggling off, dispose checker
      checker.dispose?.()
    }
  }, [debugChecker, clonedScene, originalState])

  useEffect(() => {
    // Skip garment texture while checker debug is active
    if (debugChecker) return
    let cancelled = false

    const restoreCloth = () => {
      const targets = findTargetMeshes(clonedScene)
      targets.forEach(mesh => {
        restoreOriginalUV(mesh)
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        mats.forEach(m => {
          const orig = originalState.get(m.uuid)
          if (orig) {
            if (m.map && m.map !== orig.map) m.map.dispose?.()
            m.map = orig.map
            m.color.copy(orig.color)
            m.needsUpdate = true
          }
        })
      })
    }

    if (!selectedProduct) {
      restoreCloth()
      return
    }
    // Use cropped garment-only image for 3D try-on (tryOnTexture), NOT listing photo
    const tryOnSrc = selectedProduct.tryOnTexture || selectedProduct.tryOnImage || selectedProduct.image
    if (!tryOnSrc) {
      restoreCloth()
      return
    }

    const targetMeshes = findTargetMeshes(clonedScene, selectedProduct)
    if (targetMeshes.length === 0) {
      // No mesh for this category (e.g., Bags on new model) — restore and exit
      restoreCloth()
      return
    }

    // 4a-4e: Geometry shape swap — same body, different top shape (cached, instant)
    // TShirt click -> tshirt (3819 verts, avatar-tshirt.glb), Jacket click -> jacket/hoodie (7037 verts, avatar-jacket.glb)
    const shape = getGarmentShapeForProduct(selectedProduct)
    let variantGeom = outfitTopGeometryVariants[shape] || outfitGeometryVariants[shape]
    if (!variantGeom && VARIANT_GLB[shape] && VARIANT_GLB[shape] !== AVATAR_GLB) {
      // Try to lazy-load if not preloaded yet (with fallback)
      const url = VARIANT_GLB[shape]
      console.warn(`[Variant] Geometry for shape '${shape}' not yet cached — needs ${url}. Trying to load...`)
      // attempt async load but fallback immediately to tshirt for this frame
      loadVariantGeometry(shape, url).catch(() => {
        const fb = VARIANT_FALLBACK[url]
        if (fb) loadVariantGeometry(shape, fb).catch(()=>{})
      })
      variantGeom = outfitTopGeometryVariants['tshirt'] || outfitGeometryVariants['tshirt']
    }
    if (variantGeom && targetMeshes[0] && targetMeshes[0].name === OUTFIT_TOP) {
      const mesh = targetMeshes[0]
      if (!mesh.userData.originalGeometry) mesh.userData.originalGeometry = mesh.geometry
      if (mesh.geometry.uuid !== variantGeom.uuid && mesh.userData._lastShape !== shape) {
        const newGeom = variantGeom.clone()
        if (!newGeom.attributes.skinIndex && mesh.geometry.attributes.skinIndex) {
          newGeom.setAttribute('skinIndex', mesh.geometry.attributes.skinIndex.clone())
          console.log(`[Variant] Copied skinIndex from original to '${shape}'`)
        }
        if (!newGeom.attributes.skinWeight && mesh.geometry.attributes.skinWeight) {
          newGeom.setAttribute('skinWeight', mesh.geometry.attributes.skinWeight.clone())
          console.log(`[Variant] Copied skinWeight from original to '${shape}'`)
        }
        mesh.geometry.dispose?.()
        mesh.geometry = newGeom
        mesh.geometry.userData._avatarCloned = true
        delete mesh.geometry.userData.bbox
        delete mesh.geometry.userData.planarUV
        delete mesh.geometry.userData.planarUVApplied
        delete mesh.geometry.userData.bboxLogged
        mesh.userData._lastShape = shape
        console.log(`[Variant] Swapped outfit_top geometry to shape '${shape}' — verts=${newGeom.attributes.position.count}`)
        if (mesh.isSkinnedMesh && !mesh.skeleton) {
          console.warn(`[Variant] SkinnedMesh missing skeleton after swap for '${shape}' — may appear distorted, needs skinIndex/skinWeight fix`)
        }
      }
    }

    const loader = new THREE.TextureLoader()
    loader.setCrossOrigin('anonymous')
    let currentTexture = null

    loader.load(
      tryOnSrc,
      (texture) => {
        if (cancelled) {
          texture.dispose()
          return
        }
        currentTexture = texture
        console.log(`[Texture] Loaded ${tryOnSrc} — ${texture.image.width}x${texture.image.height}`)
        // Apply per-mesh full-bbox planar projection with correct aspect — fresh for new geometry
        targetMeshes.forEach(mesh => ensurePlanarUV(mesh, texture.image))
        texture.wrapS = THREE.ClampToEdgeWrapping
        texture.wrapT = THREE.ClampToEdgeWrapping
        texture.colorSpace = THREE.SRGBColorSpace
        texture.flipY = false
        texture.magFilter = THREE.LinearFilter
        texture.minFilter = THREE.LinearMipmapLinearFilter
        texture.generateMipmaps = true
        texture.needsUpdate = true

        console.log(`[AvatarTryOn] Texture applied to ${targetMeshes.length} mesh(es) for "${selectedProduct.category}" — ${selectedProduct.name}`, targetMeshes.map(m => m.name))

        targetMeshes.forEach((mesh) => {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
          mats.forEach((m) => {
            const orig = originalState.get(m.uuid)
            if (m.map && m.map !== orig?.map) m.map.dispose?.()
            m.map = texture
            m.color.set(0xffffff)
            m.needsUpdate = true
          })
        })
      },
      undefined,
      (err) => {
        console.error('[AvatarTryOn] Texture load failed for', tryOnSrc, err)
      }
    )

    return () => {
      cancelled = true
      if (currentTexture) currentTexture.dispose?.()
    }
  }, [selectedProduct, clonedScene, originalState, debugChecker])

  return <primitive object={clonedScene} />
}

function AvatarViewer({ selectedProduct, debugChecker }) {
  const controlsRef = useRef()
  // FULL MODEL SWITCH — tshirt vs HOODIE alag GLB (jacket hata ke hoodies me dala)
  const shape = selectedProduct ? getGarmentShapeForProduct(selectedProduct) : 'tshirt'
  const isJacketShape = shape === 'hoodie' || shape === 'jacket'
  const modelUrl = isJacketShape ? AVATAR_JACKET_GLB : AVATAR_TSHIRT_GLB
  // Also support hyphen copy after restart — if hyphen file exists, prefer it; fallback handled by VARIANT_GLB
  return (
    <div className="relative bg-white rounded-3xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-b from-gray-50 to-white p-3 flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-900">Your Model {isJacketShape ? '🧥 Hoodie' : '👕 TShirt'}</h3>
        <span className={`text-xs text-white px-3 py-1 rounded-full font-bold ${isJacketShape ? 'bg-orange-500' : 'bg-sky-500'}`}>{isJacketShape ? '7037 verts Hoodie' : '3819 verts TShirt'}</span>
      </div>
      <div className="relative w-full h-[560px] bg-white overflow-hidden">
        <Canvas camera={{ position: [0, 0.95, 2.35], fov: 42 }} style={{ background: '#ffffff' }}>
          <ambientLight intensity={1.3} />
          <directionalLight position={[2, 3, 2]} intensity={1.5} />
          <directionalLight position={[-2, 1, -2]} intensity={0.6} />
          <Suspense fallback={null}>
            <AvatarModel key={modelUrl} modelUrl={modelUrl} selectedProduct={selectedProduct} debugChecker={debugChecker} controlsRef={controlsRef} />
          </Suspense>
          <OrbitControls ref={controlsRef} enablePan={false} minDistance={1.2} maxDistance={5} target={[0, 0.85, 0]} autoRotate={!debugChecker} autoRotateSpeed={0.8} />
        </Canvas>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-charcoal/70 text-white text-xs px-3 py-1 rounded-full pointer-events-none z-20">Drag • Scroll zoom</div>
        {debugChecker && <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs px-4 py-1 rounded-full font-bold pointer-events-none z-30">DIAG: Checker ON</div>}
      </div>
      {debugChecker && (
        <div className="p-2.5 bg-red-600 text-white text-xs font-mono">
          <p className="font-bold">DIAG MODE: Checker 8×8 — same planar UV. Console logs dekho.</p>
        </div>
      )}
      {selectedProduct && !debugChecker && (
        <div className="p-4 bg-gray-900 text-white">
          <p className="text-sm font-bold">{selectedProduct.name} <span className="text-amber-400">• ₹{selectedProduct.salePrice}</span> <span className="text-xs font-normal text-gray-400">({selectedProduct.category})</span></p>
          <p className="text-xs text-gray-400 line-clamp-2">{selectedProduct.description}</p>
          <p className="text-xs text-gray-500">Model: {getGarmentShapeForProduct(selectedProduct) === 'hoodie' || getGarmentShapeForProduct(selectedProduct) === 'jacket' ? '🧥 Hoodie (avatar-jacket.glb, 7037 verts — from products/try-on/avatar.zip, ab Hoodies section)' : '👕 TShirt (avatar-tshirt.glb, 3819 verts — from avatar_model/avatar (1).zip)'} {outfitTopGeometryVariants[getGarmentShapeForProduct(selectedProduct)] ? '✓ cached' : '⚠ loading...'}</p>
          {selectedProduct.category === 'Shoes' ? (
            <p className="text-xs text-green-400 mt-1">Shoes → outfit_shoes — per-mesh bbox, ClampToEdge, no tint</p>
          ) : selectedProduct.category === 'Bags' ? (
            <p className="text-xs text-yellow-400 mt-1">Accessory preview not available on this avatar — no bag mesh (outfit_top/bottom/shoes only)</p>
          ) : /\bjeans\b|\bpants?\b|\btrousers?\b|\bbottoms?\b/i.test(selectedProduct.name) ? (
            <p className="text-xs text-green-400 mt-1">Jeans/Pants → outfit_bottom — per-mesh bbox, ClampToEdge</p>
          ) : (
            <p className="text-xs text-green-400 mt-1">{getGarmentShapeForProduct(selectedProduct) === 'hoodie' ? 'Hoodie click → avatar-jacket.glb (hoodie shape 7037 verts) + texture' : 'TShirt click → avatar-tshirt.glb (tshirt shape 3819 verts) + texture'} — instant swap</p>
          )}
        </div>
      )}
    </div>
  )
}

function AvatarTryOn() {
  const { products, productLoading } = useSelector(state => state.product)
  const dispatch = useDispatch()
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('All')
  const [debugChecker, setDebugChecker] = useState(false)

  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(getAllProducts())
    }
  }, [dispatch, products])

  useEffect(() => {
    preloadOutfitVariants()
  }, [])

  if (productLoading && products.length === 0) {
    return <LoadingScreen loadingMessage="Loading Avatar Try-On..." />
  }

  const categories = ['All', "Men's Fashion", "Women's Fashion", "Hoodies", "Shoes", "Bags"]
  const filtered = filter === 'All' ? products : products.filter(p => p.category === filter)

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-gray-900">Home</Link> <span className="mx-2">/</span> <span className="text-neutral-900 font-medium">Avatar Try-On</span>
        </nav>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Avatar Try-On <span className="text-amber-600">3D Model</span></h1>
          <p className="text-gray-600"><span className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded font-bold">TShirt</span> pe click → <code className="bg-gray-100 px-1 rounded">avatar-tshirt.glb</code> (3819 verts) &nbsp;|&nbsp; <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-bold">Hoodie</span> pe click → <code className="bg-gray-100 px-1 rounded">avatar-jacket.glb</code> (7037 verts, hoodie shape — ab Hoodies section me)</p>
          <p className="text-xs text-gray-500 mt-1">Category → mesh: TShirt → <code className="bg-gray-100 px-1 rounded">outfit_top</code> (tshirt) | Hoodie → <code className="bg-gray-100 px-1 rounded">outfit_top</code> (hoodie 7037) | Jeans/Pants → outfit_bottom | Shoes → outfit_shoes</p>
          <p className="text-xs text-gray-400 mt-1">Jacket hata ke Hoodies section banaya — 3 colors (Black/Grey/Red) + Denim Jacket bhi Hoodies me</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <AvatarViewer selectedProduct={selected} debugChecker={debugChecker} />
            <div className="mt-4 flex gap-2 justify-center flex-wrap">
              <button onClick={() => setSelected(null)} className="px-4 py-2 border border-gray-300 rounded-full text-sm">Clear</button>
              <Link to={selected ? `/collections/${selected._id}` : '/collections'} className="px-6 py-2 bg-amber-600 text-white rounded-full text-sm font-medium hover:bg-amber-700">View Details</Link>
              <button onClick={() => setDebugChecker(!debugChecker)} className={`px-4 py-2 rounded-full text-sm font-bold border ${debugChecker ? 'bg-red-600 text-white border-red-600' : 'bg-white border-gray-300 hover:border-red-400 text-gray-700'}`}>{debugChecker ? '✕ Hide Checker' : 'DEBUG: Show UV Checker'}</button>
            </div>
            {debugChecker && <p className="text-xs text-red-600 text-center mt-2 font-mono">Checker active — open Console to see [DIAG] logs. Front view screenshot lo.</p>}
          </div>

          <div>
            <div className="flex gap-2 mb-4 flex-wrap">
              {categories.map(c => (
                <button key={c} onClick={() => setFilter(c)} className={`px-4 py-2 rounded-full text-sm font-medium border ${filter === c ? 'bg-charcoal text-white border-charcoal' : 'bg-white border-gray-300 hover:border-amber-600'}`}>{c}</button>
              ))}
            </div>
            {filtered.length === 0 ? (
              <p className="text-center text-gray-500 py-10">No products found.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
                {filtered.map(p => {
                  const isWearable = p.category === "Men's Fashion" || p.category === "Women's Fashion" || p.category === "Hoodies" || p.category === "Bags"
                  const shape = getGarmentShapeForProduct(p)
                  const isJacket = shape === 'hoodie' || shape === 'jacket'
                  const modelLabel = isJacket ? 'Hoodie Model' : 'TShirt Model'
                  const modelColor = isJacket ? 'bg-orange-500' : 'bg-sky-500'
                  return (
                  <button key={p._id} onClick={() => setSelected(p)} className={`bg-white rounded-2xl shadow p-3 text-left hover:shadow-lg transition-all border-2 ${selected?._id === p._id ? 'border-amber-600' : 'border-transparent'}`}>
                    <div className="aspect-square bg-gray-100 rounded-xl mb-2 overflow-hidden relative">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      {isWearable ? (
                        <span className={`absolute top-2 right-2 text-[9px] text-white px-2 py-0.5 rounded-full font-bold ${modelColor}`}>{modelLabel}</span>
                      ) : (
                        <span className="absolute top-2 right-2 text-[9px] bg-yellow-500 text-white px-2 py-0.5 rounded-full">3D View → View3D</span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.category} • <span className={isJacket ? 'text-orange-600 font-semibold' : 'text-sky-600 font-semibold'}>{modelLabel}</span></p>
                    <p className="text-sm font-bold text-amber-600">₹{p.salePrice}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{p._id === selected?._id ? (isWearable ? `✓ On model (${modelLabel})` : '✓ Selected — open View 3D') : (isWearable ? `Click to wear → ${modelLabel} dikhega` : 'Click → View 3D')}</p>
                  </button>
                )})}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default AvatarTryOn
