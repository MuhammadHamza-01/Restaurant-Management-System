
import {
  Pizza,
  Sparkles,
  Users,
  UtensilsCrossed,
  Heart,
  ArrowRight,
  ChefHat,
  Clock3,
} from 'lucide-react'

import { Link } from 'react-router-dom'

import { Button } from '../../../components/ui/button'
import { Card } from '../../../components/ui/card'

const values = [
  {
    icon: Pizza,
    title: 'Fresh Ingredients',
    description:
      'We prepare every pizza with carefully selected ingredients, delicious toppings, and rich sauces.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Authentic Flavors',
    description:
      'Our menu brings together classic pizza favorites and bold flavors everyone can enjoy.',
  },
  {
    icon: Users,
    title: 'Warm Hospitality',
    description:
      'Whether it is a family dinner or a casual meetup, we want every guest to feel welcome.',
  },
]

const promises = [
  'Freshly prepared food with quality ingredients',
  'A menu full of delicious choices for every craving',
  'A comfortable dine-in experience',
  'Friendly service and attention to detail',
]

const AboutPage = () => {
  return (
    <main className="bg-[#F7F1E8] text-[#24211F]">
      

      {/* Our Story */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <div className="absolute -left-4 -top-4 h-full w-full rounded-[2rem] border-2 border-[#D96A32]/30" />

            <div className="relative flex min-h-[380px] items-center justify-center overflow-hidden rounded-[2rem] bg-[#24211F] p-8 sm:min-h-[460px]">
              <img
                src="https://images.pexels.com/photos/9961871/pexels-photo-9961871.jpeg"
                alt="Freshly prepared Pizza Mehal pizza"
                className="absolute inset-0 h-full w-full  object-cover opacity-75"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#24211F]/80 via-transparent to-transparent" />

              <div className="relative mt-auto w-full">
                <div className="flex items-center gap-3 text-[#F7F1E8]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9362B]">
                    <Heart className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold">Made for sharing</p>
                    <p className="text-sm text-white/65">
                      Every meal, a reason to gather.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-[#C9362B]">
              Who We Are
            </p>

            <h2 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              More than pizza.
              <span className="block text-[#C9362B]">
                It's about the experience.
              </span>
            </h2>

            <p className="mt-6 leading-8 text-[#24211F]/70">
              At Pizza Mehal, we believe great food has a way of bringing
              people closer. Our goal is simple: serve enjoyable food in a
              welcoming atmosphere where friends and families can relax,
              connect, and make memories.
            </p>

            <p className="mt-4 leading-8 text-[#24211F]/70">
              From the first bite to the last, we want every visit to feel
              special. Whether you are stopping by for your favorite pizza or
              enjoying a meal with your loved ones, there is always a place
              for you at our table.
            </p>

            <div className="mt-8 flex items-center gap-4 border-t border-[#24211F]/10 pt-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9362B]/10 text-[#C9362B]">
                <ChefHat className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold">A passion for good food</p>
                <p className="mt-1 text-sm text-[#24211F]/55">
                  Quality, flavor, and hospitality in every visit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Promise */}
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-[#C9362B]">
              Our Promise
            </p>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              The little things make
              <span className="text-[#C9362B]"> a big difference.</span>
            </h2>

            <p className="mt-5 max-w-xl leading-8 text-[#24211F]/65">
              We want every part of your dining experience to be enjoyable.
              From the food we prepare to the way we welcome our guests, we
              focus on making every visit worth remembering.
            </p>
          </div>

          <Card className="rounded-[2rem] border-[#24211F]/5 bg-[#F7F1E8] p-7 shadow-none sm:p-9">
            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9362B] text-white">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black">What you can expect</h3>
            </div>

            <ul className="space-y-5">
              {promises.map((promise) => (
                <li key={promise} className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#C9362B] text-white">
                    <span className="text-xs">✓</span>
                  </span>
                  <span className="text-sm leading-6 text-[#24211F]/75">
                    {promise}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* Our Values */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-[#C9362B]">
            What Matters to Us
          </p>

          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            The values behind every meal.
          </h2>

          <p className="mt-4 leading-7 text-[#24211F]/60">
            A great restaurant experience is about more than what is on the
            plate. It is about the care, flavor, and people behind it.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {values.map(({ icon: Icon, title, description }, index) => (
            <Card
              key={title}
              className="group rounded-[1.75rem] border-[#24211F]/10 bg-white p-7 shadow-none transition-all duration-300 hover:-translate-y-2 hover:border-[#C9362B]/30 hover:shadow-xl hover:shadow-[#24211F]/5"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C9362B]/10 text-[#C9362B] transition-colors group-hover:bg-[#C9362B] group-hover:text-white">
                <Icon className="h-6 w-6" />
              </div>

              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#D96A32]">
                0{index + 1}
              </p>

              <h3 className="text-xl font-black">{title}</h3>

              <p className="mt-3 text-sm leading-7 text-[#24211F]/60">
                {description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8 mx-auto max-w-6xl">
        <div className=" overflow-hidden rounded-[2rem] bg-[#C9362B] px-6 py-14 text-center text-white sm:px-12 sm:py-16">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
            <Clock3 className="h-7 w-7" />
          </div>

          <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">
            Your table is waiting.
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-white/80">
            Bring your appetite, bring your people, and make your next meal a
            little more memorable with Pizza Mehal.
          </p>

          <Button
            asChild
            className="mt-8 rounded-full bg-[#F7F1E8] px-8 py-6 font-bold text-[#24211F] hover:bg-white"
          >
            <Link to="/menu">
              Discover Our Menu
            </Link>
          </Button>
        </div>
      </section>
    </main>
  )
}

export default AboutPage
