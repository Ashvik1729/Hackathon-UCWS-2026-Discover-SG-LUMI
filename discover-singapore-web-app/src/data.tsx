import React from 'react';
import {
  Utensils, Hotel as HotelIcon,
  ShoppingCart, Plane, Train, Bus, CloudSun,
  CreditCard, Shield, Globe, Smartphone, Tag, Award,
  Percent, Gift, Coffee
} from 'lucide-react';

// ===== TYPES =====
export type Category = 'All' | 'Food' | 'Attractions' | 'Culture' | 'Nature' | 'Technology' | 'Hotels' | 'Shopping' | 'Nightlife' | 'DayTrips';

export interface Location {
  id: string;
  name: string;
  category: Category;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  coordinates: { lat: number; lng: number };
  tags: string[];
  visitDuration: string;
  bestTime: string;
  price: string;
  address?: string;
  tip?: string;
}

export interface HotelData extends Location {
  pricePerNight: number;
  priceLabel: string;
  tier: 'Luxury' | 'Mid-range' | 'Affordable' | 'Budget';
  amenities: string[];
}

export interface Deal {
  id: string;
  name: string;
  tagline: string;
  description: string;
  discount: string;
  category: string;
  bestFor: string;
  image: string;
  url: string;
  color: string;
  icon: React.ReactNode;
  tip: string;
}

export interface Festival {
  name: string;
  month: string;
  description: string;
  color: string;
  emoji: string;
}

export interface Neighborhood {
  name: string;
  vibe: string;
  description: string;
  bestFor: string[];
  color: string;
}

// ===== DEALS & BOOKING APPS =====
export const DEALS: Deal[] = [
  {
    id: 'd1',
    name: 'Klook',
    tagline: 'Best for attraction tickets',
    description: 'Singapore-based travel platform offering up to 50% off major attractions. Book Universal Studios, Singapore Zoo, Gardens by the Bay, Singapore Flyer, and more at discounted rates.',
    discount: 'Up to 50% off',
    category: 'Attractions',
    bestFor: 'Theme parks, museums, tours',
    image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=600&q=80',
    url: 'https://www.klook.com',
    color: 'from-orange-500 to-red-500',
    icon: <Tag className="w-6 h-6" />,
    tip: 'Pro tip: Bundle 3+ attractions for extra 10% off. Tuesday flash sales offer deepest discounts.'
  },
  {
    id: 'd2',
    name: 'Agoda',
    tagline: 'Best for hotel bookings in Asia',
    description: 'Asia-focused hotel booking platform with exclusive deals. AgodaCash rewards program gives cashback on every booking. Often has lower rates than Booking.com for Singapore hotels.',
    discount: 'Up to 70% off + AgodaCash',
    category: 'Hotels',
    bestFor: 'Hotels, hostels, serviced apartments',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
    url: 'https://www.agoda.com',
    color: 'from-red-500 to-pink-500',
    icon: <HotelIcon className="w-6 h-6" />,
    tip: 'Pro tip: Sign up for "Agoda VIP" for extra 10-15% off. Book 30+ days ahead for best rates.'
  },
  {
    id: 'd3',
    name: 'Eatigo',
    tagline: '50% off restaurant bills',
    description: 'Book restaurants at off-peak times and get up to 50% off your entire bill. Works at 1,000+ restaurants in Singapore including high-end establishments.',
    discount: 'Up to 50% off dining',
    category: 'Food',
    bestFor: 'Fine dining, buffets, cafes',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
    url: 'https://www.eatigo.com',
    color: 'from-amber-500 to-orange-500',
    icon: <Utensils className="w-6 h-6" />,
    tip: 'Pro tip: Book at 3-5pm or 9pm for maximum 50% discount. No minimum spend required.'
  },
  {
    id: 'd4',
    name: 'Burpple Beyond',
    tagline: '1-for-1 dining at 500+ restaurants',
    description: 'Annual membership ($48/year) gives you 1-for-1 deals at over 500 restaurants across Singapore. Pays for itself after just 2-3 meals. Covers cafes, restaurants, bars.',
    discount: '1-for-1 meals',
    category: 'Food',
    bestFor: 'Foodies, couples, frequent diners',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
    url: 'https://www.burpple.com/beyond',
    color: 'from-pink-500 to-rose-500',
    icon: <Coffee className="w-6 h-6" />,
    tip: 'Pro tip: Most deals valid for dine-in only, min 2 pax. Book via app to avoid queues.'
  },
  {
    id: 'd5',
    name: 'The Entertainer',
    tagline: 'Buy-1-Get-1 dining & attractions',
    description: 'Digital voucher app with thousands of buy-1-get-1-free offers. Covers restaurants, spas, attractions, and hotels. Great for families and couples traveling together.',
    discount: 'Buy 1 Get 1 Free',
    category: 'All',
    bestFor: 'Families, couples, groups',
    image: 'https://images.unsplash.com/photo-1606830733744-0ad778449a55?w=600&q=80',
    url: 'https://www.theentertainerme.com',
    color: 'from-purple-500 to-indigo-500',
    icon: <Gift className="w-6 h-6" />,
    tip: 'Pro tip: $125/year but DBS/POSB cardholders often get it FREE with their card.'
  },
  {
    id: 'd6',
    name: 'Fave',
    tagline: 'Cashback on everything',
    description: 'Get up to 30% cashback when paying at 20,000+ merchants in Singapore. Works at restaurants, attractions, retail stores, and spas. Stack with other promotions.',
    discount: 'Up to 30% cashback',
    category: 'Shopping',
    bestFor: 'Shopping, dining, attractions',
    image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=600&q=80',
    url: 'https://www.fave.com',
    color: 'from-rose-500 to-red-500',
    icon: <Percent className="w-6 h-6" />,
    tip: 'Pro tip: Link to GrabPay for double rewards. Cashback credited within 3 days.'
  },
  {
    id: 'd7',
    name: 'Chope',
    tagline: 'Restaurant reservations + discounts',
    description: 'Book restaurants with ChopeDeals for $10-$50 off your bill. Earn Chope-Dollars on every reservation to redeem for future discounts. Covers 1,000+ restaurants.',
    discount: '$10-$50 off per booking',
    category: 'Food',
    bestFor: 'Restaurant bookings',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
    url: 'https://www.chope.co',
    color: 'from-emerald-500 to-teal-500',
    icon: <Utensils className="w-6 h-6" />,
    tip: 'Pro tip: Stack ChopeDeals with credit card promos for maximum savings.'
  },
  {
    id: 'd8',
    name: 'GetYourGuide',
    tagline: 'Skip-the-line tours & activities',
    description: 'Book tours, activities, and skip-the-line tickets for attractions. Free cancellation up to 24 hours before. Often 20-30% cheaper than booking at venue.',
    discount: '20-30% off tours',
    category: 'Attractions',
    bestFor: 'Guided tours, experiences',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80',
    url: 'https://www.getyourguide.com',
    color: 'from-blue-500 to-cyan-500',
    icon: <Award className="w-6 h-6" />,
    tip: 'Pro tip: Book combo tours (e.g. Zoo + Night Safari) for bundled savings up to 35%.'
  },
  {
    id: 'd9',
    name: 'Singapore Tourist Pass',
    tagline: 'Unlimited MRT & bus travel',
    description: 'Unlimited travel on MRT and basic bus services. Available in 1, 2, or 3-day passes. Huge savings if you use public transport frequently. Buy at Changi Airport or MRT stations.',
    discount: 'Unlimited travel from S$22',
    category: 'Transport',
    bestFor: 'Frequent MRT/bus users',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80',
    url: 'https://www.thesingaporetouristpass.com.sg',
    color: 'from-slate-600 to-slate-800',
    icon: <Train className="w-6 h-6" />,
    tip: 'Pro tip: 1-day: S$22, 2-day: S$30, 3-day: S$36. Refundable S$10 deposit. Best value if 4+ trips/day.'
  },
  {
    id: 'd10',
    name: 'iVenture Card',
    tagline: 'Multi-attraction pass',
    description: 'All-in-one digital pass for 30+ Singapore attractions. Choose 3, 4, 5, or 7 attractions and save up to 50% vs individual tickets. Includes Universal Studios, Zoo, Flyer.',
    discount: 'Up to 50% off bundled',
    category: 'Attractions',
    bestFor: 'Attraction hopping',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&q=80',
    url: 'https://www.iventurecard.com/sg',
    color: 'from-indigo-500 to-purple-500',
    icon: <CreditCard className="w-6 h-6" />,
    tip: 'Pro tip: Valid for 7 consecutive days from first use. Plan your top 5 must-sees to maximize value.'
  },
  {
    id: 'd11',
    name: 'Grab',
    tagline: 'Rides, food & payments',
    description: 'Singapore super-app for rides, food delivery, and payments. GrabRewards program gives points on every transaction. Often 30-50% cheaper than taxis.',
    discount: 'Promo codes weekly',
    category: 'Transport',
    bestFor: 'Transport, food delivery',
    image: 'https://images.unsplash.com/photo-1597218868981-1b68e15f0065?w=600&q=80',
    url: 'https://www.grab.com',
    color: 'from-green-500 to-emerald-500',
    icon: <Smartphone className="w-6 h-6" />,
    tip: 'Pro tip: Check "Promos" tab weekly for ride vouchers. GrabShare saves 30% vs GrabCar.'
  },
  {
    id: 'd12',
    name: 'Traveloka',
    tagline: 'Flights + hotels bundles',
    description: 'Southeast Asia travel platform with competitive flight and hotel packages. Traveloka Points for loyalty. Strong in budget airline deals (Scoot, AirAsia, Jetstar).',
    discount: 'Bundle savings 15-30%',
    category: 'Flights',
    bestFor: 'Flight + hotel combos',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80',
    url: 'https://www.traveloka.com',
    color: 'from-sky-500 to-blue-500',
    icon: <Plane className="w-6 h-6" />,
    tip: 'Pro tip: Book flight+hotel bundles for extra 15% off. Tuesday 12pm has weekly flash sales.'
  },
  {
    id: 'd13',
    name: 'Trip.com',
    tagline: 'Hotel flash deals',
    description: 'Chinese-owned platform with aggressive pricing on Singapore hotels. Member deals up to 50% off. "Mobile exclusive" rates often 10% cheaper than desktop.',
    discount: 'Up to 50% off hotels',
    category: 'Hotels',
    bestFor: 'Hotel flash deals',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80',
    url: 'https://www.trip.com',
    color: 'from-blue-600 to-indigo-600',
    icon: <HotelIcon className="w-6 h-6" />,
    tip: 'Pro tip: Download app for "app-only" prices. Trip Coins earned can be used for future bookings.'
  },
  {
    id: 'd14',
    name: 'Pelago',
    tagline: 'Singapore Airlines platform',
    description: 'Official experiences platform by Singapore Airlines. Earn KrisFlyer miles on bookings. Exclusive tours and activities with trusted operators.',
    discount: 'Earn KrisFlyer miles',
    category: 'Attractions',
    bestFor: 'KrisFlyer members',
    image: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?w=600&q=80',
    url: 'https://www.pelago.com',
    color: 'from-yellow-500 to-amber-600',
    icon: <Plane className="w-6 h-6" />,
    tip: 'Pro tip: Link to KrisFlyer account for double miles. Great for redeeming miles for experiences.'
  },
  {
    id: 'd15',
    name: 'Changi Rewards',
    tagline: 'Airport shopping discounts',
    description: 'Changi Rewards gives points at Changi Airport shops. Stack with iShopChangi for pre-order duty-free savings up to 40% on liquor, cosmetics, electronics.',
    discount: 'Up to 40% duty-free',
    category: 'Shopping',
    bestFor: 'Duty-free shopping',
    image: 'https://images.unsplash.com/photo-1564694202779-bc908c327862?w=600&q=80',
    url: 'https://www.ichangichoice.com',
    color: 'from-purple-500 to-pink-500',
    icon: <ShoppingCart className="w-6 h-6" />,
    tip: 'Pro tip: Pre-order online 12h-30 days before flight for best prices. Pickup at airport on arrival.'
  }
];

