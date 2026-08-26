export interface CropItem {
  id: string;
  name: string;
  category: 'Vegetables' | 'Grains' | 'Commercial' | 'Fruits' | 'Spices' | 'Pulses';
  iconUrl: string;
  emoji: string;
}

export const CROP_CATALOG: CropItem[] = [
  {
    id: 'tomato',
    name: 'Tomato',
    category: 'Vegetables',
    iconUrl: '/crops/tomato.jpg',
    emoji: '🍅'
  },
  {
    id: 'red_onion',
    name: 'Red Onion',
    category: 'Vegetables',
    iconUrl: '/crops/red_onion.jpg',
    emoji: '🧅'
  },
  {
    id: 'cotton',
    name: 'Cotton',
    category: 'Commercial',
    iconUrl: '/crops/cotton.jpg',
    emoji: '☁️'
  },
  {
    id: 'soybean',
    name: 'Soybean',
    category: 'Grains',
    iconUrl: '/crops/soybean.jpg',
    emoji: '🌱'
  },
  {
    id: 'wheat',
    name: 'Wheat',
    category: 'Grains',
    iconUrl: '/crops/wheat.jpg',
    emoji: '🌾'
  },
  {
    id: 'rice',
    name: 'Rice / Paddy',
    category: 'Grains',
    iconUrl: '/crops/rice.jpg',
    emoji: '🌾'
  },
  {
    id: 'maize',
    name: 'Maize / Corn',
    category: 'Grains',
    iconUrl: '/crops/maize.jpg',
    emoji: '🌽'
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    category: 'Commercial',
    iconUrl: '/crops/sugarcane.jpg',
    emoji: '🎋'
  },
  {
    id: 'potato',
    name: 'Potato',
    category: 'Vegetables',
    iconUrl: '/crops/potato.jpg',
    emoji: '🥔'
  },
  {
    id: 'garlic',
    name: 'Garlic',
    category: 'Spices',
    iconUrl: '/crops/garlic.jpg',
    emoji: '🧄'
  },
  {
    id: 'chilli',
    name: 'Chilli',
    category: 'Spices',
    iconUrl: '/crops/chilli.jpg',
    emoji: '🌶️'
  },
  {
    id: 'turmeric',
    name: 'Turmeric',
    category: 'Spices',
    iconUrl: '/crops/turmeric.jpg',
    emoji: '🟡'
  },
  {
    id: 'ginger',
    name: 'Ginger',
    category: 'Spices',
    iconUrl: '/crops/ginger.jpg',
    emoji: '🫚'
  },
  {
    id: 'banana',
    name: 'Banana',
    category: 'Fruits',
    iconUrl: '/crops/banana.jpg',
    emoji: '🍌'
  },
  {
    id: 'mango',
    name: 'Mango',
    category: 'Fruits',
    iconUrl: '/crops/mango.jpg',
    emoji: '🥭'
  },
  {
    id: 'grapes',
    name: 'Grapes',
    category: 'Fruits',
    iconUrl: '/crops/grapes.jpg',
    emoji: '🍇'
  },
  {
    id: 'pomegranate',
    name: 'Pomegranate',
    category: 'Fruits',
    iconUrl: '/crops/pomegranate.jpg',
    emoji: '🍎'
  },
  {
    id: 'lemon',
    name: 'Lemon',
    category: 'Fruits',
    iconUrl: '/crops/lemon.jpg',
    emoji: '🍋'
  },
  {
    id: 'groundnut',
    name: 'Groundnut',
    category: 'Commercial',
    iconUrl: '/crops/groundnut.jpg',
    emoji: '🥜'
  },
  {
    id: 'mustard',
    name: 'Mustard',
    category: 'Commercial',
    iconUrl: '/crops/mustard.jpg',
    emoji: '🌼'
  },
  {
    id: 'chickpea',
    name: 'Chickpea',
    category: 'Pulses',
    iconUrl: '/crops/chickpea.jpg',
    emoji: '🧆'
  },
  {
    id: 'pigeon_pea',
    name: 'Pigeon Pea',
    category: 'Pulses',
    iconUrl: '/crops/pigeon_pea.jpg',
    emoji: '🫘'
  },
  {
    id: 'cabbage',
    name: 'Cabbage',
    category: 'Vegetables',
    iconUrl: '/crops/cabbage.jpg',
    emoji: '🥬'
  },
  {
    id: 'cauliflower',
    name: 'Cauliflower',
    category: 'Vegetables',
    iconUrl: '/crops/cauliflower.jpg',
    emoji: '🥦'
  },
  {
    id: 'brinjal',
    name: 'Brinjal',
    category: 'Vegetables',
    iconUrl: '/crops/brinjal.jpg',
    emoji: '🍆'
  }
];

/**
 * Returns hyperrealistic crop image URL for any crop name or keyword
 */
export function getCropImage(cropName: string): string {
  if (!cropName) return '/crops/tomato.jpg';
  const clean = cropName.toLowerCase().trim();
  const match = CROP_CATALOG.find(c => 
    c.name.toLowerCase() === clean ||
    c.id.toLowerCase() === clean ||
    clean.includes(c.id.replace('_', ' ')) ||
    c.name.toLowerCase().includes(clean) ||
    clean.includes(c.name.toLowerCase().split('/')[0].trim())
  );
  return match ? match.iconUrl : '/crops/tomato.jpg';
}
