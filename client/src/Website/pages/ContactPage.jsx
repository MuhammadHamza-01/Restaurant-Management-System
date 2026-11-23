
import { useState } from 'react'
import {
  Clock3,
  MapPin,
  Mail,
  Phone,
  Send,
  MessageCircle,
  ArrowRight,
  UtensilsCrossed,
  CheckCircle2,
} from 'lucide-react'

import { Button } from '../../../components/ui/button'

const contactDetails = [
  {
    icon: MapPin,
    title: 'Our Location',
    description: 'Visit our restaurant',
    value: '1st Floor 1km Thokar Niazbaig Main Raiwind Road, Near Risen Cash and Carry Store',
  },
  {
    icon: Phone,
    title: 'Call Us',
    description: 'Speak with our team',
    value: '+92 300 1022929',
  },
  {
    icon: Mail,
    title: 'Email Us',
    description: 'Send us your queries',
    value: 'pizzamehalofficial@gmail.com',
  },
  {
    icon: Clock3,
    title: 'Opening Hours',
    description: 'Come visit us',
    value: 'Monday - Sunday: 02:00 AM - 02:00 PM',
  },
]

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    // Connect this form to your backend contact API before production.
    // No message is sent until the backend integration is implemented.
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#F7F1E8] text-[#24211F]">



      {/* =====================================
          CONTACT INFORMATION
      ===================================== */}
      <section
        id="contact-details"
        className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8"
      >

        <div className="mb-10 text-center">
          <span className="text-xs font-black uppercase tracking-[0.22em] text-[#C9362B]">
            Get in touch
          </span>

          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            We'd Love to Connect
            <span className="text-[#C9362B]">.</span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#81776D]">
            Whether you have a question about our menu or want to know
            more about visiting us, we're here to help.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {contactDetails.map((detail) => {
            const Icon = detail.icon

            return (
              <div
                key={detail.title}
                className="group rounded-2xl border border-[#E9DED0] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#D96A32]/50 hover:shadow-xl hover:shadow-[#24211F]/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FCE8DF] text-[#C9362B] transition group-hover:bg-[#C9362B] group-hover:text-white">
                  <Icon size={22} />
                </div>

                <h3 className="mt-5 text-lg font-black text-[#24211F]">
                  {detail.title}
                </h3>

                <p className="mt-1 text-xs text-[#81776D]">
                  {detail.description}
                </p>

                <p className="mt-4 break-words text-sm font-semibold text-[#C9362B]">
                  {detail.value}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* =====================================
          CONTACT FORM SECTION
      ===================================== */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">

        <div className="grid overflow-hidden rounded-3xl border border-[#E9DED0] bg-white shadow-xl shadow-[#24211F]/5 lg:grid-cols-[0.85fr_1.15fr]">

          {/* LEFT INFORMATION PANEL */}
          <div className="relative overflow-hidden bg-[#24211F] p-8 sm:p-10 lg:p-12">

            <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#C9362B]/20 blur-3xl" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#D96A32]">
                <UtensilsCrossed size={16} />
                Pizza Mehal
              </span>

              <h2 className="mt-7 text-3xl font-black leading-tight text-[#F7F1E8] sm:text-4xl">
                Every great connection starts with a conversation.
              </h2>

              <p className="mt-5 text-sm leading-7 text-[#F7F1E8]/60">
                We're passionate about good food and great hospitality.
                Send us your thoughts, questions, or suggestions.
                We'd love to hear what you have to say.
              </p>

              <div className="mt-10 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#D96A32]">
                    <MessageCircle size={19} />
                  </div>

                  <div>
                    <h4 className="font-bold text-[#F7F1E8]">
                      Questions & Feedback
                    </h4>
                    <p className="mt-1 text-xs leading-5 text-[#F7F1E8]/50">
                      Share your experience and suggestions with us.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#D96A32]">
                    <UtensilsCrossed size={19} />
                  </div>

                  <div>
                    <h4 className="font-bold text-[#F7F1E8]">
                      Restaurant Enquiries
                    </h4>
                    <p className="mt-1 text-xs leading-5 text-[#F7F1E8]/50">
                      Want to know more about our restaurant? Get in touch.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 border-t border-white/10 pt-7">
                {/* <p className="text-xs font-bold uppercase tracking-widest text-[#F7F1E8]/40">
                  Follow Pizza Mehal
                </p> */}

                {/* <div className="mt-4 flex gap-3">
                  <a
                    href="#"
                    aria-label="Instagram"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-[#F7F1E8] transition hover:border-[#D96A32] hover:bg-[#C9362B]"
                  >
                    <Instagram size={19} />
                  </a>

                  <a
                    href="#"
                    aria-label="Facebook"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-[#F7F1E8] transition hover:border-[#D96A32] hover:bg-[#C9362B]"
                  >
                    <Facebook size={19} />
                  </a>
                </div> */}
              </div>
            </div>
          </div>

          {/* RIGHT CONTACT FORM */}
          <div id="contact-form" className="p-7 sm:p-10 lg:p-12">

            <div className="mb-8">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#C9362B]">
                Send a message
              </span>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#24211F]">
                Get in Touch
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#81776D]">
                Fill out the form below and tell us what's on your mind.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-bold text-[#24211F]"
                  >
                    Your Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    minLength={2}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="h-12 w-full rounded-xl border border-[#E9DED0] bg-[#F7F1E8]/50 px-4 text-sm text-[#24211F] outline-none transition placeholder:text-[#A49A8F] focus:border-[#C9362B] focus:bg-white focus:ring-4 focus:ring-[#C9362B]/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-[#24211F]"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-xl border border-[#E9DED0] bg-[#F7F1E8]/50 px-4 text-sm text-[#24211F] outline-none transition placeholder:text-[#A49A8F] focus:border-[#C9362B] focus:bg-white focus:ring-4 focus:ring-[#C9362B]/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-bold text-[#24211F]"
                >
                  Subject
                </label>

                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is your message about?"
                  className="h-12 w-full rounded-xl border border-[#E9DED0] bg-[#F7F1E8]/50 px-4 text-sm text-[#24211F] outline-none transition placeholder:text-[#A49A8F] focus:border-[#C9362B] focus:bg-white focus:ring-4 focus:ring-[#C9362B]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-bold text-[#24211F]"
                >
                  Your Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  minLength={10}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  className="w-full resize-none rounded-xl border border-[#E9DED0] bg-[#F7F1E8]/50 px-4 py-3 text-sm text-[#24211F] outline-none transition placeholder:text-[#A49A8F] focus:border-[#C9362B] focus:bg-white focus:ring-4 focus:ring-[#C9362B]/10"
                />
              </div>

              <Button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-[#C9362B] font-bold text-white transition hover:bg-[#D96A32]"
              >
                Send Message
                <Send size={17} />
              </Button>

              
            </form>
          </div>
        </div>
      </section>

     
    </main>
  )
}

export default ContactPage