// ===== EXPANDED LOCATIONS =====
export const LOCATIONS: Location[] = [
  // ATTRACTIONS
  {
    id: '1', name: 'Marina Bay Sands', category: 'Attractions',
    description: 'Iconic three-tower hotel with the world\'s largest rooftop infinity pool, SkyPark observation deck, museum, and luxury shopping mall.',
    image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=600&q=80',
    rating: 4.8, reviews: 15420, coordinates: { lat: 1.2834, lng: 103.8607 },
    tags: ['Views', 'Luxury', 'Architecture', 'Pool'],
    visitDuration: '2-3 hours', bestTime: 'Sunset', price: '$$$',
    address: '10 Bayfront Ave', tip: 'SkyPark tickets S$30, book via Klook for 20% off'
  },
  {
    id: '2', name: 'Gardens by the Bay', category: 'Nature',
    description: '101-hectare futuristic park with 18 Supertrees, Cloud Forest dome, and Flower Dome. Free outdoor gardens; paid conservatories showcase rare plants.',
    image: 'https://images.unsplash.com/photo-1506351421178-63b52a2d2562?w=600&q=80',
    rating: 4.9, reviews: 23100, coordinates: { lat: 1.2816, lng: 103.8636 },
    tags: ['Nature', 'Family', 'Photography', 'UNESCO'],
    visitDuration: '3-4 hours', bestTime: 'Evening', price: '$$',
    address: '18 Marina Gardens Dr', tip: 'Garden Rhapsody light show free at 7:45pm & 8:45pm daily'
  },
  {
    id: '3', name: 'Merlion Park', category: 'Culture',
    description: 'Home to the iconic half-lion, half-fish statue symbolizing Singapore. Stunning Marina Bay views. Free to visit day and night.',
    image: 'https://images.unsplash.com/photo-1565961848354-3f5a36e4e3b5?w=600&q=80',
    rating: 4.6, reviews: 18500, coordinates: { lat: 1.2868, lng: 103.8545 },
    tags: ['Iconic', 'Free', 'Photo Spot'],
    visitDuration: '30-60 min', bestTime: 'Anytime', price: 'Free',
    address: '1 Fullerton Rd', tip: 'Best photo at sunrise before crowds arrive'
  },
  {
    id: '4', name: 'Jewel Changi Airport', category: 'Technology',
    description: 'Award-winning mixed-use complex at Changi Airport featuring the 40m Rain Vortex (world\'s tallest indoor waterfall), forest valley, and 280 shops.',
    image: 'https://images.unsplash.com/photo-1564694202779-bc908c327862?w=600&q=80',
    rating: 4.9, reviews: 28000, coordinates: { lat: 1.3644, lng: 103.9915 },
    tags: ['Shopping', 'Architecture', 'Family', 'Free'],
    visitDuration: '2-4 hours', bestTime: 'Anytime', price: 'Free',
    address: '78 Airport Blvd', tip: 'Light & sound show at Rain Vortex hourly from 8pm-12am'
  },
  {
    id: '6', name: 'Universal Studios Singapore', category: 'Attractions',
    description: 'Southeast Asia\'s only Universal Studios theme park with 28 rides and shows across 7 zones including Transformers, Jurassic Park, and Madagascar.',
    image: 'https://images.unsplash.com/photo-1597466599360-3b9775841aec?w=600&q=80',
    rating: 4.6, reviews: 21500, coordinates: { lat: 1.2541, lng: 103.8238 },
    tags: ['Theme Park', 'Family', 'Thrill Rides'],
    visitDuration: 'Full day', bestTime: 'Weekday', price: '$$$',
    address: '8 Sentosa Gateway', tip: 'Express pass saves 2-3hrs queue. Buy via Klook 30% off'
  },
  {
    id: '13', name: 'Sentosa Island', category: 'Attractions',
    description: 'Resort island with beaches, adventure parks, cable car, and attractions. Access by cable car, monorail, or boardwalk.',
    image: 'https://images.unsplash.com/photo-1605218427306-022ba6c5544f?w=600&q=80',
    rating: 4.7, reviews: 19800, coordinates: { lat: 1.2494, lng: 103.8303 },
    tags: ['Beach', 'Entertainment', 'Family'],
    visitDuration: 'Full day', bestTime: 'Morning', price: '$$$',
    address: 'Sentosa Island', tip: 'Free entry after 5pm on some days; check website'
  },
  {
    id: '14', name: 'Singapore Flyer', category: 'Attractions',
    description: 'Asia\'s largest observation wheel at 165m with 360° views. 30-min rotation with views to Malaysia and Indonesia on clear days.',
    image: 'https://images.unsplash.com/photo-1565961848354-3f5a36e4e3b5?w=600&q=80',
    rating: 4.5, reviews: 9200, coordinates: { lat: 1.2893, lng: 103.8631 },
    tags: ['Views', 'Romantic', 'Photo'],
    visitDuration: '1 hour', bestTime: 'Sunset', price: '$$',
    address: '30 Raffles Ave', tip: 'Sunset flight S$44, book via Klook for S$29'
  },
  {
    id: '15', name: 'S.E.A. Aquarium', category: 'Attractions',
    description: 'One of world\'s largest aquariums with 100,000+ marine animals from 1,000 species. Massive Open Ocean viewing panel is mesmerizing.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80',
    rating: 4.7, reviews: 14300, coordinates: { lat: 1.2540, lng: 103.8176 },
    tags: ['Marine Life', 'Family', 'Indoor'],
    visitDuration: '2-3 hours', bestTime: 'Weekday morning', price: '$$',
    address: '8 Sentosa Gateway', tip: 'Bundle with Universal Studios saves 30%'
  },
  {
    id: '16', name: 'ArtScience Museum', category: 'Technology',
    description: 'Lotus-shaped museum blending art, science, and technology. Features immersive "Future World" digital art exhibition by teamLab.',
    image: 'https://images.unsplash.com/photo-1542259681-d4cd463461bb?w=600&q=80',
    rating: 4.5, reviews: 7200, coordinates: { lat: 1.2860, lng: 103.8593 },
    tags: ['Digital Art', 'Interactive', 'Modern'],
    visitDuration: '2-3 hours', bestTime: 'Afternoon', price: '$$',
    address: '6 Bayfront Ave', tip: 'Future World exhibition is must-see for families'
  },
  {
    id: '17', name: 'National Gallery Singapore', category: 'Culture',
    description: 'Southeast Asia\'s largest modern art museum in beautifully restored former Supreme Court and City Hall. 8,000+ artworks.',
    image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=600&q=80',
    rating: 4.6, reviews: 6800, coordinates: { lat: 1.2892, lng: 103.8512 },
    tags: ['Art', 'Heritage', 'Architecture'],
    visitDuration: '2-3 hours', bestTime: 'Weekday', price: '$$',
    address: '1 St Andrew\'s Rd', tip: 'Free for Singaporeans/PRs. Tourist tickets S$25'
  },
  {
    id: '18', name: 'Helix Bridge', category: 'Attractions',
    description: 'Iconic DNA-inspired pedestrian bridge connecting Marina Centre to Marina Bay. Beautifully lit at night with viewing pods.',
    image: 'https://images.unsplash.com/photo-1542525801-b8ff32030dfe?w=600&q=80',
    rating: 4.5, reviews: 5400, coordinates: { lat: 1.2888, lng: 103.8582 },
    tags: ['Architecture', 'Free', 'Night Walk'],
    visitDuration: '20-30 min', bestTime: 'Night', price: 'Free',
    address: 'Marina Bay', tip: 'Best night photography spot in Singapore'
  },

  // FOOD
  {
    id: '5', name: 'Hawker Chan', category: 'Food',
    description: 'World\'s cheapest Michelin-starred meal. Famous for soya sauce chicken rice & noodles starting from S$3.50.',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80',
    rating: 4.5, reviews: 8900, coordinates: { lat: 1.2813, lng: 103.8444 },
    tags: ['Michelin', 'Local', 'Affordable', 'Chicken Rice'],
    visitDuration: '30-45 min', bestTime: 'Lunch', price: '$',
    address: 'Chinatown Complex', tip: 'Queue 30min+. Order chicken + pork combo S$5'
  },
  {
    id: '10', name: 'Lau Pa Sat', category: 'Food',
    description: 'Historic Victorian food hall with iconic Satay Street (Boon Tat St closes 7pm for outdoor satay grilling). 200+ stalls.',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80',
    rating: 4.4, reviews: 11000, coordinates: { lat: 1.2800, lng: 103.8506 },
    tags: ['Street Food', 'Satay', 'Historic'],
    visitDuration: '1-2 hours', bestTime: 'Dinner', price: '$$',
    address: '18 Raffles Quay', tip: 'Satay Street from 7pm is unmissable - 10 sticks S$10'
  },
  {
    id: '19', name: 'Maxwell Food Centre', category: 'Food',
    description: 'Legendary hawker centre home to Tian Tian Hainanese Chicken Rice (Anthony Bourdain\'s favorite). 100+ stalls.',
    image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=600&q=80',
    rating: 4.6, reviews: 15200, coordinates: { lat: 1.2812, lng: 103.8449 },
    tags: ['Hawker', 'Chicken Rice', 'Local'],
    visitDuration: '1 hour', bestTime: 'Lunch', price: '$',
    address: '1 Kadayanallur St', tip: 'Tian Tian queue 45min+. Try Zhen Zhen porridge too'
  },
  {
    id: '20', name: 'Newton Food Centre', category: 'Food',
    description: 'Famous open-air hawker centre featured in Crazy Rich Asians. Best for seafood, BBQ stingray, and oyster omelette.',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=80',
    rating: 4.3, reviews: 9100, coordinates: { lat: 1.3142, lng: 103.8384 },
    tags: ['Seafood', 'BBQ', 'Famous'],
    visitDuration: '1-2 hours', bestTime: 'Dinner', price: '$$',
    address: '500 Clemenceau Ave N', tip: 'Alliance Seafood for BBQ stingray S$25/half'
  },
  {
    id: '21', name: 'Old Airport Road Food Centre', category: 'Food',
    description: 'Locals\' favorite hawker centre with 160+ stalls. Famous for char kway teow, rojak, and lor mee. Less touristy.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
    rating: 4.6, reviews: 7800, coordinates: { lat: 1.3085, lng: 103.8861 },
    tags: ['Local Favorite', 'Hawker', 'Authentic'],
    visitDuration: '1-2 hours', bestTime: 'Dinner', price: '$',
    address: '51 Old Airport Rd', tip: 'Dong Ji Char Kway Teow and Toa Payoh Rojak are legendary'
  },
  {
    id: '22', name: 'Jumbo Seafood', category: 'Food',
    description: 'Singapore\'s most famous chilli crab restaurant since 1987. Riverside dining at East Coast. Must-try signature chilli crab.',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80',
    rating: 4.4, reviews: 12500, coordinates: { lat: 1.3026, lng: 103.9201 },
    tags: ['Chilli Crab', 'Seafood', 'Iconic'],
    visitDuration: '1.5 hours', bestTime: 'Dinner', price: '$$$',
    address: '1206 East Coast Parkway', tip: 'Book ahead! Chilli crab ~S$60/kg for 2 pax'
  },
  {
    id: '23', name: 'Tiong Bahru Market', category: 'Food',
    description: 'Hip heritage hawker centre in charming Tiong Bahru neighborhood. Famous for chwee kueh, pau, and traditional breakfast.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80',
    rating: 4.5, reviews: 6500, coordinates: { lat: 1.2861, lng: 103.8275 },
    tags: ['Breakfast', 'Traditional', 'Hip'],
    visitDuration: '1-2 hours', bestTime: 'Breakfast', price: '$',
    address: '30 Seng Poh Rd', tip: 'Jian Bo Shui Kueh opens 6am. Tiong Bahru Pau for takeaway'
  },
  {
    id: '24', name: '328 Katong Laksa', category: 'Food',
    description: 'Famous for Peranakan laksa with short noodles you eat with a spoon. Competed with Gordon Ramsay and won.',
    image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=600&q=80',
    rating: 4.4, reviews: 5900, coordinates: { lat: 1.3114, lng: 103.9005 },
    tags: ['Laksa', 'Peranakan', 'Famous'],
    visitDuration: '45 min', bestTime: 'Lunch', price: '$',
    address: '51/53 East Coast Rd', tip: 'Laksa S$5 - cut noodles with spoon, no chopsticks needed'
  },
  {
    id: '25', name: 'Ya Kun Kaya Toast', category: 'Food',
    description: 'Iconic Singapore breakfast chain since 1944. Traditional kaya toast, soft-boiled eggs, and local coffee (kopi).',
    image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=600&q=80',
    rating: 4.3, reviews: 8200, coordinates: { lat: 1.2823, lng: 103.8505 },
    tags: ['Breakfast', 'Traditional', 'Chain'],
    visitDuration: '30 min', bestTime: 'Breakfast', price: '$',
    address: 'Multiple locations', tip: 'Set A S$5.20: kaya toast + 2 eggs + coffee. Must-try!'
  },

  // CULTURE
  {
    id: '7', name: 'Chinatown', category: 'Culture',
    description: 'Historic Chinese district with Buddha Tooth Relic Temple, traditional shophouses, street markets, and authentic eateries.',
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&q=80',
    rating: 4.6, reviews: 14200, coordinates: { lat: 1.2837, lng: 103.8448 },
    tags: ['Heritage', 'Shopping', 'Food'],
    visitDuration: '2-3 hours', bestTime: 'Evening', price: '$$',
    address: 'Chinatown', tip: 'Chinatown Street Market great for souvenirs'
  },
  {
    id: '12', name: 'Little India', category: 'Culture',
    description: 'Vibrant Indian quarter with colorful temples, Mustafa Centre (24hr mall), spice shops, saree stores, and authentic restaurants.',
    image: 'https://images.unsplash.com/photo-1583412262757-1e7bb0c91cd8?w=600&q=80',
    rating: 4.5, reviews: 12800, coordinates: { lat: 1.3065, lng: 103.8493 },
    tags: ['Colorful', 'Shopping', 'Temples'],
    visitDuration: '2-3 hours', bestTime: 'Daytime', price: '$$',
    address: 'Little India', tip: 'Visit during Deepavali (Oct/Nov) for spectacular lights'
  },
  {
    id: '26', name: 'Kampong Glam', category: 'Culture',
    description: 'Malay-Arab quarter with golden-domed Sultan Mosque, hip Haji Lane boutiques, and Middle Eastern restaurants.',
    image: 'https://images.unsplash.com/photo-1583412262757-1e7bb0c91cd8?w=600&q=80',
    rating: 4.5, reviews: 8900, coordinates: { lat: 1.3011, lng: 103.8582 },
    tags: ['Heritage', 'Street Art', 'Boutiques'],
    visitDuration: '2-3 hours', bestTime: 'Afternoon', price: '$$',
    address: 'Kampong Glam', tip: 'Haji Lane is Instagram-famous for colorful murals'
  },
  {
    id: '27', name: 'Buddha Tooth Relic Temple', category: 'Culture',
    description: 'Stunning Tang-style Buddhist temple housing what is believed to be Buddha\'s left canine tooth. Free entry, respectful dress required.',
    image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&q=80',
    rating: 4.7, reviews: 9200, coordinates: { lat: 1.2821, lng: 103.8442 },
    tags: ['Temple', 'Buddhist', 'Free'],
    visitDuration: '1 hour', bestTime: 'Morning', price: 'Free',
    address: '288 South Bridge Rd', tip: 'Cover shoulders & knees. 4th floor has relic chamber'
  },
  {
    id: '28', name: 'Sri Mariamman Temple', category: 'Culture',
    description: 'Singapore\'s oldest Hindu temple (1827) with stunning gopuram tower covered in colorful deity sculptures.',
    image: 'https://images.unsplash.com/photo-1604608672516-f1b9b1d1b1b8?w=600&q=80',
    rating: 4.5, reviews: 5100, coordinates: { lat: 1.2826, lng: 103.8470 },
    tags: ['Hindu', 'Historic', 'Architecture'],
    visitDuration: '30-45 min', bestTime: 'Daytime', price: 'Free',
    address: '244 South Bridge Rd', tip: 'Remove shoes before entering. Free but donations welcome'
  },
  {
    id: '29', name: 'Sultan Mosque', category: 'Culture',
    description: 'Golden-domed mosque built in 1824, rebuilt 1928. Symbol of Malay-Muslim heritage in Singapore. Non-Muslims welcome outside prayer times.',
    image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=600&q=80',
    rating: 4.6, reviews: 6300, coordinates: { lat: 1.3013, lng: 103.8572 },
    tags: ['Mosque', 'Heritage', 'Architecture'],
    visitDuration: '30-45 min', bestTime: 'Morning', price: 'Free',
    address: '3 Muscat St', tip: 'Free guided tours. Modest dress required for women'
  },

  // NATURE
  {
    id: '8', name: 'Singapore Zoo', category: 'Nature',
    description: 'World-class "open concept" zoo with 2,800+ animals in naturalistic habitats. Rainforest KidzWorld and breakfast with orangutans.',
    image: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=600&q=80',
    rating: 4.8, reviews: 16500, coordinates: { lat: 1.4045, lng: 103.7939 },
    tags: ['Wildlife', 'Family', 'Education'],
    visitDuration: '4-5 hours', bestTime: 'Morning', price: '$$',
    address: '80 Mandai Lake Rd', tip: 'Combine with Night Safari for full day. Bundle 30% off'
  },
  {
    id: '11', name: 'Botanic Gardens', category: 'Nature',
    description: 'Singapore\'s first UNESCO World Heritage Site (2015). 160+ years old with National Orchid Garden housing 1,000+ orchid species.',
    image: 'https://images.unsplash.com/photo-1565619624098-606f120e732e?w=600&q=80',
    rating: 4.7, reviews: 9800, coordinates: { lat: 1.3139, lng: 103.8159 },
    tags: ['UNESCO', 'Orchids', 'Peaceful'],
    visitDuration: '2-3 hours', bestTime: 'Morning', price: 'Free',
    address: '1 Cluny Rd', tip: 'Orchid Garden S$5 entry worth it. Free concerts at Symphony Lake'
  },
  {
    id: '30', name: 'Night Safari', category: 'Nature',
    description: 'World\'s first nocturnal zoo open 7:15pm-midnight. Tram ride through 7 geographical zones with 2,500+ nocturnal animals.',
    image: 'https://images.unsplash.com/photo-1503919005314-30d916819fef?w=600&q=80',
    rating: 4.7, reviews: 13400, coordinates: { lat: 1.4050, lng: 103.7898 },
    tags: ['Nocturnal', 'Unique', 'Family'],
    visitDuration: '3 hours', bestTime: 'Evening', price: '$$',
    address: '80 Mandai Lake Rd', tip: '7:15pm entry best. Creatures of the Night show 7:30pm free'
  },
  {
    id: '31', name: 'MacRitchie Reservoir', category: 'Nature',
    description: 'Singapore\'s oldest reservoir with TreeTop Walk (250m suspension bridge at 25m height). 11km of hiking trails through rainforest.',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
    rating: 4.6, reviews: 4800, coordinates: { lat: 1.3468, lng: 103.8075 },
    tags: ['Hiking', 'Rainforest', 'Free'],
    visitDuration: '3-4 hours', bestTime: 'Morning', price: 'Free',
    address: 'Lornie Rd', tip: 'TreeTop Walk open 9am-5pm (closed Mon). Bring water!'
  },
  {
    id: '32', name: 'Pulau Ubin', category: 'Nature',
    description: 'Rustic island 15-min bumboat from Changi. Last kampong (village) in Singapore. Rent bikes, explore Chek Jawa wetlands.',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80',
    rating: 4.5, reviews: 3200, coordinates: { lat: 1.4098, lng: 103.9525 },
    tags: ['Island', 'Cycling', 'Rustic'],
    visitDuration: 'Half day', bestTime: 'Weekend morning', price: '$',
    address: 'Changi Point Ferry Terminal', tip: 'Bumboat S$4/person. Bike rental S$8/day'
  },

  // SHOPPING
  {
    id: '33', name: 'Orchard Road', category: 'Shopping',
    description: 'Singapore\'s premier 2.2km shopping street with 20+ malls including ION Orchard, Ngee Ann City, and Paragon.',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80',
    rating: 4.5, reviews: 18500, coordinates: { lat: 1.3045, lng: 103.8316 },
    tags: ['Shopping', 'Luxury', 'Malls'],
    visitDuration: '3-5 hours', bestTime: 'Afternoon', price: '$$$',
    address: 'Orchard Road', tip: 'Great Singapore Sale (Jun-Jul) has up to 70% off'
  },
  {
    id: '34', name: 'Mustafa Centre', category: 'Shopping',
    description: '24-hour mega-mall in Little India selling literally everything. Bargain prices on electronics, gold, perfumes, and souvenirs.',
    image: 'https://images.unsplash.com/photo-1567465413910-e16633874b1e?w=600&q=80',
    rating: 4.2, reviews: 8900, coordinates: { lat: 1.3092, lng: 103.8568 },
    tags: ['24hr', 'Bargains', 'Everything'],
    visitDuration: '2 hours', bestTime: 'Late night', price: '$',
    address: '145 Syed Alwi Rd', tip: 'Open 24/7. Best for perfumes (30-50% off) and electronics'
  },
  {
    id: '35', name: 'Bugis Street Market', category: 'Shopping',
    description: 'Bustling budget shopping market with 800+ stalls. Cheap clothes, accessories, souvenirs. Air-conditioned.',
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&q=80',
    rating: 4.1, reviews: 7200, coordinates: { lat: 1.3007, lng: 103.8565 },
    tags: ['Budget', 'Clothes', 'Souvenirs'],
    visitDuration: '1-2 hours', bestTime: 'Daytime', price: '$',
    address: '4 New Bugis St', tip: 'Haggle! Start at 50% of asking price. Cash is king'
  },
  {
    id: '36', name: 'VivoCity', category: 'Shopping',
    description: 'Singapore\'s largest mall with 300+ stores, rooftop amphitheater, cinema, and gateway to Sentosa via monorail.',
    image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=600&q=80',
    rating: 4.4, reviews: 11200, coordinates: { lat: 1.2637, lng: 103.8155 },
    tags: ['Mall', 'Entertainment', 'Family'],
    visitDuration: '3-4 hours', bestTime: 'Afternoon', price: '$$',
    address: '1 HarbourFront Walk', tip: 'Take Sentosa Express monorail from Level 3'
  },

  // NIGHTLIFE
  {
    id: '37', name: 'Clarke Quay', category: 'Nightlife',
    description: 'Vibrant riverside dining and nightlife district with bars, clubs, and restaurants. Singapore River cruises depart from here.',
    image: 'https://images.unsplash.com/photo-1567605672092-44b5f7e7bc9?w=600&q=80',
    rating: 4.4, reviews: 9800, coordinates: { lat: 1.2901, lng: 103.8472 },
    tags: ['Nightlife', 'Bars', 'Riverside'],
    visitDuration: '3+ hours', bestTime: 'Night', price: '$$',
    address: 'Clarke Quay', tip: 'River cruise S$25. Zouk club nearby for partying'
  },
  {
    id: '38', name: 'Long Bar at Raffles', category: 'Nightlife',
    description: 'Birthplace of the Singapore Sling cocktail (since 1915). Peanut shells on floor tradition. Live music nightly.',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&q=80',
    rating: 4.3, reviews: 4500, coordinates: { lat: 1.2947, lng: 103.8556 },
    tags: ['Cocktails', 'Historic', 'Iconic'],
    visitDuration: '1-2 hours', bestTime: 'Evening', price: '$$$',
    address: '1 Beach St', tip: 'Singapore Sling S$35. Touristy but iconic experience'
  },
  {
    id: '39', name: 'CE LA VI', category: 'Nightlife',
    description: 'Rooftop restaurant, skybar, and club atop Marina Bay Sands. Breathtaking views, premium cocktails, and international DJs.',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
    rating: 4.4, reviews: 3800, coordinates: { lat: 1.2834, lng: 103.8607 },
    tags: ['Rooftop', 'Club', 'Views'],
    visitDuration: '2-4 hours', bestTime: 'Night', price: '$$$',
    address: '1 Bayfront Ave, Level 57', tip: 'SkyBar no cover charge weekdays. Book table for sunset'
  },

  // DAY TRIPS
  {
    id: '40', name: 'Southern Islands', category: 'DayTrips',
    description: 'Group of 6 islands south of Singapore. St John\'s Island & Lazarus Island have pristine beaches, 45-min ferry from Marina South Pier.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    rating: 4.4, reviews: 2100, coordinates: { lat: 1.2196, lng: 103.8565 },
    tags: ['Island', 'Beach', 'Day Trip'],
    visitDuration: 'Full day', bestTime: 'Weekend', price: '$',
    address: 'Marina South Pier', tip: 'Ferry S$18 return. Bring food/water, no shops on islands'
  },
  {
    id: '41', name: 'Haw Par Villa', category: 'DayTrips',
    description: 'Bizarre 1937 theme park depicting Chinese mythology. Famous Ten Courts of Hell diorama. Free entry.',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80',
    rating: 4.2, reviews: 3400, coordinates: { lat: 1.2848, lng: 103.7819 },
    tags: ['Quirky', 'Mythology', 'Free'],
    visitDuration: '2 hours', bestTime: 'Daytime', price: 'Free',
    address: '262 Pasir Panjang Rd', tip: 'Not for kids (graphic hell scenes). Instagram goldmine'
  },
  {
    id: '42', name: 'Lazarus Island', category: 'DayTrips',
    description: 'Pristine, almost-empty island with turquoise waters and white sand. Part of the Southern Islands group. Perfect escape from the city.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    rating: 4.7, reviews: 1800, coordinates: { lat: 1.2225, lng: 103.8528 },
    tags: ['Beach', 'Island', 'Quiet'],
    visitDuration: 'Half day', bestTime: 'Weekday', price: '$',
    address: 'Southern Islands', tip: 'Take ferry from Marina South Pier. Bring water & snacks.'
  },
  {
    id: '43', name: 'Southern Ridges', category: 'Nature',
    description: '10km chain of parks connecting Mount Faber, Telok Blangah Hill, and Kent Ridge. Stunning Henderson Waves bridge and forest walks.',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
    rating: 4.6, reviews: 5200, coordinates: { lat: 1.2832, lng: 103.7889 },
    tags: ['Hiking', 'Views', 'Free'],
    visitDuration: '3-4 hours', bestTime: 'Morning', price: 'Free',
    address: 'Telok Blangah Rd', tip: 'Start at HarbourFront MRT. Best at sunrise/sunset.'
  },
  {
    id: '44', name: 'Gillman Barracks', category: 'Culture',
    description: 'Former British military barracks turned contemporary art district. 10+ art galleries, restaurants, and the NTU CCA.',
    image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=600&q=80',
    rating: 4.3, reviews: 2100, coordinates: { lat: 1.2789, lng: 103.8103 },
    tags: ['Art', 'Galleries', 'Hip'],
    visitDuration: '2 hours', bestTime: 'Afternoon', price: 'Free',
    address: '9 Lock Rd', tip: 'Free entry to most galleries. Great cafes too.'
  },
  {
    id: '45', name: 'Kranji Marshes', category: 'Nature',
    description: 'Singapore\'s largest freshwater marshland and bird sanctuary. Home to over 170 bird species. Boardwalk through wetlands.',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
    rating: 4.5, reviews: 980, coordinates: { lat: 1.4265, lng: 103.7321 },
    tags: ['Birdwatching', 'Wetland', 'Free'],
    visitDuration: '2 hours', bestTime: 'Early morning', price: 'Free',
    address: '11 Neo Tiew Lane 2', tip: 'Best at dawn. Bring binoculars and insect repellent.'
  },
  {
    id: '46', name: 'Fort Canning Park', category: 'Culture',
    description: 'Historic hill with colonial-era fort, spice garden, and underground WWII bunker. Stunning city views from the top.',
    image: 'https://images.unsplash.com/photo-1583412262757-1e7bb0c91cd8?w=600&q=80',
    rating: 4.4, reviews: 4500, coordinates: { lat: 1.2945, lng: 103.8467 },
    tags: ['History', 'Park', 'Free'],
    visitDuration: '1-2 hours', bestTime: 'Evening', price: 'Free',
    address: 'Fort Canning Rd', tip: 'Free guided tours on weekends. Great picnic spot.'
  },
  {
    id: '47', name: 'Haji Lane', category: 'Shopping',
    description: 'Narrow street in Kampong Glam famous for street art, indie boutiques, and Middle Eastern cafes. Instagram heaven.',
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&q=80',
    rating: 4.5, reviews: 8900, coordinates: { lat: 1.3021, lng: 103.8598 },
    tags: ['Street Art', 'Boutiques', 'Cafes'],
    visitDuration: '1-2 hours', bestTime: 'Afternoon', price: '$$',
    address: 'Haji Lane', tip: 'Best photos in late afternoon light. Try the cafes!'
  },
  {
    id: '48', name: 'Bukit Timah Nature Reserve', category: 'Nature',
    description: 'Singapore\'s only primary rainforest reserve. Home to long-tailed macaques and over 800 plant species. 164m hill.',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
    rating: 4.6, reviews: 6700, coordinates: { lat: 1.3547, lng: 103.7767 },
    tags: ['Rainforest', 'Hiking', 'Free'],
    visitDuration: '2-3 hours', bestTime: 'Morning', price: 'Free',
    address: '177 Hindhede Dr', tip: 'Wear proper shoes. Can be muddy after rain.'
  },
  {
    id: '49', name: 'East Coast Park', category: 'Nature',
    description: '15km stretch of beach, cycling paths, and BBQ pits. Popular for kite flying, rollerblading, and seafood dinners.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    rating: 4.3, reviews: 12400, coordinates: { lat: 1.3068, lng: 103.9123 },
    tags: ['Beach', 'Cycling', 'Free'],
    visitDuration: '3+ hours', bestTime: 'Evening', price: 'Free',
    address: 'East Coast Parkway', tip: 'Rent bikes at area C. Try Jumbo Seafood!'
  },
  {
    id: '50', name: 'Pasir Ris Park', category: 'Nature',
    description: 'Quiet beach park with mangrove boardwalk, kelong fishing, and huge playground. Less crowded than East Coast.',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
    rating: 4.2, reviews: 3800, coordinates: { lat: 1.3812, lng: 103.9521 },
    tags: ['Beach', 'Mangrove', 'Family'],
    visitDuration: '2-3 hours', bestTime: 'Morning', price: 'Free',
    address: 'Pasir Ris', tip: 'Mangrove boardwalk is great for kids. Free parking.'
  }
];

