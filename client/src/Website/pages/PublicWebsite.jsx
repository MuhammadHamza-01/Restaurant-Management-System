import { Link } from 'react-router-dom'
import { ArrowRight, ChefHat, Pizza, Sparkles, Star } from 'lucide-react'

import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Card } from '../../../components/ui/card'
import { publicMenu, featureHighlights, reviews } from '../constants/siteData'

const PublicWebsite = () => (
  <div className="min-h-screen bg-[#fffaf5] text-slate-900">
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-[#fffaf5]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-600 text-white shadow-sm">
            <Pizza className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-black tracking-tight text-slate-900">Pizza Mehal</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-600">Lahore</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#menu">Menu</a>
          <a href="#about">About</a>
          <a href="#reviews">Reviews</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="outline" size="sm">Login</Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Book a table</Button>
          </Link>
        </div>
      </div>
    </header>

    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.15),transparent_35%)" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-24">
          <div className="max-w-xl">
            <Badge variant="default" className="mb-5 gap-2 px-3 py-2">
              <Sparkles className="h-3.5 w-3.5" /> Freshly baked in Lahore
            </Badge>

            <h1 className="text-5xl font-black leading-[1.02] tracking-[-0.06em] text-slate-900 sm:text-6xl">
              Pizza crafted for memorable evenings.
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              A warm dine-in experience with a polished restaurant workflow behind the scenes.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/register">
                <Button size="lg" className="gap-2">
                  Reserve now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg">
                  Preview dashboard
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-8 text-sm text-slate-600">
              <div>
                <p className="text-2xl font-black text-slate-900">4.9/5</p>
                <p>Guest rating</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">1.2k+</p>
                <p>Monthly orders</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">12 min</p>
                <p>Average service</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-8 h-32 w-32 rounded-full bg-orange-200/70 blur-3xl" />
            <div className="absolute -right-4 bottom-4 h-28 w-28 rounded-full bg-amber-200/80 blur-3xl" />
            <Card className="relative overflow-hidden border-orange-200 bg-white/80 p-3 shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
              <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,#fdf2f8_0%,#fff7ed_45%,#ffedd5_100%)] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Tonight's special</p>
                    <h2 className="mt-2 text-3xl font-black text-slate-900">Cheese Burst</h2>
                  </div>
                  <div className="rounded-full bg-white/80 px-3 py-1 text-sm font-bold text-orange-700">PKR 1,995</div>
                </div>

                <div className="rounded-[1.5rem] bg-[radial-gradient(circle_at_50%_15%,#f9e7b6,#d97706_30%,#7c2d12_70%)] p-5">
                  <div className="flex items-center justify-between text-white/90">
                    <span className="text-sm">Freshly baked</span>
                    <span className="flex items-center gap-1 text-sm font-semibold">
                      <Star className="h-4 w-4 fill-current" /> 4.9
                    </span>
                  </div>
                  <div className="mt-20 flex items-end justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/70">Signature</p>
                      <p className="mt-2 text-4xl font-black text-white">Pizza Mehal</p>
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/30 backdrop-blur-sm">
                      <Pizza className="h-7 w-7 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section id="menu" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <Badge variant="neutral" className="mb-3">Featured menu</Badge>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Menu favorites</h2>
          </div>
          <Link to="/login" className="text-sm font-semibold text-orange-600">
            Explore admin panel
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {publicMenu.map((item) => (
            <Card key={item.name} className="overflow-hidden border-slate-200/80 p-0">
              <div className="h-40 bg-[linear-gradient(135deg,#fed7aa,#fb7185)]" />
              <div className="p-6">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-xl font-bold text-slate-900">{item.name}</h3>
                  <span className="text-sm font-bold text-orange-600">{item.price}</span>
                </div>
                <p className="text-sm leading-6 text-slate-600">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section id="about" className="bg-slate-950 py-20 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <Badge variant="neutral" className="mb-4 border-slate-700 bg-slate-800 text-slate-100">
              Why Pizza Mehal
            </Badge>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">A polished service flow behind every slice.</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {featureHighlights.map(({ title, description, icon: Icon }) => (
              <div key={title} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-300">
                  {Icon && <Icon className="h-5 w-5" />}
                  {!Icon && <ChefHat className="h-5 w-5" />}
                </div>
                <h3 className="mb-2 font-semibold">{title}</h3>
                <p className="text-sm leading-6 text-slate-300">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <Badge variant="neutral" className="mb-3">Customer stories</Badge>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Loved by Lahore diners</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((item) => (
            <Card key={item.name} className="p-6">
              <div className="mb-4 flex items-center gap-1 text-orange-500">
                {Array.from({ length: item.rating }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mb-5 text-sm leading-7 text-slate-600">“{item.text}”</p>
              <p className="font-semibold text-slate-900">{item.name}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="contact" className="bg-[#fff3eb] py-20">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-8 rounded-[2rem] border border-orange-200 bg-white p-8 text-center shadow-[0_18px_60px_rgba(15,23,42,0.08)] md:flex-row md:text-left">
          <div>
            <Badge variant="default" className="mb-3">Reserve your table</Badge>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Bring everyone to the table.</h2>
          </div>
          <div className="flex gap-3">
            <Link to="/register">
              <Button size="lg">Create account</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">Staff login</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  </div>
)

export default PublicWebsite
