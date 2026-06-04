import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin, Search, Heart, User, Trophy, Sparkles,
  Utensils, Landmark, Trees, Cpu, X, ChevronRight, Star,
  Clock, Navigation, Calendar, Compass, Check, Hotel as HotelIcon,
  DollarSign, Award, Tag, ExternalLink,
  CreditCard, CloudSun, ShoppingCart, Train, Bus, Smartphone, Globe, Plane
} from 'lucide-react';

import {
  LOCATIONS, HOTELS, DEALS, FESTIVALS, NEIGHBORHOODS,
  TRANSPORT, WEATHER, BUDGET, ESSENTIALS,
  type Location, type HotelData, type Deal, type Category
} from './data';

const ALL_PLACES: Location[] = [...LOCATIONS, ...HOTELS];

// Fix Leaflet marker icons
const createIcon = (color: string, symbol: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative; width: 36px; height: 44px;">
        <svg width="36" height="44" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 0C8.059 0 0 8.059 0 18c0 13.5 18 26 18 26s18-12.5 18-26C36 8.059 27.941 0 18 0z" fill="${color}"/>
          <circle cx="18" cy="18" r="10" fill="white"/>
          <text x="18" y="22" text-anchor="middle" font-size="12" fill="${color}" font-weight="bold">${symbol}</text>
        </svg>
      </div>
    `,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -40]
  });
};

const categoryIcons: Record<string, L.DivIcon> = {
  Attractions: createIcon('#ED2939', '★'),
  Food: createIcon('#F59E0B', '🍽'),
  Culture: createIcon('#EC4899', '♥'),
  Nature: createIcon('#10B981', '🌿'),
  Technology: createIcon('#3B82F6', '⚙'),
  Hotels: createIcon('#8B5CF6', '🏨'),
  Shopping: createIcon('#EC4899', '🛍'),
  Nightlife: createIcon('#A855F7', '🌙'),
  DayTrips: createIcon('#14B8A6', '🏝')
};

// User & Achievement types
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  points: number;
}

interface UserProfile {
  name: string;
  avatar: string;
  visited: string[];
  favorites: string[];
  achievements: Achievement[];
  // Personal travel profile
  homeCountry: string;
  homeCurrency: string;
  homeCurrencyCode: string;
  preferredLanguage: string;
  budgetLevel: string;
}

interface TripPlan {
  id: string;
  title: string;
  locations: Location[];
  duration: string;
  interests: string[];
}

const FACTS = [
  "Singapore is one of only three surviving city-states in the world (along with Monaco and Vatican City).",
  "The Singapore Flyer was once the world's tallest Ferris wheel at 165 meters.",
  "Singapore's Night Safari is the world's first nocturnal zoo.",
  "The country is made up of 63 islands, most of which are uninhabited.",
  "Singapore has four official languages: English, Mandarin, Malay, and Tamil.",
  "Chewing gum is banned in Singapore (except for therapeutic purposes).",
  "Singapore Changi Airport has been voted the world's best airport for 12 consecutive years.",
  "The country is home to the world's first UNESCO World Heritage Botanic Gardens.",
  "Singapore has the world's highest rooftop infinity pool at Marina Bay Sands.",
  "The National Stadium has the world's largest free-spanning dome roof.",
  "Singapore is the second most densely populated sovereign state in the world.",
  "Nearly half of Singapore is covered in greenery, earning its 'City in a Garden' nickname."
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: '1', name: 'First Steps', description: 'Visit your first location', icon: <MapPin className="w-5 h-5" />, unlocked: false, points: 10 },
  { id: '2', name: 'Foodie', description: 'Visit 3 food places', icon: <Utensils className="w-5 h-5" />, unlocked: false, points: 25 },
  { id: '3', name: 'Culture Vulture', description: 'Visit 3 cultural sites', icon: <Landmark className="w-5 h-5" />, unlocked: false, points: 50 },
  { id: '4', name: 'Nature Lover', description: 'Visit 3 nature spots', icon: <Trees className="w-5 h-5" />, unlocked: false, points: 50 },
  { id: '5', name: 'Tech Explorer', description: 'Visit all tech attractions', icon: <Cpu className="w-5 h-5" />, unlocked: false, points: 30 },
  { id: '6', name: 'Explorer', description: 'Visit 5 different places', icon: <Compass className="w-5 h-5" />, unlocked: false, points: 40 },
  { id: '7', name: 'Master Tourist', description: 'Visit 10 locations', icon: <Trophy className="w-5 h-5" />, unlocked: false, points: 100 },
  { id: '8', name: 'Hotel Hunter', description: 'Save 3 hotels', icon: <HotelIcon className="w-5 h-5" />, unlocked: false, points: 30 },
  { id: '9', name: 'Deal Finder', description: 'Check out 5 deals', icon: <Tag className="w-5 h-5" />, unlocked: false, points: 20 }
];

// Map helpers
const FitBounds = ({ locations }: { locations: Location[] }) => {
  const map = useMap();
  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(l => [l.coordinates.lat, l.coordinates.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [locations, map]);
  return null;
};

const RealMap = ({ locations, onSelect, visited }: {
  locations: Location[];
  onSelect: (loc: Location) => void;
  visited: string[];
}) => {
  const center: [number, number] = [1.3521, 103.8198];
  return (
    <MapContainer 
      center={center} 
      zoom={12} 
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds locations={locations} />
      {locations.map(loc => {
        const isVisited = visited.includes(loc.id);
        const icon = isVisited 
          ? createIcon('#10B981', '✓') 
          : categoryIcons[loc.category] || categoryIcons.Attractions;
        
        return (
          <Marker 
            key={loc.id} 
            position={[loc.coordinates.lat, loc.coordinates.lng]}
            icon={icon}
            eventHandlers={{ click: () => onSelect(loc) }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">
                  {loc.category}
                </span>
                <h3 className="font-bold text-slate-900 mt-1">{loc.name}</h3>
                <p className="text-xs text-slate-600 mt-1">{loc.description}</p>
                <div className="flex items-center gap-1 mt-2 text-sm">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{loc.rating}</span>
                  <span className="text-slate-400">• {loc.price}</span>
                </div>
                {loc.address && (
                  <p className="text-xs text-slate-500 mt-1">📍 {loc.address}</p>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

const Button = ({ children, variant = 'primary', onClick, className = '' }: any) => {
  const base = 'px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2';
  const variants = {
    primary: 'bg-[#ED2939] text-white hover:bg-[#c91f2d] shadow-lg shadow-red-200',
    secondary: 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200',
    outline: 'border-2 border-[#ED2939] text-[#ED2939] hover:bg-red-50'
  };
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${base} ${variants[variant as keyof typeof variants]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

const Badge = ({ children, color = 'red' }: { children: React.ReactNode; color?: string }) => {
  const colors: any = {
    red: 'bg-red-100 text-red-700',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    purple: 'bg-purple-100 text-purple-700',
    pink: 'bg-pink-100 text-pink-700',
    slate: 'bg-slate-100 text-slate-700'
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[color] || colors.red}`}>
      {children}
    </span>
  );
};

const getCategoryColor = (cat: string) => {
  const map: any = {
    Food: 'amber', Attractions: 'red', Culture: 'pink',
    Nature: 'green', Technology: 'blue', Hotels: 'purple',
    Shopping: 'pink', Nightlife: 'purple', DayTrips: 'green'
  };
  return map[cat] || 'red';
};