// ===== EXPANDED HOTELS =====
export const HOTELS: HotelData[] = [
  {
    id: 'h1', name: 'Marina Bay Sands', category: 'Hotels',
    description: 'World-famous luxury with largest rooftop infinity pool, SkyPark, casino, and 2,561 rooms across three towers.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
    rating: 4.8, reviews: 25000, coordinates: { lat: 1.2834, lng: 103.8607 },
    tags: ['Infinity Pool', 'Casino', 'Sky Park'],
    visitDuration: 'Multiple days', bestTime: 'Anytime', price: '$$$$',
    address: '10 Bayfront Ave', pricePerNight: 450, priceLabel: '$450/night',
    tier: 'Luxury', amenities: ['Infinity Pool', 'Spa', 'Casino', 'Fine Dining', 'Sky Park', 'Free WiFi']
  },
  {
    id: 'h2', name: 'The Fullerton Hotel', category: 'Hotels',
    description: 'Historic neo-classical landmark hotel overlooking Marina Bay. National monument since 1928, converted to hotel 2001.',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80',
    rating: 4.8, reviews: 12500, coordinates: { lat: 1.2861, lng: 103.8526 },
    tags: ['Historic', 'Heritage', 'Bay View'],
    visitDuration: 'Multiple days', bestTime: 'Anytime', price: '$$$$',
    address: '1 Fullerton Square', pricePerNight: 380, priceLabel: '$380/night',
    tier: 'Luxury', amenities: ['Pool', 'Spa', 'Fine Dining', 'Bay View', 'Heritage', 'Free WiFi']
  },
  {
    id: 'h3', name: 'Raffles Hotel', category: 'Hotels',
    description: 'Legendary colonial-era hotel since 1887. Birthplace of Singapore Sling. Butler service, heritage tours, tropical gardens.',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
    rating: 4.9, reviews: 8900, coordinates: { lat: 1.2947, lng: 103.8556 },
    tags: ['Heritage', 'Colonial', 'Iconic'],
    visitDuration: 'Multiple days', bestTime: 'Anytime', price: '$$$$',
    address: '1 Beach Rd', pricePerNight: 650, priceLabel: '$650/night',
    tier: 'Luxury', amenities: ['Butler Service', 'Spa', 'Fine Dining', 'Long Bar', 'Free WiFi']
  },
  {
    id: 'h13', name: 'The Ritz-Carlton Millenia', category: 'Hotels',
    description: 'Luxury hotel with panoramic bay views, largest standard rooms in Singapore (50sqm), and world-class art collection.',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80',
    rating: 4.8, reviews: 7200, coordinates: { lat: 1.2918, lng: 103.8588 },
    tags: ['Bay View', 'Luxury', 'Art'],
    visitDuration: 'Multiple days', bestTime: 'Anytime', price: '$$$$',
    address: '7 Raffles Ave', pricePerNight: 420, priceLabel: '$420/night',
    tier: 'Luxury', amenities: ['Pool', 'Spa', 'Club Lounge', 'Fine Dining', 'Free WiFi']
  },
  {
    id: 'h4', name: 'PARKROYAL COLLECTION Pickering', category: 'Hotels',
    description: 'Award-winning eco-hotel with 15,000sqm of lush gardens integrated into architecture. Zero-energy sky gardens.',
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80',
    rating: 4.6, reviews: 9200, coordinates: { lat: 1.2853, lng: 103.8464 },
    tags: ['Eco-Friendly', 'Design', 'Garden'],
    visitDuration: 'Multiple days', bestTime: 'Anytime', price: '$$$',
    address: '3A Pickering St', pricePerNight: 220, priceLabel: '$220/night',
    tier: 'Mid-range', amenities: ['Infinity Pool', 'Spa', 'Garden', 'Restaurant', 'Free WiFi']
  },
  {
    id: 'h5', name: 'Hotel Jen Orchardgateway', category: 'Hotels',
    description: 'Modern hotel above Orchard MRT with rooftop infinity pool. Direct mall access, perfect shopping base.',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80',
    rating: 4.3, reviews: 6800, coordinates: { lat: 1.3010, lng: 103.8404 },
    tags: ['Shopping', 'Central', 'Modern'],
    visitDuration: 'Multiple days', bestTime: 'Anytime', price: '$$$',
    address: '277 Orchard Rd', pricePerNight: 160, priceLabel: '$160/night',
    tier: 'Mid-range', amenities: ['Rooftop Pool', 'Gym', 'Shopping Access', 'Free WiFi']
  },
  {
    id: 'h12', name: 'Oasia Hotel Downtown', category: 'Hotels',
    description: 'Striking red tower with 21 species of creepers and 4 open-air sky gardens. CBD location near Tanjong Pagar MRT.',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80',
    rating: 4.5, reviews: 5600, coordinates: { lat: 1.2778, lng: 103.8482 },
    tags: ['Design', 'Green', 'CBD'],
    visitDuration: 'Multiple days', bestTime: 'Anytime', price: '$$$',
    address: '8 Central Square', pricePerNight: 190, priceLabel: '$190/night',
    tier: 'Mid-range', amenities: ['Pool', 'Gym', 'Sky Garden', 'Restaurant', 'Free WiFi']
  },
  {
    id: 'h14', name: 'Carlton Hotel Singapore', category: 'Hotels',
    description: 'Classic 4-star hotel in Civic District. Walking distance to Marina Bay, Raffles City, and MRT stations.',
    image: 'https://images.unsplash.com/photo-1590381105924-c7258a9434ed?w=600&q=80',
    rating: 4.2, reviews: 5800, coordinates: { lat: 1.2950, lng: 103.8525 },
    tags: ['Central', 'Classic', 'Value'],
    visitDuration: 'Multiple days', bestTime: 'Anytime', price: '$$$',
    address: '76 Bras Basah Rd', pricePerNight: 150, priceLabel: '$150/night',
    tier: 'Mid-range', amenities: ['Pool', 'Gym', 'Restaurant', 'Free WiFi']
  },
  {
    id: 'h6', name: 'YOTEL Singapore', category: 'Hotels',
    description: 'Futuristic cabin-style hotel inspired by first-class air travel. Smart beds, MoodPad controls, located in Jewel Mall.',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80',
    rating: 4.2, reviews: 5400, coordinates: { lat: 1.3045, lng: 103.8316 },
    tags: ['Modern', 'Smart', 'Affordable'],
    visitDuration: 'Multiple days', bestTime: 'Anytime', price: '$$',
    address: '333A Orchard Rd', pricePerNight: 120, priceLabel: '$120/night',
    tier: 'Affordable', amenities: ['Smart Cabin', 'Rooftop Pool', 'Self Check-in', 'Free WiFi']
  },
  {
    id: 'h7', name: 'V Hotel Lavender', category: 'Hotels',
    description: 'Stylish affordable hotel directly above Lavender MRT. Pool, gym, and hawker center downstairs.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
    rating: 4.1, reviews: 8200, coordinates: { lat: 1.3071, lng: 103.8629 },
    tags: ['Budget', 'MRT Access', 'Clean'],
    visitDuration: 'Multiple days', bestTime: 'Anytime', price: '$$',
    address: '70 Jellicoe Rd', pricePerNight: 95, priceLabel: '$95/night',
    tier: 'Affordable', amenities: ['Pool', 'Gym', 'MRT Access', 'Free WiFi']
  },
  {
    id: 'h8', name: 'lyf Funan Singapore', category: 'Hotels',
    description: 'Hip co-living hotel in Funan Mall with social kitchens, co-working spaces, and weekly events. Perfect for millennials.',
    image: 'https://images.unsplash.com/photo-1590381105924-c7258a9434ed?w=600&q=80',
    rating: 4.4, reviews: 3800, coordinates: { lat: 1.2899, lng: 103.8500 },
    tags: ['Co-living', 'Trendy', 'Social'],
    visitDuration: 'Multiple days', bestTime: 'Anytime', price: '$$',
    address: '67 Hill St', pricePerNight: 110, priceLabel: '$110/night',
    tier: 'Affordable', amenities: ['Co-working', 'Kitchen', 'Laundry', 'Social Events', 'Free WiFi']
  },
  {
    id: 'h15', name: 'Ibis Budget Singapore Bugis', category: 'Hotels',
    description: 'Clean, modern budget hotel near Bugis Street Market and Haji Lane. Good value with reliable Ibis standards.',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
    rating: 4.0, reviews: 4200, coordinates: { lat: 1.3015, lng: 103.8578 },
    tags: ['Budget', 'Location', 'Modern'],
    visitDuration: 'Multiple days', bestTime: 'Anytime', price: '$',
    address: '46 Bencoolen St', pricePerNight: 80, priceLabel: '$80/night',
    tier: 'Budget', amenities: ['Air Conditioning', 'Free WiFi', 'Restaurant']
  },
  {
    id: 'h9', name: 'ibis Singapore on Bencoolen', category: 'Hotels',
    description: 'Reliable international budget chain near Bugis. Clean rooms, great location, family rooms available.',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
    rating: 4.0, reviews: 7600, coordinates: { lat: 1.3000, lng: 103.8515 },
    tags: ['Budget', 'International', 'Reliable'],
    visitDuration: 'Multiple days', bestTime: 'Anytime', price: '$',
    address: '170 Bencoolen St', pricePerNight: 75, priceLabel: '$75/night',
    tier: 'Budget', amenities: ['Restaurant', 'Bar', 'Free WiFi']
  },
  {
    id: 'h10', name: 'Hotel 81 Lavender', category: 'Hotels',
    description: 'Ultra-affordable no-frills hotel near Lavender MRT. Best value for budget travelers.',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80',
    rating: 3.8, reviews: 4500, coordinates: { lat: 1.3102, lng: 103.8611 },
    tags: ['Budget', 'Value', 'Clean'],
    visitDuration: 'Multiple days', bestTime: 'Anytime', price: '$',
    address: '33 Jln Besar', pricePerNight: 55, priceLabel: '$55/night',
    tier: 'Budget', amenities: ['Air Conditioning', 'TV', 'Free WiFi']
  },
  {
    id: 'h11', name: 'The Pod Boutique Capsule', category: 'Hotels',
    description: 'Modern capsule hotel with premium pods, privacy curtains, personal TV, and excellent communal areas.',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80',
    rating: 4.3, reviews: 2900, coordinates: { lat: 1.3024, lng: 103.8584 },
    tags: ['Capsule', 'Modern', 'Unique'],
    visitDuration: 'Multiple days', bestTime: 'Anytime', price: '$',
    address: '769 N Bridge Rd', pricePerNight: 40, priceLabel: '$40/night',
    tier: 'Budget', amenities: ['Pod Bed', 'Locker', 'Lounge', 'Free WiFi', 'Breakfast']
  },
  {
    id: 'h16', name: 'Dream Lodge @ Farrer', category: 'Hotels',
    description: 'Top-rated hostel with pod-style dorms and private rooms. Rooftop bar, free breakfast, social events.',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80',
    rating: 4.5, reviews: 3800, coordinates: { lat: 1.3118, lng: 103.8556 },
    tags: ['Hostel', 'Social', 'Backpacker'],
    visitDuration: 'Multiple days', bestTime: 'Anytime', price: '$',
    address: '259A Jln Besar', pricePerNight: 30, priceLabel: '$30/night (dorm)',
    tier: 'Budget', amenities: ['Free Breakfast', 'Rooftop Bar', 'Kitchen', 'Free WiFi']
  }
];

