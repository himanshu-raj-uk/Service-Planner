export type TouristPlace = {
  name: string;
  slug: string;
  description?: string;
  tags?: string[];
};

export type IndiaRegion = {
  name: string;
  slug: string;
  type: "state" | "union-territory";
  capital: string;
  touristPlaces: TouristPlace[];
};

const place = (
  name: string,
  slug: string,
  tags: string[] = [],
  description = "",
): TouristPlace => ({
  name,
  slug,
  tags,
  ...(description ? { description } : {}),
});

export const INDIAN_STATES: IndiaRegion[] = [
  {
    name: "Andhra Pradesh",
    slug: "andhra-pradesh",
    type: "state",
    capital: "Amaravati",
    touristPlaces: [
      place("Visakhapatnam", "visakhapatnam", ["beach", "city"]),
      place("Tirupati", "tirupati", ["temple", "pilgrimage"]),
      place("Vijayawada", "vijayawada", ["city", "temple"]),
      place("Araku Valley", "araku-valley", ["hills", "nature"]),
      place("Lepakshi", "lepakshi", ["heritage", "temple"]),
      place("Srisailam", "srisailam", ["temple", "nature"]),
      place("Rajahmundry", "rajahmundry", ["city", "river"]),
      place("Kurnool", "kurnool", ["heritage", "nature"]),
    ],
  },
  {
    name: "Arunachal Pradesh",
    slug: "arunachal-pradesh",
    type: "state",
    capital: "Itanagar",
    touristPlaces: [
      place("Tawang", "tawang", ["mountains", "monastery"]),
      place("Itanagar", "itanagar", ["city", "nature"]),
      place("Ziro Valley", "ziro-valley", ["valley", "nature"]),
      place("Bomdila", "bomdila", ["mountains", "nature"]),
      place("Dirang", "dirang", ["mountains", "hot-springs"]),
      place("Sela Pass", "sela-pass", ["mountains", "scenic"]),
      place("Namdapha National Park", "namdapha-national-park", ["wildlife", "nature"]),
      place("Pasighat", "pasighat", ["nature", "river"]),
    ],
  },
  {
    name: "Assam",
    slug: "assam",
    type: "state",
    capital: "Dispur",
    touristPlaces: [
      place("Guwahati", "guwahati", ["city", "temple"]),
      place("Kaziranga National Park", "kaziranga-national-park", ["wildlife", "nature"]),
      place("Majuli", "majuli", ["island", "culture"]),
      place("Sivasagar", "sivasagar", ["heritage", "history"]),
      place("Manas National Park", "manas-national-park", ["wildlife", "nature"]),
      place("Tezpur", "tezpur", ["heritage", "nature"]),
      place("Jorhat", "jorhat", ["tea", "culture"]),
      place("Dibrugarh", "dibrugarh", ["tea", "city"]),
    ],
  },
  {
    name: "Bihar",
    slug: "bihar",
    type: "state",
    capital: "Patna",
    touristPlaces: [
      place("Patna", "patna", ["city", "history"]),
      place("Bodh Gaya", "bodh-gaya", ["buddhist", "pilgrimage"]),
      place("Nalanda", "nalanda", ["heritage", "history"]),
      place("Rajgir", "rajgir", ["heritage", "pilgrimage"]),
      place("Vaishali", "vaishali", ["heritage", "pilgrimage"]),
      place("Pawapuri", "pawapuri", ["jain", "pilgrimage"]),
      place("Valmiki National Park", "valmiki-national-park", ["wildlife", "nature"]),
    ],
  },
  {
    name: "Chhattisgarh",
    slug: "chhattisgarh",
    type: "state",
    capital: "Raipur",
    touristPlaces: [
      place("Raipur", "raipur", ["city"]),
      place("Jagdalpur", "jagdalpur", ["nature", "culture"]),
      place("Chitrakote Falls", "chitrakote-falls", ["waterfall", "nature"]),
      place("Tirathgarh Falls", "tirathgarh-falls", ["waterfall", "nature"]),
      place("Kanger Valley National Park", "kanger-valley-national-park", ["wildlife", "nature"]),
      place("Bhoramdeo", "bhoramdeo", ["temple", "heritage"]),
      place("Mainpat", "mainpat", ["hills", "nature"]),
    ],
  },
  {
    name: "Goa",
    slug: "goa",
    type: "state",
    capital: "Panaji",
    touristPlaces: [
      place("Panaji", "panaji", ["city", "heritage"]),
      place("Calangute", "calangute", ["beach", "nightlife"]),
      place("Baga", "baga", ["beach", "nightlife"]),
      place("Anjuna", "anjuna", ["beach", "nightlife"]),
      place("Vagator", "vagator", ["beach", "sunset"]),
      place("Palolem", "palolem", ["beach", "nature"]),
      place("Old Goa", "old-goa", ["heritage", "churches"]),
      place("Dudhsagar Falls", "dudhsagar-falls", ["waterfall", "nature"]),
    ],
  },
  {
    name: "Gujarat",
    slug: "gujarat",
    type: "state",
    capital: "Gandhinagar",
    touristPlaces: [
      place("Ahmedabad", "ahmedabad", ["city", "heritage"]),
      place("Gandhinagar", "gandhinagar", ["city"]),
      place("Statue of Unity", "statue-of-unity", ["landmark", "heritage"]),
      place("Gir National Park", "gir-national-park", ["wildlife", "nature"]),
      place("Dwarka", "dwarka", ["temple", "pilgrimage"]),
      place("Somnath", "somnath", ["temple", "pilgrimage"]),
      place("Rann of Kutch", "rann-of-kutch", ["desert", "nature"]),
      place("Diu", "diu", ["beach", "heritage"]),
      place("Patan", "patan", ["heritage", "history"]),
    ],
  },
  {
    name: "Haryana",
    slug: "haryana",
    type: "state",
    capital: "Chandigarh",
    touristPlaces: [
      place("Gurugram", "gurugram", ["city", "shopping"]),
      place("Kurukshetra", "kurukshetra", ["heritage", "pilgrimage"]),
      place("Panipat", "panipat", ["history", "heritage"]),
      place("Morni Hills", "morni-hills", ["hills", "nature"]),
      place("Sultanpur National Park", "sultanpur-national-park", ["wildlife", "nature"]),
      place("Pinjore Gardens", "pinjore-gardens", ["garden", "heritage"]),
    ],
  },
  {
    name: "Himachal Pradesh",
    slug: "himachal-pradesh",
    type: "state",
    capital: "Shimla",
    touristPlaces: [
      place("Shimla", "shimla", ["mountains", "hill-station"]),
      place("Manali", "manali", ["mountains", "adventure"]),
      place("Dharamshala", "dharamshala", ["mountains", "culture"]),
      place("McLeod Ganj", "mcleod-ganj", ["mountains", "buddhist"]),
      place("Kasol", "kasol", ["mountains", "trekking"]),
      place("Spiti Valley", "spiti-valley", ["mountains", "adventure"]),
      place("Kasauli", "kasauli", ["mountains", "hill-station"]),
      place("Dalhousie", "dalhousie", ["mountains", "hill-station"]),
      place("Kullu", "kullu", ["mountains", "nature"]),
    ],
  },
  {
    name: "Jharkhand",
    slug: "jharkhand",
    type: "state",
    capital: "Ranchi",
    touristPlaces: [
      place("Ranchi", "ranchi", ["city", "waterfall"]),
      place("Deoghar", "deoghar", ["temple", "pilgrimage"]),
      place("Netarhat", "netarhat", ["hills", "nature"]),
      place("Betla National Park", "betla-national-park", ["wildlife", "nature"]),
      place("Hundru Falls", "hundru-falls", ["waterfall", "nature"]),
      place("Dassam Falls", "dassam-falls", ["waterfall", "nature"]),
      place("Jamshedpur", "jamshedpur", ["city", "nature"]),
    ],
  },
  {
    name: "Karnataka",
    slug: "karnataka",
    type: "state",
    capital: "Bengaluru",
    touristPlaces: [
      place("Bengaluru", "bengaluru", ["city", "technology"]),
      place("Mysuru", "mysuru", ["heritage", "palace"]),
      place("Hampi", "hampi", ["heritage", "history"]),
      place("Coorg", "coorg", ["hills", "nature"]),
      place("Gokarna", "gokarna", ["beach", "temple"]),
      place("Chikmagalur", "chikmagalur", ["hills", "coffee"]),
      place("Udupi", "udupi", ["temple", "beach"]),
      place("Badami", "badami", ["heritage", "caves"]),
      place("Kabini", "kabini", ["wildlife", "nature"]),
      place("Jog Falls", "jog-falls", ["waterfall", "nature"]),
    ],
  },
  {
    name: "Kerala",
    slug: "kerala",
    type: "state",
    capital: "Thiruvananthapuram",
    touristPlaces: [
      place("Thiruvananthapuram", "thiruvananthapuram", ["city", "beach"]),
      place("Kochi", "kochi", ["city", "heritage"]),
      place("Munnar", "munnar", ["hills", "tea"]),
      place("Alappuzha", "alappuzha", ["backwaters", "nature"]),
      place("Kovalam", "kovalam", ["beach", "nature"]),
      place("Thekkady", "thekkady", ["wildlife", "nature"]),
      place("Varkala", "varkala", ["beach", "cliffs"]),
      place("Wayanad", "wayanad", ["hills", "wildlife"]),
      place("Kumarakom", "kumarakom", ["backwaters", "nature"]),
    ],
  },
  {
    name: "Madhya Pradesh",
    slug: "madhya-pradesh",
    type: "state",
    capital: "Bhopal",
    touristPlaces: [
      place("Bhopal", "bhopal", ["city", "lakes"]),
      place("Indore", "indore", ["city", "food"]),
      place("Ujjain", "ujjain", ["temple", "pilgrimage"]),
      place("Khajuraho", "khajuraho", ["heritage", "temples"]),
      place("Gwalior", "gwalior", ["fort", "heritage"]),
      place("Sanchi", "sanchi", ["buddhist", "heritage"]),
      place("Pachmarhi", "pachmarhi", ["hills", "nature"]),
      place("Kanha National Park", "kanha-national-park", ["wildlife", "nature"]),
      place("Bandhavgarh National Park", "bandhavgarh-national-park", ["wildlife", "nature"]),
      place("Orchha", "orchha", ["heritage", "history"]),
    ],
  },
  {
    name: "Maharashtra",
    slug: "maharashtra",
    type: "state",
    capital: "Mumbai",
    touristPlaces: [
      place("Mumbai", "mumbai", ["city", "beach"]),
      place("Pune", "pune", ["city", "heritage"]),
      place("Lonavala", "lonavala", ["hills", "nature"]),
      place("Mahabaleshwar", "mahabaleshwar", ["hills", "nature"]),
      place("Nashik", "nashik", ["temple", "wine"]),
      place("Aurangabad", "aurangabad", ["heritage", "history"]),
      place("Ajanta Caves", "ajanta-caves", ["heritage", "caves"]),
      place("Ellora Caves", "ellora-caves", ["heritage", "caves"]),
      place("Alibaug", "alibaug", ["beach", "nature"]),
      place("Tadoba-Andhari Tiger Reserve", "tadoba-andhari-tiger-reserve", ["wildlife", "nature"]),
    ],
  },
  {
    name: "Manipur",
    slug: "manipur",
    type: "state",
    capital: "Imphal",
    touristPlaces: [
      place("Imphal", "imphal", ["city", "culture"]),
      place("Loktak Lake", "loktak-lake", ["lake", "nature"]),
      place("Keibul Lamjao National Park", "keibul-lamjao-national-park", ["wildlife", "nature"]),
      place("Moirang", "moirang", ["heritage", "culture"]),
      place("Ukhrul", "ukhrul", ["hills", "nature"]),
    ],
  },
  {
    name: "Meghalaya",
    slug: "meghalaya",
    type: "state",
    capital: "Shillong",
    touristPlaces: [
      place("Shillong", "shillong", ["hills", "city"]),
      place("Cherrapunji", "cherrapunji", ["waterfalls", "nature"]),
      place("Mawsynram", "mawsynram", ["nature", "hills"]),
      place("Dawki", "dawki", ["river", "nature"]),
      place("Mawlynnong", "mawlynnong", ["village", "nature"]),
      place("Nongriat", "nongriat", ["trekking", "nature"]),
      place("Jowai", "jowai", ["hills", "nature"]),
    ],
  },
  {
    name: "Mizoram",
    slug: "mizoram",
    type: "state",
    capital: "Aizawl",
    touristPlaces: [
      place("Aizawl", "aizawl", ["hills", "city"]),
      place("Lunglei", "lunglei", ["hills", "nature"]),
      place("Champhai", "champhai", ["hills", "nature"]),
      place("Phawngpui", "phawngpui", ["mountains", "nature"]),
      place("Reiek", "reiek", ["mountains", "nature"]),
    ],
  },
  {
    name: "Nagaland",
    slug: "nagaland",
    type: "state",
    capital: "Kohima",
    touristPlaces: [
      place("Kohima", "kohima", ["hills", "culture"]),
      place("Dimapur", "dimapur", ["city", "heritage"]),
      place("Dzukou Valley", "dzukou-valley", ["valley", "trekking"]),
      place("Mokokchung", "mokokchung", ["hills", "culture"]),
      place("Mon", "mon", ["culture", "nature"]),
    ],
  },
  {
    name: "Odisha",
    slug: "odisha",
    type: "state",
    capital: "Bhubaneswar",
    touristPlaces: [
      place("Bhubaneswar", "bhubaneswar", ["temple", "city"]),
      place("Puri", "puri", ["beach", "temple"]),
      place("Konark", "konark", ["heritage", "temple"]),
      place("Chilika Lake", "chilika-lake", ["lake", "nature"]),
      place("Cuttack", "cuttack", ["heritage", "city"]),
      place("Gopalpur", "gopalpur", ["beach", "nature"]),
      place("Similipal National Park", "similipal-national-park", ["wildlife", "nature"]),
      place("Daringbadi", "daringbadi", ["hills", "nature"]),
    ],
  },
  {
    name: "Punjab",
    slug: "punjab",
    type: "state",
    capital: "Chandigarh",
    touristPlaces: [
      place("Amritsar", "amritsar", ["heritage", "pilgrimage"]),
      place("Golden Temple", "golden-temple", ["pilgrimage", "heritage"]),
      place("Jallianwala Bagh", "jallianwala-bagh", ["history", "heritage"]),
      place("Wagah Border", "wagah-border", ["culture", "landmark"]),
      place("Patiala", "patiala", ["heritage", "culture"]),
      place("Anandpur Sahib", "anandpur-sahib", ["pilgrimage", "heritage"]),
      place("Ludhiana", "ludhiana", ["city", "shopping"]),
    ],
  },
  {
    name: "Rajasthan",
    slug: "rajasthan",
    type: "state",
    capital: "Jaipur",
    touristPlaces: [
      place("Jaipur", "jaipur", ["heritage", "city"]),
      place("Udaipur", "udaipur", ["lakes", "heritage"]),
      place("Jodhpur", "jodhpur", ["fort", "heritage"]),
      place("Jaisalmer", "jaisalmer", ["desert", "heritage"]),
      place("Pushkar", "pushkar", ["pilgrimage", "culture"]),
      place("Ajmer", "ajmer", ["pilgrimage", "heritage"]),
      place("Mount Abu", "mount-abu", ["hills", "nature"]),
      place("Ranthambore National Park", "ranthambore-national-park", ["wildlife", "nature"]),
      place("Bikaner", "bikaner", ["heritage", "desert"]),
      place("Chittorgarh", "chittorgarh", ["fort", "history"]),
    ],
  },
  {
    name: "Sikkim",
    slug: "sikkim",
    type: "state",
    capital: "Gangtok",
    touristPlaces: [
      place("Gangtok", "gangtok", ["mountains", "city"]),
      place("Pelling", "pelling", ["mountains", "nature"]),
      place("Nathula Pass", "nathula-pass", ["mountains", "scenic"]),
      place("Tsomgo Lake", "tsomgo-lake", ["lake", "mountains"]),
      place("Lachung", "lachung", ["mountains", "nature"]),
      place("Lachen", "lachen", ["mountains", "nature"]),
      place("Yuksom", "yuksom", ["trekking", "heritage"]),
    ],
  },
  {
    name: "Tamil Nadu",
    slug: "tamil-nadu",
    type: "state",
    capital: "Chennai",
    touristPlaces: [
      place("Chennai", "chennai", ["city", "beach"]),
      place("Ooty", "ooty", ["hills", "hill-station"]),
      place("Kodaikanal", "kodaikanal", ["hills", "nature"]),
      place("Madurai", "madurai", ["temple", "heritage"]),
      place("Rameswaram", "rameswaram", ["temple", "pilgrimage"]),
      place("Mahabalipuram", "mahabalipuram", ["heritage", "beach"]),
      place("Kanyakumari", "kanyakumari", ["beach", "landmark"]),
      place("Thanjavur", "thanjavur", ["heritage", "temple"]),
      place("Coimbatore", "coimbatore", ["city", "nature"]),
      place("Pondicherry", "pondicherry", ["beach", "heritage"]),
    ],
  },
  {
    name: "Telangana",
    slug: "telangana",
    type: "state",
    capital: "Hyderabad",
    touristPlaces: [
      place("Hyderabad", "hyderabad", ["city", "heritage"]),
      place("Warangal", "warangal", ["heritage", "temple"]),
      place("Nagarjuna Sagar", "nagarjuna-sagar", ["nature", "heritage"]),
      place("Bhongir", "bhongir", ["fort", "adventure"]),
      place("Vemulawada", "vemulawada", ["temple", "pilgrimage"]),
      place("Adilabad", "adilabad", ["waterfalls", "nature"]),
      place("Medak", "medak", ["heritage", "nature"]),
    ],
  },
  {
    name: "Tripura",
    slug: "tripura",
    type: "state",
    capital: "Agartala",
    touristPlaces: [
      place("Agartala", "agartala", ["city", "heritage"]),
      place("Ujjayanta Palace", "ujjayanta-palace", ["heritage", "palace"]),
      place("Neermahal", "neermahal", ["palace", "heritage"]),
      place("Unakoti", "unakoti", ["heritage", "sculptures"]),
      place("Jampui Hills", "jampui-hills", ["hills", "nature"]),
    ],
  },
  {
    name: "Uttar Pradesh",
    slug: "uttar-pradesh",
    type: "state",
    capital: "Lucknow",
    touristPlaces: [
      place("Lucknow", "lucknow", ["heritage", "city"]),
      place("Agra", "agra", ["heritage", "monument"]),
      place("Varanasi", "varanasi", ["pilgrimage", "heritage"]),
      place("Ayodhya", "ayodhya", ["pilgrimage", "heritage"]),
      place("Mathura", "mathura", ["pilgrimage", "heritage"]),
      place("Vrindavan", "vrindavan", ["pilgrimage", "temple"]),
      place("Prayagraj", "prayagraj", ["pilgrimage", "heritage"]),
      place("Sarnath", "sarnath", ["buddhist", "heritage"]),
      place("Fatehpur Sikri", "fatehpur-sikri", ["heritage", "history"]),
      place("Jhansi", "jhansi", ["fort", "history"]),
    ],
  },
  {
    name: "Uttarakhand",
    slug: "uttarakhand",
    type: "state",
    capital: "Dehradun",
    touristPlaces: [
      place("Dehradun", "dehradun", ["city", "nature"]),
      place("Mussoorie", "mussoorie", ["hills", "hill-station"]),
      place("Nainital", "nainital", ["lake", "hill-station"]),
      place("Rishikesh", "rishikesh", ["adventure", "pilgrimage"]),
      place("Haridwar", "haridwar", ["pilgrimage", "heritage"]),
      place("Jim Corbett National Park", "jim-corbett-national-park", ["wildlife", "nature"]),
      place("Kedarnath", "kedarnath", ["pilgrimage", "mountains"]),
      place("Badrinath", "badrinath", ["pilgrimage", "mountains"]),
      place("Auli", "auli", ["mountains", "skiing"]),
      place("Valley of Flowers", "valley-of-flowers", ["trekking", "nature"]),
    ],
  },
  {
    name: "West Bengal",
    slug: "west-bengal",
    type: "state",
    capital: "Kolkata",
    touristPlaces: [
      place("Kolkata", "kolkata", ["city", "heritage"]),
      place("Darjeeling", "darjeeling", ["mountains", "tea"]),
      place("Siliguri", "siliguri", ["city", "nature"]),
      place("Sundarbans", "sundarbans", ["wildlife", "nature"]),
      place("Kalimpong", "kalimpong", ["hills", "nature"]),
      place("Digha", "digha", ["beach", "nature"]),
      place("Shantiniketan", "shantiniketan", ["culture", "heritage"]),
      place("Murshidabad", "murshidabad", ["heritage", "history"]),
    ],
  },
];