// ===== MAIN APP =====
export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'map' | 'deals' | 'learn' | 'planner' | 'profile'>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<string>('All');
  const [user, setUser] = useState<UserProfile>({
    name: 'Explorer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Singapore',
    visited: [],
    favorites: [],
    achievements: INITIAL_ACHIEVEMENTS,
    homeCountry: 'United States',
    homeCurrency: 'US Dollar',
    homeCurrencyCode: 'USD',
    preferredLanguage: 'English',
    budgetLevel: 'Mid-range'
  });
  const [selectedLocation, setSelectedLocation] = useState<Location | HotelData | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [dailyFact, setDailyFact] = useState('');
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [plannerInterests, setPlannerInterests] = useState<string[]>([]);
  const [plannerDuration, setPlannerDuration] = useState('1 day');
  const [plannerBudget, setPlannerBudget] = useState<'Budget' | 'Mid-range' | 'Luxury' | 'All' | 'Custom'>('All');
  const [customBudgetAmount, setCustomBudgetAmount] = useState(150);
  const [isCustomDates, setIsCustomDates] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizResult, setQuizResult] = useState<string>('');
  const [routeFrom, setRouteFrom] = useState('Changi Airport');
  const [routeTo, setRouteTo] = useState('Marina Bay Sands');
  const [routeMode, setRouteMode] = useState<'fastest' | 'cheapest' | 'leastWalking' | 'accessible'>('fastest');
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [mapCategory, setMapCategory] = useState<Category>('All');

  useEffect(() => {
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    setDailyFact(FACTS[dayOfYear % FACTS.length]);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const filteredLocations = useMemo(() => {
    return ALL_PLACES.filter(loc => {
      const matchesCategory = selectedCategory === 'All' || loc.category === selectedCategory;
      const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           loc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           loc.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesPrice = priceFilter === 'All' || loc.price === priceFilter;
      return matchesCategory && matchesSearch && matchesPrice;
    });
  }, [selectedCategory, searchQuery, priceFilter]);

  const realTimeContext = useMemo(() => {
    const hour = currentTime.getHours();
    const day = currentTime.getDay();
    const month = currentTime.getMonth();
    const isWeekend = day === 0 || day === 6;
    const isLunch = hour >= 12 && hour <= 14;
    const isEvening = hour >= 18 && hour <= 21;
    const isPeakTransit = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
    const wetSeason = month === 10 || month === 11 || month === 0 || month === 1;

    const crowdLevel = isWeekend || isEvening ? 'High' : isLunch ? 'Medium' : 'Low';
    const crowdColor = crowdLevel === 'High' ? 'text-red-600 bg-red-50' : crowdLevel === 'Medium' ? 'text-amber-600 bg-amber-50' : 'text-emerald-600 bg-emerald-50';
    const weather = wetSeason
      ? 'Humid, chance of showers'
      : hour >= 11 && hour <= 16
        ? 'Hot and sunny'
        : 'Warm and humid';
    const weatherTip = wetSeason
      ? 'Carry umbrella and plan indoor backups like Jewel, National Gallery, or ArtScience Museum.'
      : hour >= 11 && hour <= 16
        ? 'Use MRT, hydrate often, and do outdoor walks before 11am or after 5pm.'
        : 'Good time for outdoor viewpoints, hawker centres, and waterfront walks.';

    return {
      updatedAt: currentTime.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' }),
      weather,
      weatherTip,
      temperature: wetSeason ? '26-31°C' : '27-33°C',
      crowdLevel,
      crowdColor,
      transit: isPeakTransit ? 'MRT peak hour' : 'MRT normal flow',
      transitTip: isPeakTransit ? 'Avoid large luggage and stand left on escalators.' : 'Good time to move across the city by MRT.',
      distance: 'Marina Bay to Chinatown: ~2.1 km / 8 min MRT',
      bestNow: isEvening ? 'Gardens by the Bay light show or Lau Pa Sat satay' : isLunch ? 'Maxwell Food Centre or Tiong Bahru Market' : 'Merlion Park, Botanic Gardens, or Jewel Changi'
    };
  }, [currentTime]);

  const toggleFavorite = (id: string) => {
    setUser(prev => {
      const newFavs = prev.favorites.includes(id) 
        ? prev.favorites.filter(f => f !== id)
        : [...prev.favorites, id];
      
      const savedHotels = newFavs.filter(f => ALL_PLACES.find(p => p.id === f && p.category === 'Hotels')).length;
      const newAchievements = prev.achievements.map(a => {
        if (a.id === '8' && savedHotels >= 3) return { ...a, unlocked: true };
        return a;
      });
      
      return { ...prev, favorites: newFavs, achievements: newAchievements };
    });
  };

  const markVisited = (id: string) => {
    if (!user.visited.includes(id)) {
      const newVisited = [...user.visited, id];
      setUser(prev => {
        const newAchievements = prev.achievements.map(a => {
          if (a.id === '1' && newVisited.length >= 1) return { ...a, unlocked: true };
          if (a.id === '6' && newVisited.length >= 5) return { ...a, unlocked: true };
          if (a.id === '7' && newVisited.length >= 10) return { ...a, unlocked: true };
          if (a.id === '2') {
            const foodCount = newVisited.filter(v => ALL_PLACES.find(p => p.id === v && p.category === 'Food')).length;
            if (foodCount >= 3) return { ...a, unlocked: true };
          }
          return a;
        });
        return { ...prev, visited: newVisited, achievements: newAchievements };
      });
    }
  };

  const openDeal = (deal: Deal) => {
    setUser(prev => {
      const newAchievements = prev.achievements.map(a => {
        if (a.id === '9') return { ...a, unlocked: true };
        return a;
      });
      return { ...prev, achievements: newAchievements };
    });
    window.open(deal.url, '_blank');
  };

  const generateTripPlan = () => {
    let filtered = ALL_PLACES.filter(l => {
      const matchesInterest = plannerInterests.length > 0 
        ? plannerInterests.includes(l.category) 
        : ['Food', 'Attractions', 'Culture', 'Nature', 'Technology', 'Shopping', 'Nightlife'].includes(l.category);
      
      let matchesBudget = true;
      if (plannerBudget !== 'All' && l.category === 'Hotels') {
        const hotel = l as HotelData;
        if (plannerBudget === 'Budget') matchesBudget = hotel.pricePerNight <= 100;
        if (plannerBudget === 'Mid-range') matchesBudget = hotel.pricePerNight > 100 && hotel.pricePerNight <= 300;
        if (plannerBudget === 'Luxury') matchesBudget = hotel.pricePerNight > 300;
        if (plannerBudget === 'Custom') matchesBudget = hotel.pricePerNight <= customBudgetAmount;
      }
      
      return matchesInterest && matchesBudget;
    });
    
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    
    let numberOfDays: number;
    let durationLabel: string;
    
    if (isCustomDates && startDate && endDate) {
      numberOfDays = Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)));
      const start = new Date(startDate).toLocaleDateString('en-SG', { month: 'short', day: 'numeric' });
      const end = new Date(endDate).toLocaleDateString('en-SG', { month: 'short', day: 'numeric', year: 'numeric' });
      durationLabel = `${numberOfDays} ${numberOfDays === 1 ? 'day' : 'days'} (${start} - ${end})`;
    } else {
      numberOfDays = plannerDuration === '1 day' ? 1 : plannerDuration === '2 days' ? 2 : 3;
      durationLabel = plannerDuration;
    }
    
    const count = numberOfDays * 5; // 5 places per day for richer plans
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));
    
    setTripPlan({
      id: Date.now().toString(),
      title: `Your ${numberOfDays}-Day Singapore Adventure`,
      locations: selected,
      duration: durationLabel,
      interests: plannerInterests
    });
  };

  const openLocation = (loc: Location | HotelData) => {
    setSelectedLocation(loc);
    setShowLocationModal(true);
  };

  const recommendedHotels = HOTELS.filter(h => h.rating >= 4.5).slice(0, 4);
  const affordableHotels = HOTELS.filter(h => h.tier === 'Affordable' || h.tier === 'Budget').sort((a, b) => a.pricePerNight - b.pricePerNight).slice(0, 4);

  // ===== HOME =====
  const renderHome = () => (
    <div className="space-y-8 pb-24">
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/singapore-hero.jpg" alt="Singapore" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="relative z-10 h-full flex flex-col justify-end p-6 pb-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <Badge color="red">Welcome to the Lion City</Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white mt-4 mb-4">
              Discover<br/>
              <span className="text-[#ED2939]">Singapore</span>
            </h1>
            <p className="text-white/80 text-lg max-w-md mb-6">
              Your complete guide to Singapore's culture, food, attractions, hotels, and the best deals.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setActiveTab('explore')}>
                Explore All <ChevronRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" onClick={() => setActiveTab('deals')} className="border-white text-white hover:bg-white/10">
                <Tag className="w-5 h-5" /> Find Deals
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Daily Fact */}
      <section className="px-6">
        <motion.div 
          className="bg-gradient-to-r from-[#ED2939] to-red-600 rounded-2xl p-6 text-white shadow-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">Daily Singapore Fact</span>
          </div>
          <p className="text-white/90">{dailyFact}</p>
        </motion.div>
      </section>

      {/* Real Time Context */}
      <section className="px-6">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Real Time Context</h2>
              <p className="text-xs text-slate-500">Updated {realTimeContext.updatedAt} • simulated live travel guidance</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${realTimeContext.crowdColor}`}>
              {realTimeContext.crowdLevel} crowd
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            <div className="rounded-xl bg-sky-50 p-3">
              <div className="text-xs font-semibold text-sky-600">Weather</div>
              <div className="mt-1 font-bold text-slate-900">{realTimeContext.temperature}</div>
              <p className="mt-1 text-xs text-slate-600">{realTimeContext.weather}</p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3">
              <div className="text-xs font-semibold text-emerald-600">Transit</div>
              <div className="mt-1 font-bold text-slate-900">{realTimeContext.transit}</div>
              <p className="mt-1 text-xs text-slate-600">{realTimeContext.transitTip}</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3">
              <div className="text-xs font-semibold text-amber-600">Distance</div>
              <div className="mt-1 font-bold text-slate-900">Nearby route</div>
              <p className="mt-1 text-xs text-slate-600">{realTimeContext.distance}</p>
            </div>
            <div className="rounded-xl bg-purple-50 p-3">
              <div className="text-xs font-semibold text-purple-600">Best Now</div>
              <div className="mt-1 font-bold text-slate-900">Recommendation</div>
              <p className="mt-1 text-xs text-slate-600">{realTimeContext.bestNow}</p>
            </div>
          </div>

          <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
            {realTimeContext.weatherTip}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="px-6">
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-[#ED2939]">{ALL_PLACES.length}</div>
            <div className="text-xs text-slate-500">Places</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-[#ED2939]">{DEALS.length}</div>
            <div className="text-xs text-slate-500">Deals</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-[#ED2939]">{HOTELS.length}</div>
            <div className="text-xs text-slate-500">Hotels</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-[#ED2939]">{FESTIVALS.length}</div>
            <div className="text-xs text-slate-500">Festivals</div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Explore by Category</h2>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {[
            { name: 'Food', icon: Utensils, color: 'bg-amber-100 text-amber-600' },
            { name: 'Attractions', icon: Landmark, color: 'bg-red-100 text-red-600' },
            { name: 'Culture', icon: Heart, color: 'bg-pink-100 text-pink-600' },
            { name: 'Nature', icon: Trees, color: 'bg-emerald-100 text-emerald-600' },
            { name: 'Technology', icon: Cpu, color: 'bg-blue-100 text-blue-600' },
            { name: 'Hotels', icon: HotelIcon, color: 'bg-purple-100 text-purple-600' },
            { name: 'Shopping', icon: ShoppingCart, color: 'bg-pink-100 text-pink-600' },
            { name: 'Nightlife', icon: Sparkles, color: 'bg-purple-100 text-purple-600' },
            { name: 'DayTrips', icon: Compass, color: 'bg-teal-100 text-teal-600' },
          ].map((cat, i) => (
            <motion.button
              key={cat.name}
              className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all text-center"
              onClick={() => { setSelectedCategory(cat.name as Category); setActiveTab('explore'); }}
              whileHover={{ y: -3 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-1 ${cat.color}`}>
                <cat.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-slate-700">{cat.name}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* TOP DEALS PREVIEW */}
      <section className="px-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Tag className="w-6 h-6 text-[#ED2939]" />
              Top Travel Deals
            </h2>
            <p className="text-sm text-slate-500">Save big with our recommended booking apps</p>
          </div>
          <button onClick={() => setActiveTab('deals')} className="text-[#ED2939] text-sm font-medium flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
          {DEALS.slice(0, 6).map((deal, i) => (
            <motion.div
              key={deal.id}
              className="min-w-[280px] bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer"
              onClick={() => openDeal(deal)}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={`h-24 bg-gradient-to-br ${deal.color} flex items-center justify-center`}>
                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-white">
                  {deal.icon}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-slate-900">{deal.name}</h3>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-xs text-slate-500 mb-2">{deal.tagline}</p>
                <span className="inline-block px-3 py-1 bg-red-50 text-[#ED2939] text-xs font-bold rounded-full">
                  {deal.discount}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* RECOMMENDED HOTELS */}
      <section className="px-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-6 h-6 text-[#ED2939]" />
              Recommended Hotels
            </h2>
            <p className="text-sm text-slate-500">Top-rated stays handpicked for you</p>
          </div>
          <button 
            onClick={() => { setSelectedCategory('Hotels'); setActiveTab('explore'); }}
            className="text-[#ED2939] text-sm font-medium flex items-center gap-1"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
          {recommendedHotels.map((hotel) => (
            <motion.div
              key={hotel.id}
              className="min-w-[300px] bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer"
              onClick={() => openLocation(hotel)}
              whileHover={{ y: -5 }}
            >
              <div className="relative h-40">
                <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                    <Award className="w-3 h-3" /> Top Rated
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-900 mb-1">{hotel.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-[#ED2939]">{hotel.priceLabel}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold">{hotel.rating}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AFFORDABLE HOTELS */}
      <section className="px-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-emerald-600" />
              Affordable Stays
            </h2>
            <p className="text-sm text-slate-500">Great value without compromising comfort</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {affordableHotels.map((hotel) => (
            <motion.div
              key={hotel.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer flex"
              onClick={() => openLocation(hotel)}
              whileHover={{ y: -3 }}
            >
              <div className="relative w-32 flex-shrink-0">
                <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full">
                    ${hotel.pricePerNight}
                  </span>
                </div>
              </div>
              <div className="p-3 flex-1">
                <Badge color={hotel.tier === 'Affordable' ? 'green' : 'amber'}>{hotel.tier}</Badge>
                <h3 className="font-bold text-slate-900 mt-1 text-sm">{hotel.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{hotel.description}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-semibold">{hotel.rating}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* NEIGHBORHOODS */}
      <section className="px-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Neighborhood Guide</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {NEIGHBORHOODS.map((hood, i) => (
            <motion.div
              key={hood.name}
              className={`bg-gradient-to-br ${hood.color} rounded-2xl p-5 text-white cursor-pointer`}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <h3 className="font-bold text-xl mb-1">{hood.name}</h3>
              <p className="text-white/80 text-sm mb-3">{hood.vibe}</p>
              <p className="text-white/90 text-sm mb-3">{hood.description}</p>
              <div className="flex flex-wrap gap-1">
                {hood.bestFor.map(b => (
                  <span key={b} className="px-2 py-0.5 bg-white/20 backdrop-blur rounded-full text-xs">
                    {b}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FESTIVALS */}
      <section className="px-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Festivals & Events</h2>
        <div className="flex gap-3 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
          {FESTIVALS.map((f, i) => (
            <motion.div
              key={f.name}
              className="min-w-[200px] bg-white rounded-2xl p-4 shadow-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="text-3xl mb-2">{f.emoji}</div>
              <h3 className="font-bold text-slate-900 text-sm">{f.name}</h3>
              <p className="text-xs text-[#ED2939] font-semibold mb-2">{f.month}</p>
              <p className="text-xs text-slate-600 line-clamp-3">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TRANSPORT */}
      <section className="px-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Getting Around</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {TRANSPORT.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className={`w-12 h-12 ${t.color} rounded-xl flex items-center justify-center text-white mb-3`}>
                <t.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{t.name}</h3>
              <p className="text-sm text-slate-600 mb-2">{t.description}</p>
              <div className="text-xs text-[#ED2939] bg-red-50 p-2 rounded-lg">
                💡 {t.tip}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WEATHER */}
      <section className="px-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Weather by Season</h2>
        <div className="grid md:grid-cols-4 gap-3">
          {WEATHER.map((w, i) => (
            <div key={i} className="bg-gradient-to-br from-blue-50 to-sky-100 rounded-2xl p-4">
              <CloudSun className="w-8 h-8 text-blue-500 mb-2" />
              <div className="font-bold text-slate-900">{w.months}</div>
              <div className="text-sm text-slate-700 mb-1">{w.temp}</div>
              <div className="text-xs text-blue-600 font-semibold">{w.season}</div>
              <p className="text-xs text-slate-600 mt-2">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BUDGET */}
      <section className="px-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Daily Budget Guide</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {BUDGET.map((b) => (
            <div key={b.tier} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
              <div className={`${b.color} p-4 text-white`}>
                <div className="text-sm font-medium opacity-90">{b.tier}</div>
                <div className="text-2xl font-bold">{b.daily}</div>
                <div className="text-xs opacity-80">per day</div>
              </div>
              <div className="p-4">
                <p className="text-sm text-slate-600 mb-3">{b.description}</p>
                <div className="space-y-1">
                  {b.items.map((item, j) => (
                    <div key={j} className="text-xs text-slate-700 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-500" /> {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ESSENTIALS */}
      <section className="px-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Travel Essentials</h2>
        <div className="space-y-3">
          {ESSENTIALS.map((e) => (
            <div key={e.title} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <e.icon className="w-6 h-6 text-[#ED2939]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-1">{e.title}</h3>
                  <p className="text-sm text-slate-600 mb-2">{e.info}</p>
                  <div className="text-xs text-[#ED2939] bg-red-50 p-2 rounded-lg">
                    💡 {e.tip}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🏛️ TIME TRAVEL SINGAPORE */}
      <section className="px-6">
        <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
          🏛️ Time Travel Singapore
        </h2>
        <p className="text-sm text-slate-600 mb-4">See how iconic places looked decades ago</p>
        
        <div className="space-y-4">
          {[
            {
              name: "Boat Quay",
              then: "1880s: Bustling trading port with Chinese junks and European godowns. Coolies loading cargo along the Singapore River.",
              now: "Today: Row of 30+ restaurants and bars in restored shophouses. Popular after-work drinks spot.",
              fun: "The river was so polluted in the 1970s that it was called 'the smelly river' before a massive clean-up."
            },
            {
              name: "Clarke Quay",
              then: "1900s: Warehouse district with Indian and Chinese traders. Named after Sir Andrew Clarke, 2nd Governor of Singapore.",
              now: "Today: Vibrant nightlife hub with clubs, restaurants, and the iconic colorful umbrellas.",
              fun: "The famous colorful umbrellas were added in 2014 to create Instagram moments!"
            },
            {
              name: "Chinatown",
              then: "1820s: First Chinese immigrants settled here. It was called 'Chinese Campong' and had opium dens and brothels.",
              now: "Today: Heritage shophouses, Buddha Tooth Relic Temple, and Michelin-starred hawker food.",
              fun: "The famous 'Five-Foot Way' (covered walkway) was a British rule so people could walk in shade."
            }
          ].map((place, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 mb-3">{place.name}</h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="w-16 text-amber-600 font-semibold flex-shrink-0">Then:</div>
                  <div className="text-slate-600">{place.then}</div>
                </div>
                <div className="flex gap-3">
                  <div className="w-16 text-emerald-600 font-semibold flex-shrink-0">Now:</div>
                  <div className="text-slate-600">{place.now}</div>
                </div>
                <div className="bg-amber-50 border-l-4 border-amber-400 pl-3 py-1 text-amber-800">
                  💡 {place.fun}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🧠 SINGAPORE TRIVIA */}
      <section className="px-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          🧠 Singapore Trivia
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { q: "Why is Singapore called the Lion City?", a: "Sang Nila Utama saw a lion (actually a tiger) when he landed in 1299. 'Singa' = lion in Sanskrit." },
            { q: "Why do HDBs have void decks?", a: "They were designed in the 1960s for community events, weddings, funerals, and to allow wind to flow through the building." },
            { q: "What is a kopitiam?", a: "A traditional coffee shop serving kopi (local coffee), kaya toast, and cheap local food. 'Kopi' = coffee, 'tiam' = shop in Hokkien." },
            { q: "Why are there so many Merlion statues?", a: "The original Merlion was built in 1972 as a tourism icon. Now there are 6 official ones across the island." },
            { q: "What is 'chope'?", a: "To reserve a seat at a hawker centre by placing a tissue packet or umbrella on the table. Very Singaporean!" },
            { q: "Why can't you chew gum?", a: "It was banned in 1992 to keep the city clean. You can still buy therapeutic gum with a prescription." }
          ].map((t, i) => (
            <div key={i} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
              <div className="font-bold text-purple-900 mb-2">{t.q}</div>
              <div className="text-sm text-purple-700">{t.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 🌎 COMPARE CULTURES */}
      <section className="px-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          🌎 How Singapore Differs From Your Country
        </h2>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-bold text-[#ED2939] mb-2">🍽️ Tipping Culture</h4>
              <p className="text-slate-600">No tipping expected! Service charge (10%) is often already added to restaurant bills. Hawker centres = no tipping at all.</p>
            </div>
            <div>
              <h4 className="font-bold text-[#ED2939] mb-2">🚇 Public Transport</h4>
              <p className="text-slate-600">Stand on the left, walk on the right. No eating or drinking. Give up seats to elderly/pregnant. Say "Thank you" when alighting.</p>
            </div>
            <div>
              <h4 className="font-bold text-[#ED2939] mb-2">⚖️ Laws to Know</h4>
              <p className="text-slate-600">No jaywalking, no littering (S$300 fine), no smoking in public, no durian on MRT, return your tray at hawker centres!</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🚨 THINGS TOURISTS DO WRONG */}
      <section className="px-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          🚨 Things Tourists Accidentally Do Wrong
        </h2>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { wrong: "Eating on the MRT", fine: "S$500 fine", tip: "Finish your food before boarding!" },
            { wrong: "Jaywalking", fine: "S$50 fine", tip: "Wait for the green man, even if no cars." },
            { wrong: "Not returning trays", fine: "S$300 fine", tip: "Always return your tray at hawker centres." },
            { wrong: "Smoking in wrong places", fine: "S$200 fine", tip: "Only smoke in designated yellow boxes." },
            { wrong: "Bringing durian on transport", fine: "Confiscated", tip: "The smell is too strong — leave it at home!" },
            { wrong: "Drinking tap water from wrong places", fine: "N/A", tip: "All Singapore tap water is drinkable!" }
          ].map((item, i) => (
            <div key={i} className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="font-bold text-red-900">❌ {item.wrong}</div>
              <div className="text-xs text-red-600 mt-1">{item.fine}</div>
              <div className="text-sm text-red-700 mt-2">✅ {item.tip}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 🛒 SOUVENIR GUIDE */}
      <section className="px-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          🛒 Best Souvenirs to Bring Home
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "Kaya (Coconut Jam)", where: "Ya Kun, Toast Box", price: "S$4-6", tip: "Buy in glass jar — lasts months!" },
            { name: "Bak Kwa (BBQ Pork)", where: "Lim Chee Guan, Bee Cheng Hiang", price: "S$20-40/pack", tip: "Best eaten hot. Vacuum packed for travel." },
            { name: "TWG Tea", where: "TWG outlets, Airport", price: "S$15-40", tip: "Singapore's famous tea brand. 800+ varieties." },
            { name: "Merlion Souvenirs", where: "Chinatown, Sentosa", price: "S$5-50", tip: "Get the small ones for easy packing." },
            { name: "Local Snacks", where: "Mustafa, FairPrice", price: "S$2-8", tip: "Try shrimp crackers, pandan cookies, Milo." },
            { name: "Singapore Sling Mix", where: "Raffles Hotel shop", price: "S$25", tip: "Make the iconic cocktail at home!" }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <h4 className="font-bold text-slate-900">{item.name}</h4>
              <div className="text-xs text-[#ED2939] mt-1">{item.where}</div>
              <div className="text-sm text-emerald-600 font-semibold mt-1">{item.price}</div>
              <div className="text-xs text-slate-600 mt-2">💡 {item.tip}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 🤝 MEET A LOCAL */}
      <section className="px-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          🤝 Meet a Local
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { name: "Uncle Lim, 72", area: "Tiong Bahru", story: "I've lived here since 1955. The best char kway teow is still at the market — same stall for 40 years!", dish: "Char Kway Teow", hidden: "The old playground behind the market" },
            { name: "Aisha, 34", area: "Kampong Glam", story: "My family has run the same textile shop for 3 generations. Come during Ramadan for the best bazaar food.", dish: "Murtabak", hidden: "The quiet cafe behind Sultan Mosque" },
            { name: "Raj, 45", area: "Little India", story: "Mustafa is my second home. I go there at 2am when I can't sleep — it's always open and has everything!", dish: "Roti Prata", hidden: "The 24-hour prata place on Serangoon Rd" },
            { name: "Mei Ling, 28", area: "Chinatown", story: "The new bars are cool, but the real Chinatown is in the hawker centres. Try the herbal soups at Maxwell.", dish: "Herbal Soup", hidden: "The temple at the end of Pagoda Street" }
          ].map((local, i) => (
            <div key={i} className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-200">
              <div className="font-bold text-orange-900">{local.name}</div>
              <div className="text-xs text-orange-600 mb-3">{local.area}</div>
              <p className="text-sm text-orange-800 mb-3">"{local.story}"</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-white px-2 py-1 rounded">🍜 {local.dish}</span>
                <span className="bg-white px-2 py-1 rounded">📍 {local.hidden}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🧳 BEFORE TOURISTS ARRIVE */}
      <section className="px-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          🧳 Before You Arrive
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          {/* Visa & Entry Assistant */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">🛂 Visa & Entry Assistant</h3>
            <div className="space-y-3 text-sm">
              <div className="bg-emerald-50 p-3 rounded-lg">
                <div className="font-semibold text-emerald-800">SG Arrival Card</div>
                <div className="text-emerald-700 text-xs mt-1">Fill online 3 days before arrival at ica.gov.sg</div>
              </div>
              <div>
                <div className="font-semibold text-slate-700 mb-1">Customs Rules:</div>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>✅ Duty-free: 1L alcohol, 1 carton cigarettes</li>
                  <li>❌ No: Chewing gum, drugs, weapons, meat products</li>
                  <li>⚠️ Durian: Allowed but very smelly!</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Packing Assistant */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">🎒 Packing Assistant</h3>
            <div className="text-sm text-slate-600">
              <div className="mb-2"><b>Weather:</b> Hot & humid year-round (25-32°C). Pack light, breathable clothes + umbrella.</div>
              <div className="mb-2"><b>Activities:</b> Comfortable shoes for walking, modest clothes for temples, swimwear for pools/beaches.</div>
              <div><b>Essentials:</b> Power bank, reusable water bottle, portable fan, mosquito repellent.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ✈️ CHANGI COMPANION */}
      <section className="px-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          ✈️ Changi Airport Companion
        </h2>
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-bold mb-2">🛍️ Must-See Attractions</div>
              <ul className="text-xs space-y-1 text-white/90">
                <li>• Jewel Rain Vortex (free)</li>
                <li>• Canopy Park (S$5)</li>
                <li>• Hedge Maze & Mirror Maze</li>
                <li>• Sunflower Garden</li>
              </ul>
            </div>
            <div>
              <div className="font-bold mb-2">🛋️ Lounge Guide</div>
              <ul className="text-xs space-y-1 text-white/90">
                <li>• Ambassador Transit Lounge (free for transit)</li>
                <li>• Marhaba Lounge (paid)</li>
                <li>• Plaza Premium (paid)</li>
              </ul>
            </div>
            <div>
              <div className="font-bold mb-2">🛃 Immigration Tips</div>
              <ul className="text-xs space-y-1 text-white/90">
                <li>• Use e-Gate if eligible (fast!)</li>
                <li>• Have SG Arrival Card ready</li>
                <li>• Jewel is between T1 & T3</li>
                <li>• Free Skytrain between terminals</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 🍜 HAWKER ROULETTE + EAT LIKE A SINGAPOREAN */}
      <section className="px-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          🍜 Food Experiences
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          {/* Hawker Roulette */}
          <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl p-6 text-white">
            <div className="font-bold text-xl mb-2">🎲 Hawker Roulette</div>
            <div className="text-sm mb-4 text-white/90">"Surprise me" — get a random famous stall recommendation!</div>
            <div className="bg-white/20 rounded-xl p-4 text-sm">
              <div className="font-bold">Today's Pick:</div>
              <div className="mt-1">🍜 <b>Min Heng Kee Bak Chor Mee</b></div>
              <div className="text-xs mt-1">Tiong Bahru Market • S$5 • President's favourite!</div>
            </div>
          </div>

          {/* Eat Like a Singaporean */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="font-bold mb-3">🍽 Eat Like a Singaporean</div>
            <div className="space-y-2 text-sm">
              <div><span className="font-semibold text-amber-600">☕ Breakfast:</span> Kaya toast + soft-boiled eggs + kopi</div>
              <div><span className="font-semibold text-orange-600">🍗 Lunch:</span> Hainanese Chicken Rice (S$5)</div>
              <div><span className="font-semibold text-red-600">🍢 Dinner:</span> Satay + chilli crab</div>
              <div><span className="font-semibold text-purple-600">🌙 Supper:</span> Roti prata + teh tarik</div>
            </div>
          </div>
        </div>
      </section>

      {/* 🇸🇬 UNIQUELY SINGAPOREAN */}
      <section className="px-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          🇸🇬 Uniquely Singaporean
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          {/* Durian Finder */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
            <div className="text-2xl mb-2">🥭</div>
            <h3 className="font-bold text-yellow-900">Durian Finder</h3>
            <div className="text-sm text-yellow-700 mt-2">Season: June–August. Best places: Tekka Market, 99 Pasir Panjang, Chinatown. Types: D24, Mao Shan Wang, Black Thorn.</div>
          </div>

          {/* HDB Explorer */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
            <div className="text-2xl mb-2">🏠</div>
            <h3 className="font-bold text-blue-900">HDB Explorer</h3>
            <div className="text-sm text-blue-700 mt-2">85% of Singaporeans live in HDB flats. Void decks = community spaces. Wet markets = fresh produce daily. Visit Toa Payoh or Ang Mo Kio to see real Singapore life.</div>
          </div>

          {/* Singlish Challenge */}
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5">
            <div className="text-2xl mb-2">🗣️</div>
            <h3 className="font-bold text-purple-900">Singlish Challenge</h3>
            <div className="text-xs text-purple-700 mt-2 space-y-1">
              <div><b>Lah</b> = emphasis (Can lah!)</div>
              <div><b>Lor</b> = obvious (Like that lor)</div>
              <div><b>Shiok</b> = very good/delightful</div>
              <div><b>Sian</b> = bored/tired</div>
              <div><b>Paiseh</b> = embarrassed/sorry</div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔥 WHY SINGAPORE WORKS */}
      <section className="px-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          🔥 Why Singapore Works
        </h2>
        <div className="bg-slate-900 rounded-2xl p-6 text-white">
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <div className="font-bold text-emerald-400 mb-2">💧 Water System</div>
              <div className="text-slate-300">4 national taps: Local catchment, imported water, NEWater (recycled), desalination. One of the most advanced water systems in the world.</div>
            </div>
            <div>
              <div className="font-bold text-blue-400 mb-2">🏠 Public Housing</div>
              <div className="text-slate-300">85% live in HDB flats. 90%+ home ownership rate. Ethnic integration policy prevents ghettos. World-class urban planning.</div>
            </div>
            <div>
              <div className="font-bold text-purple-400 mb-2">🌳 City in a Garden</div>
              <div className="text-slate-300">50% green cover. 350+ parks. Vertical gardens on buildings. Gardens by the Bay. Most sustainable city in Asia.</div>
            </div>
            <div>
              <div className="font-bold text-amber-400 mb-2">🤖 Smart Nation</div>
              <div className="text-slate-300">World's first Smart Nation. Contactless payments everywhere. Autonomous vehicles testing. Digital government services. 5G nationwide.</div>
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-400 border-t border-slate-700 pt-4">This is what makes Singapore one of the most liveable, efficient, and forward-thinking countries on Earth.</div>
        </div>
      </section>

      {/* 🍜 HAWKER FOOD PASSPORT */}
      <section className="px-6">
        <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
          🍜 Singapore Hawker Food Passport
        </h2>
        <p className="text-sm text-slate-600 mb-4">UNESCO-recognized street food culture — try these 10 must-eat dishes!</p>
        
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white mb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">🏆</div>
            <div>
              <div className="font-bold text-xl">Complete the Passport</div>
              <div className="text-white/90 text-sm">Visit 10 famous hawker stalls and get your "stamp" by trying each dish!</div>
            </div>
          </div>
          <div className="text-xs bg-white/20 rounded-lg p-3">
            Pro tip: Download the <b>Chope</b> or <b>Burpple</b> app for discounts at these stalls!
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {[
            { dish: "Hainanese Chicken Rice", stall: "Tian Tian (Maxwell)", price: "S$5", famous: "Anthony Bourdain's favorite" },
            { dish: "Chilli Crab", stall: "Jumbo Seafood", price: "S$60/kg", famous: "Singapore's national dish" },
            { dish: "Laksa", stall: "328 Katong Laksa", price: "S$5", famous: "Gordon Ramsay approved" },
            { dish: "Char Kway Teow", stall: "Hill Street Tai Hwa", price: "S$6", famous: "Michelin Bib Gourmand" },
            { dish: "Satay", stall: "Lau Pa Sat Satay Street", price: "S$10/10 sticks", famous: "Best at night" },
            { dish: "Roti Prata", stall: "The Prata Place", price: "S$2", famous: "24-hour prata" },
            { dish: "Bak Chor Mee", stall: "Min Heng Kee", price: "S$5", famous: "President's favorite" },
            { dish: "Oyster Omelette", stall: "Ah Chuan", price: "S$8", famous: "Newton Food Centre" },
            { dish: "Murtabak", stall: "Zam Zam", price: "S$8", famous: "Since 1908" },
            { dish: "Kaya Toast Set", stall: "Ya Kun Kaya Toast", price: "S$5.20", famous: "Since 1944" }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-4 flex justify-between items-center shadow-sm border border-slate-100">
              <div>
                <div className="font-bold text-slate-900">{item.dish}</div>
                <div className="text-xs text-slate-500">{item.stall}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-emerald-600">{item.price}</div>
                <div className="text-xs text-amber-600">{item.famous}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 📸 AI PHOTO SPOT FINDER */}
      <section className="px-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          📸 Best Photo Spots in Singapore
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { spot: "Marina Bay Sands Infinity Pool", time: "Sunrise 6:30am", tip: "Book SkyPark ticket in advance", vibe: "Iconic" },
            { spot: "Gardens by the Bay Supertrees", time: "7:45pm (light show)", tip: "Free from ground level", vibe: "Futuristic" },
            { spot: "Henderson Waves Bridge", time: "Golden hour 6pm", tip: "Highest pedestrian bridge in SG", vibe: "Architectural" },
            { spot: "Haji Lane Street Art", time: "Late afternoon", tip: "Colorful murals on both sides", vibe: "Hipster" },
            { spot: "Jewel Rain Vortex", time: "8pm (light show)", tip: "Hourly shows from 8pm-12am", vibe: "Magical" },
            { spot: "Merlion Park", time: "Blue hour 7pm", tip: "Best with MBS in background", vibe: "Classic" }
          ].map((p, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
              <div className="p-4">
                <div className="font-bold text-slate-900 mb-1">{p.spot}</div>
                <div className="text-xs text-[#ED2939] mb-2">⏰ Best time: {p.time}</div>
                <div className="text-xs text-slate-600 mb-2">💡 {p.tip}</div>
                <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">{p.vibe}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );

  // ===== EXPLORE =====
  const renderExplore = () => (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="sticky top-0 z-40 bg-white shadow-sm px-4 py-4">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search places, hotels, food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-100 rounded-xl border-0 focus:ring-2 focus:ring-[#ED2939]"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['All', 'Hotels', 'Food', 'Attractions', 'Culture', 'Nature', 'Technology', 'Shopping', 'Nightlife', 'DayTrips'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as Category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat ? 'bg-[#ED2939] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {selectedCategory === 'Hotels' && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <span className="text-sm text-slate-500 self-center">Price:</span>
              {['All', '$', '$$', '$$$', '$$$$'].map(p => (
                <button
                  key={p}
                  onClick={() => setPriceFilter(p)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    priceFilter === p ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <p className="text-slate-500 text-sm mb-4">{filteredLocations.length} places found</p>
        <div className="grid md:grid-cols-2 gap-4">
          {filteredLocations.map((loc, i) => {
            const isHotel = loc.category === 'Hotels';
            const hotel = isHotel ? loc as HotelData : null;
            return (
              <motion.div
                key={loc.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer"
                onClick={() => openLocation(loc)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.5) }}
              >
                <div className="relative h-48">
                  <img src={loc.image} alt={loc.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge color={getCategoryColor(loc.category)}>{loc.category}</Badge>
                    {hotel && (
                      <span className="px-2 py-1 bg-black/60 backdrop-blur text-white text-xs font-semibold rounded-full">
                        {hotel.priceLabel}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(loc.id); }}
                    className="absolute top-3 right-3 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center"
                  >
                    <Heart className={`w-5 h-5 ${user.favorites.includes(loc.id) ? 'fill-[#ED2939] text-[#ED2939]' : 'text-slate-400'}`} />
                  </button>
                  {user.visited.includes(loc.id) && (
                    <div className="absolute bottom-3 right-3 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-slate-900">{loc.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-sm">{loc.rating}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm mb-3 line-clamp-2">{loc.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {loc.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 bg-slate-100 rounded-md text-slate-600">{tag}</span>
                    ))}
                  </div>
                  {loc.tip && (
                    <div className="text-xs text-[#ED2939] bg-red-50 p-2 rounded-lg mb-2">
                      💡 {loc.tip}
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {loc.visitDuration}
                    </span>
                    {loc.address && (
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-4 h-4" /> {loc.address}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ===== MAP =====
  const renderMap = () => {
    const mapLocations = mapCategory === 'All' ? ALL_PLACES : ALL_PLACES.filter(l => l.category === mapCategory);
    const routePlaces = ['Changi Airport', ...ALL_PLACES.slice(0, 18).map(p => p.name)];
    const routeOptions = {
      fastest: {
        label: 'Fastest',
        time: '31 min',
        cost: 'S$2.20 + optional S$8 Grab',
        walk: '550 m',
        color: 'bg-[#ED2939]',
        summary: 'MRT first, short walk or Grab for last mile.',
        legs: [
          { type: 'MRT', line: 'EW', detail: `${routeFrom} to City Hall`, time: '24 min', color: 'bg-green-500' },
          { type: 'Walk', line: '5 min', detail: `Exit toward ${routeTo}`, time: '5 min', color: 'bg-slate-400' },
          { type: 'Arrive', line: '✓', detail: routeTo, time: '2 min buffer', color: 'bg-emerald-500' }
        ]
      },
      cheapest: {
        label: 'Cheapest',
        time: '46 min',
        cost: 'S$1.60-S$2.40',
        walk: '900 m',
        color: 'bg-emerald-500',
        summary: 'Public transport only. Best value if you are not rushing.',
        legs: [
          { type: 'MRT', line: 'EW', detail: `${routeFrom} to interchange`, time: '22 min', color: 'bg-green-500' },
          { type: 'MRT', line: 'DT/NS', detail: 'Change line toward city centre', time: '16 min', color: 'bg-blue-500' },
          { type: 'Walk', line: '8 min', detail: `Walk to ${routeTo}`, time: '8 min', color: 'bg-slate-400' }
        ]
      },
      leastWalking: {
        label: 'Least walking',
        time: '38 min',
        cost: 'S$6-S$12',
        walk: '180 m',
        color: 'bg-amber-500',
        summary: 'MRT plus short Grab/bus connection. Good in rain or heat.',
        legs: [
          { type: 'MRT', line: 'EW/DT', detail: `${routeFrom} to nearest MRT`, time: '27 min', color: 'bg-blue-500' },
          { type: 'Grab/Bus', line: 'Last mile', detail: `Door-to-door to ${routeTo}`, time: '8 min', color: 'bg-amber-500' },
          { type: 'Walk', line: '2 min', detail: 'Minimal walking route', time: '2 min', color: 'bg-slate-400' }
        ]
      },
      accessible: {
        label: 'Step-free',
        time: '42 min',
        cost: 'S$2.20-S$3.00',
        walk: '450 m',
        color: 'bg-purple-600',
        summary: 'Prioritizes elevators, barrier-free MRT exits, and accessible paths.',
        legs: [
          { type: 'MRT', line: 'Lift access', detail: 'Use elevator access at MRT station', time: '5 min', color: 'bg-purple-500' },
          { type: 'MRT', line: 'Step-free', detail: `${routeFrom} to accessible exit near ${routeTo}`, time: '30 min', color: 'bg-blue-500' },
          { type: 'Walk/Ramp', line: '7 min', detail: 'Step-free pedestrian route', time: '7 min', color: 'bg-purple-500' }
        ]
      }
    } as const;
    const selectedRoute = routeOptions[routeMode];

    return (
      <div className="min-h-screen bg-slate-100 pb-24">
        <div className="bg-white px-4 py-4 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Interactive Map</h1>
          <p className="text-slate-500 text-sm">{mapLocations.length} real locations across Singapore</p>
        </div>
        <div className="p-4">
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-3">
            {['All', 'Hotels', 'Food', 'Attractions', 'Culture', 'Nature', 'Technology', 'Shopping', 'Nightlife'].map(cat => (
              <button
                key={cat}
                onClick={() => setMapCategory(cat as Category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  mapCategory === cat ? 'bg-[#ED2939] text-white' : 'bg-white text-slate-600 shadow-sm'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Citymapper-style public transport navigator */}
          <div className="mb-4 overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl">
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold">Smart Navigator</h2>
                  <p className="text-xs text-slate-400">Citymapper-style route options for MRT, bus, walking, and accessibility</p>
                </div>
                <div className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                  Live estimate
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-400">From</span>
                  <select
                    value={routeFrom}
                    onChange={(e) => setRouteFrom(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none focus:border-[#ED2939]"
                  >
                    {routePlaces.map(place => <option key={place} className="text-slate-900">{place}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-400">To</span>
                  <select
                    value={routeTo}
                    onChange={(e) => setRouteTo(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none focus:border-[#ED2939]"
                  >
                    {routePlaces.map(place => <option key={place} className="text-slate-900">{place}</option>)}
                  </select>
                </label>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
                {[
                  { id: 'fastest', label: 'Fastest', sub: 'Save time' },
                  { id: 'cheapest', label: 'Cheapest', sub: 'Lowest fare' },
                  { id: 'leastWalking', label: 'Least walking', sub: 'Heat/rain friendly' },
                  { id: 'accessible', label: 'Step-free', sub: 'Elevators & ramps' }
                ].map(option => (
                  <button
                    key={option.id}
                    onClick={() => setRouteMode(option.id as typeof routeMode)}
                    className={`rounded-2xl p-3 text-left transition-all ${
                      routeMode === option.id ? 'bg-[#ED2939] text-white shadow-lg shadow-red-950/40' : 'bg-white/10 text-slate-300 hover:bg-white/15'
                    }`}
                  >
                    <div className="text-sm font-bold">{option.label}</div>
                    <div className="text-[11px] opacity-75">{option.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 text-slate-900">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm text-slate-500">Recommended route</div>
                  <div className="text-2xl font-bold">{selectedRoute.label}</div>
                  <p className="mt-1 text-sm text-slate-600">{selectedRoute.summary}</p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-xl bg-slate-100 px-3 py-2"><b>{selectedRoute.time}</b><br />time</div>
                  <div className="rounded-xl bg-slate-100 px-3 py-2"><b>{selectedRoute.cost}</b><br />fare</div>
                  <div className="rounded-xl bg-slate-100 px-3 py-2"><b>{selectedRoute.walk}</b><br />walk</div>
                </div>
              </div>

              <div className="space-y-3">
                {selectedRoute.legs.map((leg, index) => (
                  <div key={`${leg.type}-${index}`} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-full ${leg.color} text-xs font-bold text-white`}>
                        {index + 1}
                      </div>
                      {index < selectedRoute.legs.length - 1 && <div className="h-full min-h-8 w-0.5 bg-slate-200" />}
                    </div>
                    <div className="flex-1 pb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold">{leg.type}</span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">{leg.line}</span>
                        <span className="text-xs text-slate-500">{leg.time}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">{leg.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-xs text-blue-900">
                <b>Navigator tip:</b> For real-time arrivals, open Google Maps, Citymapper, or MyTransport.SG. This planner shows demo routing logic and Singapore-specific etiquette: no eating on MRT, keep left on escalators, and give up priority seats.
              </div>
            </div>
          </div>

          <div className="h-[500px] rounded-3xl overflow-hidden shadow-xl">
            <RealMap
              locations={mapLocations}
              onSelect={openLocation}
              visited={user.visited}
            />
          </div>
          <div className="mt-4 bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-3">Legend</h3>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2 text-xs">
              {[
                { color: 'bg-red-500', label: 'Attractions' },
                { color: 'bg-amber-500', label: 'Food' },
                { color: 'bg-pink-500', label: 'Culture' },
                { color: 'bg-emerald-500', label: 'Nature' },
                { color: 'bg-blue-500', label: 'Technology' },
                { color: 'bg-purple-500', label: 'Hotels' },
                { color: 'bg-pink-600', label: 'Shopping' },
                { color: 'bg-purple-600', label: 'Nightlife' },
                { color: 'bg-teal-500', label: 'Day Trips' }
              ].map(l => (
                <div key={l.label} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${l.color}`} />
                  <span>{l.label}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-3">Map data © OpenStreetMap contributors. Tap any marker for details.</p>
          </div>
        </div>
      </div>
    );
  };

  // ===== DEALS PAGE =====
  const renderDeals = () => (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-gradient-to-r from-[#ED2939] to-red-600 px-4 py-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Tag className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Travel Deals & Discounts</h1>
        </div>
        <p className="text-white/90">Save up to 70% with Singapore's best booking apps and discount platforms</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-4">
        {/* Quick Tips Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#ED2939]" />
            Pro Tips for Maximum Savings
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-[#ED2939] text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
              <p className="text-slate-700"><b>Stack discounts:</b> Use Klook for attractions + Grab for transport + Eatigo for dining in one day.</p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-[#ED2939] text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
              <p className="text-slate-700"><b>Sign up early:</b> Most apps offer first-time user discounts (S$10-30 off).</p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-[#ED2939] text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
              <p className="text-slate-700"><b>Book bundles:</b> Attraction combos (Zoo + Night Safari + River Wonders) save 30-50%.</p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-[#ED2939] text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">4</div>
              <p className="text-slate-700"><b>Get the Singapore Tourist Pass:</b> Unlimited MRT/bus from S$22/day - worth it if taking 4+ trips.</p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-[#ED2939] text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">5</div>
              <p className="text-slate-700"><b>Visit free attractions:</b> Gardens by the Bay, Botanic Gardens, Merlion Park, temples - all free!</p>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-4">
          {['All', 'Attractions', 'Hotels', 'Food', 'Shopping', 'Transport', 'Flights'].map(cat => (
            <button
              key={cat}
              className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-white text-slate-600 shadow-sm hover:bg-slate-100"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* All Deals */}
        <div className="grid md:grid-cols-2 gap-4">
          {DEALS.map((deal, i) => (
            <motion.div
              key={deal.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer"
              onClick={() => openDeal(deal)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -3 }}
            >
              <div className={`h-32 bg-gradient-to-br ${deal.color} flex items-center justify-between p-6 relative overflow-hidden`}>
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full" />
                <div className="absolute -right-12 -top-8 w-24 h-24 bg-white/5 rounded-full" />
                <div className="relative z-10 text-white">
                  <div className="text-2xl font-bold mb-1">{deal.name}</div>
                  <div className="text-sm opacity-90">{deal.tagline}</div>
                </div>
                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-white relative z-10">
                  {deal.icon}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-block px-3 py-1 bg-red-100 text-[#ED2939] text-sm font-bold rounded-full">
                    {deal.discount}
                  </span>
                  <Badge color="slate">{deal.category}</Badge>
                </div>
                <p className="text-sm text-slate-600 mb-3 line-clamp-2">{deal.description}</p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                  <p className="text-xs text-amber-900">
                    <b>💡 {deal.tip}</b>
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Best for: {deal.bestFor}</span>
                  <div className="flex items-center gap-1 text-[#ED2939] font-semibold text-sm">
                    Visit <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Passes Summary */}
        <div className="mt-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-amber-400" />
            Must-Have Tourist Passes
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <h3 className="font-bold text-amber-400 mb-2">Singapore Tourist Pass</h3>
              <p className="text-sm text-white/80 mb-2">Unlimited MRT & bus travel</p>
              <ul className="text-xs text-white/70 space-y-1">
                <li>• 1 day: S$22 (ref S$10 deposit)</li>
                <li>• 2 days: S$30</li>
                <li>• 3 days: S$36</li>
              </ul>
              <p className="text-xs text-amber-400 mt-2">Buy: Changi Airport, MRT stations</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <h3 className="font-bold text-amber-400 mb-2">iVenture Card</h3>
              <p className="text-sm text-white/80 mb-2">30+ attractions, save up to 50%</p>
              <ul className="text-xs text-white/70 space-y-1">
                <li>• 3 attractions: ~S$120</li>
                <li>• 5 attractions: ~S$180</li>
                <li>• Valid 7 days from first use</li>
              </ul>
              <p className="text-xs text-amber-400 mt-2">Book: iventurecard.com/sg</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <h3 className="font-bold text-amber-400 mb-2">Burpple Beyond</h3>
              <p className="text-sm text-white/80 mb-2">1-for-1 at 500+ restaurants</p>
              <ul className="text-xs text-white/70 space-y-1">
                <li>• Annual: S$48</li>
                <li>• Pays for itself in 2-3 meals</li>
                <li>• Covers cafes, bars, restaurants</li>
              </ul>
              <p className="text-xs text-amber-400 mt-2">Get: burpple.com/beyond</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <h3 className="font-bold text-amber-400 mb-2">The Entertainer</h3>
              <p className="text-sm text-white/80 mb-2">Buy-1-Get-1 dining & attractions</p>
              <ul className="text-xs text-white/70 space-y-1">
                <li>• Annual: S$125</li>
                <li>• FREE with DBS/POSB cards</li>
                <li>• Thousands of offers</li>
              </ul>
              <p className="text-xs text-amber-400 mt-2">Get: theentertainerme.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ===== PLANNER =====
  const renderPlanner = () => (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-gradient-to-r from-[#ED2939] to-red-600 px-4 py-8 text-white">
        <h1 className="text-3xl font-bold mb-2">AI Trip Planner</h1>
        <p className="text-white/80">Let our AI create your perfect Singapore itinerary</p>
      </div>
      <div className="max-w-4xl mx-auto px-4 -mt-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#ED2939]" /> Customize Your Trip
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Duration</label>
              <div className="flex gap-2 flex-wrap">
                {['1 day', '2 days', '3 days'].map(d => (
                  <button
                    key={d}
                    onClick={() => { setPlannerDuration(d); setIsCustomDates(false); }}
                    className={`flex-1 min-w-[80px] py-3 rounded-xl font-medium ${
                      !isCustomDates && plannerDuration === d ? 'bg-[#ED2939] text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >{d}</button>
                ))}
                <button
                  onClick={() => { setIsCustomDates(true); setPlannerDuration('custom'); }}
                  className={`flex-1 min-w-[80px] py-3 rounded-xl font-medium flex items-center justify-center gap-1 ${
                    isCustomDates ? 'bg-[#ED2939] text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Calendar className="w-4 h-4" /> Custom
                </button>
              </div>
            </div>
            {isCustomDates && (
              <motion.div 
                className="grid md:grid-cols-2 gap-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Check-in Date</label>
                  <input
                    type="date"
                    value={startDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-100 rounded-xl border-2 border-transparent focus:border-[#ED2939] focus:bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Check-out Date</label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-100 rounded-xl border-2 border-transparent focus:border-[#ED2939] focus:bg-white outline-none"
                  />
                </div>
                {startDate && endDate && (
                  <div className="md:col-span-2 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 border border-red-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500">Your Stay</p>
                        <p className="font-bold text-slate-900">
                          {new Date(startDate).toLocaleDateString('en-SG', { month: 'short', day: 'numeric' })} 
                          {' → '}
                          {new Date(endDate).toLocaleDateString('en-SG', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Total</p>
                        <p className="font-bold text-[#ED2939] text-xl">
                          {(() => {
                            const days = Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)));
                            return `${days} ${days === 1 ? 'day' : 'days'}`;
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Interests</label>
              <div className="flex flex-wrap gap-2">
                {['Food', 'Attractions', 'Culture', 'Nature', 'Technology', 'Shopping', 'Nightlife'].map(interest => (
                  <button
                    key={interest}
                    onClick={() => setPlannerInterests(prev => 
                      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
                    )}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      plannerInterests.includes(interest) ? 'bg-[#ED2939] text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >{interest}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Budget Preference</label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: 'All', desc: 'Any price', color: 'bg-slate-800' },
                  { label: 'Budget', desc: 'S$70-100/day', color: 'bg-emerald-500' },
                  { label: 'Mid-range', desc: 'S$200-300/day', color: 'bg-blue-500' },
                  { label: 'Luxury', desc: 'S$500+/day', color: 'bg-purple-600' },
                  { label: 'Custom', desc: 'Set your own', color: 'bg-amber-500' }
                ].map(b => (
                  <button
                    key={b.label}
                    onClick={() => setPlannerBudget(b.label as any)}
                    className={`flex-1 min-w-[70px] py-3 px-2 rounded-xl text-sm font-medium transition-all ${
                      plannerBudget === b.label 
                        ? `${b.color} text-white shadow-md` 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <div>{b.label}</div>
                    <div className="text-[10px] opacity-75 mt-0.5">{b.desc}</div>
                  </button>
                ))}
              </div>
              {plannerBudget === 'Custom' && (
                <motion.div 
                  className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-xl"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <label className="block text-sm font-medium text-amber-900 mb-2">
                    Your Daily Budget (SGD)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="30"
                      max="600"
                      step="10"
                      value={customBudgetAmount}
                      onChange={(e) => setCustomBudgetAmount(parseInt(e.target.value))}
                      className="flex-1 accent-amber-500"
                    />
                    <div className="flex items-center gap-1 bg-white border border-amber-300 rounded-lg px-3 py-2">
                      <span className="text-amber-600 font-bold">S$</span>
                      <input
                        type="number"
                        min="30"
                        max="600"
                        value={customBudgetAmount}
                        onChange={(e) => setCustomBudgetAmount(Math.max(30, Math.min(600, parseInt(e.target.value) || 150)))}
                        className="w-20 font-bold text-xl text-amber-900 outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-amber-700 mt-2">
                    <span>S$30</span>
                    <span>S$600</span>
                  </div>
                  <p className="text-xs text-amber-800 mt-2">
                    Hotels under S${customBudgetAmount}/night will be recommended
                  </p>
                </motion.div>
              )}
            </div>
            <Button onClick={generateTripPlan} className="w-full justify-center">
              <Sparkles className="w-5 h-5" /> Generate My Trip Plan
            </Button>

            <div className="pt-4 border-t border-slate-100">
              <button 
                onClick={() => setShowQuiz(!showQuiz)}
                className="text-sm text-[#ED2939] font-medium flex items-center gap-2"
              >
                🧠 Take the Food Personality Quiz (find your perfect dishes)
              </button>
            </div>

            {showQuiz && (
              <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="font-bold text-amber-900 mb-3">Food Personality Quiz</div>
                {!quizResult ? (
                  <div className="space-y-4">
                    {foodQuizQuestions.map((q, i) => (
                      <div key={i}>
                        <div className="text-sm font-medium text-amber-900 mb-2">{q.q}</div>
                        <div className="flex gap-2">
                          {q.options.map((opt, j) => (
                            <button
                              key={j}
                              onClick={() => {
                                const newAnswers = [...quizAnswers];
                                newAnswers[i] = j;
                                if (newAnswers.length === foodQuizQuestions.length && !newAnswers.includes(undefined as any)) {
                                  runFoodQuiz(newAnswers);
                                } else {
                                  setQuizAnswers(newAnswers);
                                }
                              }}
                              className={`flex-1 py-2 text-xs rounded-lg transition-all ${
                                quizAnswers[i] === j ? 'bg-[#ED2939] text-white' : 'bg-white text-amber-700 border border-amber-200'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-4xl mb-3">🍜</div>
                    <div className="font-bold text-amber-900 mb-2">Your Food Personality:</div>
                    <div className="text-sm text-amber-800">{quizResult}</div>
                    <button onClick={() => { setQuizResult(''); setQuizAnswers([]); }} className="mt-4 text-xs text-amber-600 underline">Retake Quiz</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {tripPlan && (
          <motion.div className="bg-white rounded-2xl shadow-lg overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-red-50 to-pink-50">
              <h3 className="text-xl font-bold text-slate-900">{tripPlan.title}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge color="red">{tripPlan.duration}</Badge>
                {plannerBudget !== 'All' && (
                  <Badge color={plannerBudget === 'Budget' ? 'green' : plannerBudget === 'Mid-range' ? 'blue' : plannerBudget === 'Luxury' ? 'purple' : 'amber'}>
                    {plannerBudget === 'Custom' ? `S$${customBudgetAmount}/day` : plannerBudget}
                  </Badge>
                )}
              </div>
              <p className="text-slate-600 text-sm mt-2">
                {tripPlan.locations.length} curated places • Optimized for your interests & budget
              </p>
            </div>

            {/* Detailed Day-by-Day Plan */}
            <div>
              {(() => {
                const placesPerDay = 5;
                const totalDays = Math.ceil(tripPlan.locations.length / placesPerDay);
                const days = [];
                
                for (let d = 0; d < totalDays; d++) {
                  const dayPlaces = tripPlan.locations.slice(d * placesPerDay, (d + 1) * placesPerDay);
                  days.push({ day: d + 1, places: dayPlaces });
                }
                
                return days.map((dayData) => (
                  <div key={dayData.day} className="border-b border-slate-100 last:border-0">
                    {/* Day Header */}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-4 text-white sticky top-0 z-10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#ED2939] rounded-full flex items-center justify-center font-bold text-lg">
                            {dayData.day}
                          </div>
                          <div>
                            <div className="font-bold text-lg">Day {dayData.day}</div>
                            <div className="text-xs text-white/70">{dayData.places.length} experiences • ~8-10 hours</div>
                          </div>
                        </div>
                        <div className="text-right text-xs">
                          <div>☀️ Morning: 2 places</div>
                          <div>🌤️ Afternoon: 2 places</div>
                          <div>🌙 Evening: 1 place</div>
                        </div>
                      </div>
                    </div>

                    {/* Places for the day */}
                    {/* Detailed Daily Guide */}
                    <div className="p-5 bg-white border-b border-slate-200">
                      <div className="font-bold text-slate-900 mb-4">📋 Day {dayData.day} Guide</div>
                      
                      <div className="space-y-4 text-sm">
                        {/* Breakfast */}
                        <div>
                          <div className="flex items-center gap-2 text-amber-600 font-semibold mb-1">
                            <span>☕ 07:30 – 09:00</span>
                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">BREAKFAST</span>
                          </div>
                          <div className="pl-6">
                            {dayData.places[0]?.category === 'Hotels' ? (
                              <div>
                                <span className="font-medium">{dayData.places[0].name}</span> — Free breakfast included
                                <div className="text-xs text-slate-500 mt-0.5">Start your day strong at the hotel.</div>
                              </div>
                            ) : (
                              <div>
                                <span className="font-medium">Ya Kun Kaya Toast</span> (Multiple locations)
                                <div className="text-xs text-slate-500 mt-0.5">Classic Singapore breakfast: Kaya toast + soft-boiled eggs + kopi.</div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Morning Activity */}
                        <div>
                          <div className="flex items-center gap-2 text-blue-600 font-semibold mb-1">
                            <span>🌅 09:30 – 12:00</span>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">MORNING</span>
                          </div>
                          <div className="pl-6">
                            <div className="font-medium">{dayData.places[0]?.name || "Iconic Landmark"}</div>
                            <div className="text-xs text-slate-600 mt-0.5">{dayData.places[0]?.description}</div>
                            <div className="text-xs text-blue-600 mt-1">→ Do: Take photos, explore surroundings, enjoy the views.</div>
                          </div>
                        </div>

                        {/* Lunch */}
                        <div>
                          <div className="flex items-center gap-2 text-orange-600 font-semibold mb-1">
                            <span>🍜 12:30 – 14:00</span>
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">LUNCH</span>
                          </div>
                          <div className="pl-6">
                            <div className="font-medium">
                              {dayData.places.find(p => p.category === 'Food')?.name || "Famous Hawker Stall"}
                            </div>
                            <div className="text-xs text-slate-600 mt-0.5">
                              {dayData.places.find(p => p.category === 'Food')?.tip || "Try local specialties like Chicken Rice or Laksa."}
                            </div>
                          </div>
                        </div>

                        {/* Afternoon */}
                        <div>
                          <div className="flex items-center gap-2 text-emerald-600 font-semibold mb-1">
                            <span>🏛️ 14:30 – 17:30</span>
                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">AFTERNOON</span>
                          </div>
                          <div className="pl-6">
                            <div className="font-medium">{dayData.places[2]?.name || dayData.places[1]?.name}</div>
                            <div className="text-xs text-emerald-600 mt-1">→ Do: Walk around, visit nearby attractions, rest if needed.</div>
                          </div>
                        </div>

                        {/* Dinner */}
                        <div>
                          <div className="flex items-center gap-2 text-red-600 font-semibold mb-1">
                            <span>🍢 19:00 – 21:00</span>
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">DINNER</span>
                          </div>
                          <div className="pl-6">
                            <div className="font-medium">Clarke Quay or Lau Pa Sat</div>
                            <div className="text-xs text-slate-600 mt-0.5">Riverside dining or famous Satay Street experience.</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Places List */}
                    <div className="divide-y divide-slate-100">
                      {dayData.places.map((loc, i) => (
                        <div 
                          key={loc.id} 
                          className="p-5 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer group" 
                          onClick={() => openLocation(loc)}
                        >
                          <div className="w-9 h-9 bg-slate-200 group-hover:bg-[#ED2939] group-hover:text-white rounded-full flex items-center justify-center text-slate-700 font-bold text-sm shrink-0 transition-all">
                            {(dayData.day - 1) * placesPerDay + i + 1}
                          </div>
                          
                          <img src={loc.image} alt={loc.name} className="w-24 h-24 rounded-xl object-cover shadow-sm" />
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-bold text-slate-900 text-lg">{loc.name}</h4>
                                <Badge color={getCategoryColor(loc.category)}>{loc.category}</Badge>
                              </div>
                              <div className="text-right text-xs text-slate-500">
                                {loc.visitDuration}<br />
                                {loc.price}
                              </div>
                            </div>
                            
                            <p className="text-sm text-slate-600 mt-2 line-clamp-2">{loc.description}</p>
                            
                            {loc.address && (
                              <div className="flex items-center gap-1 text-xs text-slate-500 mt-2">
                                <MapPin className="w-3 h-3" /> {loc.address}
                              </div>
                            )}
                            
                            {loc.tip && (
                              <div className="mt-2 text-xs bg-amber-50 text-amber-800 p-2 rounded border-l-2 border-amber-400">
                                💡 {loc.tip}
                              </div>
                            )}
                          </div>
                          
                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#ED2939] mt-2" />
                        </div>
                      ))}
                    </div>

                    {/* Daily Tips */}
                    <div className="bg-slate-50 p-4 text-xs text-slate-600 border-t border-slate-100">
                      <div className="font-semibold mb-1">Day {dayData.day} Tips:</div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        <span>🚇 Use MRT for efficiency</span>
                        <span>🍜 Try local food nearby</span>
                        <span>📸 Golden hour photos at 6pm</span>
                        <span>💧 Stay hydrated — it's hot!</span>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>

            <div className="p-4 bg-slate-50 flex gap-3">
              <Button variant="outline" onClick={() => setTripPlan(null)} className="flex-1 justify-center">
                New Plan
              </Button>
              <Button onClick={() => window.print()} className="flex-1 justify-center">
                <Calendar className="w-4 h-4" /> Save / Print Itinerary
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );

  // Food Personality Quiz
  const foodQuizQuestions = [
    { q: "What's your spice tolerance?", options: ["Mild", "Medium", "Bring the fire!"] },
    { q: "Breakfast preference?", options: ["Sweet & simple", "Savory & hearty", "Anything goes"] },
    { q: "Dining style?", options: ["Fine dining", "Street food only", "Mix of both"] },
    { q: "Sweet tooth?", options: ["Dessert every meal", "Occasional", "Skip the sweets"] }
  ];

  const getFoodPersonality = (answers: number[]) => {
    const score = answers.reduce((a, b) => a + b, 0);
    if (score <= 3) return "The Classic Kopi Uncle — You love traditional Singapore breakfasts and local coffee shops.";
    if (score <= 6) return "The Hawker Explorer — You want to try every famous stall and hidden gem.";
    if (score <= 9) return "The Spice Warrior — Chili crab, laksa, and the hottest dishes are your jam.";
    return "The Fine Diner — You appreciate both Michelin stars and street food with equal enthusiasm.";
  };

  const runFoodQuiz = (answers: number[]) => {
    const result = getFoodPersonality(answers);
    setQuizResult(result);
    setQuizAnswers(answers);
  };

  // ===== LEARN (Educational & Cultural Content) =====
  const renderLearn = () => (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Learn About Singapore</h1>
        <p className="text-white/80">Go beyond the tourist spots — understand the culture, history, and what makes Singapore unique.</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        
        {/* Time Travel */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">🏛️ Time Travel Singapore</h2>
          <div className="space-y-4">
            {[
              { name: "Boat Quay", then: "1880s: Bustling trading port with Chinese junks and European godowns.", now: "Today: 30+ restaurants in restored shophouses.", fun: "The river was called 'the smelly river' in the 1970s before a massive clean-up." },
              { name: "Clarke Quay", then: "1900s: Warehouse district named after Governor Sir Andrew Clarke.", now: "Today: Vibrant nightlife with colorful umbrellas added in 2014 for Instagram.", fun: "The famous umbrellas were added purely for photos!" },
              { name: "Chinatown", then: "1820s: Called 'Chinese Campong' with opium dens and brothels.", now: "Today: Heritage shophouses, temples, and Michelin hawker food.", fun: "The 'Five-Foot Way' was a British rule for walking in shade." }
            ].map((place, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-lg mb-3">{place.name}</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-semibold text-amber-600">Then:</span> {place.then}</div>
                  <div><span className="font-semibold text-emerald-600">Now:</span> {place.now}</div>
                  <div className="bg-amber-50 border-l-4 border-amber-400 pl-3 py-1 text-amber-800">💡 {place.fun}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trivia */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">🧠 Singapore Trivia</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              ["Why is Singapore called the Lion City?", "Sang Nila Utama saw a lion (actually a tiger) in 1299. 'Singa' = lion."],
              ["Why do HDBs have void decks?", "Designed in the 1960s for community events, weddings, and wind flow."],
              ["What is a kopitiam?", "'Kopi' = coffee, 'tiam' = shop in Hokkien. Traditional coffee shops."],
              ["Why can't you chew gum?", "Banned in 1992 to keep the city clean. Therapeutic gum needs prescription."],
              ["What does 'chope' mean?", "To reserve a seat with a tissue packet. Very Singaporean!"],
              ["How many Merlions are there?", "6 official Merlions across the island. The original was built in 1972."]
            ].map(([q, a], i) => (
              <div key={i} className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <div className="font-bold text-purple-900 text-sm mb-1">{q}</div>
                <div className="text-sm text-purple-700">{a}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Tourist Mistakes */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">🚨 Things Tourists Accidentally Do Wrong</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              ["Eating on the MRT", "S$500 fine — finish food before boarding!"],
              ["Jaywalking", "S$50 fine — wait for the green man."],
              ["Not returning trays", "S$300 fine — always return at hawker centres."],
              ["Smoking in wrong places", "S$200 fine — only in yellow boxes."],
              ["Bringing durian on MRT", "Confiscated — the smell is too strong!"],
              ["Tipping at restaurants", "Not expected! 10% service charge is usually included."]
            ].map(([wrong, tip], i) => (
              <div key={i} className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="font-bold text-red-900">❌ {wrong}</div>
                <div className="text-sm text-red-700 mt-1">✅ {tip}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Souvenirs */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">🛒 Best Souvenirs</h2>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              ["Kaya (Coconut Jam)", "Ya Kun, Toast Box", "S$4-6"],
              ["Bak Kwa (BBQ Pork)", "Lim Chee Guan", "S$20-40"],
              ["TWG Tea", "TWG outlets", "S$15-40"],
              ["Merlion souvenirs", "Chinatown, Sentosa", "S$5-50"],
              ["Local snacks", "Mustafa, FairPrice", "S$2-8"],
              ["Singapore Sling mix", "Raffles Hotel shop", "S$25"]
            ].map(([name, where, price], i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="font-bold">{name}</div>
                <div className="text-xs text-[#ED2939]">{where}</div>
                <div className="text-emerald-600 font-semibold mt-1">{price}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Meet a Local */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">🤝 Meet a Local</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: "Uncle Lim, 72", area: "Tiong Bahru", quote: "The best char kway teow is still at the market — same stall for 40 years!" },
              { name: "Aisha, 34", area: "Kampong Glam", quote: "My family has run the same textile shop for 3 generations." },
              { name: "Raj, 45", area: "Little India", quote: "Mustafa is my second home. I go there at 2am — it's always open!" },
              { name: "Mei Ling, 28", area: "Chinatown", quote: "Try the herbal soups at Maxwell. The real Chinatown is in the hawker centres." }
            ].map((local, i) => (
              <div key={i} className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <div className="font-bold">{local.name} • {local.area}</div>
                <div className="text-sm text-orange-700 mt-2">"{local.quote}"</div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Singapore Works */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">🔥 Why Singapore Works</h2>
          <div className="bg-slate-900 rounded-2xl p-6 text-white">
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div><span className="font-bold text-emerald-400">💧 Water:</span> 4 national taps — one of the most advanced systems in the world.</div>
              <div><span className="font-bold text-blue-400">🏠 Housing:</span> 85% live in HDB flats. 90%+ home ownership rate.</div>
              <div><span className="font-bold text-purple-400">🌳 Green City:</span> 50% green cover. 350+ parks. Most sustainable city in Asia.</div>
              <div><span className="font-bold text-amber-400">🤖 Smart Nation:</span> Contactless payments, 5G, digital government. World-first Smart Nation.</div>
            </div>
          </div>
        </section>

        {/* Uniquely Singaporean */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">🇸🇬 Uniquely Singaporean</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
              <div className="font-bold text-yellow-900">🥭 Durian Finder</div>
              <div className="text-sm text-yellow-700 mt-2">Season: June–August. Best at Tekka Market, 99 Pasir Panjang. Types: D24, Mao Shan Wang, Black Thorn.</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <div className="font-bold text-blue-900">🏠 HDB Explorer</div>
              <div className="text-sm text-blue-700 mt-2">85% of Singaporeans live in HDBs. Visit Toa Payoh or Ang Mo Kio to see real Singapore community life.</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
              <div className="font-bold text-purple-900">🗣️ Singlish</div>
              <div className="text-xs text-purple-700 mt-2 space-y-1">
                <div><b>Lah</b> = emphasis (Can lah!)</div>
                <div><b>Shiok</b> = very good</div>
                <div><b>Sian</b> = bored/tired</div>
                <div><b>Paiseh</b> = embarrassed</div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );

  // ===== PROFILE - Personal Travel Assistant =====
  const renderProfile = () => {
    // Currency conversion rates (approximate)
    const exchangeRates: { [key: string]: number } = {
      USD: 0.74, EUR: 0.68, GBP: 0.58, AUD: 1.12, CAD: 1.0,
      CNY: 5.35, JPY: 115, INR: 62, MYR: 3.35, THB: 26,
      IDR: 11500, KRW: 1020, VND: 19000, PHP: 43, BRL: 4.0,
      RUB: 65, SAR: 2.77, AED: 2.72, ZAR: 13.8, MXN: 13.7,
      SEK: 7.7, NOK: 7.9, DKK: 5.05, PLN: 2.9, TRY: 24,
      ILS: 2.7, NZD: 1.23, CHF: 0.65, SGD: 1
    };
    const currencyNames: { [key: string]: string } = {
      USD: 'US Dollar', EUR: 'Euro', GBP: 'British Pound', AUD: 'Australian Dollar', CAD: 'Canadian Dollar',
      CNY: 'Chinese Yuan', JPY: 'Japanese Yen', INR: 'Indian Rupee', MYR: 'Malaysian Ringgit', THB: 'Thai Baht',
      IDR: 'Indonesian Rupiah', KRW: 'South Korean Won', VND: 'Vietnamese Dong', PHP: 'Philippine Peso', BRL: 'Brazilian Real',
      RUB: 'Russian Ruble', SAR: 'Saudi Riyal', AED: 'UAE Dirham', ZAR: 'South African Rand', MXN: 'Mexican Peso',
      SEK: 'Swedish Krona', NOK: 'Norwegian Krone', DKK: 'Danish Krone', PLN: 'Polish Zloty', TRY: 'Turkish Lira',
      ILS: 'Israeli Shekel', NZD: 'New Zealand Dollar', CHF: 'Swiss Franc', SGD: 'Singapore Dollar'
    };
    
    const homeRate = exchangeRates[user.homeCurrencyCode] || 0.74;
    const homeToSgd = (home: number) => (home / homeRate).toFixed(2);

    const transportTips = [
      { icon: Train, title: 'MRT & LRT', desc: 'Fastest way around. 6 lines, S$1-3 per trip. Get EZ-Link or Tourist Pass.' },
      { icon: Bus, title: 'Public Buses', desc: 'Air-conditioned double-deckers. Same card works on MRT + buses.' },
      { icon: Smartphone, title: 'Grab App', desc: 'Southeast Asia Uber. 30-50% cheaper than taxis. Download before arrival!' },
      { icon: CreditCard, title: 'Payment', desc: 'Contactless everywhere. Apple/Google Pay accepted. Hawker centers = cash.' }
    ];

    const commonPhrases = [
      { english: 'Thank you', local: 'Terima kasih / Xie xie', note: 'Malay / Mandarin' },
      { english: 'How much?', local: 'Berapa? / Duo shao qian?', note: 'Malay / Mandarin' },
      { english: 'Can I have...', local: 'Boleh saya...', note: 'Very useful!' },
      { english: 'Where is...?', local: 'Di mana...?', note: 'Malay' }
    ];

    return (
      <div className="min-h-screen bg-slate-50 pb-24">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#ED2939] to-red-600 px-4 py-8">
          <div className="flex items-center gap-4">
            <img src={user.avatar} alt="Profile" className="w-20 h-20 rounded-2xl bg-white p-1" />
            <div className="text-white">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-white/80">{user.visited.length} places explored • Ready to travel smarter</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center text-white">
              <div className="text-3xl font-bold">{user.visited.length}</div>
              <div className="text-sm text-white/70">Places Visited</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center text-white">
              <div className="text-3xl font-bold">{user.favorites.length}</div>
              <div className="text-sm text-white/70">Saved Favorites</div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          
          {/* PERSONAL DATA FORM */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#ED2939]" /> My Travel Profile
            </h2>
            <p className="text-sm text-slate-600 mb-6">Tell us about yourself so we can give you personalized travel tips.</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Home Country</label>
                <select 
                  value={user.homeCountry}
                  onChange={(e) => {
                    const countryData: any = {
                      'United States': { currency: 'USD', code: 'USD', visa: 'Visa-free (90 days)' },
                      'United Kingdom': { currency: 'GBP', code: 'GBP', visa: 'Visa-free (90 days)' },
                      'Germany': { currency: 'EUR', code: 'EUR', visa: 'Visa-free (90 days)' },
                      'France': { currency: 'EUR', code: 'EUR', visa: 'Visa-free (90 days)' },
                      'Italy': { currency: 'EUR', code: 'EUR', visa: 'Visa-free (90 days)' },
                      'Spain': { currency: 'EUR', code: 'EUR', visa: 'Visa-free (90 days)' },
                      'Australia': { currency: 'AUD', code: 'AUD', visa: 'Visa-free (90 days)' },
                      'Canada': { currency: 'CAD', code: 'CAD', visa: 'Visa-free (90 days)' },
                      'Japan': { currency: 'JPY', code: 'JPY', visa: 'Visa-free (90 days)' },
                      'South Korea': { currency: 'KRW', code: 'KRW', visa: 'Visa-free (90 days)' },
                      'China': { currency: 'CNY', code: 'CNY', visa: 'Visa required (apply in advance)' },
                      'India': { currency: 'INR', code: 'INR', visa: 'Visa required (e-Visa available)' },
                      'Malaysia': { currency: 'MYR', code: 'MYR', visa: 'Visa-free (90 days)' },
                      'Indonesia': { currency: 'IDR', code: 'IDR', visa: 'Visa-free (30 days)' },
                      'Thailand': { currency: 'THB', code: 'THB', visa: 'Visa-free (60 days)' },
                      'Vietnam': { currency: 'VND', code: 'VND', visa: 'Visa-free (45 days)' },
                      'Philippines': { currency: 'PHP', code: 'PHP', visa: 'Visa-free (30 days)' },
                      'Singapore': { currency: 'SGD', code: 'SGD', visa: 'Citizen / PR' },
                      'Brazil': { currency: 'BRL', code: 'BRL', visa: 'Visa-free (90 days)' },
                      'Russia': { currency: 'RUB', code: 'RUB', visa: 'Visa required' },
                      'Saudi Arabia': { currency: 'SAR', code: 'SAR', visa: 'Visa required (e-Visa)' },
                      'United Arab Emirates': { currency: 'AED', code: 'AED', visa: 'Visa-free (90 days)' },
                      'South Africa': { currency: 'ZAR', code: 'ZAR', visa: 'Visa-free (90 days)' },
                      'Mexico': { currency: 'MXN', code: 'MXN', visa: 'Visa-free (30 days)' },
                      'Netherlands': { currency: 'EUR', code: 'EUR', visa: 'Visa-free (90 days)' },
                      'Sweden': { currency: 'SEK', code: 'SEK', visa: 'Visa-free (90 days)' },
                      'Norway': { currency: 'NOK', code: 'NOK', visa: 'Visa-free (90 days)' },
                      'Denmark': { currency: 'DKK', code: 'DKK', visa: 'Visa-free (90 days)' },
                      'Finland': { currency: 'EUR', code: 'EUR', visa: 'Visa-free (90 days)' },
                      'Poland': { currency: 'PLN', code: 'PLN', visa: 'Visa-free (90 days)' },
                      'Turkey': { currency: 'TRY', code: 'TRY', visa: 'Visa-free (90 days)' },
                      'Greece': { currency: 'EUR', code: 'EUR', visa: 'Visa-free (90 days)' },
                      'Israel': { currency: 'ILS', code: 'ILS', visa: 'Visa-free (90 days)' },
                      'New Zealand': { currency: 'NZD', code: 'NZD', visa: 'Visa-free (90 days)' },
                      'Ireland': { currency: 'EUR', code: 'EUR', visa: 'Visa-free (90 days)' },
                      'Switzerland': { currency: 'CHF', code: 'CHF', visa: 'Visa-free (90 days)' },
                      'Austria': { currency: 'EUR', code: 'EUR', visa: 'Visa-free (90 days)' },
                      'Belgium': { currency: 'EUR', code: 'EUR', visa: 'Visa-free (90 days)' },
                      'Portugal': { currency: 'EUR', code: 'EUR', visa: 'Visa-free (90 days)' }
                    };
                    const data = countryData[e.target.value] || { currency: 'USD', code: 'USD', visa: 'Check ICA website' };
                    setUser({
                      ...user, 
                      homeCountry: e.target.value,
                      homeCurrency: data.currency,
                      homeCurrencyCode: data.code
                    });
                  }}
                  className="w-full px-4 py-3 bg-slate-100 rounded-xl border-2 border-transparent focus:border-[#ED2939] focus:bg-white outline-none text-sm"
                >
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Germany</option>
                  <option>France</option>
                  <option>Italy</option>
                  <option>Spain</option>
                  <option>Australia</option>
                  <option>Canada</option>
                  <option>Japan</option>
                  <option>South Korea</option>
                  <option>China</option>
                  <option>India</option>
                  <option>Malaysia</option>
                  <option>Indonesia</option>
                  <option>Thailand</option>
                  <option>Vietnam</option>
                  <option>Philippines</option>
                  <option>Singapore</option>
                  <option>Brazil</option>
                  <option>Russia</option>
                  <option>Saudi Arabia</option>
                  <option>United Arab Emirates</option>
                  <option>South Africa</option>
                  <option>Mexico</option>
                  <option>Netherlands</option>
                  <option>Sweden</option>
                  <option>Norway</option>
                  <option>Denmark</option>
                  <option>Finland</option>
                  <option>Poland</option>
                  <option>Turkey</option>
                  <option>Greece</option>
                  <option>Israel</option>
                  <option>New Zealand</option>
                  <option>Ireland</option>
                  <option>Switzerland</option>
                  <option>Austria</option>
                  <option>Belgium</option>
                  <option>Portugal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Language</label>
                <select 
                  value={user.preferredLanguage}
                  onChange={(e) => setUser({...user, preferredLanguage: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-100 rounded-xl border-2 border-transparent focus:border-[#ED2939] focus:bg-white outline-none"
                >
                  <option>English</option>
                  <option>Mandarin Chinese</option>
                  <option>Cantonese</option>
                  <option>Malay</option>
                  <option>Indonesian</option>
                  <option>Tamil</option>
                  <option>Hindi</option>
                  <option>Japanese</option>
                  <option>Korean</option>
                  <option>Thai</option>
                  <option>Vietnamese</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Italian</option>
                  <option>Portuguese</option>
                  <option>Russian</option>
                  <option>Arabic</option>
                  <option>Dutch</option>
                  <option>Swedish</option>
                  <option>Norwegian</option>
                  <option>Danish</option>
                  <option>Finnish</option>
                  <option>Polish</option>
                  <option>Turkish</option>
                  <option>Greek</option>
                  <option>Hebrew</option>
                  <option>Filipino / Tagalog</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Home Currency</label>
                <div className="px-4 py-3 bg-slate-100 rounded-xl border-2 border-slate-200 text-slate-700 font-medium">
                  {user.homeCurrencyCode} — {currencyNames[user.homeCurrencyCode] || user.homeCurrency}
                </div>
                <p className="text-xs text-slate-500 mt-1">Auto-updated based on country</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Typical Travel Budget</label>
                <select 
                  value={user.budgetLevel}
                  onChange={(e) => setUser({...user, budgetLevel: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-100 rounded-xl border-2 border-transparent focus:border-[#ED2939] focus:bg-white outline-none"
                >
                  <option>Budget (S$70-100/day)</option>
                  <option>Mid-range (S$200-300/day)</option>
                  <option>Luxury (S$500+/day)</option>
                </select>
              </div>
            </div>
            
            {/* VISA INFO */}
            <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Plane className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-emerald-900">Singapore Entry Requirements</h4>
                  <p className="text-sm text-emerald-700 mt-1">
                    {user.homeCountry === 'Singapore' 
                      ? '🇸🇬 You are a Singapore citizen or PR — no visa needed!' 
                      : `From ${user.homeCountry}: Most visitors get 30–90 days visa-free. Always check the official ICA website before travel.`}
                  </p>
                  <a href="https://www.ica.gov.sg/enter-transit-depart/entering-singapore/visa-requirements" target="_blank" className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-800 mt-2 font-medium">
                    Check official visa requirements <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* CURRENCY CONVERTER */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-500" /> Currency Converter
            </h2>
            <p className="text-sm text-slate-600 mb-4">Convert your home currency to Singapore Dollars (SGD).</p>
            
            <div className="grid md:grid-cols-3 gap-4">
              {[50, 100, 500].map((amount) => (
                <div key={amount} className="bg-blue-50 rounded-xl p-4">
                  <div className="text-xs text-blue-600 font-semibold mb-1">
                    {user.homeCurrencyCode} → SGD
                  </div>
                  <div className="text-3xl font-bold text-blue-900">
                    {user.homeCurrencyCode}{amount}
                  </div>
                  <div className="text-sm text-blue-700 mt-1">
                    = S${homeToSgd(amount)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">
              Rate used: 1 SGD ≈ {homeRate} {user.homeCurrencyCode}. Example: {user.homeCurrencyCode}100 ≈ S${homeToSgd(100)}.
            </div>
            
            <div className="mt-4 text-xs bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-800">
              💡 <b>Pro Tip:</b> No tipping culture in Singapore. Prices shown are what you pay. 8% GST + 10% service charge sometimes included in restaurants.
            </div>
          </section>

          {/* PUBLIC TRANSPORT GUIDE */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Train className="w-5 h-5 text-blue-500" /> Getting Around Singapore
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {transportTips.map((tip, i) => (
                <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <tip.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">{tip.title}</h4>
                    <p className="text-sm text-slate-600">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-2">🚇 MRT Quick Guide</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <div><span className="font-mono font-bold text-red-600">NS</span> North-South (Red)</div>
                <div><span className="font-mono font-bold text-green-600">EW</span> East-West (Green)</div>
                <div><span className="font-mono font-bold text-purple-600">NE</span> North-East (Purple)</div>
                <div><span className="font-mono font-bold text-yellow-600">CC</span> Circle Line (Yellow)</div>
                <div><span className="font-mono font-bold text-blue-600">DT</span> Downtown (Blue)</div>
                <div><span className="font-mono font-bold text-teal-600">TE</span> Thomson-East Coast</div>
              </div>
              <p className="text-xs text-blue-700 mt-3">💡 Download the <b>SG MRT Map</b> app or use Google Maps for live arrivals.</p>
            </div>
          </section>

          {/* USEFUL PHRASES */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-500" /> Useful Local Phrases
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {commonPhrases.map((phrase, i) => (
                <div key={i} className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="font-bold text-purple-900">{phrase.english}</div>
                  <div className="text-sm text-purple-700 mt-1">{phrase.local}</div>
                  <div className="text-xs text-purple-500 mt-1">({phrase.note})</div>
                </div>
              ))}
            </div>
          </section>

          {/* EMERGENCY & IMPORTANT */}
          <section className="bg-slate-900 rounded-2xl p-6 text-white">
            <h2 className="text-lg font-bold mb-4">🆘 Emergency & Important Numbers</h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-bold text-red-400">Emergency</div>
                <div className="font-mono text-2xl">999</div>
                <div className="text-xs text-slate-400">Police • Ambulance • Fire</div>
              </div>
              <div>
                <div className="font-bold text-amber-400">Non-Emergency</div>
                <div className="font-mono text-2xl">1777</div>
                <div className="text-xs text-slate-400">Police hotline</div>
              </div>
              <div>
                <div className="font-bold text-emerald-400">Tourist Hotline</div>
                <div className="font-mono text-2xl">1800 736 2000</div>
                <div className="text-xs text-slate-400">24/7 assistance</div>
              </div>
            </div>
          </section>

        </div>
      </div>
    );
  };

  // ===== LOCATION MODAL =====
  const LocationModal = () => {
    if (!selectedLocation) return null;
    const isFavorite = user.favorites.includes(selectedLocation.id);
    const isVisited = user.visited.includes(selectedLocation.id);
    const isHotel = selectedLocation.category === 'Hotels';
    const hotel = isHotel ? selectedLocation as HotelData : null;
    
    return (
      <AnimatePresence>
        {showLocationModal && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLocationModal(false)} />
            <motion.div 
              className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="relative h-72">
                <img src={selectedLocation.image} alt={selectedLocation.name} className="w-full h-full object-cover" />
                <button 
                  onClick={() => setShowLocationModal(false)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/30 backdrop-blur rounded-full flex items-center justify-center text-white"
                ><X className="w-5 h-5" /></button>
                <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                  <button 
                    onClick={() => toggleFavorite(selectedLocation.id)}
                    className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${
                      isFavorite ? 'bg-[#ED2939] text-white' : 'bg-white/90 text-slate-700'
                    }`}
                  ><Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />{isFavorite ? 'Favorited' : 'Save'}</button>
                  <button 
                    onClick={() => { markVisited(selectedLocation.id); setShowLocationModal(false); }}
                    className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${
                      isVisited ? 'bg-emerald-500 text-white' : 'bg-white/90 text-slate-700'
                    }`}
                  ><Check className="w-5 h-5" />{isVisited ? 'Visited' : 'Mark Visited'}</button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Badge color={getCategoryColor(selectedLocation.category)}>{selectedLocation.category}</Badge>
                    <h2 className="text-2xl font-bold text-slate-900 mt-2">{selectedLocation.name}</h2>
                    {selectedLocation.address && (
                      <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {selectedLocation.address}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      <span className="text-2xl font-bold">{selectedLocation.rating}</span>
                    </div>
                    <p className="text-sm text-slate-500">{selectedLocation.reviews.toLocaleString()} reviews</p>
                  </div>
                </div>
                {hotel && (
                  <div className="bg-gradient-to-r from-red-50 to-purple-50 rounded-2xl p-4 mb-6">
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-sm font-semibold text-slate-600">Starting from</span>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-[#ED2939]">${hotel.pricePerNight}</div>
                        <div className="text-xs text-slate-500">per night</div>
                      </div>
                    </div>
                    <Button className="w-full justify-center" onClick={() => window.open('https://www.agoda.com', '_blank')}>
                      Book on Agoda <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                <p className="text-slate-600 mb-6">{selectedLocation.description}</p>
                {selectedLocation.tip && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                    <p className="text-sm text-amber-900"><b>💡 Insider Tip:</b> {selectedLocation.tip}</p>
                  </div>
                )}
                {hotel && hotel.amenities.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-slate-900 mb-3">Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {hotel.amenities.map(a => (
                        <div key={a} className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
                          <Check className="w-4 h-4 text-emerald-500" />
                          <span>{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-50 rounded-xl p-4 text-center">
                    <Clock className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                    <p className="text-sm font-medium text-slate-900">{selectedLocation.visitDuration}</p>
                    <p className="text-xs text-slate-500">Duration</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 text-center">
                    <Calendar className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                    <p className="text-sm font-medium text-slate-900">{selectedLocation.bestTime}</p>
                    <p className="text-xs text-slate-500">Best Time</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 text-center">
                    <Navigation className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                    <p className="text-sm font-medium text-slate-900">{selectedLocation.price}</p>
                    <p className="text-xs text-slate-500">Price</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedLocation.tags.map(tag => (
                    <span key={tag} className="px-3 py-1.5 bg-slate-100 rounded-full text-sm text-slate-600">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const navItems = [
    { id: 'home', icon: Compass, label: 'Home' },
    { id: 'explore', icon: Search, label: 'Explore' },
    { id: 'map', icon: MapPin, label: 'Map' },
    { id: 'deals', icon: Tag, label: 'Deals' },
    { id: 'learn', icon: Award, label: 'Guide' },
    { id: 'planner', icon: Sparkles, label: 'Planner' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <main>
        {activeTab === 'home' && renderHome()}
        {activeTab === 'explore' && renderExplore()}
        {activeTab === 'map' && renderMap()}
        {activeTab === 'deals' && renderDeals()}
        {activeTab === 'learn' && renderLearn()}
        {activeTab === 'planner' && renderPlanner()}
        {activeTab === 'profile' && renderProfile()}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2 z-40 safe-area-pb">
        <div className="max-w-2xl mx-auto flex justify-around">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all ${
                  isActive ? 'text-[#ED2939]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'fill-current' : ''}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
      <LocationModal />
    </div>
  );
}
