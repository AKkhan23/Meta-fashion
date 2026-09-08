import { useState } from 'react'
import { toast } from 'react-toastify'

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success("Message sent! We'll reply soon.", { position: "top-center" })
    setForm({ name: '', email: '', message: '' })
  }
  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex items-center gap-2 text-xs tracking-[0.14em] uppercase text-charcoal/40 mb-6">
          <a href="/" className="hover:text-charcoal">Home</a> <span className="text-[var(--color-gold)]">/</span> <span className="text-charcoal font-medium normal-case tracking-normal text-sm">Contact</span>
        </nav>
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">Have a question? We'd love to hear from you.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Send a message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600" />
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Your email" required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600" />
              <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your message" rows={4} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600" />
              <button type="submit" className="w-full bg-[var(--color-gold)] to-amber-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all">Send Message</button>
            </form>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Contact info</h3>
            <div className="space-y-4 text-gray-600">
              <p><span className="font-semibold text-gray-900">Email:</span> support@libasmitr.com</p>
              <p><span className="font-semibold text-gray-900">Phone:</span> +91 98765 43210</p>
              <p><span className="font-semibold text-gray-900">Address:</span> Jaipur, Rajasthan, India</p>
              <p className="text-sm text-gray-500 mt-6">Response within 24 hours.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Contact