// ===== FESTIVALS =====
export const FESTIVALS: Festival[] = [
  { name: 'Chinese New Year', month: 'Jan/Feb', description: 'Largest celebration with lion dances, street markets in Chinatown, and river celebrations.', color: 'bg-red-500', emoji: '🧧' },
  { name: 'Thaipusam', month: 'Jan/Feb', description: 'Hindu festival with devotees carrying kavadis. Procession from Sri Srinivasa to Chettiar Temple.', color: 'bg-orange-500', emoji: '🪔' },
  { name: 'Hari Raya Puasa', month: 'Varies', description: 'End of Ramadan celebration in Kampong Glam with bazaars and open houses.', color: 'bg-emerald-500', emoji: '🌙' },
  { name: 'Vesak Day', month: 'May', description: 'Buddhist celebration of Buddha\'s birth, enlightenment, and death.', color: 'bg-yellow-500', emoji: '🪷' },
  { name: 'Great Singapore Sale', month: 'Jun-Jul', description: 'Island-wide shopping festival with discounts up to 70% at malls.', color: 'bg-pink-500', emoji: '🛍️' },
  { name: 'Singapore Food Festival', month: 'Jul', description: 'Month-long celebration of local cuisine with events islandwide.', color: 'bg-amber-500', emoji: '🍜' },
  { name: 'National Day', month: 'Aug 9', description: 'Independence celebration with fireworks, parade, and patriotic displays.', color: 'bg-red-600', emoji: '🇸🇬' },
  { name: 'Hungry Ghost Festival', month: 'Aug/Sep', description: 'Taoist month-long festival with wayang operas and getai performances.', color: 'bg-purple-500', emoji: '👻' },
  { name: 'Mid-Autumn Festival', month: 'Sep/Oct', description: 'Chinese lantern festival with mooncakes and Gardens by the Bay celebrations.', color: 'bg-red-400', emoji: '🏮' },
  { name: 'Deepavali', month: 'Oct/Nov', description: 'Hindu festival of lights. Little India transformed with decorations.', color: 'bg-orange-600', emoji: '🪔' },
  { name: 'Christmas', month: 'Dec', description: 'Orchard Road Christmas light-up. Island-wide festive celebrations.', color: 'bg-green-600', emoji: '🎄' },
  { name: 'New Year Countdown', month: 'Dec 31', description: 'Fireworks at Marina Bay, Siloso Beach Party, and Clarke Quay.', color: 'bg-indigo-500', emoji: '🎆' }
];

