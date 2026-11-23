
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Pizza,
  Sparkles,
  Star,
  Clock,
  ShieldCheck,
  Flame,
  Leaf,
  Heart,
  Utensils,
  ChevronRight,
  Plus,
  Quote,
} from "lucide-react";

import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Card } from "../../../components/ui/card";
import {
  publicMenu,
  featureHighlights,
} from "../constants/siteData";

const COLORS = {
  primary: "#C9362B",
  background: "#F7F1E8",
  dark: "#24211F",
  orange: "#D96A32",
};

const categories = [
  "All",
  "Pizza",
  "Burgers",
  "Pasta",
  "Sides",
  "Drinks",
];

const foodImages = [
  "/images/special-pizza-mahal.jpg",
  "/images/crown-crust.jpg",
  "/images/BBQ.jpg",
];

const HomePage = () => {
  return (
    <main className="overflow-hidden bg-[#F7F1E8] text-[#24211F]">

      {/* HERO SECTION */}
      <section className="relative">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-24">

          {/* Hero Content */}
          <div className="relative z-10">

            <Badge
              variant="default"
              className="mb-6 gap-2 rounded-full bg-[#C9362B]/10 px-4 py-2 text-[#C9362B]"
            >
              <Sparkles size={15} />
              Made with passion, served with love
            </Badge>

            <h1 className="max-w-2xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl">
              Good food
              <br />
              Great moments
              <br />
              <span className="text-[#C9362B]">
                Pizza Mehal.
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-8 text-[#706963] sm:text-lg">
              From our signature crust to the last delicious bite,
              discover a pizza experience made for sharing,
              celebrating, and enjoying together.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">

              <Link to="/menu">
                <Button
                  size="lg"
                  className="h-13 gap-3 rounded-full bg-[#C9362B] px-7 text-white hover:bg-[#A92B23]"
                >
                  Explore our menu
                  <ArrowRight size={18} />
                </Button>
              </Link>

              <Link to="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-13 rounded-full border-[#24211F]/20 px-7 text-[#24211F] hover:bg-[#24211F] hover:text-white"
                >
                  Visit our restaurant
                </Button>
              </Link>

            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap gap-8 border-t border-[#24211F]/10 pt-7">

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white">
                  <Flame className="text-[#C9362B]" size={21} />
                </div>
                <div>
                  <p className="text-sm font-bold">Freshly baked</p>
                  <p className="text-xs text-[#857B73]">Made to order</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white">
                  <Heart className="text-[#C9362B]" size={21} />
                </div>
                <div>
                  <p className="text-sm font-bold">Made with love</p>
                  <p className="text-xs text-[#857B73]">Quality ingredients</p>
                </div>
              </div>

            </div>
          </div>

          {/* Hero Image */}
          <div className="relative mx-auto w-full max-w-xl">

            <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-[#D96A32]/15 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] shadow-2xl">

              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&q=90"
                alt="Freshly baked Pizza Mehal pizza"
                className="aspect-[4/4.5] w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-7 text-white sm:p-9">

                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/80">
                  <Sparkles size={16} />
                  OUR SIGNATURE EXPERIENCE
                </div>

                <h2 className="text-3xl font-black sm:text-4xl">
                  Made for pizza lovers.
                </h2>

                <p className="mt-3 max-w-sm text-sm leading-6 text-white/80">
                  Delicious flavors, freshly prepared,
                  and always worth coming back for.
                </p>

                <Link
                  to="/menu"
                  className="mt-5 inline-flex items-center gap-2 font-semibold text-white transition hover:gap-4"
                >
                  Discover our menu
                  <ArrowRight size={17} />
                </Link>

              </div>
            </div>

            {/* Floating rating-style decoration */}
            <div className="absolute -bottom-6 -left-5 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xl sm:-left-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C9362B]/10 text-[#C9362B]">
                <Pizza size={25} />
              </div>
              <div>
                <p className="text-sm font-black">Pizza perfection</p>
                <p className="text-xs text-[#857B73]">Every single bite</p>
              </div>
            </div>

          </div>
        </div>
      </section>



      {/* BEST SELLERS */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-24">

        <div className="mb-12 flex flex-wrap items-end justify-between gap-5">

          <div>
            <Badge
              variant="neutral"
              className="mb-4 rounded-full bg-[#C9362B]/10 text-[#C9362B]"
            >
              <Flame size={13} className="mr-1" />
              Customer favourites
            </Badge>

            <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
              The stars of our menu.
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-7 text-[#857B73]">
              Discover the flavors everyone loves.
              Your next favorite might be right here.
            </p>
          </div>

          <Link
            to="/menu"
            className="flex items-center gap-2 text-sm font-bold text-[#C9362B] transition hover:gap-4"
          >
            Explore all pizzas
            <ArrowRight size={17} />
          </Link>

        </div>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

          {publicMenu.slice(0, 3).map((item, index) => (

            <Card
              key={item.name}
              className="group overflow-hidden rounded-[1.5rem] border border-[#24211F]/5 bg-white p-0 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >

              <div className="relative overflow-hidden">

                <img
                  src={foodImages[index % foodImages.length]}
                  alt={item.name}
                  className="aspect-[5/3.5] w-full object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#C9362B] shadow">
                  {index === 0 ? "BEST SELLER" : index === 1 ? "POPULAR" : "MUST TRY"}
                </div>

                <Link
                  to="/menu"
                  aria-label={`Explore ${item.name}`}
                  className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#C9362B]  shadow-lg transition hover:scale-110 hover:bg-[#A92B23]"
                >
                  <Plus className="text-white" size={21} />
                </Link>

              </div>

              <div className="p-6">

                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="text-xl font-black">
                    {item.name}
                  </h3>

                  <span className="shrink-0 text-sm font-black text-[#C9362B]">
                    {item.price}
                  </span>
                </div>

                <p className="min-h-12 text-sm leading-6 text-[#857B73]">
                  {item.description}
                </p>

                <Link
                  to="/menu"
                  className="mt-5 flex items-center gap-2 text-sm font-bold text-[#24211F] transition group-hover:text-[#C9362B]"
                >
                  View details
                  <ChevronRight size={17} />
                </Link>

              </div>

            </Card>

          ))}

        </div>
      </section>


      {/* PROMOTIONAL BANNER */}
      <section className="px-5 sm:px-8 mx-auto max-w-6xl ">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#24211F]">

          <div className="absolute inset-0 opacity-30">
            <img
              src="https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=1400&q=85"
              alt=""
              className="h-full w-full object-cover"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-[#24211F] via-[#24211F]/90 to-transparent" />

          <div className="relative grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-2 lg:p-16">

            <div className="text-white">

              <Badge
                variant="default"
                className="mb-6 rounded-full bg-[#C9362B] text-white"
              >
                <Sparkles size={14} className="mr-1" />
                Something delicious awaits
              </Badge>

              <h2 className="max-w-xl text-4xl font-black leading-tight sm:text-6xl">
                Make your next meal
                <span className="text-[#F2A06C]"> unforgettable.</span>
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-white/70">
                Gather your favorite people, find your perfect pizza,
                and make every visit a little more special.
              </p>

              <Link to="/menu">
                <Button
                  size="lg"
                  className="mt-8 gap-2 rounded-full bg-[#C9362B] px-7 text-white hover:bg-[#A92B23]"
                >
                  Discover the menu
                  <ArrowRight size={18} />
                </Button>
              </Link>

            </div>

            <div className="hidden lg:block" />

          </div>
        </div>
      </section>


      {/* WHY PIZZA MEHAL */}
      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">

        <div className="mx-auto mb-14 max-w-2xl text-center">

          <Badge
            variant="neutral"
            className="mb-4 rounded-full bg-[#C9362B]/10 text-[#C9362B]"
          >
            The Pizza Mehal difference
          </Badge>

          <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
            More than just a pizza.
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#857B73] sm:text-base">
            Great ingredients, thoughtful preparation, and
            an experience worth sharing with the people you love.
          </p>

        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {featureHighlights.map(({ title, description }, index) => (

            <div
              key={title}
              className="group rounded-3xl border border-[#24211F]/10 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-[#C9362B]/30 hover:shadow-xl"
            >

              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C9362B]/10 text-[#C9362B] transition group-hover:bg-[#C9362B] group-hover:text-white">
                {index === 0 ? (
                  <Flame size={26} />
                ) : index === 1 ? (
                  <Leaf size={26} />
                ) : (
                  <Heart size={26} />
                )}
              </div>

              <h3 className="mb-3 text-lg font-black">
                {title}
              </h3>

              <p className="text-sm leading-7 text-[#857B73]">
                {description}
              </p>

            </div>

          ))}

        </div>
      </section>


      {/* RESTAURANT EXPERIENCE */}
      <section className="bg-[#EEE3D5] py-20">

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">

          <div className="grid grid-cols-2 gap-4">

            <img
              src="https://images.unsplash.com/photo-1579751626657-72bc17010498?w=700&q=85"
              alt="Fresh pizza"
              className="h-64 w-full rounded-3xl object-cover sm:h-80"
            />

            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&q=85"
              alt="Restaurant dining experience"
              className="mt-12 h-64 w-full rounded-3xl object-cover sm:h-80"
            />

          </div>

          <div>

            <Badge
              variant="neutral"
              className="mb-5 rounded-full bg-white text-[#C9362B]"
            >
              A place to enjoy
            </Badge>

            <h2 className="text-4xl font-black leading-tight sm:text-5xl">
              Great pizza.
              <br />
              Even better company
            </h2>

            <p className="mt-6 text-base leading-8 text-[#706963]">
              Pizza is better when shared. Bring your family,
              meet your friends, and enjoy delicious food
              in a welcoming atmosphere at Pizza Mehal.
            </p>

            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 font-bold text-[#C9362B] transition hover:gap-4"
            >
              Get in touch
              <ArrowRight size={18} />
            </Link>

          </div>

        </div>
      </section>


      {/* FINAL CTA */}
      <section className="px-5 py-20 sm:px-8 mx-auto max-w-6xl">

        <div className=" rounded-[2rem] bg-[#C9362B] px-7 py-14 text-center text-white sm:px-14 sm:py-16">

          <Utensils className="mx-auto mb-6" size={36} />

          <h2 className="text-3xl font-black sm:text-5xl">
            Your table is waiting.
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/80 sm:text-base">
            Come hungry, bring your favorite people,
            and let Pizza Mehal take care of the flavor.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">

            <Link to="/menu">
              <Button
                size="lg"
                className="gap-2 rounded-full bg-white px-8 text-[#C9362B] hover:bg-[#F7F1E8]"
              >
                Explore menu
                <ArrowRight size={18} />
              </Button>
            </Link>

            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-white/60 bg-transparent px-8 text-white hover:bg-white hover:text-[#C9362B]"
              >
                Contact us
              </Button>
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
};

export default HomePage;
