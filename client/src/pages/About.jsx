import Reveal from '../components/Reveal'
function About() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex items-center gap-2 text-xs tracking-[0.14em] uppercase text-charcoal/40 mb-6">
          <a href="/" className="hover:text-charcoal">Home</a> <span className="text-[var(--color-gold)]">/</span> <span className="text-charcoal font-medium lowercase tracking-normal normal-case text-sm">About Meta Fashion</span>
        </nav>
        <Reveal><div className="text-center mb-12">
          <span className="inline-block h-px w-12 bg-[var(--color-gold)] mb-4"></span>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-charcoal mb-4">About Meta Fashion</h1>
          <p className="text-lg text-charcoal/60 max-w-3xl mx-auto">Meta Fashion — formerly Libas Mitr (“Libas” = clothes, “Mitr” = friend). Your friendly wardrobe on the web with AI-powered virtual try-on.</p>
        </div></Reveal>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Reveal delay={0}><div className="bg-white rounded-2xl p-8 border border-charcoal/5 hover:shadow-lg transition-all">
            <div className="w-10 h-10 rounded-xl border border-charcoal/10 grid place-items-center mb-4">✦</div>
            <h3 className="text-lg font-bold text-charcoal mb-2">Our Mission</h3>
            <p className="text-sm text-charcoal/60 leading-relaxed">Reduce returns by 80% with 95% accurate fit prediction. No more size guessing.</p>
          </div></Reveal>
          <Reveal delay={80}><div className="bg-charcoal text-white rounded-2xl p-8">
            <div className="w-10 h-10 rounded-xl bg-white/10 grid place-items-center mb-4">◈</div>
            <h3 className="text-lg font-bold mb-2">AI Virtual Try-On</h3>
            <p className="text-sm text-white/70 leading-relaxed">Upload your photo and preview any outfit instantly — powered by modern AI.</p>
          </div></Reveal>
          <Reveal delay={160}><div className="bg-white rounded-2xl p-8 border border-charcoal/5 hover:shadow-lg transition-all">
            <div className="w-10 h-10 rounded-xl border border-charcoal/10 grid place-items-center mb-4">◆</div>
            <h3 className="text-lg font-bold text-charcoal mb-2">Why Us</h3>
            <p className="text-sm text-charcoal/60 leading-relaxed">Curated collections, secure checkout, and friendly support.</p>
          </div></Reveal>
        </div>
        <Reveal><div className="bg-white rounded-2xl p-8 border border-charcoal/5 text-center">
          <h2 className="font-display text-2xl font-bold text-charcoal mb-2">Join thousands of happy shoppers</h2>
          <p className="text-charcoal/60 mb-6">Browse collections and try virtually today.</p>
          <a href="/collections" className="inline-block bg-charcoal text-white px-8 py-3 rounded-full font-semibold hover:bg-charcoal transition-colors">Browse Collections</a>
        </div></Reveal>
      </div>
    </div>
  )
}
export default About