// ===== NEIGHBORHOODS =====
export const NEIGHBORHOODS: Neighborhood[] = [
  { name: 'Marina Bay', vibe: 'Futuristic & Luxurious', description: 'Iconic skyline, high-end hotels, and modern attractions. The postcard image of Singapore.', bestFor: ['First-timers', 'Luxury', 'Views'], color: 'from-blue-500 to-cyan-500' },
  { name: 'Orchard', vibe: 'Shopping Paradise', description: 'Singapore\'s premier shopping belt with 20+ malls along a 2.2km tree-lined boulevard.', bestFor: ['Shoppers', 'Luxury', 'Dining'], color: 'from-pink-500 to-rose-500' },
  { name: 'Chinatown', vibe: 'Heritage & Food', description: 'Traditional Chinese district with temples, shophouses, and hawker centers.', bestFor: ['Culture', 'Food', 'Souvenirs'], color: 'from-red-500 to-orange-500' },
  { name: 'Little India', vibe: 'Colorful & Vibrant', description: 'Indian quarter bursting with spices, sarees, temples, and 24-hour shopping at Mustafa.', bestFor: ['Culture', 'Budget', 'Food'], color: 'from-orange-500 to-amber-500' },
  { name: 'Kampong Glam', vibe: 'Hip & Heritage', description: 'Malay-Arab quarter with Sultan Mosque, hip Haji Lane boutiques, and street art.', bestFor: ['Hipsters', 'Culture', 'Boutiques'], color: 'from-emerald-500 to-teal-500' },
  { name: 'Tiong Bahru', vibe: 'Trendy & Charming', description: 'Art deco neighborhood with indie cafes, bakeries, bookstores, and heritage charm.', bestFor: ['Cafe hopping', 'Locals', 'Charm'], color: 'from-violet-500 to-purple-500' },
  { name: 'Clarke Quay', vibe: 'Nightlife Central', description: 'Riverside dining and nightlife district. Clubs, bars, and Singapore River cruises.', bestFor: ['Nightlife', 'Dining', 'Partying'], color: 'from-purple-500 to-pink-500' },
  { name: 'Sentosa', vibe: 'Island Resort', description: 'Fun-filled resort island with beaches, theme parks, and luxury hotels.', bestFor: ['Families', 'Beach', 'Relaxation'], color: 'from-cyan-500 to-blue-500' }
];

