import { useParams, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { getProduct } from '../features/products/productSlice'

// Demo glb - real product ka model DB se ayega (product.model3d)
// Running Shoes ke liye ab DB me Astronaut glb hai demo ke liye - isko real Nike red shoe ke .glb se replace karna hai
const DEMO_GLB = "https://modelviewer.dev/shared-assets/models/Astronaut.glb"

function View3D() {
  const { pid } = useParams()
  const dispatch = useDispatch()
  const { products, product: singleProduct, productError, productErrorMessage } = useSelector(state => state.product)
  let product = products.find(p => p._id === pid) || (singleProduct && singleProduct._id === pid ? singleProduct : null)

  useEffect(() => {
    if (!product && pid && pid.length === 24) dispatch(getProduct(pid))
  }, [dispatch, pid, product])

  const modelUrl = product?.model3d || DEMO_GLB
  const isDemo = !product?.model3d

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="max-w-5xl mx-auto w-full px-4 py-6 flex-1 flex flex-col">
        <Link to={`/collections`} className="text-sm text-gray-400 hover:text-white mb-4">← Back to collections</Link>
        <h1 className="text-2xl font-bold mb-2">{product ? product.name : "Demo 3D Viewer (Product Not Found?)"}</h1>
        <p className="text-sm text-gray-400 mb-6">{product ? `₹${product.salePrice} • ${product.category}` : "Product ID purana hai ya DB reseed hua hai — fresh product pe click karo. Demo model dikh raha hai."} — niche model ko ghumao, zoom karo, AR pe click karo {isDemo && "(Demo Astronaut - real shoe ke liye .glb badlo)"}</p>
        {isDemo && (
          <p className="text-xs bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-xl px-4 py-2 mb-4">Ye abhi demo Astronaut model hai (shoes ka real glb nahi mila to placeholder). Real Nike red shoe dikhane ke liye apna `.glb` upload karo (Cloudinary ya `public/models/nike-red.glb`), fir MongoDB me `Running Shoes` ke `model3d` ko us URL se update karo — fir yahi real time se shoe ayega. Data `/api/products/:id` se real time fetch ho raha hai.</p>
        )}

        <div className="bg-white rounded-3xl overflow-hidden flex-1 min-h-[60vh] relative">
          {/* model-viewer web component - src real time DB se */}
          <model-viewer
            src={modelUrl}
            alt={product ? product.name : "Demo Shoe 3D"}
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            auto-rotate
            shadow-intensity="1"
            style={{ width: '100%', height: '60vh', backgroundColor: '#f8fafc' }}
          >
            <button slot="ar-button" className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-amber-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg">
              View in your space (AR)
            </button>
          </model-viewer>
        </div>

        <div className="mt-6 bg-gray-800 rounded-2xl p-4 text-sm text-gray-300">
          <p className="font-semibold text-white mb-1">Kaise dekhe?</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Model pe finger se ghumao / pinch se zoom karo</li>
            <li><b>View in your space</b> pe click karo — phone camera se real floor pe shoe dekhega (AR)</li>
            <li>Ye abhi demo glb hai (Astronaut) — baad me har product ka apna `.glb` daal dena, `DEMO_GLB` ko `product.model3d` se replace kar dena</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
export default View3D
