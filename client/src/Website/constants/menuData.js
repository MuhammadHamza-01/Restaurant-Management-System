
export const menuCategories = [
  'All',
  'Pizza',
  'Deals',
  'Burgers',
  'Rolls',
  'Wings & Nuggets',
  'Fries',
  'Sandwiches',
  'Pasta',
  'Steaks',
  'Drinks',
  'Extras',
]

export const menuItems = [
  // PIZZAS
  {
    id: 'special-pizza-mahal',
    name: 'Special Pizza Mahal',
    category: 'Pizza',
    description: 'Pizza Mahal signature pizza.',
    image:'/Logo.png',
    featured: true,
  },
  {
    id: 'chicken-tikka',
    name: 'Chicken Tikka',
    category: 'Pizza',
    image: '/Logo.png',
    description: 'Chicken tikka, onion and mozzarella cheese.',
    sizes: { Small: 500, Medium: 1100, Large: 1400 },
  },
  {
    id: 'veggie-lover',
    name: 'Veggie Lover',
    category: 'Pizza',
    image: '/Logo.png',
    description: 'Mozzarella cheese, vegetables, onion and tomatoes.',
    sizes: { Small: 500, Medium: 1050, Large: 1300 },
  },
  {
    id: 'sweet-corns',
    name: 'Sweet Corns',
    category: 'Pizza',
    description: 'Mozzarella cheese with sweet corn.',
    sizes: { Small: 500, Medium: 1050, Large: 1450 },
  },
  {
    id: 'fajita',
    name: 'Fajita',
    category: 'Pizza',
    description: 'Smoked chicken, green pepper and jalapeño olives.',
    sizes: { Small: 500, Medium: 1100, Large: 1400 },
  },
  {
    id: 'super-supreme',
    name: 'Super Supreme',
    category: 'Pizza',
    description: 'Chicken tikka, onion, green pepper and jalapeño olives.',
    sizes: { Small: 500, Medium: 1050, Large: 1450 },
  },
  {
    id: 'cheese-lover',
    name: 'Cheese Lover',
    category: 'Pizza',
    description: 'Mozzarella cheese with special sauce.',
    sizes: { Small: 500, Medium: 1050, Large: 1300 },
  },
  {
    id: 'bbq-chicken',
    name: 'B.B.Q Chicken',
    category: 'Pizza',
    description: 'Topped with spicy chicken, olives and tikka sauce.',
    sizes: { Small: 500, Medium: 1350, Large: 1600 },
  },
  {
    id: 'chicken-kabab-pizza',
    name: 'Chicken Kabab Pizza',
    category: 'Pizza',
    sizes: { Medium: 1350, Large: 1650 },
  },
  {
    id: 'kababa-stuffer',
    name: 'Kababa Stuffer Pizza',
    category: 'Pizza',
    description: 'Stuffed with chicken kabab, tomatoes and green pepper.',
    sizes: { Medium: 1400, Large: 1700 },
  },
  {
    id: 'crown-crust',
    name: 'Crown Crust Pizza',
    category: 'Pizza',
    description: 'Special crown crust with green pepper, olives and cheese.',
    sizes: { Medium: 1500, Large: 1800 },
  },
  {
    id: 'malai-boti-pizza',
    name: 'Malai Boti Pizza',
    category: 'Pizza',
    description: 'Marinated chicken malai boti with special sauce.',
    sizes: { Small: 550, Medium: 1300, Large: 1600 },
  },
  {
    id: 'mughlai-tikka',
    name: 'Mughlai Tikka Pizza',
    category: 'Pizza',
    description: 'Special Mughlai tikka chicken with onion and green pepper.',
    sizes: { Small: 500, Medium: 1380, Large: 1650 },
  },

  // BURGERS
  {
    id: 'patty-burger',
    name: 'Patty Burger',
    category: 'Burgers',
    price: 380,
  },
  {
    id: 'zinger-cheese',
    name: 'Zinger Burger With Cheese',
    category: 'Burgers',
    price: 480,
  },
  {
    id: 'jumbo-zinger',
    name: 'Jumbo Zinger',
    category: 'Burgers',
    price: 550,
    featured: true,
  },
  {
    id: 'hunger-buster',
    name: 'Hunger Buster',
    category: 'Burgers',
    price: 450,
  },
  {
    id: 'zinger-burger',
    name: 'Zinger Burger',
    category: 'Burgers',
    price: 400,
  },
  {
    id: 'zinger-fries-drink',
    name: 'Zinger Burger With Fries & Regular Drink',
    category: 'Burgers',
    price: 550,
  },
  {
    id: 'double-decker',
    name: 'Double Decker',
    category: 'Burgers',
    price: 650,
  },
  {
    id: 'jalapeno-chicken-cheese',
    name: 'Jalapeno Chicken With Cheese',
    category: 'Burgers',
    price: 520,
  },

  // DEALS
  {
    id: 'student-deals',
    name: 'Student Deals',
    category: 'Deals',
    price: 2400,
    description: '1 large pizza, 2 oven-baked wings, 2 chicken patty burgers and 1.5L drink.',
    featured: true,
  },
  {
    id: 'mix-platter',
    name: 'Mix Platter',
    category: 'Deals',
    price: 1350,
    description: '1 spin roll, 6 oven-baked wings and half-pasta with 1L drink.',
    featured: true,
  },
  {
    id: 'pizza-deal-1',
    name: 'Pizza Deal 1',
    category: 'Deals',
    price: 2999,
    description: 'Large pizza with 1L drink.',
  },
  {
    id: 'pizza-deal-2',
    name: 'Pizza Deal 2',
    category: 'Deals',
    price: 2400,
    description: '2 medium pizzas with 1.5L drink.',
  },
  {
    id: 'pizza-deal-3',
    name: 'Pizza Deal 3',
    category: 'Deals',
    price: 1050,
    description: 'Small pizza with 1 drink.',
  },
  {
    id: 'pizza-deal-4',
    name: 'Pizza Deal 4',
    category: 'Deals',
    price: 2899,
    description: '2 zinger burgers, 1 large pizza, 2 half-pastas and 1.5L drink.',
  },
  {
    id: 'pizza-deal-5',
    name: 'Pizza Deal 5',
    category: 'Deals',
    price: 599,
    description: 'Small pizza with 1 drink.',
  },
  {
    id: 'combo',
    name: 'Combo',
    category: 'Deals',
    price: 1950,
    description: '1 medium pizza, 2 zinger burgers and 1L drink.',
  },
  {
    id: 'zinger-deal-1',
    name: 'Zinger Deal 1',
    category: 'Deals',
    price: 850,
    description: '2 zinger burgers with 1 regular drink.',
  },
  {
    id: 'zinger-deal-2',
    name: 'Zinger Deal 2',
    category: 'Deals',
    price: 1600,
    description: '4 zinger burgers with 1L drink.',
  },
  {
    id: 'special-offer',
    name: 'Special Offer',
    category: 'Deals',
    price: 1599,
    description: '1 large pizza with 1L drink.',
  },
  {
    id: 'sp-pizza-deal',
    name: 'SP Pizza Deal',
    category: 'Deals',
    price: 1250,
    description: '1 medium pizza with 0.5L drink.',
  },
  {
    id: 'zinpasta-deal',
    name: 'ZinPasta Deal',
    category: 'Deals',
    price: 899,
    description: '1 zinger burger with half pasta and 500ml drink.',
  },

  // ROLLS
  {
    id: 'malai-boti-roll',
    name: 'Malai Boti Roll',
    category: 'Rolls',
    price: 650,
  },
  {
    id: 'chicken-kabab-roll',
    name: 'Chicken Kabab Roll',
    category: 'Rolls',
    price: 600,
  },
  {
    id: 'spin-roll',
    name: 'Spin Roll',
    category: 'Rolls',
    price: 550,
  },

  // WINGS & NUGGETS
  {
    id: 'oven-baked-wings',
    name: 'Oven Baked Wings (10 Pcs)',
    category: 'Wings & Nuggets',
    price: 650,
  },
  {
    id: 'hot-wings',
    name: 'Hot Wings (10 Pcs)',
    category: 'Wings & Nuggets',
    price: 700,
  },
  {
    id: 'nuggets',
    name: 'Nuggets',
    category: 'Wings & Nuggets',
    variants: [
      { label: '6 Pcs', price: 350 },
      { label: '12 Pcs', price: 600 },
    ],
  },

  // FRIES
  {
    id: 'plain-fries',
    name: 'Plain Fries',
    category: 'Fries',
    variants: [
      { label: 'Regular', price: 200 },
      { label: 'Large', price: 350 },
    ],
  },
  {
    id: 'french-fries',
    name: 'French Fries',
    category: 'Fries',
    price: 450,
  },
  {
    id: 'loaded-fries',
    name: 'Loaded Fries',
    category: 'Fries',
    price: 650,
  },

  // SANDWICHES
  {
    id: 'chicken-sandwich',
    name: 'Chicken Sandwich',
    category: 'Sandwiches',
    price: 500,
  },
  {
    id: 'grilled-sandwich',
    name: 'Grilled Sandwich',
    category: 'Sandwiches',
    price: 550,
  },

  // PASTA
  {
    id: 'special-pasta',
    name: 'Special Pasta',
    category: 'Pasta',
    variants: [
      { label: 'Full', price: 800 },
      { label: 'Half', price: 400 },
    ],
  },
  {
    id: 'creamy-pasta',
    name: 'Creamy Pasta',
    category: 'Pasta',
    variants: [
      { label: 'Full', price: 820 },
      { label: 'Half', price: 430 },
    ],
  },
  {
    id: 'macaroni',
    name: 'Macaroni',
    category: 'Pasta',
    variants: [
      { label: 'Full', price: 650 },
      { label: 'Half', price: 350 },
    ],
  },
  {
    id: 'alfredo-pasta',
    name: 'Alfredo Pasta',
    category: 'Pasta',
    price: null,
    priceOnRequest: true,
  },

  // STEAKS
  {
    id: 'mexican-steak',
    name: 'Mexican Steak',
    category: 'Steaks',
    price: 750,
  },

  // DRINKS
  {
    id: 'plain-water',
    name: 'Plain Water',
    category: 'Drinks',
    variants: [
      { label: 'Small', price: 60 },
      { label: 'Large', price: 120 },
    ],
  },
  {
    id: 'cold-drink-liter',
    name: 'Cold Drink',
    category: 'Drinks',
    variants: [
      { label: '1 Liter', price: 180 },
      { label: '1.5 Liter', price: 230 },
    ],
  },
  {
    id: 'cold-drink-small',
    name: 'Cold Drink',
    category: 'Drinks',
    variants: [
      { label: '300ml', price: 100 },
      { label: '500ml', price: 130 },
    ],
  },

  // EXTRAS
  {
    id: 'pizza-topping',
    name: 'Pizza Topping',
    category: 'Extras',
    variants: [
      { label: 'Small', price: 80 },
      { label: 'Medium', price: 130 },
      { label: 'Large', price: 150 },
    ],
  },
  {
    id: 'cheese-slice',
    name: 'Cheese Slice',
    category: 'Extras',
    price: 70,
  },
  {
    id: 'dip-sauce',
    name: 'Dip Sauce',
    category: 'Extras',
    price: 70,
  },
]
