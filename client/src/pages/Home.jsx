import {
  Upload,
  Shirt,
  Eye,
  ShoppingBag,
  Sparkles,
  Target,
  Clock,
} from "lucide-react";
import FeaturedCategory from "../components/FeaturedCategory";
const HeroCutout = "/products/try-on/Azeem_Img.png";
import Reveal from "../components/Reveal";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../features/products/productSlice";

function Home() {
  const dispatch = useDispatch();
  const { products } = useSelector((s) => s.product);
  useEffect(() => {
    if (!products || products.length === 0) dispatch(getAllProducts());
  }, [dispatch, products]);
  const newArrivals = (products || []).slice(0, 8);
  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* HERO — EXACT Z-INDEX: ELEVATE(1) / IMAGE(0) / BRANDS(2) / TODAY right-bottom, image half behind */}
      {/* =========================================================
    META FASHION — FINAL HERO
    FINAL EDITORIAL REFERENCE COMPOSITION
========================================================= */}
      {/* =========================================================
    META FASHION — FINAL HERO
    REFERENCE MATCHED EDITORIAL LAYOUT
========================================================= */}

      <section className="relative w-full overflow-hidden bg-[#E8E1D9]" style={{ height: "780px", minHeight: "780px" }}>
        {/* DESKTOP IMAGE — unchanged */}
        <img src={HeroCutout} alt="Meta Fashion editorial model" className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none select-none" style={{ objectFit: "contain", objectPosition: "center 42%", zIndex: 1, filter: "contrast(1.04) saturate(1.05) brightness(1.02)" }} fetchPriority="high" decoding="async" />
        {/* MOBILE IMAGE — with soft shadow to blend bg */}
        <img src={HeroCutout} alt="Meta Fashion editorial model" className="lg:hidden absolute inset-0 w-full h-full pointer-events-none select-none" style={{ objectFit: "contain", objectPosition: "center 38%", zIndex: 1, filter: "drop-shadow(0 12px 24px rgba(41,39,37,0.12)) contrast(1.04) saturate(1.05)" }} fetchPriority="high" decoding="async" />

        {/* ================= DESKTOP HERO — EXACT, UNCHANGED ================= */}
        <div className="hidden lg:block absolute inset-0 w-full h-full mx-auto overflow-hidden">
          <div className="absolute whitespace-nowrap select-none text-charcoal pointer-events-none" style={{ left: "10%", top: "9%", fontFamily: "Arial, Helvetica, sans-serif", fontSize: "clamp(96px, 7.7vw, 140px)", fontWeight: 900, lineHeight: "0.78", letterSpacing: "-0.075em", zIndex: 0 }}>ELEVATE</div>
          <div className="absolute whitespace-nowrap select-none text-charcoal pointer-events-none" style={{ left: "10%", top: "32%", fontFamily: "Arial, Helvetica, sans-serif", fontSize: "clamp(96px, 7.7vw, 140px)", fontWeight: 900, lineHeight: "0.78", letterSpacing: "-0.075em", zIndex: 3 }}>BRANDS</div>
          <div className="absolute text-charcoal" style={{ right: "8%", top: "28%", width: "370px", zIndex: 20 }}>
            <p className="m-0" style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: "15px", fontWeight: 400, lineHeight: "1.55", letterSpacing: "0", color: "#292725" }}>Creating impactful brand experiences through innovative design and strategic thinking, helping businesses stand out and thrive in today's competitive landscape.</p>
          </div>
          <div className="absolute flex items-center justify-between" style={{ right: "8%", top: "56%", width: "370px", zIndex: 20 }}>
            <span style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: "11px", fontWeight: 400, letterSpacing: "0.17em", color: "#292725" }}>SINCE 2014</span>
            <span style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: "11px", fontWeight: 400, letterSpacing: "0.17em", color: "#292725" }}>+123 123 1234</span>
          </div>
          <div className="absolute whitespace-nowrap select-none text-charcoal pointer-events-none" style={{ right: "15%", bottom: "23%", fontFamily: "Arial, Helvetica, sans-serif", fontSize: "clamp(100px, 8vw, 145px)", fontWeight: 900, lineHeight: "0.76", letterSpacing: "-0.075em", zIndex: 1 }}>TODAY</div>
          <div className="absolute left-[6%] top-[75%] -translate-y-1/2 w-[88px] h-[88px] flex items-center justify-center bg-white/40 backdrop-blur rounded-full border border-charcoal/10 shadow-sm" style={{ zIndex: 25 }}>
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" aria-hidden="true"><defs><path id="finalHeroCircle" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" /></defs><text style={{ fill: "#292725", fontFamily: "Arial, Helvetica, sans-serif", fontSize: "6.3px", letterSpacing: "0.18em", opacity: 0.52 }}><textPath href="#finalHeroCircle" startOffset="0%">1234 SINCE 2014 1234 SINCE 2014</textPath></text></svg>
            <span className="relative text-charcoal" style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: "21px", fontWeight: 300 }}>↓</span>
          </div>
        </div>

        {/* MOBILE ELEVATE — ELE left, V under face, ATE right visible */}
        <div className="lg:hidden absolute whitespace-nowrap select-none text-charcoal pointer-events-none" style={{ left: "2%", top: "13%", fontFamily: "Arial, Helvetica, sans-serif", fontSize: "clamp(62px, 20vw, 86px)", fontWeight: 900, lineHeight: "0.78", letterSpacing: "-0.065em", zIndex: 0, transform: "translateX(2%)" }}>ELEVATE</div>
        {/* MOBILE HERO — REST (in front of model) */}
        <div className="lg:hidden relative w-full" style={{ minHeight: "720px", zIndex: 1 }}>
          <div className="absolute whitespace-nowrap select-none left-1/2 -translate-x-1/2" style={{ top: "24.5%", fontFamily: "Arial, Helvetica, sans-serif", fontSize: "clamp(58px, 18vw, 78px)", fontWeight: 900, lineHeight: "0.78", letterSpacing: "-0.075em", zIndex: 5, color: "rgba(245,241,232,0.85)", textShadow: "0 2px 20px rgba(0,0,0,0.15)" }}>BRANDS</div>
          <div className="absolute" style={{ left: "6%", right: "6%", top: "54%", zIndex: 20 }}>
            <p className="m-0 text-charcoal" style={{ maxWidth: "310px", fontFamily: "Arial, Helvetica, sans-serif", fontSize: "12px", fontWeight: 400, lineHeight: "1.55" }}>Creating impactful brand experiences through innovative design and strategic thinking, helping businesses stand out and thrive in today's competitive landscape.</p>
          </div>
          <div className="absolute flex items-center justify-between" style={{ left: "6%", right: "6%", top: "70%", zIndex: 20 }}>
            <span className="text-charcoal" style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: "9px", letterSpacing: "0.14em" }}>SINCE 2014</span>
            <span className="text-charcoal" style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: "9px", letterSpacing: "0.12em" }}>+123 123 1234</span>
          </div>
          <div className="absolute whitespace-nowrap select-none pointer-events-none text-charcoal" style={{ left: "38%", bottom: "7%", fontFamily: "Arial, Helvetica, sans-serif", fontSize: "clamp(62px, 18vw, 90px)", fontWeight: 900, lineHeight: "0.76", letterSpacing: "-0.075em", zIndex: 1 }}>TODAY</div>
          <div className="absolute flex items-center justify-center rounded-full" style={{ left: "6%", bottom: "6%", width: "68px", height: "68px", background: "rgba(255,255,255,0.42)", backdropFilter: "blur(4px)", border: "1px solid rgba(41,39,37,0.10)", zIndex: 25 }}>
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" aria-hidden="true"><defs><path id="mobileHeroCircle" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" /></defs><text style={{ fill: "#292725", fontFamily: "Arial, Helvetica, sans-serif", fontSize: "6px", letterSpacing: "0.15em", opacity: 0.52 }}><textPath href="#mobileHeroCircle">1234 SINCE 2014 1234 SINCE 2014</textPath></text></svg>
            <span className="relative text-charcoal" style={{ fontSize: "18px", fontWeight: 300 }}>↓</span>
          </div>
        </div>
      </section>

      <Reveal>
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl font-bold text-charcoal mb-3">
                How It Works
              </h2>
              <p className="text-lg text-charcoal/60">
                Three simple steps to your perfect fit
              </p>
              <span className="inline-block mt-4 h-px w-12 bg-[var(--color-gold)]"></span>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Reveal delay={0}>
                <div className="text-center p-8 rounded-2xl border border-charcoal/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-[var(--color-cream)]/50">
                  <div className="w-16 h-16 bg-white border border-charcoal/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Upload className="w-7 h-7 text-charcoal" />
                  </div>
                  <h3 className="text-xl font-bold text-charcoal mb-3">
                    Upload Your Photo
                  </h3>
                  <p className="text-sm text-charcoal/60 leading-relaxed">
                    Take a quick photo or upload an existing one. Our AI will
                    analyze your body measurements.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <div className="text-center p-8 rounded-2xl border border-charcoal/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white">
                  <div className="w-16 h-16 bg-charcoal rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Shirt className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-charcoal mb-3">
                    Choose Your Outfit
                  </h3>
                  <p className="text-sm text-charcoal/60 leading-relaxed">
                    Browse our curated collection and select any item you want
                    to try on virtually.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={200}>
                <div className="text-center p-8 rounded-2xl border border-charcoal/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-[var(--color-cream)]/50">
                  <div className="w-16 h-16 bg-white border border-charcoal/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Eye className="w-7 h-7 text-charcoal" />
                  </div>
                  <h3 className="text-xl font-bold text-charcoal mb-3">
                    Preview Your Fit
                  </h3>
                  <p className="text-sm text-charcoal/60 leading-relaxed">
                    See an accurate representation of how the outfit looks on
                    you in real-time.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </Reveal>

      <FeaturedCategory />

      {/* NEW ARRIVALS — bulky premium grid with on-scroll product images */}
      <section className="bg-[var(--color-cream)] py-16 lg:py-24 border-y hairline">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
              <div>
                <span className="text-xs tracking-[0.2em] uppercase text-charcoal/40">
                  Curated Drop • SS 24
                </span>
                <h2 className="font-display text-4xl lg:text-5xl font-bold text-charcoal mt-2">
                  NEW ARRIVALS
                </h2>
                <span className="inline-block mt-3 h-px w-16 bg-[var(--color-gold)]"></span>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-charcoal/60">
                  Handpicked essentials — from everyday tees to statement
                  hoodies. Each piece crafted for fit, photographed in studio
                  light, and ready for your AI try-on.
                </p>
              </div>
              <Link
                to="/collections"
                className="hidden sm:inline-flex items-center gap-2 bg-charcoal text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-charcoal"
              >
                View All Collections →
              </Link>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {newArrivals.length === 0 ? (
              <p className="col-span-4 text-center text-charcoal/40 py-12">
                Loading premium pieces...
              </p>
            ) : (
              newArrivals.map((p, i) => (
                <Reveal key={p._id} delay={(i % 4) * 90}>
                  <Link
                    to={`/collections/${p._id}`}
                    className="group block bg-white rounded-[20px] overflow-hidden border border-charcoal/5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="aspect-[4/5] overflow-hidden bg-[#F3F0EB] relative">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                        loading="lazy"
                      />
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-charcoal text-[11px] font-semibold px-3 py-1 rounded-full border border-charcoal/10">
                        ₹{p.salePrice}
                      </span>
                      <span className="absolute bottom-3 right-3 bg-charcoal text-white text-[10px] tracking-wide px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        {p.category}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-charcoal line-clamp-1">
                        {p.name}
                      </h3>
                      <p className="text-xs text-charcoal/50 line-clamp-1 mt-1">
                        {p.description}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs font-medium text-[var(--color-purple-accent)]">
                          Try On →
                        </span>
                        <span className="text-[11px] text-charcoal/30 line-through">
                          ₹{p.originalPrice}
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))
            )}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/collections"
              className="inline-flex bg-charcoal text-white px-6 py-3 rounded-full text-sm font-semibold"
            >
              View All →
            </Link>
          </div>
        </div>
      </section>

      <Reveal>
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl font-bold text-charcoal mb-3">
                Why Meta Fashion
              </h2>
              <p className="text-lg text-charcoal/60">
                The smartest way to shop online
              </p>
              <span className="inline-block mt-4 h-px w-12 bg-[var(--color-gold)]"></span>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Reveal delay={0}>
                <div className="bg-[var(--color-cream)] p-8 rounded-2xl border border-charcoal/5 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-white border border-charcoal/5 rounded-xl flex items-center justify-center mb-6">
                    <Target className="w-6 h-6 text-charcoal" />
                  </div>
                  <h3 className="text-xl font-bold text-charcoal mb-3">
                    AI Fit Accuracy
                  </h3>
                  <p className="text-sm text-charcoal/60 leading-relaxed">
                    Our advanced AI algorithms ensure 95% accuracy in size
                    predictions and fit visualization.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <div className="bg-white p-8 rounded-2xl border border-charcoal/5 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-charcoal rounded-xl flex items-center justify-center mb-6">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-charcoal mb-3">
                    No Size Guessing
                  </h3>
                  <p className="text-sm text-charcoal/60 leading-relaxed">
                    Say goodbye to size charts and confusion. See exactly how
                    clothes fit your unique body.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={200}>
                <div className="bg-[var(--color-cream)] p-8 rounded-2xl border border-charcoal/5 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-white border border-charcoal/5 rounded-xl flex items-center justify-center mb-6">
                    <Clock className="w-6 h-6 text-charcoal" />
                  </div>
                  <h3 className="text-xl font-bold text-charcoal mb-3">
                    Save Time & Returns
                  </h3>
                  <p className="text-sm text-charcoal/60 leading-relaxed">
                    Reduce returns by 80% and shop with confidence knowing your
                    order will fit perfectly.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </Reveal>


    </div>
  );
}

export default Home;