// ===== TRANSPORT =====
export const TRANSPORT = [
  { name: 'MRT (Metro)', icon: Train, description: 'Fastest way around. 6 lines covering whole island. $1-3 per trip.', tip: 'Get Singapore Tourist Pass for unlimited rides', color: 'bg-blue-500' },
  { name: 'Public Bus', icon: Bus, description: 'Extensive network with air-conditioned double-deckers. $1-2 per trip.', tip: 'Same card works on buses and MRT', color: 'bg-emerald-500' },
  { name: 'Grab (Rideshare)', icon: Smartphone, description: 'Southeast Asia Uber. 30-50% cheaper than taxis. Download before arrival.', tip: 'GrabShare saves 30% vs GrabCar', color: 'bg-green-500' },
  { name: 'Changi Airport', icon: Plane, description: 'World\'s best airport 12 consecutive years. Direct MRT to city.', tip: 'Free Skytrain between terminals; Jewel is must-see', color: 'bg-amber-500' }
];

// ===== WEATHER =====
export const WEATHER = [
  { months: 'Dec-Feb', temp: '23-31°C', season: 'Northeast Monsoon', icon: CloudSun, desc: 'Wettest period. Cool evenings. Pack umbrella.' },
  { months: 'Mar-May', temp: '25-33°C', season: 'Inter-monsoon', icon: CloudSun, desc: 'Hot and humid. Occasional thunderstorms.' },
  { months: 'Jun-Aug', temp: '25-32°C', season: 'Southwest Monsoon', icon: CloudSun, desc: 'Drier but hot. Great for outdoor activities.' },
  { months: 'Sep-Nov', temp: '24-32°C', season: 'Inter-monsoon', icon: CloudSun, desc: 'Mix of sun and rain. F1 night race in Sep.' }
];

