
import { useEffect, useState } from 'react'
import {
  ArrowDown,
  ArrowRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock,
  Image as ImageIcon,
  X,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const galleryCategories = [
  'All',
  'Our Food',
  'Pizza',
  'Burgers',
  'Restaurant',
  'Moments',
]

const galleryImages = [
  {
    id: 1,
    title: 'The Signature Pizza',
    category: 'Moments',
    image: 'https://images.pexels.com/photos/7886606/pexels-photo-7886606.jpeg',
    size: 'large',
  },
  {
    id: 2,
    title: 'Fresh Out of the Oven',
    category: 'Our Food',
    image: 'https://images.pexels.com/photos/5056623/pexels-photo-5056623.jpeg',
    size: 'small',
  },
  {
    id: 3,
    title: 'The Perfect Bite',
    category: 'Burgers',
    image: 'https://images.pexels.com/photos/4315148/pexels-photo-4315148.jpeg',
    size: 'small',
  },
  {
    id: 4,
    title: 'Made for Sharing',
    category: 'Pizza',
    image: 'https://images.pexels.com/photos/17403901/pexels-photo-17403901.jpeg',
    size: 'wide',
  },
  {
    id: 5,
    title: 'Refreshing Drinks',
    category: 'Drinks',
    image: 'https://media.istockphoto.com/id/1062831310/photo/pour-soft-drink-in-glass-with-ice-splash-on-dark-background.jpg?b=1&s=612x612&w=0&k=20&c=fjNgCpNIfiXPzhRJkfi84X5fjTG-OtG4QF71ZK8V-ME=',
    size: 'small',
  },
  {
    id: 6,
    title: 'Crispy Fries and Sides',
    category: 'Fries',
    image: 'https://images.pexels.com/photos/12557559/pexels-photo-12557559.jpeg',
    size: 'small',
  },
  {
    id: 7,
    title: 'Cozy Dining Experience',
    category: 'Restaurant',
    image: 'https://images.pexels.com/photos/33948377/pexels-photo-33948377.jpeg',
    size: 'wide',
  },
  {
    id: 8,
    title: 'Good Times, Great Food',
    category: 'Nuggets',
    image: 'https://images.pexels.com/photos/39853099/pexels-photo-39853099.jpeg',
    size: 'small',
  },
  {
    id: 9,
    title: 'Freshly Prepared',
    category: 'Rolls',
    image: 'https://images.pexels.com/photos/11783313/pexels-photo-11783313.jpeg',
    size: 'small',
  },
]

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedImage, setSelectedImage] = useState(null)

  const filteredImages =
    activeCategory === 'All'
      ? galleryImages
      : galleryImages.filter(
          (item) => item.category === activeCategory,
        )

  const currentIndex = selectedImage
    ? filteredImages.findIndex((item) => item.id === selectedImage.id)
    : -1

  const showNext = () => {
    if (currentIndex === -1) return

    setSelectedImage(
      filteredImages[(currentIndex + 1) % filteredImages.length],
    )
  }

  const showPrevious = () => {
    if (currentIndex === -1) return

    setSelectedImage(
      filteredImages[
        (currentIndex - 1 + filteredImages.length) %
          filteredImages.length
      ],
    )
  }

  useEffect(() => {
    if (!selectedImage) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedImage(null)
      if (event.key === 'ArrowRight') showNext()
      if (event.key === 'ArrowLeft') showPrevious()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [selectedImage, currentIndex])

  const getSizeClass = (size) => {
    switch (size) {
      case 'large':
        return 'md:col-span-2 md:row-span-2 min-h-[300px] md:min-h-[520px]'
      case 'wide':
        return 'md:col-span-2 min-h-[260px]'
      default:
        return 'md:col-span-1 min-h-[260px]'
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#F7F1E8] text-[#24211F]">

      {/* GALLERY */}
      <section
        id="gallery"
        className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      >
        {/* SECTION HEADING */}
        <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.22em] text-[#C9362B]">
              Moments worth sharing
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              The Pizza Mehal Gallery
              <span className="text-[#C9362B]">.</span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[#71675F]">
              Explore our food, our space, and the moments that make
              every visit special.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-xl border border-[#E9DED0] bg-white px-4 py-3 text-sm font-semibold">
            <ImageIcon size={18} className="text-[#C9362B]" />
            {filteredImages.length} photos
          </div>
        </div>

        {/* CATEGORY FILTER */}
        {/* <div className="mb-10 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {galleryCategories.map((category) => {
            const isActive = activeCategory === category

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full px-5 py-3 text-xs font-bold transition-all sm:text-sm ${
                  isActive
                    ? 'bg-[#C9362B] text-white shadow-lg shadow-[#C9362B]/15'
                    : 'border border-[#E9DED0] bg-white text-[#554B43] hover:border-[#C9362B] hover:text-[#C9362B]'
                }`}
              >
                {category}
              </button>
            )
          })}
        </div> */}

        {/* BENTO GRID */}
        {filteredImages.length > 0 ? (
          <div className="grid auto-rows-[260px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:auto-rows-[260px] lg:gap-5">
            {filteredImages.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedImage(item)}
                aria-label={`View ${item.title}`}
                className={`group relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#FCE8D8] via-[#F7F0E8] to-[#F4DCC8] text-left shadow-sm transition duration-500 hover:shadow-xl hover:shadow-[#24211F]/10 ${getSizeClass(item.size)}`}
              >
                {/* BACKGROUND GLOW */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,106,50,0.18),transparent_70%)]" />

                {/* IMAGE */}
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'
                  }}
                />

                {/* IMAGE OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#171310]/80 via-[#171310]/10 to-transparent opacity-80 transition duration-300 group-hover:opacity-100" />

                {/* CATEGORY */}
                <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                  {item.category}
                </span>

                {/* VIEW ICON */}
                <div className="absolute right-5 top-5 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-md transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowRight size={18} />
                </div>

                {/* IMAGE TITLE */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <div className="translate-y-3 transition duration-300 group-hover:translate-y-0">
                    <h3 className="text-xl font-black text-white sm:text-2xl">
                      {item.title}
                    </h3>

                    <p className="mt-2 flex items-center gap-2 text-xs font-medium text-white/70 opacity-0 transition duration-300 group-hover:opacity-100">
                      <Camera size={14} />
                      View photograph
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-[#DCCDBB] bg-white px-5 py-16 text-center">
            <ImageIcon
              size={42}
              className="mx-auto text-[#C9362B]/50"
            />

            <h3 className="mt-4 text-xl font-black">
              No photos found
            </h3>

            <p className="mt-2 text-sm text-[#81776D]">
              Try selecting another gallery category.
            </p>

            <button
              onClick={() => setActiveCategory('All')}
              className="mt-5 rounded-full bg-[#C9362B] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#D96A32]"
            >
              View All Photos
            </button>
          </div>
        )}
      </section>

      {/* LIGHTBOX */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#171310]/95 p-4 backdrop-blur-md sm:p-8"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          {/* CLOSE */}
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            aria-label="Close image preview"
            className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#C9362B]"
          >
            <X size={22} />
          </button>

          {/* PREVIOUS */}
          {filteredImages.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                showPrevious()
              }}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#C9362B] sm:left-8"
            >
              <ChevronLeft size={25} />
            </button>
          )}

          {/* IMAGE CONTENT */}
          <div
            className="relative w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="overflow-hidden rounded-2xl bg-[#24211F] shadow-2xl">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="max-h-[75vh] w-full object-contain"
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-white">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#D96A32]">
                  {selectedImage.category}
                </p>
                <h3 className="mt-1 text-xl font-black sm:text-2xl">
                  {selectedImage.title}
                </h3>
              </div>

              <span className="text-sm font-semibold text-white/50">
                {currentIndex + 1} / {filteredImages.length}
              </span>
            </div>
          </div>

          {/* NEXT */}
          {filteredImages.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                showNext()
              }}
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#C9362B] sm:right-8"
            >
              <ChevronRight size={25} />
            </button>
          )}
        </div>
      )}

      {/* BOTTOM CTA */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-[#24211F] px-6 py-14 text-center sm:px-12 sm:py-16">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C9362B] text-white">
            <Camera size={26} />
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-[#D96A32]">
            Your next delicious moment
          </p>

          <h2 className="mt-3 text-3xl font-black text-[#F7F1E8] sm:text-4xl">
            Ready to make some memories?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/55">
            Explore our menu and discover something delicious for your
            next visit.
          </p>

          <Link
            to="/menu"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#C9362B] px-8 py-4 text-sm font-bold transition hover:bg-[#D96A32]"
          >
            <span className='text-white'>Explore Our Menu</span>
            <ArrowRight className='text-white' size={17} />
          </Link>
        </div>
      </section>
    </main>
  )
}

export default Gallery
