import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Pizza,
  Menu,
  X,
  ArrowRight,
  MapPin,
  Clock,
  Phone,
  Utensils,
  MessageCircleMore,
  ChevronUp,
} from "lucide-react";

import { Button } from "../../../components/ui/button";

const navigation = [
  
  { label: "Menu", to: "/menu" },
  { label: "Our Story", to: "/about" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
];

const WebsiteLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F7F1E8] text-[#24211F]">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-[#24211F]/10 bg-[#F7F1E8]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          {/* BRAND */}
          <Link
            to="/"
            className="flex shrink-0 items-center gap-3"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img
              src="/Logo.png"
              alt="Pizza Mehal"
              className="h-12 w-12 object-contain"
            />

            <div>
              <p className="text-lg md:text-xl font-black">
                Pizza <span className="text-[#F08B64]">Mehal</span>
              </p>
              <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-black/50">
                Taste the difference
              </p>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden items-center gap-9 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`relative py-2 text-sm font-semibold transition ${
                  isActive(item.to)
                    ? "text-[#C9362B]"
                    : "text-[#706963] hover:text-[#C9362B]"
                }`}
              >
                {item.label}

                {isActive(item.to) && (
                  <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-[#C9362B]" />
                )}
              </Link>
            ))}
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden items-center gap-3 md:flex">
            {/* <Link to="/login">
              <Button
                variant="outline"
                size="sm"
                className="h-10 rounded-full border-[#24211F]/20 px-5 text-[#24211F] hover:bg-[#24211F] hover:text-white"
              >
                Login
              </Button>
            </Link> */}

            <Link to="https://wa.me/923001022929" target="_blank">
              <Button
                size="sm"
                className="h-10 gap-2 rounded-full bg-[#C9362B] px-5 text-white hover:bg-[#A92B23]"
              >
                Reserve a table
                <ArrowRight size={15} />
              </Button>
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#24211F]/10 bg-white text-[#24211F] md:hidden"
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {/* MOBILE NAVIGATION */}
        {mobileMenuOpen && (
          <div className="border-t border-[#24211F]/10 bg-[#F7F1E8] px-5 py-5 md:hidden">
            <nav className="flex flex-col gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive(item.to)
                      ? "bg-[#C9362B]/10 text-[#C9362B]"
                      : "text-[#706963] hover:bg-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {/* <div className="mt-3 grid grid-cols-2 gap-3 border-t border-[#24211F]/10 pt-5">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-[#24211F]/20"
                  >
                    Login
                  </Button>
                </Link>

                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full rounded-full bg-[#C9362B] hover:bg-[#A92B23]">
                    Reserve
                  </Button>
                </Link>
              </div> */}
            </nav>
          </div>
        )}
      </header>

      {/* PAGE CONTENT */}
      <main>
        <Outlet />
      </main>

      <a
        href="https://wa.me/923001022929"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 left-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_18px_40px_rgba(37,211,102,0.35)] transition hover:scale-105 hover:bg-[#1ebc5a] md:bottom-8 md:left-8"
      >
        <img width="38" height="38" src="/whatsapp-svgr.svg" alt="WhatsApp" className="filter invert" />
      </a>

      {showScrollTop && (
        <button
          type="button"
          aria-label="Scroll to top"
          onClick={scrollToTop}
          className="fixed bottom-6 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[#24211F]/10 bg-white text-[#24211F] shadow-[0_12px_30px_rgba(36,33,31,0.12)] transition hover:-translate-y-0.5 hover:bg-[#F5EDE5] md:bottom-8 md:right-8"
        >
          <ChevronUp size={20} />
        </button>
      )}

      {/* MAP */}
      <section className="border-t border-[#24211F]/10 bg-[#F3E7D9]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#C9362B]">
                Find us
              </p>
              <h2 className="mt-2 text-3xl font-black text-[#24211F] md:text-4xl">
                Visit Pizza Mehal
              </h2>
            </div>

            <a
              href="https://maps.google.com/?q=1st+Floor+1km+Thokar+Niazbaig+Main+Raiwind+Road+Near+Risen+Cash+and+Carry+Store"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#C9362B] transition hover:text-[#A92B23]"
            >
              Get directions
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
            <div className="overflow-hidden rounded-[28px] border border-[#24211F]/10 bg-white shadow-[0_20px_60px_rgba(36,33,31,0.08)]">
              <iframe
                title="Pizza Mehal location"
                src="https://www.google.com/maps?q=1st%20Floor%201km%20Thokar%20Niazbaig%20Main%20Raiwind%20Road%20Near%20Risen%20Cash%20and%20Carry%20Store&output=embed"
                className="h-[360px] w-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="flex flex-col justify-center rounded-[28px] bg-[#24211F] p-8 text-white shadow-[0_20px_60px_rgba(36,33,31,0.12)]">
              <div className="mb-5 flex items-center gap-3 text-[#F08B64]">
                <MapPin size={22} />
                <span className="text-sm font-bold uppercase tracking-[0.2em]">
                  Address
                </span>
              </div>

              <p className="text-lg font-semibold leading-8 text-white/90">
                1st Floor 1km Thokar Niazbaig Main Raiwind Road, Near Risen Cash and Carry Store
              </p>

              <div className="mt-8 space-y-4 text-sm text-white/70">
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 shrink-0 text-[#F08B64]" size={18} />
                  <span>Monday - Sunday: 02:00 AM - 02:00 PM</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="shrink-0 text-[#F08B64]" size={18} />
                  <span>+92 300 1022929</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#24211F] text-white">
        {/* FOOTER MAIN */}
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* BRAND INFORMATION */}
          <div className="lg:col-span-1">
            <Link to="/" className="mb-6 inline-flex items-center gap-3">
              <img
                src="/Logo.png"
                alt="Pizza Mehal"
                className="h-12 w-12 rounded-xl bg-white object-contain p-1"
              />

              <div>
                <p className="text-xl font-black">
                  Pizza <span className="text-[#F08B64]">Mehal</span>
                </p>
                <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/50">
                  Taste the difference
                </p>
              </div>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-white/60">
              Great pizza, unforgettable flavors, and beautiful moments around
              the table. Welcome to Pizza Mehal.
            </p>

            {/* <div className="mt-6 flex gap-3">

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#C9362B]"
              >
                
              </a>

              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#C9362B]"
              >
                
              </a>

            </div> */}
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-[#F08B64]">
              Explore
            </h3>

            <ul className="space-y-4">
              {navigation.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-white/60 transition hover:pl-1 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* RESTAURANT INFORMATION */}
          <div>
            <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-[#F08B64]">
              Visit us
            </h3>

            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 shrink-0 text-[#F08B64]" size={18} />

                <span className="text-sm leading-6 text-white/60">
                 1st Floor 1km Thokar Niazbaig Main Raiwind Road, Near Risen Cash and Carry Store
                </span>
              </li>

              {/* <li className="flex items-start gap-3">
                <Clock className="mt-0.5 shrink-0 text-[#F08B64]" size={18} />

                <span className="text-sm leading-6 text-white/60">
                  Opening hours
                  <br />
                  Check with our restaurant team for any changes.
                </span>
              </li> */}

              <li className="flex items-center gap-3">
                <Phone className="shrink-0 text-[#F08B64]" size={18} />

                <span className="text-sm text-white/60">+92 300 1022929</span>
              </li>
            </ul>
          </div>

          {/* RESERVATIONS */}
          <div>
            <h3 className="mb-6 text-xs  font-bold uppercase tracking-[0.2em] text-[#F08B64]">
              Your table awaits
            </h3>

            <p className="mb-6 text-sm leading-7 text-white/60">
              Planning a meal with friends or family? Reserve your table and
              make it special.
            </p>

            <Link to="https://wa.me/923001022929" target="_blank">
              <Button className="h-12 gap-2 rounded-full bg-[#C9362B] px-6 text-white hover:bg-[#A92B23]">
                <Utensils size={16} />
                Reserve a table
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-white/10 ">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-center sm:px-8 md:flex-row md:text-left">
            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} Pizza Mehal. All rights reserved.
            </p>

            <p className="flex items-center gap-1 text-xs text-white/40">
              Made with
              <span className="text-[#C9362B]">♥</span>
              for pizza lovers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WebsiteLayout;