// ===== BUDGET =====
export const BUDGET = [
  { tier: 'Budget', daily: 'S$70-100', description: 'Hostels, hawker food, public transport, free attractions', color: 'bg-emerald-500', items: ['Hostel S$30-40', 'Hawker food S$15-20', 'MRT S$6-10', 'Free attractions'] },
  { tier: 'Mid-range', daily: 'S$200-300', description: '3-star hotels, mix of restaurants and hawker, attractions', color: 'bg-blue-500', items: ['Hotel S$120-180', 'Meals S$40-60', 'Attractions S$40-60', 'Grab rides S$20-30'] },
  { tier: 'Luxury', daily: 'S$500+', description: '5-star hotels, fine dining, private transport, premium experiences', color: 'bg-purple-500', items: ['Hotel S$300-600', 'Fine dining S$150+', 'Private car S$100', 'VIP experiences'] }
];

// ===== ESSENTIALS =====
export const ESSENTIALS = [
  { title: 'Preferred Language', icon: Globe, info: 'English is widely spoken. You can also use Mandarin, Malay, Tamil, or your preferred travel language for app guidance.', tip: 'Singlish tip: "Can lah!" means definitely yes.' },
  { title: 'Currency', icon: CreditCard, info: 'Singapore Dollar (SGD). ATMs everywhere. Cards accepted in most places. Hawker centers mostly cash.', tip: '$1 SGD ≈ $0.74 USD. No tipping culture in Singapore.' },
  { title: 'Safety', icon: Shield, info: 'One of world\'s safest countries. Low crime, clean water, excellent healthcare. Emergency: 999 (Police), 995 (Ambulance).', tip: 'Strict laws: no littering ($1,000 fine), no smoking indoors.' },
  { title: 'Visa', icon: Plane, info: '160+ countries get visa-free entry for 30-90 days. Check ICA Singapore website for your country.', tip: 'Fill in SG Arrival Card online within 3 days of arrival.' },
  { title: 'Connectivity', icon: Smartphone, info: 'Free WiFi at 20,000+ Wireless@SG hotspots. Buy tourist SIM at Changi Airport (S$12-30 for 7 days).', tip: 'StarHub, Singtel, M1 best carriers. eSIM available via Airalo.' }
];