export const UNION_TERRITORIES: IndiaRegion[] = [
  {
    name: "Andaman and Nicobar Islands",
    slug: "andaman-and-nicobar-islands",
    type: "union-territory",
    capital: "Sri Vijaya Puram",
    touristPlaces: [
      place("Sri Vijaya Puram", "sri-vijaya-puram", ["city", "islands"]),
      place("Swaraj Dweep", "swaraj-dweep", ["island", "beach"]),
      place("Shaheed Dweep", "shaheed-dweep", ["island", "beach"]),
      place("Baratang Island", "baratang-island", ["island", "nature"]),
      place("Radhanagar Beach", "radhanagar-beach", ["beach", "island"]),
      place("Cellular Jail", "cellular-jail", ["history", "heritage"]),
      place("North Bay Island", "north-bay-island", ["island", "water-sports"]),
    ],
  },
  {
    name: "Chandigarh",
    slug: "chandigarh",
    type: "union-territory",
    capital: "Chandigarh",
    touristPlaces: [
      place("Rock Garden", "rock-garden-chandigarh", ["garden", "art"]),
      place("Sukhna Lake", "sukhna-lake", ["lake", "nature"]),
      place("Rose Garden", "rose-garden-chandigarh", ["garden", "nature"]),
      place("Capitol Complex", "capitol-complex-chandigarh", ["heritage", "architecture"]),
      place("Zakir Hussain Rose Garden", "zakir-hussain-rose-garden", ["garden", "nature"]),
    ],
  },
  {
    name: "Dadra and Nagar Haveli and Daman and Diu",
    slug: "dadra-and-nagar-haveli-and-daman-and-diu",
    type: "union-territory",
    capital: "Daman",
    touristPlaces: [
      place("Daman", "daman", ["beach", "heritage"]),
      place("Diu", "diu-ut", ["beach", "heritage"]),
      place("Silvassa", "silvassa", ["nature", "city"]),
      place("Devka Beach", "devka-beach", ["beach", "nature"]),
      place("Nagoa Beach", "nagoa-beach-diu", ["beach", "nature"]),
      place("Diu Fort", "diu-fort", ["fort", "heritage"]),
    ],
  },
  {
    name: "Delhi",
    slug: "delhi",
    type: "union-territory",
    capital: "New Delhi",
    touristPlaces: [
      place("New Delhi", "new-delhi", ["city", "heritage"]),
      place("Red Fort", "red-fort-delhi", ["heritage", "history"]),
      place("India Gate", "india-gate", ["landmark", "heritage"]),
      place("Qutub Minar", "qutub-minar", ["heritage", "history"]),
      place("Humayun's Tomb", "humayuns-tomb", ["heritage", "history"]),
      place("Lotus Temple", "lotus-temple", ["architecture", "landmark"]),
      place("Akshardham", "akshardham-delhi", ["temple", "heritage"]),
      place("Chandni Chowk", "chandni-chowk", ["shopping", "food"]),
    ],
  },
  {
    name: "Jammu and Kashmir",
    slug: "jammu-and-kashmir",
    type: "union-territory",
    capital: "Srinagar",
    touristPlaces: [
      place("Srinagar", "srinagar", ["lake", "mountains"]),
      place("Gulmarg", "gulmarg", ["mountains", "skiing"]),
      place("Pahalgam", "pahalgam", ["mountains", "nature"]),
      place("Sonamarg", "sonamarg", ["mountains", "nature"]),
      place("Jammu", "jammu", ["temple", "city"]),
      place("Vaishno Devi", "vaishno-devi", ["pilgrimage", "mountains"]),
      place("Doodhpathri", "doodhpathri", ["valley", "nature"]),
      place("Patnitop", "patnitop", ["mountains", "nature"]),
    ],
  },
  {
    name: "Ladakh",
    slug: "ladakh",
    type: "union-territory",
    capital: "Leh",
    touristPlaces: [
      place("Leh", "leh", ["mountains", "city"]),
      place("Nubra Valley", "nubra-valley", ["valley", "mountains"]),
      place("Pangong Lake", "pangong-lake", ["lake", "mountains"]),
      place("Khardung La", "khardung-la", ["mountains", "scenic"]),
      place("Tso Moriri", "tso-moriri", ["lake", "nature"]),
      place("Diskit", "diskit", ["monastery", "mountains"]),
      place("Alchi", "alchi", ["heritage", "monastery"]),
    ],
  },
  {
    name: "Lakshadweep",
    slug: "lakshadweep",
    type: "union-territory",
    capital: "Kavaratti",
    touristPlaces: [
      place("Kavaratti", "kavaratti", ["island", "beach"]),
      place("Agatti Island", "agatti-island", ["island", "beach"]),
      place("Bangaram Island", "bangaram-island", ["island", "beach"]),
      place("Kadmat Island", "kadmat-island", ["island", "water-sports"]),
      place("Kalpeni", "kalpeni", ["island", "beach"]),
      place("Minicoy", "minicoy", ["island", "beach"]),
    ],
  },
  {
    name: "Puducherry",
    slug: "puducherry",
    type: "union-territory",
    capital: "Puducherry",
    touristPlaces: [
      place("Puducherry", "puducherry", ["beach", "heritage"]),
      place("Auroville", "auroville", ["culture", "architecture"]),
      place("Promenade Beach", "promenade-beach", ["beach", "city"]),
      place("Paradise Beach", "paradise-beach-puducherry", ["beach", "nature"]),
      place("French Quarter", "french-quarter-puducherry", ["heritage", "architecture"]),
      place("Chunnambar", "chunnambar", ["beach", "nature"]),
    ],
  },
];

