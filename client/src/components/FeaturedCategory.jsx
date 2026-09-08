import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import Men from "../assets/men_clothing.jpg"
import Woman from "../assets/woman_clothing.jpg"
import Hoodie from "../assets/hoodie.jpg"
import SuperHero from "../assets/superhero.jpg"
const KidsImg = "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&q=80"

const categories = [
  { label: 'Men', img: Men, to: '/collections?category=Men%27s%20Fashion' },
  { label: 'Women', img: Woman, to: '/collections?category=Women%27s%20Fashion' },
  { label: 'Hoodies', img: Hoodie, to: '/collections?category=Hoodies' },
  { label: 'SuperHero', img: SuperHero, to: '/collections?category=Hoodies' },
  { label: 'Kids', img: KidsImg, to: '/collections?category=Kids' },
]

const FeaturedCategory = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <Reveal>
            <div className="text-center mb-12">
                <h2 className="font-display text-4xl font-bold text-charcoal mb-3">Featured Categories</h2>
                <p className="text-lg text-charcoal/60">Discover styles that match your vibe</p>
                <span className="inline-block mt-4 h-px w-12 bg-[var(--color-gold)]"></span>
            </div>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {categories.map((c,i)=> (
                  <Reveal key={c.label} delay={i*80}>
                    <Link to={c.to} className="group relative overflow-hidden rounded-3xl bg-white border border-charcoal/5 block hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
                    <div className="aspect-[3/4] bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.03]" style={{backgroundImage:`url(${c.img})`}}>
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-60"></div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className="text-xl font-bold text-white font-display">{c.label}</h3>
                        <span className="text-xs tracking-wide text-white/80 group-hover:text-white">Explore →</span>
                    </div>
                    </Link>
                  </Reveal>
                ))}

            </div>
        </section>

    )
}

export default FeaturedCategory
