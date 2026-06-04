
# 🇸🇬 Discover Singapore - Interactive Travel Guide

An immersive, feature-rich travel guide web application that helps users explore Singapore's attractions, food, hotels, and cultural experiences. Built with React, TypeScript, and Vite.

## 🌐 Live Demo

**[View Live App](https://cosmic-torrone-76de4b.netlify.app/)**

## ✨ Features

### 🗺️ Interactive Map
- Real-time map with Leaflet integration
- 50+ locations including attractions, hotels, and food spots
- Category-based filtering (Food, Attractions, Culture, Nature, Technology, Hotels, Shopping, Nightlife)
- Smart public transport navigator with multiple route options

### 🍜 Explore Page
- Browse all locations with image galleries
- Filter by category and price range
- Search functionality for places and tags
- Save favorites and mark places as visited

### 💰 Travel Deals
- 15+ curated deals from top booking platforms (Klook, Agoda, Eatigo, Grab, etc.)
- Discount information and booking tips
- Covers attractions, hotels, dining, transport, and shopping

### 📅 AI Trip Planner
- Personalized itinerary generator
- Custom duration (1-3 days or custom date range)
- Interest-based filtering (Food, Attractions, Culture, Nature, Technology, Shopping, Nightlife)
- Budget preference selector (Budget, Mid-range, Luxury, Custom)
- Day-by-day breakdown with timing suggestions
- Food personality quiz

### 👤 Personal Travel Assistant
- User profile with visited places and favorites
- Currency converter with 30+ international currencies
- Visa requirement information by country
- Public transport guide with MRT lines
- Emergency numbers and useful local phrases
- Travel checklist and packing assistant

### 📚 Cultural Learning Hub
- Singapore trivia and fun facts
- "Things Tourists Do Wrong" guide
- Souvenir recommendations
- Local stories ("Meet a Local")
- Singlish phrases and unique Singaporean culture
- Time travel history section
- Hawker food passport with 10 must-try dishes

### Real-Time Context
- Live weather recommendations
- Crowd level indicators
- Transit peak hour alerts
- Time-of-day activity suggestions

### Gamification
- Achievements system (First Steps, Foodie, Culture Vulture, Nature Lover, etc.)
- Points-based rewards
- Track visited locations

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool and dev server |
| **Tailwind CSS 4** | Styling |
| **Framer Motion** | Animations |
| **Leaflet + React-Leaflet** | Interactive maps |
| **Lucide React** | Icons |
| **date-fns** | Date utilities |
| **clsx + tailwind-merge** | Conditional styling |

## 📦 Installation

### Prerequisites
- Node.js (v20.19.0 or higher)
- npm (v10 or higher)



## 📁 Project Structure

```
├── src/
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Entry point
│   ├── index.css            # Global styles + Tailwind
│   ├── data.tsx             # All locations, hotels, deals, etc.
│   ├── cn.ts                # Utility for className merging
│   └── vite-env.d.ts        # Vite type declarations
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── README.md                # This file
```

## 🗺️ Data Included

- **50+ Locations** (Attractions, Food, Culture, Nature, Technology)
- **16 Hotels** (Luxury, Mid-range, Affordable, Budget)
- **15 Travel Deals** (Klook, Agoda, Eatigo, Grab, etc.)
- **12 Festivals & Events**
- **8 Neighborhood Guides**
- **4 Transport Options**
- **4 Weather Seasons**
- **3 Budget Tiers**
- **5 Travel Essentials**

## 🚀 Deployment

The app is deployed on **Netlify** at:
```
https://cosmic-torrone-76de4b.netlify.app/
```

---

## 🙏 Acknowledgments

- Map data © [OpenStreetMap](https://www.openstreetmap.org/) contributors
- Icons by [Lucide](https://lucide.dev/)
- Images from Unsplash
- Built with Vite + React + Tailwind

---

**Made with ❤️ for exploring Singapore** 🇸🇬
