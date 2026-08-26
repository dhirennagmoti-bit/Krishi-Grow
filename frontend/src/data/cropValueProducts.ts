export interface CropProductProcessingGuide {
  id: string;
  cropName: string;
  category: 'Vegetable' | 'Grain & Pulse' | 'Commercial & Cash' | 'Fruit' | 'Spice & Oilseed';
  image: string;
  productsCanBeMade: string[];
  productsSummary: string;
  estimatedMarginPercent: number;
  marketDemand: 'VERY_HIGH' | 'HIGH' | 'MODERATE';
  investmentLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  shelfLifeExtensionDays: number;
  buyerProcessorName: string;
  phone?: string;
  email?: string;
  location: string;
  youtubeSearchUrl: string;
  youtubeKeywords: string;
  whyRecommended: string[];
}

export const CROP_VALUE_PRODUCTS: CropProductProcessingGuide[] = [
  {
    id: 'val_banana',
    cropName: 'Banana',
    category: 'Fruit',
    image: '/crops/banana.jpg',
    productsCanBeMade: ['Banana Chips (Wafers)', 'Green Banana Flour (Resistant Starch)', 'Aseptic Banana Puree', 'Banana Pseudo-Stem Eco Fibre'],
    productsSummary: 'Banana chips; banana flour; banana puree; banana fibre',
    estimatedMarginPercent: 36,
    marketDemand: 'VERY_HIGH',
    investmentLevel: 'MEDIUM',
    shelfLifeExtensionDays: 180,
    buyerProcessorName: 'Neelay Agro Infra Pvt. Ltd.',
    phone: '+91 98606 11653',
    email: 'sagar.girase@neelaygroup.com',
    location: 'Amravati, Maharashtra',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=banana+processing+manufacturing+chips+flour+fibre',
    youtubeKeywords: 'Banana chips manufacturing & flour processing plant',
    whyRecommended: [
      'Raw green bananas converted to vacuum-fried chips fetch 3.5x farm-gate price',
      'Banana flour has surging global export demand as gluten-free prebiotic superfood',
      'Banana fibre extracted from waste pseudostems creates secondary revenue for craft paper & textiles'
    ]
  },
  {
    id: 'val_brinjal',
    cropName: 'Brinjal',
    category: 'Vegetable',
    image: '/crops/brinjal.jpg',
    productsCanBeMade: ['Brinjal Pickle (Vangi Lonche)', 'Dehydrated Brinjal Slices', 'IQF Frozen Roasted Baingan Bharta Base'],
    productsSummary: 'Brinjal pickle; dehydrated brinjal; frozen brinjal',
    estimatedMarginPercent: 28,
    marketDemand: 'HIGH',
    investmentLevel: 'LOW',
    shelfLifeExtensionDays: 240,
    buyerProcessorName: 'MahaAgri Ready-Cook Processing Cluster',
    location: 'Pune & Satara, Maharashtra',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=brinjal+processing+value+added+products',
    youtubeKeywords: 'Brinjal pickle & frozen roasted baingan bharta manufacturing',
    whyRecommended: [
      'Prevents peak harvest distress dump sales during gluts',
      'Vacuum freeze-drying preserves color and reconstitutes in 5 minutes for FMCG ready meals',
      'High-margin shelf-stable pickle manufacturing requires minimal initial machinery'
    ]
  },
  {
    id: 'val_cabbage',
    cropName: 'Cabbage',
    category: 'Vegetable',
    image: '/crops/cabbage.jpg',
    productsCanBeMade: ['Dehydrated Cabbage Flakes', 'Probiotic Sauerkraut / Cabbage Pickle', 'IQF Shredded Frozen Cabbage'],
    productsSummary: 'Dehydrated cabbage; cabbage pickle; frozen cabbage',
    estimatedMarginPercent: 32,
    marketDemand: 'HIGH',
    investmentLevel: 'MEDIUM',
    shelfLifeExtensionDays: 300,
    buyerProcessorName: 'Sahyadri Agro Dehydration Consortium',
    location: 'Nashik, Maharashtra',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=cabbage+processing+dehydration+products',
    youtubeKeywords: 'Industrial cabbage dehydration & flakes processing plant',
    whyRecommended: [
      'Dehydrated shredded cabbage is a core ingredient in instant noodle seasonings & soup packs',
      'Reduces bulky shipping volume by 92%, drastically cutting cold transport costs',
      'Probiotic fermentation generates high-value wellness food products'
    ]
  },
  {
    id: 'val_cauliflower',
    cropName: 'Cauliflower',
    category: 'Vegetable',
    image: '/crops/cauliflower.jpg',
    productsCanBeMade: ['Dehydrated Cauliflower Powder / Rice', 'Spiced Cauliflower Pickle', 'IQF Frozen Florets for HoReCa'],
    productsSummary: 'Dehydrated cauliflower; pickle; frozen cauliflower',
    estimatedMarginPercent: 35,
    marketDemand: 'VERY_HIGH',
    investmentLevel: 'MEDIUM',
    shelfLifeExtensionDays: 270,
    buyerProcessorName: 'Western Maharashtra Cold Chain & IQF Cluster',
    location: 'Manchar / Pune, Maharashtra',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=cauliflower+processing+dehydration+products',
    youtubeKeywords: 'Cauliflower IQF freezing & dehydration plant guide',
    whyRecommended: [
      'Low-carb keto cauliflower flour & rice are booming export commodities in North America & Europe',
      'IQF frozen florets eliminate seasonal price volatility and secure fixed hotel supply contracts',
      'Standardized automated grading and blanching minimize microbial spoilage'
    ]
  },
  {
    id: 'val_chana',
    cropName: 'Chana',
    category: 'Grain & Pulse',
    image: '/crops/chickpea.jpg',
    productsCanBeMade: ['Fine Gram Flour (Besan)', 'Roasted Spiced Chana (Namkeen)', 'Split Chana Dal', 'Extruded Protein Snacks'],
    productsSummary: 'Besan; roasted chana; chana dal; snacks',
    estimatedMarginPercent: 30,
    marketDemand: 'VERY_HIGH',
    investmentLevel: 'MEDIUM',
    shelfLifeExtensionDays: 365,
    buyerProcessorName: 'Artha Industries',
    phone: '0724-2259391 / +91 9422939890',
    email: 'customercare@arthaindustries.com',
    location: 'Akola / Thane, Maharashtra',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=chana+processing+besan+manufacturing',
    youtubeKeywords: 'Commercial besan manufacturing & chana dal mill setup',
    whyRecommended: [
      'Besan is an indispensable staple in Indian confectionery, snacks, and sweet manufacturing',
      'Direct pulse milling increases realization by 40% over raw farm-gate pod sales',
      'Packaged roasted chana enjoys 12-month shelf life with zero refrigeration requirement'
    ]
  },
  {
    id: 'val_chilli',
    cropName: 'Chilli',
    category: 'Spice & Oilseed',
    image: '/crops/chilli.jpg',
    productsCanBeMade: ['Standardized Chilli Powder (SHU Tested)', 'Dried Crushed Chilli Flakes', 'Hot Chilli Paste & Puree', 'Artisanal Hot Sauces & Oleoresin Capsaicin'],
    productsSummary: 'Chilli powder; flakes; paste; sauce',
    estimatedMarginPercent: 44,
    marketDemand: 'VERY_HIGH',
    investmentLevel: 'MEDIUM',
    shelfLifeExtensionDays: 365,
    buyerProcessorName: 'Nandurbar Spices & Oleoresin Processing Park',
    location: 'Nandurbar / Solapur, Maharashtra',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=chilli+processing+powder+flakes+sauce',
    youtubeKeywords: 'Red chilli grinding powder & hot sauce processing line',
    whyRecommended: [
      'Capsaicin oleoresin extraction commands high margins in pharmaceutical & food additive industries',
      'Crushed flakes for global pizzeria chains deliver consistent B2B contract revenue',
      'Vacuum-sealed spice powder packaging prevents color degradation and fetches export premiums'
    ]
  },
  {
    id: 'val_cotton',
    cropName: 'Cotton',
    category: 'Commercial & Cash',
    image: '/crops/cotton.jpg',
    productsCanBeMade: ['Spun Cotton Yarn (30s/40s count)', 'Refined Cottonseed Cooking Oil', 'High-Protein Cottonseed Cattle Cake (DOC)', 'Medical Absorbent Bleached Cotton'],
    productsSummary: 'Cotton yarn; cottonseed oil; cottonseed cake; textile fibre',
    estimatedMarginPercent: 38,
    marketDemand: 'VERY_HIGH',
    investmentLevel: 'HIGH',
    shelfLifeExtensionDays: 730,
    buyerProcessorName: 'Swarup Shetkari Producer Company Ltd.',
    phone: '+91 9421305555',
    email: 'deepakchavan5500@gmail.com',
    location: 'Aurangabad, Maharashtra',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=cotton+processing+yarn+cottonseed+oil',
    youtubeKeywords: 'Modern cotton ginning, yarn spinning & cottonseed oil extraction',
    whyRecommended: [
      'Ginning raw seed-cotton separates lint and seed, capturing dual revenue streams',
      'Cottonseed oil refining produces heart-healthy oil and premium livestock feed cake',
      'Direct FPC mill contracts bypass ginning middleman commissions of ₹400/Qtl'
    ]
  },
  {
    id: 'val_garlic',
    cropName: 'Garlic',
    category: 'Spice & Oilseed',
    image: '/crops/garlic.jpg',
    productsCanBeMade: ['Dehydrated Garlic Powder', 'Dehydrated Garlic Flakes & Minced Bits', 'Ginger-Garlic Paste (Pouch/Jar)', 'Aged Black Garlic & Garlic Oil Extract'],
    productsSummary: 'Garlic powder; flakes; paste; pickle',
    estimatedMarginPercent: 42,
    marketDemand: 'VERY_HIGH',
    investmentLevel: 'MEDIUM',
    shelfLifeExtensionDays: 365,
    buyerProcessorName: 'MahaAgri Garlic Dehydration Park',
    location: 'Ahmednagar / Nashik, Maharashtra',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=garlic+processing+powder+flakes+paste',
    youtubeKeywords: 'Garlic peeling, dehydration powder & paste manufacturing plant',
    whyRecommended: [
      'Ginger-garlic paste is the fastest-growing packaged kitchen condiment in urban Indian households',
      'Garlic powder has perennial B2B demand from snack seasoning and seasoning manufacturers',
      'Black garlic fermentation creates an ultra-premium gourmet delicacy selling at ₹2,500/kg'
    ]
  },
  {
    id: 'val_ginger',
    cropName: 'Ginger',
    category: 'Spice & Oilseed',
    image: '/crops/ginger.jpg',
    productsCanBeMade: ['Dry Ginger Powder (Sunth)', 'Crystallized Ginger Candy', 'Ginger-Garlic Paste & Puree', 'Ginger Essential Oil & Oleoresin Extract'],
    productsSummary: 'Ginger powder; dried ginger; paste; candy',
    estimatedMarginPercent: 40,
    marketDemand: 'HIGH',
    investmentLevel: 'MEDIUM',
    shelfLifeExtensionDays: 365,
    buyerProcessorName: 'Konkan & Satara Zingiber Processing Consortium',
    location: 'Satara / Kolhapur, Maharashtra',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=ginger+processing+powder+paste+candy',
    youtubeKeywords: 'Ginger processing, sunth powder & ginger candy manufacturing',
    whyRecommended: [
      'Sunth (dry ginger powder) is in high demand for Ayurvedic formulations and tea masalas',
      'Ginger candy manufacturing converts fibrous low-grade rhizomes into high-margin confectioneries',
      'Oleoresin extraction commands high export value across Europe & Middle East'
    ]
  },
  {
    id: 'val_grapes',
    cropName: 'Grapes',
    category: 'Fruit',
    image: '/crops/grapes.jpg',
    productsCanBeMade: ['Golden & Brown Raisins (Bedana)', 'Clarified Grape Juice Concentrate', 'Grape Seed Oil (Cosmetic & Culinary)', 'Natural Grape Vinegar (Balsamic/Cider)'],
    productsSummary: 'Raisins; grape juice; concentrate; vinegar',
    estimatedMarginPercent: 46,
    marketDemand: 'VERY_HIGH',
    investmentLevel: 'MEDIUM',
    shelfLifeExtensionDays: 365,
    buyerProcessorName: 'Neelay Agro Infra Pvt. Ltd.',
    phone: '+91 98606 11653',
    email: 'sagar.girase@neelaygroup.com',
    location: 'Amravati, Maharashtra',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=grape+processing+raisins+juice+concentrate',
    youtubeKeywords: 'Grape drying bedana raisin processing & juice concentration',
    whyRecommended: [
      'Converting fresh Thomson grapes into Bedana (raisins) boosts shelf-life to 12 months and protects against sudden rain damage',
      'Grape juice concentrate is utilized in beverage, pharmaceutical syrup, and bakery industries',
      'Grape seed byproduct oil fetches ₹1,800/litre in luxury skincare cosmetics'
    ]
  },
  {
    id: 'val_groundnut',
    cropName: 'Groundnut',
    category: 'Spice & Oilseed',
    image: '/crops/groundnut.jpg',
    productsCanBeMade: ['Cold-Pressed Virgin Groundnut Oil (Wood Churn)', 'Creamy & Crunchy Peanut Butter', 'Roasted Salted Cocktail Peanuts', 'Jaggery Peanut Chikki / Energy Bars'],
    productsSummary: 'Groundnut oil; peanut butter; roasted peanuts; chikki',
    estimatedMarginPercent: 38,
    marketDemand: 'VERY_HIGH',
    investmentLevel: 'MEDIUM',
    shelfLifeExtensionDays: 270,
    buyerProcessorName: 'Western Maharashtra Oil & Confectionery Plants',
    location: 'Solapur / Sangli, Maharashtra',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=groundnut+processing+oil+peanut+butter+chikki',
    youtubeKeywords: 'Cold pressed peanut oil & peanut butter automated processing line',
    whyRecommended: [
      'Wood-pressed (Lakdi Ghani) cold-pressed oil commands up to ₹320/litre in retail health markets',
      'Peanut butter is growing at 22% CAGR driven by fitness and gym nutrition trends in India',
      'Traditional Chikki manufacturing requires low capital outlay and delivers rapid inventory turnover'
    ]
  },
  {
    id: 'val_jowar',
    cropName: 'Jowar',
    category: 'Grain & Pulse',
    image: '/crops/maize.jpg',
    productsCanBeMade: ['Millet Sorghum Bhakri Flour', 'Crispy Jowar Flakes / Poha', 'Ready-to-Cook Millet Dosa / Idli Mix', 'Extruded Gluten-Free Roasted Puffs'],
    productsSummary: 'Jowar flour; bhakri flour; flakes; ready mixes',
    estimatedMarginPercent: 34,
    marketDemand: 'VERY_HIGH',
    investmentLevel: 'LOW',
    shelfLifeExtensionDays: 240,
    buyerProcessorName: 'Artha Industries',
    phone: '0724-2259391 / +91 9422939890',
    email: 'customercare@arthaindustries.com',
    location: 'Akola / Thane, Maharashtra',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=jowar+flour+processing+manufacturing',
    youtubeKeywords: 'Sorghum jowar flour milling & extruded millet snacks plant',
    whyRecommended: [
      'Supported by National Millet Mission (Shree Anna) with institutional government procurement',
      'Gluten-free roasted sorghum puffs compete directly with fried snacks in healthy snacking segment',
      'Pre-mix bhakri flour commands a 70% retail premium over raw farm-gate grain'
    ]
  },
  {
    id: 'val_lemon',
    cropName: 'Lemon',
    category: 'Fruit',
    image: '/crops/lemon.jpg',
    productsCanBeMade: ['Pasteurized Lemon Juice Concentrate', 'Traditional Sweet & Sour Lemon Pickle', 'Ready-to-Serve Lemon Squash / Cordial', 'Lemon Peel Pectin & Essential Oil'],
    productsSummary: 'Lemon juice; pickle; concentrate; squash',
    estimatedMarginPercent: 38,
    marketDemand: 'HIGH',
    investmentLevel: 'LOW',
    shelfLifeExtensionDays: 365,
    buyerProcessorName: 'Ahmednagar & Solapur Citrus Agro Processing',
    location: 'Ahmednagar / Solapur, Maharashtra',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=lemon+processing+juice+concentrate+squash',
    youtubeKeywords: 'Lemon juice extraction, squash bottling & pickle processing',
    whyRecommended: [
      'Prevents spoilage during summer gluts when lemon prices drop at market yards',
      'Concentrated citrus juice is used across commercial bakeries, beverages, and restaurants',
      'Lemon peel waste yields cold-pressed lemon oil used in natural fragrances and cleaners'
    ]
  },
  {
    id: 'val_corn',
    cropName: 'Corn',
    category: 'Grain & Pulse',
    image: '/crops/maize.jpg',
    productsCanBeMade: ['Maize Starch & Dextrose', 'Corn Flakes Breakfast Cereal', 'Corn Grits & Polenta Flour', 'High-Yield Cattle & Poultry Feed Mash'],
    productsSummary: 'Corn flour; starch; flakes; popcorn; snacks',
    estimatedMarginPercent: 33,
    marketDemand: 'VERY_HIGH',
    investmentLevel: 'HIGH',
    shelfLifeExtensionDays: 365,
    buyerProcessorName: 'Swarup Shetkari Producer Company Ltd.',
    phone: '+91 9421305555',
    email: 'deepakchavan5500@gmail.com',
    location: 'Aurangabad, Maharashtra',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=corn+processing+flour+starch+flakes',
    youtubeKeywords: 'Corn wet milling, starch extraction & cornflakes manufacturing plant',
    whyRecommended: [
      'Industrial corn starch is essential for paper, textile sizing, and pharmaceutical tablet binding',
      'Corn grit extraction supplies multinational snack food manufacturers (e.g. Kurkure, nachos)',
      'High-energy feed mash has guaranteed off-take from dairy and poultry farm clusters'
    ]
  },
  {
    id: 'val_mango',
    cropName: 'Mango',
    category: 'Fruit',
    image: '/crops/mango.jpg',
    productsCanBeMade: ['Aseptic Alphonso / Kesar Mango Pulp', 'Clarified Mango RTS Juice & Nectar', 'Traditional Aam Papad (Mango Leather)', 'Spiced Raw Mango Pickle & Amchur Powder'],
    productsSummary: 'Mango pulp; juice; pickle; aam papad; dried mango',
    estimatedMarginPercent: 48,
    marketDemand: 'VERY_HIGH',
    investmentLevel: 'MEDIUM',
    shelfLifeExtensionDays: 540,
    buyerProcessorName: 'Ratnagiri & Konkan Hapus Processing Consortium',
    location: 'Ratnagiri / Sindhudurg, Maharashtra',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=mango+processing+pulp+juice+aam+papad',
    youtubeKeywords: 'Aseptic mango pulp canning & aam papad dehydration line',
    whyRecommended: [
      'Aseptic pulp in 215kg drums is the #1 exported processed fruit commodity from India to Middle East & UK',
      'Protects orchards against localized distress sales caused by heatwaves and fruit flies',
      'Aam Papad manufacturing provides employment and yields 50%+ gross margins in festive seasons'
    ]
  },
  {
    id: 'val_mustard',
    cropName: 'Mustard',
    category: 'Spice & Oilseed',
    image: '/crops/mustard.jpg',
    productsCanBeMade: ['Cold-Pressed Kachi Ghani Mustard Oil', 'Whole & Ground Mustard Paste (Kasundi)', 'Yellow & Brown Mustard Spice Powder', 'High-Protein De-Oiled Mustard Meal'],
    productsSummary: 'Mustard oil; powder; paste; condiment',
    estimatedMarginPercent: 32,
    marketDemand: 'HIGH',
    investmentLevel: 'MEDIUM',
    shelfLifeExtensionDays: 365,
    buyerProcessorName: 'Artha Industries',
    phone: '0724-2259391 / +91 9422939890',
    email: 'customercare@arthaindustries.com',
    location: 'Akola / Thane, Maharashtra',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=mustard+oil+processing+manufacturing',
    youtubeKeywords: 'Kachi ghani mustard oil expelling & kasundi paste plant',
    whyRecommended: [
      'Cold-pressed Kachi Ghani mustard oil with pungent allyl isothiocyanate sells at high premium',
      'Kasundi sauce & prepared mustard pastes enjoy high retail foodservice margins',
      'De-oiled cake is an essential organic bio-fertilizer and cattle feed supplement'
    ]
  },
  {
    id: 'val_pomegranate',
    cropName: 'Pomegranate',
    category: 'Fruit',
    image: '/crops/pomegranate.jpg',
    productsCanBeMade: ['Modified Atmosphere (MAP) Packaged Fresh Arils', 'Cold-Pressed 100% Pure Pomegranate Juice', 'Anardana (Dried Pomegranate Seeds)', 'Pomegranate Peel Polyphenol Extract Powder'],
    productsSummary: 'Arils; juice; concentrate; anardana; peel powder',
    estimatedMarginPercent: 45,
    marketDemand: 'VERY_HIGH',
    investmentLevel: 'MEDIUM',
    shelfLifeExtensionDays: 240,
    buyerProcessorName: 'Neelay Agro Infra Pvt. Ltd.',
    phone: '+91 98606 11653',
    email: 'sagar.girase@neelaygroup.com',
    location: 'Amravati, Maharashtra',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=pomegranate+processing+arils+juice+concentrate',
    youtubeKeywords: 'Pomegranate aril de-seeding & cold pressed juice bottling line',
    whyRecommended: [
      'Pre-packaged fresh arils (200g cups) sell in metro supermarkets at 4x raw farm-gate price',
      'Anardana spice provides high utilization for small or blemished fruit that cannot be sold fresh',
      'Pomegranate peel extract has high nutraceutical demand for anti-aging supplements'
    ]
  },
  {
    id: 'val_potato',
    cropName: 'Potato',
    category: 'Vegetable',
    image: '/crops/potato.jpg',
    productsCanBeMade: ['Kettle-Cooked Potato Chips & Crisps', 'Frozen French Fries & Hash Browns', 'Dehydrated Potato Flakes & Granules', 'Refined Potato Starch & Farina'],
    productsSummary: 'Potato chips; French fries; flakes; starch; dehydrated potato',
    estimatedMarginPercent: 36,
    marketDemand: 'VERY_HIGH',
    investmentLevel: 'HIGH',
    shelfLifeExtensionDays: 365,
    buyerProcessorName: 'Pune & Manchar Cold Chain & Agro Processing Unit',
    location: 'Manchar / Pune, Maharashtra',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=potato+processing+chips+french+fries+flakes',
    youtubeKeywords: 'Automated potato chips & frozen french fries processing plant',
    whyRecommended: [
      'Chips and french fries processing locks in long-term procurement contracts with fast-food chains',
      'Dehydrated potato flakes are used widely in bakery, extruded snacks, and instant aloo mash',
      'Reduces storage rot losses in standard dry warehouses during monsoon'
    ]
  },
  {
    id: 'val_red_onion',
    cropName: 'Red Onion',
    category: 'Vegetable',
    image: '/crops/red_onion.jpg',
    productsCanBeMade: ['Dehydrated Toasted Onion Flakes (Kibbled)', 'Fine Red Onion Powder', 'Sterilized Onion Paste & Puree', 'Fried Crispy Biryani Shallots (Barista)'],
    productsSummary: 'Dehydrated onion; onion powder; flakes; paste',
    estimatedMarginPercent: 44,
    marketDemand: 'VERY_HIGH',
    investmentLevel: 'MEDIUM',
    shelfLifeExtensionDays: 365,
    buyerProcessorName: 'Bhavarth Farmer Producer Company',
    email: 'contact@bhavarthfpc.in',
    location: 'Nashik / Maharashtra',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=onion+dehydration+powder+flakes+processing',
    youtubeKeywords: 'Commercial onion dehydration, kibbled flakes & powder plant',
    whyRecommended: [
      'Eliminates up to 35% physiological weight loss and rot during peak summer harvest storage',
      'Dehydrated kibbled onion is a massive export commodity to Europe, Russia, and the Americas',
      'Fried crispy onions (Barista) fetch up to ₹450/kg from restaurant chains and cloud kitchens'
    ]
  },
  {
    id: 'val_rice',
    cropName: 'Rice',
    category: 'Grain & Pulse',
    image: '/crops/rice.jpg',
    productsCanBeMade: ['Flattened Rice Flakes (Poha / Aval)', 'Fine Steamed Rice Flour (Idiyappam / Modak)', 'Crispy Puffed Rice (Murmura)', 'Refined Rice Bran Oil (Oryzanol Rich)'],
    productsSummary: 'Rice flour; puffed rice; poha; rice flakes; bran oil',
    estimatedMarginPercent: 30,
    marketDemand: 'VERY_HIGH',
    investmentLevel: 'MEDIUM',
    shelfLifeExtensionDays: 365,
    buyerProcessorName: 'Bhandara & Gondia Modern Rice Mills Consortium',
    location: 'Gondia / Bhandara, Maharashtra',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=rice+processing+poha+rice+flour+puffed+rice',
    youtubeKeywords: 'Poha manufacturing plant & rice bran oil solvent extraction',
    whyRecommended: [
      'Poha (flattened rice) is a daily breakfast staple across Maharashtra, MP, and Gujarat',
      'Rice bran byproduct oil rich in gamma-oryzanol sells at premium as heart-friendly cooking oil',
      'Puffed rice and modak flour command steady year-round cash flow'
    ]
  },
  {
    id: 'val_soybean',
    cropName: 'Soybean',
    category: 'Grain & Pulse',
    image: '/crops/soybean.jpg',
    productsCanBeMade: ['Refined Soy Cooking Oil', 'Non-Dairy Soy Milk & Fresh Tofu (Soy Paneer)', 'Defatted Soy Flour & TVP Soy Chunks (Bari)', 'Soy Protein Isolate (SPI)'],
    productsSummary: 'Soybean oil; soy milk; tofu; soy flour; soy protein',
    estimatedMarginPercent: 37,
    marketDemand: 'VERY_HIGH',
    investmentLevel: 'HIGH',
    shelfLifeExtensionDays: 365,
    buyerProcessorName: 'Purna Kelna Producer Company Ltd.',
    phone: '+91 9922111384',
    email: 'vijaymhaske1234@gmail.com',
    location: 'Jalna, Maharashtra',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=soybean+processing+oil+tofu+soy+milk',
    youtubeKeywords: 'Soy milk, tofu making & soybean oil solvent extraction plant',
    whyRecommended: [
      'Tofu (soy paneer) has a 45%+ gross margin and replaces high-cost dairy paneer in institutional catering',
      'Textured Vegetable Protein (TVP Soy Chunks) is an affordable source of protein with huge market reach',
      'Solvent extraction plants yield high export revenue for De-Oiled Cake (DOC) animal feeds'
    ]
  },
  {
    id: 'val_sugarcane',
    cropName: 'Sugarcane',
    category: 'Commercial & Cash',
    image: '/crops/sugarcane.jpg',
    productsCanBeMade: ['Organic Chemical-Free Jaggery (Gur Cubes/Powder)', 'Liquid Jaggery (Kakvi)', 'Bagasse Tableware (Bio-Degradable Plates/Boxes)', 'Cold-Pressed Hygienic Bottled Sugarcane Juice'],
    productsSummary: 'Sugar; jaggery; liquid jaggery; molasses; bagasse products',
    estimatedMarginPercent: 41,
    marketDemand: 'VERY_HIGH',
    investmentLevel: 'MEDIUM',
    shelfLifeExtensionDays: 365,
    buyerProcessorName: 'Kolhapur & Sangli Jaggery Cluster',
    location: 'Kolhapur / Sangli, Maharashtra',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=sugarcane+processing+jaggery+sugar+bagasse',
    youtubeKeywords: 'Automated chemical-free jaggery plant & bagasse tableware manufacturing',
    whyRecommended: [
      'Organic jaggery powder sells at ₹80-120/kg in retail packaging vs ₹38/kg white refined sugar',
      'Kakvi (liquid jaggery) has medicinal Ayurvedic value and steady export off-take',
      'Bagasse tableware directly replaces banned single-use plastics in food delivery'
    ]
  },
  {
    id: 'val_tomato',
    cropName: 'Tomato',
    category: 'Vegetable',
    image: '/crops/tomato.jpg',
    productsCanBeMade: ['Concentrated Tomato Paste (28-30° Brix)', 'Commercial Tomato Puree (12-14° Brix)', 'Table Ketchup & Pizza-Pasta Sauces', 'Dehydrated Tomato Powder & Sun-Dried Slices'],
    productsSummary: 'Tomato puree; ketchup; sauce; paste; tomato powder',
    estimatedMarginPercent: 46,
    marketDemand: 'VERY_HIGH',
    investmentLevel: 'MEDIUM',
    shelfLifeExtensionDays: 365,
    buyerProcessorName: 'Bhavarth Farmer Producer Company',
    email: 'contact@bhavarthfpc.in',
    location: 'Maharashtra',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=tomato+processing+puree+ketchup+paste+powder',
    youtubeKeywords: 'Tomato paste, aseptic puree & ketchup processing plant machinery',
    whyRecommended: [
      'Eliminates tomato dumping during market price crashes (₹2-3/kg at farm gate)',
      'Tomato paste is a key bulk raw material for multinational QSRs, FMCG brands, and hotel chains',
      'Tomato powder extends shelf life to 12 months with zero cold storage electrical cost'
    ]
  },
  {
    id: 'val_tur',
    cropName: 'Tur',
    category: 'Grain & Pulse',
    image: '/crops/pigeon_pea.jpg',
    productsCanBeMade: ['Polished & Unpolished Split Tur Dal', 'Roasted Spiced Tur Pulse Snacks', 'Tur Dal Flour (Pulse Flour)', 'Instant Ready-to-Cook Dal Mixes'],
    productsSummary: 'Tur dal; split pigeon pea; flour; roasted snacks',
    estimatedMarginPercent: 32,
    marketDemand: 'VERY_HIGH',
    investmentLevel: 'MEDIUM',
    shelfLifeExtensionDays: 365,
    buyerProcessorName: 'Swarup Shetkari Producer Company Ltd.',
    phone: '+91 9421305555',
    email: 'deepakchavan5500@gmail.com',
    location: 'Aurangabad, Maharashtra',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=tur+dal+pigeon+pea+processing',
    youtubeKeywords: 'Mini dal mill setup & modern tur dal processing machine',
    whyRecommended: [
      'Tur dal is India’s most widely consumed staple pulse with consistent daily household consumption',
      'Mini Dal Mills at village/FPC level retain 30% more margin than selling un-milled raw pods',
      'Unpolished organic dal commands 25% price premium in Tier-1 city markets'
    ]
  },
  {
    id: 'val_turmeric',
    cropName: 'Turmeric',
    category: 'Spice & Oilseed',
    image: '/crops/turmeric.jpg',
    productsCanBeMade: ['High-Curcumin (>4.5%) Pure Turmeric Powder', 'Turmeric Oleoresin & Curcumin Extract (95%)', 'Fresh Turmeric Ginger Immune Shots / Paste', 'Golden Milk (Haldi Doodh) Ready Mixes'],
    productsSummary: 'Turmeric powder; oleoresin; extract; paste; tea',
    estimatedMarginPercent: 48,
    marketDemand: 'VERY_HIGH',
    investmentLevel: 'MEDIUM',
    shelfLifeExtensionDays: 730,
    buyerProcessorName: 'Artha Industries',
    phone: '0724-2259391 / +91 9422939890',
    email: 'customercare@arthaindustries.com',
    location: 'Akola / Thane, Maharashtra',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=turmeric+processing+powder+oleoresin',
    youtubeKeywords: 'Turmeric polishing, grinding & curcumin extraction plant',
    whyRecommended: [
      'Curcumin extract (95% purity) sells at up to ₹4,500/kg in pharmaceutical and wellness export markets',
      'Sangli and Waigaon GI-tagged turmeric fetches strong export buyer premiums',
      'Polished and packaged finger turmeric has a 2-year shelf life with high price stability'
    ]
  },
  {
    id: 'val_wheat',
    cropName: 'Wheat',
    category: 'Grain & Pulse',
    image: '/crops/wheat.jpg',
    productsCanBeMade: ['Chakki Whole Wheat Atta (Stone-Ground)', 'Refined Flour (Maida) & Semolina (Suji/Rava)', 'High-Fiber Wheat Bran Supplements', 'Pasta, Macaroni & Bakery Biscuits'],
    productsSummary: 'Atta; maida; suji/rava; bran; biscuits; pasta',
    estimatedMarginPercent: 29,
    marketDemand: 'VERY_HIGH',
    investmentLevel: 'MEDIUM',
    shelfLifeExtensionDays: 365,
    buyerProcessorName: 'Bhavarth Farmer Producer Company',
    email: 'contact@bhavarthfpc.in',
    location: 'Maharashtra',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=wheat+processing+atta+maida+suji+pasta',
    youtubeKeywords: 'Commercial flour mill (Chakki Atta) & pasta processing line',
    whyRecommended: [
      'Stone-ground Chakki Atta with intact bran is a high-volume non-perishable consumer staple',
      'Suji and Rava milling produces consistent demand from confectionery and breakfast food makers',
      'Wheat bran byproduct is an essential high-fiber dairy livestock feed'
    ]
  },
];