export const INDIA_REGIONS: IndiaRegion[] = [
  ...INDIAN_STATES,
  ...UNION_TERRITORIES,
];

export const ALL_TOURIST_PLACES = INDIA_REGIONS.flatMap((region) =>
  region.touristPlaces.map((touristPlace) => ({
    ...touristPlace,
    state: region.name,
    capital: region.capital,
    regionType: region.type,
  })),
);

export const STATE_AND_CAPITALS = INDIA_REGIONS.map((region) => ({
  name: region.name,
  slug: region.slug,
  type: region.type,
  capital: region.capital,
}));

export const POPULAR_DESTINATIONS = [
  "Delhi",
  "Agra",
  "Jaipur",
  "Udaipur",
  "Jaisalmer",
  "Manali",
  "Shimla",
  "Goa",
  "Mumbai",
  "Kerala",
  "Munnar",
  "Rishikesh",
  "Varanasi",
  "Ayodhya",
  "Amritsar",
  "Darjeeling",
  "Gangtok",
  "Leh",
  "Srinagar",
  "Andaman and Nicobar Islands",
] as const;

export function normalizePlaceName(value: string): string {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getRegionByName(
  name: string,
): IndiaRegion | undefined {
  const normalized = normalizePlaceName(name);

  return INDIA_REGIONS.find(
    (region) => normalizePlaceName(region.name) === normalized,
  );
}

export function getCapitalByRegion(
  name: string,
): string | undefined {
  return getRegionByName(name)?.capital;
}

export function getPopularPlaces(
  regionName: string,
): TouristPlace[] {
  return getRegionByName(regionName)?.touristPlaces ?? [];
}

export function searchTouristPlaces(
  query: string,
  limit = 12,
) {
  const normalizedQuery = normalizePlaceName(query);

  if (!normalizedQuery) {
    return ALL_TOURIST_PLACES.slice(0, limit);
  }

  const words = normalizedQuery.split(" ");

  return ALL_TOURIST_PLACES
    .map((item) => {
      const searchable = normalizePlaceName(
        `${item.name} ${item.state} ${item.capital} ${(item.tags || []).join(" ")}`,
      );

      let score = 0;

      if (searchable === normalizedQuery) score += 100;
      if (normalizePlaceName(item.name) === normalizedQuery) score += 90;
      if (normalizePlaceName(item.state) === normalizedQuery) score += 80;
      if (normalizePlaceName(item.capital) === normalizedQuery) score += 70;
      if (searchable.startsWith(normalizedQuery)) score += 50;

      for (const word of words) {
        if (searchable.includes(word)) score += 10;
      }

      return { ...item, score };
    })
    .filter((item) => item.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.name.localeCompare(b.name),
    )
    .slice(0, limit);
}

export function getRegionPlacesAndCapital(regionName: string) {
  const region = getRegionByName(regionName);

  if (!region) {
    return undefined;
  }

  return {
    name: region.name,
    capital: region.capital,
    type: region.type,
    touristPlaces: region.touristPlaces,
  };
}

export default INDIA_REGIONS;
