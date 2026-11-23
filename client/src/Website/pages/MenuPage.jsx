import { useMemo, useState } from "react";
import {
  Search,
  Pizza,
  Flame,
  UtensilsCrossed,
  Sandwich,
  Drumstick,
  Coffee,
  Beef,
  GlassWater,
  Plus,
  Tag,
  X,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

import { menuCategories, menuItems } from "../constants/menuData.js";

const formatPrice = (price) => `Rs. ${Number(price).toLocaleString("en-PK")}`;

const categoryIcons = {
  All: UtensilsCrossed,
  Pizza,
  Deals: Tag,
  Burgers: Sandwich,
  Rolls: Sandwich,
  "Wings & Nuggets": Drumstick,
  Fries: Flame,
  Sandwiches: Sandwich,
  Pasta: UtensilsCrossed,
  Steaks: Beef,
  Drinks: GlassWater,
  Extras: Plus,
};

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;

      const matchesSearch = `${item.name} ${item.category} ${
        item.description || ""
      }`
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const groupedItems = useMemo(() => {
    if (activeCategory !== "All") {
      return filteredItems.length
        ? [{ title: activeCategory, items: filteredItems }]
        : [];
    }

    return menuCategories
      .filter((category) => category !== "All")
      .map((category) => ({
        title: category,
        items: filteredItems.filter((item) => item.category === category),
      }))
      .filter((section) => section.items.length > 0);
  }, [activeCategory, filteredItems]);

  const clearFilters = () => {
    setActiveCategory("All");
    setSearchQuery("");
  };

  const scrollToMenu = () => {
    document.getElementById("menu-list")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#F7F1E8] text-[#24211F]">
      {/* ========================================
          MENU SECTION
      ======================================== */}
      <section
        id="menu-list"
        className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
      >
        {/* SECTION HEADING */}
        <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.22em] text-[#C9362B]">
              Discover our flavours
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Our Full Menu
              <span className="text-[#C9362B]">.</span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[#71675F]">
              Explore our selection of delicious pizzas, burgers, sides,
              refreshing drinks and special deals.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#E9DED0] bg-white px-4 py-3 text-sm font-semibold shadow-sm">
            <Pizza size={18} className="text-[#C9362B]" />
            {filteredItems.length} items found
          </div>
        </div>

        {/* SEARCH */}
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[#E9DED0] bg-white px-4 py-4 shadow-sm transition focus-within:border-[#C9362B] focus-within:ring-2 focus-within:ring-[#C9362B]/10">
          <Search size={20} className="shrink-0 text-[#A49A8F]" />

          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search pizzas, burgers, deals..."
            aria-label="Search menu"
            className="w-full bg-transparent text-sm font-medium text-[#24211F] outline-none placeholder:text-[#A49A8F]"
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="rounded-full p-1 text-[#81776D] transition hover:bg-[#F7F1E8]"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* CATEGORY NAVIGATION */}
        <div className="sticky top-16 z-30 -mx-4 mb-10 border-y border-[#E9DED0] bg-[#F7F1E8]/95 px-4 py-4 backdrop-blur-lg sm:mx-0 sm:rounded-2xl sm:border sm:px-4">
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {menuCategories.map((category) => {
              const Icon = categoryIcons[category] || UtensilsCrossed;
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-3 text-xs font-bold transition-all sm:text-sm ${
                    isActive
                      ? "bg-[#C9362B] text-white shadow-md shadow-[#C9362B]/15"
                      : "border border-[#E9DED0] bg-white text-[#554B43] hover:border-[#C9362B] hover:text-[#C9362B]"
                  }`}
                >
                  <Icon size={16} />
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* MENU PRODUCTS */}
        {groupedItems.length > 0 ? (
          <div className="space-y-14">
            {groupedItems.map((section) => {
              const Icon = categoryIcons[section.title] || UtensilsCrossed;

              return (
                <div key={section.title}>
                  {/* CATEGORY HEADING */}
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#C9362B]/10 text-[#C9362B]">
                      <Icon size={23} />
                    </div>

                    <div>
                      <h3 className="text-2xl font-black tracking-tight sm:text-3xl">
                        {section.title}
                      </h3>

                      <p className="mt-1 text-xs text-[#81776D]">
                        {section.items.length} delicious options
                      </p>
                    </div>

                    <div className="ml-2 hidden h-px flex-1 bg-[#E5D9CA] sm:block" />
                  </div>

                  {/* PRODUCT CARDS */}
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {section.items.map((item) => (
                      <article
                        key={item.id}
                        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#E9DED0] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#D96A32]/50 hover:shadow-xl hover:shadow-[#24211F]/5"
                      >
                        {/* POPULAR LABEL */}
                        {item.featured && (
                          <span className="absolute right-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-[#FCE8DF] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#C9362B]">
                            <Flame size={12} />
                            Popular
                          </span>
                        )}

                        {/* PRODUCT IMAGE */}
                       
<div className="relative mb-5 h-48 overflow-hidden rounded-xl bg-gradient-to-br from-[#FCE8D8] via-[#F7F0E8] to-[#F4DCC8]">
  {/* Decorative background glow */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,106,50,0.18),transparent_70%)]" />

  {item.image ? (
    <img
      src={item.image}
      alt={item.name}
      loading="lazy"
      className="relative z-[1] h-full w-full object-cover transition duration-500 group-hover:scale-110"
      onError={(event) => {
        event.currentTarget.style.display = 'none'
      }}
    />
  ) : (
    <div className="relative z-[1] flex h-full w-full items-center justify-center">
      <Icon
        size={48}
        strokeWidth={1.3}
        className="text-[#C9362B]/75"
      />
    </div>
  )}

  {item.featured && (
    <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-[#C9362B] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
      <Flame size={12} />
      Popular
    </span>
  )}
</div>


                        <div className="flex flex-1 flex-col">
                          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#C9362B]">
                            {item.category}
                          </span>

                          <h4 className="mt-2 text-lg font-black leading-snug text-[#24211F]">
                            {item.name}
                          </h4>

                          {item.description && (
                            <p className="mt-2 text-xs leading-5 text-[#81776D]">
                              {item.description}
                            </p>
                          )}

                          <div className="mt-auto pt-5">
                            {/* PIZZA SIZES */}
                            {item.sizes && (
                              <div className="border-t border-dashed border-[#E9DED0] pt-4">
                                <p className="mb-3 text-[10px] font-black uppercase tracking-wider text-[#81776D]">
                                  Available sizes
                                </p>

                                <div className="grid grid-cols-3 gap-2">
                                  {Object.entries(item.sizes).map(
                                    ([size, price]) => (
                                      <div
                                        key={size}
                                        className="rounded-xl bg-[#F7F1E8] px-1 py-2 text-center transition hover:bg-[#FCE8DF]"
                                      >
                                        <p className="text-[10px] font-bold text-[#81776D]">
                                          {size}
                                        </p>

                                        <p className="mt-1 text-xs font-black text-[#C9362B]">
                                          {formatPrice(price)}
                                        </p>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}

                            {/* OTHER VARIANTS */}
                            {item.variants && (
                              <div className="border-t border-dashed border-[#E9DED0] pt-4">
                                <div className="flex flex-wrap gap-2">
                                  {item.variants.map((variant) => (
                                    <div
                                      key={variant.label}
                                      className="flex flex-1 items-center justify-between gap-2 rounded-xl bg-[#F7F1E8] px-3 py-2"
                                    >
                                      <span className="text-xs font-bold text-[#81776D]">
                                        {variant.label}
                                      </span>

                                      <span className="text-xs font-black text-[#C9362B]">
                                        {formatPrice(variant.price)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* SINGLE PRICE */}
                            {item.price !== undefined &&
                              item.price !== null && (
                                <div className="flex items-center justify-between border-t border-dashed border-[#E9DED0] pt-4">
                                  <span className="text-xs font-semibold text-[#81776D]">
                                    Price
                                  </span>

                                  <span className="text-xl font-black text-[#C9362B]">
                                    {formatPrice(item.price)}
                                  </span>
                                </div>
                              )}

                            {/* PRICE NOT AVAILABLE */}
                            {item.priceOnRequest && (
                              <div className="border-t border-dashed border-[#E9DED0] pt-4 text-sm font-bold text-[#C9362B]">
                                Please ask our staff for price
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="rounded-3xl border border-dashed border-[#DCCDBB] bg-white px-5 py-16 text-center">
            <Search size={42} className="mx-auto text-[#C9362B]/50" />

            <h3 className="mt-4 text-xl font-black">No items found</h3>

            <p className="mt-2 text-sm text-[#81776D]">
              Try another search or choose a different category.
            </p>

            <button
              onClick={clearFilters}
              className="mt-5 rounded-full bg-[#C9362B] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#D96A32]"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default MenuPage;
