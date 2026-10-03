export type TouristPlace = {
  name: string;
  slug: string;
  description?: string;
  tags?: string[];
};

export type SubDistrict = {
  name: string;
  slug: string;
  code?: string;
};

export type IndiaDistrict = {
  name: string;
  slug: string;
  code?: string;
  subDistricts: SubDistrict[];
};

export type IndiaRegion = {
  name: string;
  slug: string;
  type: "state" | "union-territory";
  capital: string;
  cities: string[];
  districts: IndiaDistrict[];
  touristPlaces: TouristPlace[];
  pincodePrefixes: string[];
};

export type StateAndCapital = {
  name: string;
  slug: string;
  capital: string;
  type: "state" | "union-territory";
};

export type PincodeRange = {
  prefix: string;
  description?: string;
};

const LGD_SUBDISTRICT_CSV_URL =
  "https://gist.githubusercontent.com/planemad/b2195c7feb506f8436659f36da1e58af/raw/india-subdistricts-lgd.csv";

const regionMeta: Record<
  string,
  { capital: string; type: "state" | "union-territory" }
> = {
  "Andhra Pradesh": { capital: "Amaravati", type: "state" },
  "Arunachal Pradesh": { capital: "Itanagar", type: "state" },
  Assam: { capital: "Dispur", type: "state" },
  Bihar: { capital: "Patna", type: "state" },
  Chhattisgarh: { capital: "Raipur", type: "state" },
  Goa: { capital: "Panaji", type: "state" },
  Gujarat: { capital: "Gandhinagar", type: "state" },
  Haryana: { capital: "Chandigarh", type: "state" },
  "Himachal Pradesh": { capital: "Shimla", type: "state" },
  Jharkhand: { capital: "Ranchi", type: "state" },
  Karnataka: { capital: "Bengaluru", type: "state" },
  Kerala: { capital: "Thiruvananthapuram", type: "state" },
  "Madhya Pradesh": { capital: "Bhopal", type: "state" },
  Maharashtra: { capital: "Mumbai", type: "state" },
  Manipur: { capital: "Imphal", type: "state" },
  Meghalaya: { capital: "Shillong", type: "state" },
  Mizoram: { capital: "Aizawl", type: "state" },
  Nagaland: { capital: "Kohima", type: "state" },
  Odisha: { capital: "Bhubaneswar", type: "state" },
  Punjab: { capital: "Chandigarh", type: "state" },
  Rajasthan: { capital: "Jaipur", type: "state" },
  Sikkim: { capital: "Gangtok", type: "state" },
  "Tamil Nadu": { capital: "Chennai", type: "state" },
  Telangana: { capital: "Hyderabad", type: "state" },
  Tripura: { capital: "Agartala", type: "state" },
  "Uttar Pradesh": { capital: "Lucknow", type: "state" },
  Uttarakhand: { capital: "Dehradun", type: "state" },
  "West Bengal": { capital: "Kolkata", type: "state" },
  "Andaman and Nicobar Islands": {
    capital: "Port Blair",
    type: "union-territory",
  },
  Chandigarh: { capital: "Chandigarh", type: "union-territory" },
  "Dadra and Nagar Haveli and Daman and Diu": {
    capital: "Daman",
    type: "union-territory",
  },
  Delhi: { capital: "New Delhi", type: "union-territory" },
  "Jammu and Kashmir": { capital: "Srinagar", type: "union-territory" },
  Ladakh: { capital: "Leh", type: "union-territory" },
  Lakshadweep: { capital: "Kavaratti", type: "union-territory" },
  Puducherry: { capital: "Puducherry", type: "union-territory" },
};

export const INDIA_PINCODE_PREFIXES: Record<string, string[]> = {
  "Andhra Pradesh": ["51", "52", "53"],
  "Arunachal Pradesh": ["79"],
  Assam: ["78"],
  Bihar: ["80", "81", "82", "84", "85"],
  Chhattisgarh: ["49"],
  Goa: ["40"],
  Gujarat: ["36", "37", "38", "39"],
  Haryana: ["12", "13"],
  "Himachal Pradesh": ["17"],
  Jharkhand: ["81", "82", "83", "84"],
  Karnataka: ["56", "57", "58", "59"],
  Kerala: ["67", "68", "69"],
  "Madhya Pradesh": ["45", "46", "47", "48"],
  Maharashtra: ["40", "41", "42", "43", "44"],
  Manipur: ["79"],
  Meghalaya: ["79"],
  Mizoram: ["79"],
  Nagaland: ["79"],
  Odisha: ["75", "76", "77", "78"],
  Punjab: ["14", "15", "16"],
  Rajasthan: ["30", "31", "32", "33", "34"],
  Sikkim: ["73"],
  "Tamil Nadu": ["60", "61", "62", "63", "64"],
  Telangana: ["50", "51"],
  Tripura: ["79"],
  "Uttar Pradesh": ["20", "21", "22", "24", "25", "26", "27", "28"],
  Uttarakhand: ["24", "26"],
  "West Bengal": ["70", "71", "72", "73", "74"],
  "Andaman and Nicobar Islands": ["74"],
  Chandigarh: ["16"],
  "Dadra and Nagar Haveli and Daman and Diu": ["39"],
  Delhi: ["11"],
  "Jammu and Kashmir": ["18", "19"],
  Ladakh: ["19"],
  Lakshadweep: ["67", "68"],
  Puducherry: ["60", "61"],
};

const touristLocationGroups = [
  {
    state: "Andhra Pradesh",
    city: "Visakhapatnam",
    places: ["Visakhapatnam", "Araku Valley", "Borra Caves"],
  },
  {
    state: "Andhra Pradesh",
    city: "Tirupati",
    places: ["Tirupati", "Tirumala", "Sri Venkateswara Temple"],
  },
  {
    state: "Arunachal Pradesh",
    city: "Tawang",
    places: [
      "Tawang",
      "Tawang Monastery",
      "Sela Pass",
      "Bum La Pass",
      "Dirang",
      "Bomdila",
      "Ziro",
      "Itanagar",
    ],
  },
  {
    state: "Assam",
    city: "Guwahati",
    places: ["Guwahati", "Kamakhya Temple"],
  },
  {
    state: "Assam",
    city: "Kaziranga",
    places: ["Kaziranga National Park", "Majuli", "Jorhat"],
  },
  {
    state: "Bihar",
    city: "Gaya",
    places: ["Gaya", "Bodh Gaya", "Mahabodhi Temple"],
  },
  {
    state: "Bihar",
    city: "Patna",
    places: ["Patna", "Nalanda", "Rajgir", "Vaishali"],
  },
  {
    state: "Chhattisgarh",
    city: "Jagdalpur",
    places: [
      "Jagdalpur",
      "Chitrakote Falls",
      "Tirathgarh Falls",
      "Kanger Valley National Park",
    ],
  },
  {
    state: "Goa",
    city: "North Goa",
    places: [
      "North Goa",
      "Calangute",
      "Baga",
      "Anjuna",
      "Vagator",
      "Candolim",
      "Fort Aguada",
    ],
  },
  {
    state: "Goa",
    city: "South Goa",
    places: [
      "South Goa",
      "Palolem",
      "Colva",
      "Benaulim",
      "Agonda",
      "Dudhsagar Falls",
    ],
  },
  {
    state: "Gujarat",
    city: "Ahmedabad",
    places: ["Ahmedabad", "Sabarmati Ashram", "Adalaj Stepwell"],
  },
  {
    state: "Gujarat",
    city: "Kutch",
    places: ["Kutch", "Rann of Kutch", "Dhordo", "Mandvi"],
  },
  {
    state: "Gujarat",
    city: "Dwarka",
    places: [
      "Dwarka",
      "Somnath",
      "Gir National Park",
      "Diu",
      "Statue of Unity",
      "Vadodara",
    ],
  },
  {
    state: "Haryana",
    city: "Gurugram",
    places: ["Gurugram", "Kurukshetra", "Panipat"],
  },
  {
    state: "Himachal Pradesh",
    city: "Shimla",
    places: ["Shimla", "Kufri", "Mashobra", "Chail", "Narkanda"],
  },
  {
    state: "Himachal Pradesh",
    city: "Manali",
    places: [
      "Manali",
      "Solang Valley",
      "Rohtang Pass",
      "Kasol",
      "Malana",
      "Naggar",
    ],
  },
  {
    state: "Himachal Pradesh",
    city: "Dharamshala",
    places: ["Dharamshala", "McLeod Ganj", "Triund", "Bir Billing", "Palampur"],
  },
  {
    state: "Himachal Pradesh",
    city: "Spiti",
    places: ["Spiti Valley", "Kaza", "Key Monastery", "Chandratal", "Kibber"],
  },
  {
    state: "Jammu and Kashmir",
    city: "Srinagar",
    places: [
      "Srinagar",
      "Dal Lake",
      "Gulmarg",
      "Pahalgam",
      "Sonamarg",
      "Doodhpathri",
    ],
  },
  {
    state: "Jharkhand",
    city: "Ranchi",
    places: [
      "Ranchi",
      "Hundru Falls",
      "Dassam Falls",
      "Netarhat",
      "Deoghar",
      "Betla National Park",
    ],
  },
  {
    state: "Karnataka",
    city: "Bengaluru",
    places: ["Bengaluru", "Nandi Hills", "Mysuru", "Coorg", "Chikmagalur"],
  },
  {
    state: "Karnataka",
    city: "Hampi",
    places: ["Hampi", "Badami", "Aihole", "Pattadakal"],
  },
  {
    state: "Karnataka",
    city: "Coastal Karnataka",
    places: [
      "Gokarna",
      "Udupi",
      "Mangalore",
      "Murudeshwar",
      "Jog Falls",
      "Dandeli",
    ],
  },
  {
    state: "Kerala",
    city: "Kochi",
    places: ["Kochi", "Fort Kochi", "Alappuzha", "Kumarakom"],
  },
  {
    state: "Kerala",
    city: "Munnar",
    places: ["Munnar", "Thekkady", "Vagamon", "Wayanad"],
  },
  {
    state: "Kerala",
    city: "Thiruvananthapuram",
    places: ["Thiruvananthapuram", "Kovalam", "Varkala", "Ponmudi"],
  },
  {
    state: "Madhya Pradesh",
    city: "Indore",
    places: ["Indore", "Ujjain", "Omkareshwar", "Mandu"],
  },
  {
    state: "Madhya Pradesh",
    city: "Bhopal",
    places: ["Bhopal", "Sanchi", "Bhimbetka", "Pachmarhi"],
  },
  {
    state: "Madhya Pradesh",
    city: "Khajuraho",
    places: [
      "Khajuraho",
      "Kanha National Park",
      "Bandhavgarh National Park",
      "Pench National Park",
    ],
  },
  {
    state: "Maharashtra",
    city: "Mumbai",
    places: [
      "Mumbai",
      "Gateway of India",
      "Marine Drive",
      "Elephanta Caves",
      "Juhu Beach",
      "Sanjay Gandhi National Park",
    ],
  },
  {
    state: "Maharashtra",
    city: "Pune",
    places: ["Pune", "Lonavala", "Khandala", "Lavasa", "Sinhagad Fort"],
  },
  {
    state: "Maharashtra",
    city: "Mahabaleshwar",
    places: ["Mahabaleshwar", "Panchgani", "Pratapgad Fort", "Kaas Plateau"],
  },
  {
    state: "Maharashtra",
    city: "Nashik",
    places: ["Nashik", "Igatpuri", "Bhandardara", "Trimbakeshwar"],
  },
  {
    state: "Maharashtra",
    city: "Aurangabad",
    places: ["Aurangabad", "Ajanta Caves", "Ellora Caves", "Daulatabad Fort"],
  },
  {
    state: "Manipur",
    city: "Imphal",
    places: ["Imphal", "Loktak Lake", "Keibul Lamjao National Park"],
  },
  {
    state: "Meghalaya",
    city: "Shillong",
    places: [
      "Shillong",
      "Cherrapunji",
      "Mawsynram",
      "Dawki",
      "Mawlynnong",
      "Nongriat",
    ],
  },
  {
    state: "Mizoram",
    city: "Aizawl",
    places: ["Aizawl", "Reiek", "Vantawng Falls"],
  },
  {
    state: "Nagaland",
    city: "Kohima",
    places: ["Kohima", "Dzukou Valley", "Mokokchung"],
  },
  {
    state: "Odisha",
    city: "Bhubaneswar",
    places: ["Bhubaneswar", "Puri", "Konark", "Chilika Lake"],
  },
  {
    state: "Odisha",
    city: "Simlipal",
    places: ["Simlipal National Park", "Gopalpur", "Baripada"],
  },
  {
    state: "Punjab",
    city: "Amritsar",
    places: ["Amritsar", "Golden Temple", "Jallianwala Bagh", "Wagah Border"],
  },
  {
    state: "Rajasthan",
    city: "Jaipur",
    places: [
      "Jaipur",
      "Hawa Mahal",
      "Amber Fort",
      "City Palace",
      "Jantar Mantar",
    ],
  },
  {
    state: "Rajasthan",
    city: "Udaipur",
    places: ["Udaipur", "City Palace Udaipur", "Lake Pichola", "Kumbhalgarh"],
  },
  {
    state: "Rajasthan",
    city: "Jodhpur",
    places: ["Jodhpur", "Mehrangarh Fort", "Umaid Bhawan Palace"],
  },
  {
    state: "Rajasthan",
    city: "Jaisalmer",
    places: ["Jaisalmer", "Sam Sand Dunes", "Jaisalmer Fort", "Khuri"],
  },
  {
    state: "Rajasthan",
    city: "Pushkar",
    places: [
      "Pushkar",
      "Ajmer",
      "Ranthambore",
      "Mount Abu",
      "Bundi",
      "Bikaner",
    ],
  },
  {
    state: "Sikkim",
    city: "Gangtok",
    places: [
      "Gangtok",
      "Tsomgo Lake",
      "Nathula Pass",
      "Pelling",
      "Lachung",
      "Yuksom",
    ],
  },
  {
    state: "Tamil Nadu",
    city: "Chennai",
    places: [
      "Chennai",
      "Marina Beach",
      "Mahabalipuram",
      "Pondicherry",
      "Kanchipuram",
    ],
  },
  {
    state: "Tamil Nadu",
    city: "Ooty",
    places: ["Ooty", "Coonoor", "Kotagiri", "Kodaikanal"],
  },
  {
    state: "Tamil Nadu",
    city: "Madurai",
    places: ["Madurai", "Rameswaram", "Kanyakumari", "Thanjavur"],
  },
  {
    state: "Telangana",
    city: "Hyderabad",
    places: ["Hyderabad", "Charminar", "Golconda Fort", "Ramoji Film City"],
  },
  {
    state: "Uttar Pradesh",
    city: "Agra",
    places: ["Agra", "Taj Mahal", "Agra Fort", "Fatehpur Sikri"],
  },
  {
    state: "Uttar Pradesh",
    city: "Varanasi",
    places: [
      "Varanasi",
      "Kashi Vishwanath Temple",
      "Sarnath",
      "Prayagraj",
      "Ayodhya",
    ],
  },
  {
    state: "Uttarakhand",
    city: "Nainital",
    places: ["Nainital", "Bhimtal", "Sattal", "Naukuchiatal", "Mukteshwar"],
  },
  {
    state: "Uttarakhand",
    city: "Mussoorie",
    places: ["Mussoorie", "Dhanaulti", "Landour", "Kanatal"],
  },
  {
    state: "Uttarakhand",
    city: "Rishikesh",
    places: [
      "Rishikesh",
      "Haridwar",
      "Rajaji National Park",
      "Neer Garh Waterfall",
    ],
  },
  {
    state: "Uttarakhand",
    city: "Kedarnath",
    places: [
      "Kedarnath",
      "Badrinath",
      "Valley of Flowers",
      "Auli",
      "Chopta",
      "Jim Corbett National Park",
    ],
  },
  {
    state: "West Bengal",
    city: "Kolkata",
    places: [
      "Kolkata",
      "Victoria Memorial",
      "Howrah Bridge",
      "Darjeeling",
      "Kalimpong",
    ],
  },
  {
    state: "West Bengal",
    city: "Darjeeling",
    places: ["Darjeeling", "Tiger Hill", "Siliguri", "Dooars", "Sundarbans"],
  },
  {
    state: "Andaman and Nicobar Islands",
    city: "Port Blair",
    places: [
      "Port Blair",
      "Swaraj Dweep (Havelock)",
      "Shaheed Dweep (Neil Island)",
      "Cellular Jail",
      "Radhanagar Beach",
    ],
  },
  {
    state: "Delhi",
    city: "New Delhi",
    places: [
      "New Delhi",
      "India Gate",
      "Red Fort",
      "Qutub Minar",
      "Humayun's Tomb",
      "Lotus Temple",
    ],
  },
  {
    state: "Ladakh",
    city: "Leh",
    places: [
      "Leh",
      "Nubra Valley",
      "Pangong Lake",
      "Khardung La",
      "Tso Moriri",
      "Lamayuru",
    ],
  },
  {
    state: "Puducherry",
    city: "Puducherry",
    places: ["Puducherry", "Auroville", "Promenade Beach", "Paradise Beach"],
  },
  {
    state: "Chandigarh",
    city: "Chandigarh",
    places: ["Chandigarh", "Rock Garden", "Sukhna Lake"],
  },
  {
    state: "Dadra and Nagar Haveli and Daman and Diu",
    city: "Daman",
    places: ["Daman", "Diu", "Silvassa", "Jampore Beach"],
  },
  {
    state: "Lakshadweep",
    city: "Lakshadweep",
    places: ["Lakshadweep", "Agatti", "Bangaram", "Kavaratti", "Minicoy"],
  },
] as const;

const regionCityData: Record<string, string[]> = {
  "Andhra Pradesh": [
    "Amaravati",
    "Visakhapatnam",
    "Vijayawada",
    "Tirupati",
    "Guntur",
    "Nellore",
    "Kurnool",
    "Rajahmundry",
    "Kakinada",
    "Kadapa",
    "Anantapur",
    "Eluru",
    "Ongole",
    "Srikakulam",
    "Vizianagaram",
    "Machilipatnam",
    "Chittoor",
    "Hindupur",
    "Tenali",
    "Proddatur",
    "Bhimavaram",
    "Nandyal",
    "Gudivada",
    "Madanapalle",
    "Araku Valley",
    "Tirumala",
  ],

  "Arunachal Pradesh": [
    "Itanagar",
    "Naharlagun",
    "Tawang",
    "Dirang",
    "Bomdila",
    "Ziro",
    "Pasighat",
    "Along",
    "Tezu",
    "Roing",
    "Namsai",
    "Daporijo",
    "Seppa",
    "Changlang",
    "Khonsa",
    "Yingkiong",
    "Bomjir",
  ],

  Assam: [
    "Dispur",
    "Guwahati",
    "Dibrugarh",
    "Jorhat",
    "Silchar",
    "Tinsukia",
    "Tezpur",
    "Nagaon",
    "Sivasagar",
    "Bongaigaon",
    "Dhubri",
    "Goalpara",
    "Barpeta",
    "North Lakhimpur",
    "Diphu",
    "Karimganj",
    "Hailakandi",
    "Golaghat",
    "Mangaldoi",
    "Haflong",
    "Majuli",
    "Kaziranga",
  ],

  Bihar: [
    "Patna",
    "Gaya",
    "Bodh Gaya",
    "Bhagalpur",
    "Muzaffarpur",
    "Purnia",
    "Darbhanga",
    "Arrah",
    "Begusarai",
    "Katihar",
    "Munger",
    "Chhapra",
    "Bettiah",
    "Saharsa",
    "Sasaram",
    "Hajipur",
    "Dehri",
    "Bihar Sharif",
    "Motihari",
    "Samastipur",
    "Sitamarhi",
    "Nalanda",
    "Rajgir",
    "Vaishali",
  ],

  Chhattisgarh: [
    "Raipur",
    "Bhilai",
    "Durg",
    "Bilaspur",
    "Korba",
    "Jagdalpur",
    "Rajnandgaon",
    "Raigarh",
    "Ambikapur",
    "Dhamtari",
    "Mahasamund",
    "Kanker",
    "Kawardha",
    "Dantewada",
    "Sukma",
    "Bastar",
  ],

  Goa: [
    "Panaji",
    "Panjim",
    "Vasco da Gama",
    "Margao",
    "Mapusa",
    "Ponda",
    "Calangute",
    "Baga",
    "Anjuna",
    "Vagator",
    "Candolim",
    "Palolem",
    "Colva",
    "Benaulim",
    "Agonda",
    "North Goa",
    "South Goa",
  ],

  Gujarat: [
    "Gandhinagar",
    "Ahmedabad",
    "Surat",
    "Vadodara",
    "Rajkot",
    "Bhavnagar",
    "Jamnagar",
    "Junagadh",
    "Gandhidham",
    "Anand",
    "Nadiad",
    "Bharuch",
    "Navsari",
    "Vapi",
    "Morbi",
    "Mehsana",
    "Palanpur",
    "Porbandar",
    "Bhuj",
    "Dwarka",
    "Somnath",
    "Diu",
    "Kutch",
    "Dhordo",
    "Mandvi",
  ],

  Haryana: [
    "Chandigarh",
    "Gurugram",
    "Faridabad",
    "Panipat",
    "Ambala",
    "Yamunanagar",
    "Rohtak",
    "Hisar",
    "Karnal",
    "Sonipat",
    "Panchkula",
    "Bhiwani",
    "Sirsa",
    "Rewari",
    "Palwal",
    "Jind",
    "Kaithal",
    "Kurukshetra",
    "Bahadurgarh",
    "Narnaul",
    "Fatehabad",
  ],

  "Himachal Pradesh": [
    "Shimla",
    "Dharamshala",
    "Manali",
    "Solan",
    "Mandi",
    "Kullu",
    "Bilaspur",
    "Hamirpur",
    "Una",
    "Chamba",
    "Nahan",
    "Kangra",
    "Kasauli",
    "Dalhousie",
    "Palampur",
    "McLeod Ganj",
    "Kasol",
    "Kufri",
    "Mashobra",
    "Chail",
    "Narkanda",
    "Kaza",
    "Keylong",
    "Spiti",
  ],

  Jharkhand: [
    "Ranchi",
    "Jamshedpur",
    "Dhanbad",
    "Bokaro",
    "Deoghar",
    "Hazaribagh",
    "Giridih",
    "Ramgarh",
    "Dumka",
    "Chaibasa",
    "Medininagar",
    "Garhwa",
    "Godda",
    "Sahibganj",
    "Pakur",
    "Latehar",
    "Lohardaga",
    "Simdega",
    "Gumla",
    "Netarhat",
  ],

  Karnataka: [
    "Bengaluru",
    "Mysuru",
    "Mangaluru",
    "Hubballi",
    "Dharwad",
    "Belagavi",
    "Kalaburagi",
    "Ballari",
    "Davangere",
    "Tumakuru",
    "Shivamogga",
    "Udupi",
    "Hassan",
    "Mandya",
    "Bidar",
    "Raichur",
    "Vijayapura",
    "Chitradurga",
    "Kolar",
    "Chikmagalur",
    "Coorg",
    "Madikeri",
    "Gokarna",
    "Hampi",
    "Badami",
    "Aihole",
    "Pattadakal",
    "Dandeli",
    "Murudeshwar",
  ],

  Kerala: [
    "Thiruvananthapuram",
    "Kochi",
    "Kozhikode",
    "Kollam",
    "Thrissur",
    "Kannur",
    "Alappuzha",
    "Palakkad",
    "Kottayam",
    "Malappuram",
    "Kasaragod",
    "Pathanamthitta",
    "Idukki",
    "Munnar",
    "Thekkady",
    "Varkala",
    "Kovalam",
    "Kumarakom",
    "Vagamon",
    "Wayanad",
    "Fort Kochi",
  ],

  "Madhya Pradesh": [
    "Bhopal",
    "Indore",
    "Jabalpur",
    "Gwalior",
    "Ujjain",
    "Sagar",
    "Dewas",
    "Satna",
    "Ratlam",
    "Rewa",
    "Murwara",
    "Singrauli",
    "Burhanpur",
    "Khandwa",
    "Bhind",
    "Chhindwara",
    "Shivpuri",
    "Vidisha",
    "Mandsaur",
    "Neemuch",
    "Khajuraho",
    "Mandu",
    "Omkareshwar",
    "Pachmarhi",
    "Sanchi",
  ],

  Maharashtra: [
    "Mumbai",
    "Pune",
    "Nagpur",
    "Nashik",
    "Thane",
    "Navi Mumbai",
    "Aurangabad",
    "Chhatrapati Sambhajinagar",
    "Solapur",
    "Kolhapur",
    "Amravati",
    "Nanded",
    "Jalgaon",
    "Akola",
    "Latur",
    "Ahmednagar",
    "Sangli",
    "Satara",
    "Ratnagiri",
    "Dhule",
    "Bhiwandi",
    "Vasai",
    "Virar",
    "Panvel",
    "Lonavala",
    "Khandala",
    "Mahabaleshwar",
    "Panchgani",
    "Igatpuri",
    "Bhandardara",
    "Nashik",
    "Trimbakeshwar",
  ],

  Manipur: [
    "Imphal",
    "Thoubal",
    "Bishnupur",
    "Churachandpur",
    "Ukhrul",
    "Senapati",
    "Tamenglong",
    "Kakching",
    "Moirang",
    "Loktak",
  ],

  Meghalaya: [
    "Shillong",
    "Tura",
    "Jowai",
    "Nongpoh",
    "Williamnagar",
    "Nongstoin",
    "Baghmara",
    "Cherrapunji",
    "Mawsynram",
    "Dawki",
    "Mawlynnong",
    "Nongriat",
  ],

  Mizoram: [
    "Aizawl",
    "Lunglei",
    "Champhai",
    "Kolasib",
    "Serchhip",
    "Lawngtlai",
    "Mamit",
    "Saiha",
    "Reiek",
  ],

  Nagaland: [
    "Kohima",
    "Dimapur",
    "Mokokchung",
    "Tuensang",
    "Wokha",
    "Mon",
    "Phek",
    "Zunheboto",
    "Kiphire",
    "Longleng",
    "Dzukou Valley",
  ],

  Odisha: [
    "Bhubaneswar",
    "Cuttack",
    "Rourkela",
    "Berhampur",
    "Sambalpur",
    "Puri",
    "Balasore",
    "Baripada",
    "Bhadrak",
    "Jharsuguda",
    "Bargarh",
    "Koraput",
    "Rayagada",
    "Balangir",
    "Angul",
    "Dhenkanal",
    "Jajpur",
    "Kendujhar",
    "Gopalpur",
    "Konark",
    "Chilika",
    "Simlipal",
  ],

  Punjab: [
    "Chandigarh",
    "Amritsar",
    "Ludhiana",
    "Jalandhar",
    "Patiala",
    "Bathinda",
    "Mohali",
    "Pathankot",
    "Hoshiarpur",
    "Batala",
    "Moga",
    "Firozpur",
    "Abohar",
    "Kapurthala",
    "Sangrur",
    "Barnala",
    "Khanna",
    "Phagwara",
    "Gurdaspur",
    "Faridkot",
  ],

  Rajasthan: [
    "Jaipur",
    "Jodhpur",
    "Udaipur",
    "Kota",
    "Bikaner",
    "Ajmer",
    "Alwar",
    "Bharatpur",
    "Bhilwara",
    "Sikar",
    "Sri Ganganagar",
    "Pali",
    "Barmer",
    "Churu",
    "Jhunjhunu",
    "Nagaur",
    "Tonk",
    "Bundi",
    "Jaisalmer",
    "Pushkar",
    "Mount Abu",
    "Ranthambore",
    "Kumbhalgarh",
    "Sam Sand Dunes",
  ],

  Sikkim: [
    "Gangtok",
    "Namchi",
    "Gyalshing",
    "Mangan",
    "Ravangla",
    "Pelling",
    "Lachung",
    "Lachen",
    "Yuksom",
    "Nathula",
  ],

  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Tiruchirappalli",
    "Salem",
    "Tiruppur",
    "Erode",
    "Vellore",
    "Thoothukudi",
    "Tirunelveli",
    "Dindigul",
    "Thanjavur",
    "Kanchipuram",
    "Nagercoil",
    "Cuddalore",
    "Karur",
    "Hosur",
    "Ooty",
    "Coonoor",
    "Kodaikanal",
    "Rameswaram",
    "Kanyakumari",
    "Mahabalipuram",
    "Puducherry",
  ],

  Telangana: [
    "Hyderabad",
    "Warangal",
    "Nizamabad",
    "Khammam",
    "Karimnagar",
    "Ramagundam",
    "Mahbubnagar",
    "Nalgonda",
    "Adilabad",
    "Suryapet",
    "Siddipet",
    "Mancherial",
    "Jagtial",
    "Vikarabad",
    "Kamareddy",
    "Medak",
    "Ramoji Film City",
  ],

  Tripura: [
    "Agartala",
    "Dharmanagar",
    "Udaipur",
    "Kailashahar",
    "Belonia",
    "Ambassa",
    "Khowai",
    "Sabroom",
  ],

  "Uttar Pradesh": [
    "Lucknow",
    "Kanpur",
    "Ghaziabad",
    "Agra",
    "Varanasi",
    "Prayagraj",
    "Meerut",
    "Noida",
    "Greater Noida",
    "Bareilly",
    "Aligarh",
    "Moradabad",
    "Saharanpur",
    "Gorakhpur",
    "Firozabad",
    "Jhansi",
    "Mathura",
    "Ayodhya",
    "Muzaffarnagar",
    "Rampur",
    "Shahjahanpur",
    "Farrukhabad",
    "Hapur",
    "Etawah",
    "Mirzapur",
    "Bulandshahr",
    "Basti",
    "Faizabad",
    "Vrindavan",
    "Sarnath",
  ],

  Uttarakhand: [
    "Dehradun",
    "Haridwar",
    "Rishikesh",
    "Haldwani",
    "Nainital",
    "Roorkee",
    "Rudrapur",
    "Kashipur",
    "Almora",
    "Pithoragarh",
    "Chamoli",
    "Uttarkashi",
    "Srinagar",
    "Bageshwar",
    "Champawat",
    "Mussoorie",
    "Dhanaulti",
    "Landour",
    "Auli",
    "Kedarnath",
    "Badrinath",
    "Chopta",
    "Joshimath",
    "Mukteshwar",
    "Bhimtal",
    "Sattal",
    "Naukuchiatal",
  ],

  "West Bengal": [
    "Kolkata",
    "Howrah",
    "Durgapur",
    "Asansol",
    "Siliguri",
    "Darjeeling",
    "Kharagpur",
    "Haldia",
    "Bardhaman",
    "Malda",
    "Jalpaiguri",
    "Raiganj",
    "Krishnanagar",
    "Berhampore",
    "Cooch Behar",
    "Kalimpong",
    "Dooars",
    "Sundarbans",
  ],

  "Andaman and Nicobar Islands": [
    "Port Blair",
    "Swaraj Dweep",
    "Havelock Island",
    "Shaheed Dweep",
    "Neil Island",
    "Diglipur",
    "Mayabunder",
    "Rangat",
    "Car Nicobar",
    "Campbell Bay",
  ],

  Chandigarh: [
    "Chandigarh",
    "Sector 1",
    "Sector 17",
    "Sector 22",
    "Sector 35",
    "Sector 43",
    "Manimajra",
    "Sukhna",
  ],

  "Dadra and Nagar Haveli and Daman and Diu": [
    "Daman",
    "Diu",
    "Silvassa",
    "Amli",
    "Naroli",
    "Khanvel",
    "Dudhni",
    "Jampore",
  ],

  Delhi: [
    "New Delhi",
    "Delhi",
    "Central Delhi",
    "North Delhi",
    "North East Delhi",
    "North West Delhi",
    "South Delhi",
    "South East Delhi",
    "South West Delhi",
    "West Delhi",
    "East Delhi",
    "Shahdara",
    "Old Delhi",
    "Connaught Place",
    "Karol Bagh",
    "Paharganj",
    "Civil Lines",
    "Model Town",
    "Pitampura",
    "Rohini",
    "Burari",
    "Bhalswa Jahangir Pur",
    "Kirari Suleman Nagar",
    "Karawal Nagar",
    "Sultan Pur Majra",
    "Nangloi Jat",
    "Bawana",
    "Narela",
    "Azadpur",
    "Shalimar Bagh",
    "Ashok Vihar",
    "Wazirpur",
    "Mukherjee Nagar",
    "GTB Nagar",
    "Kamla Nagar",
    "Patel Nagar",
    "Rajouri Garden",
    "Punjabi Bagh",
    "Janakpuri",
    "Tilak Nagar",
    "Dwarka",
    "Uttam Nagar",
    "Vikaspuri",
    "Paschim Vihar",
    "Hari Nagar",
    "Naraina",
    "Mayur Vihar",
    "Preet Vihar",
    "Laxmi Nagar",
    "Shahdara",
    "Vivek Vihar",
    "Anand Vihar",
    "Krishna Nagar",
    "Gandhi Nagar",
    "Seelampur",
    "Yamuna Vihar",
    "Mustafabad",
    "Jafrabad",
    "Welcome",
    "Greater Kailash",
    "Saket",
    "Hauz Khas",
    "Vasant Kunj",
    "Vasant Vihar",
    "Defence Colony",
    "Lajpat Nagar",
    "South Extension",
    "Green Park",
    "Malviya Nagar",
    "Mehrauli",
    "Chhatarpur",
    "Sangam Vihar",
    "Kalkaji",
    "Govindpuri",
    "Okhla",
    "Jasola",
    "Sarita Vihar",
    "New Friends Colony",
    "Jangpura",
    "Nizamuddin",
    "Daryaganj",
    "Chandni Chowk",
    "Kashmere Gate",
    "India Gate",
    "Chanakyapuri",
    "Diplomatic Enclave",
    "Lodhi Road",
    "Pragati Maidan",
  ],

  "Jammu and Kashmir": [
    "Srinagar",
    "Jammu",
    "Anantnag",
    "Baramulla",
    "Kathua",
    "Udhampur",
    "Sopore",
    "Kupwara",
    "Pulwama",
    "Rajouri",
    "Poonch",
    "Kishtwar",
    "Doda",
    "Budgam",
    "Ganderbal",
    "Bandipora",
    "Shopian",
    "Gulmarg",
    "Pahalgam",
    "Sonamarg",
    "Doodhpathri",
  ],

  Ladakh: [
    "Leh",
    "Kargil",
    "Nubra",
    "Diskit",
    "Hunder",
    "Pangong",
    "Tso Moriri",
    "Lamayuru",
    "Khardung",
    "Drass",
    "Zanskar",
  ],

  Lakshadweep: [
    "Kavaratti",
    "Agatti",
    "Bangaram",
    "Minicoy",
    "Kalpeni",
    "Andrott",
    "Amini",
    "Kadmat",
    "Kiltan",
    "Chetlat",
    "Bitra",
  ],

  Puducherry: [
    "Puducherry",
    "Auroville",
    "Karaikal",
    "Mahe",
    "Yanam",
    "White Town",
    "Promenade",
    "Lawspet",
    "Reddiarpalayam",
    "Oulgaret",
  ],
};

const touristPlaceMap: Record<string, TouristPlace[]> = {};

for (const group of touristLocationGroups) {
  const current = touristPlaceMap[group.state] || [];

  for (const name of group.places) {
    if (
      !current.some((place) => place.name.toLowerCase() === name.toLowerCase())
    ) {
      current.push({
        name,
        slug: normalizePlaceName(name),
      });
    }
  }

  touristPlaceMap[group.state] = current;
}

const getCitiesForRegion = (
  regionName: string,
  additionalCities: string[] = [],
): string[] => {
  const regionMetaData = regionMeta[regionName];

  const groupCities = touristLocationGroups
    .filter(
      (group) => group.state.toLowerCase() === regionName.trim().toLowerCase(),
    )
    .map((group) => group.city)
    .filter(Boolean);

  const staticCities = regionCityData[regionName] || [];

  const capital = regionMetaData?.capital || "";

  return Array.from(
    new Map(
      [capital, ...staticCities, ...groupCities, ...additionalCities]
        .map((city) => String(city || "").trim())
        .filter(Boolean)
        .map((city) => [city.toLowerCase(), city] as const),
    ).values(),
  ).sort((a, b) => a.localeCompare(b));
};

export const INDIAN_STATES: IndiaRegion[] = Object.entries(regionMeta)
  .filter(([, meta]) => meta.type === "state")
  .map(([name, meta]) => ({
    name,
    slug: normalizePlaceName(name),
    type: meta.type,
    capital: meta.capital,
    cities: getCitiesForRegion(name),
    districts: [],
    touristPlaces: touristPlaceMap[name] || [],
    pincodePrefixes: INDIA_PINCODE_PREFIXES[name] || [],
  }));

export const UNION_TERRITORIES: IndiaRegion[] = Object.entries(regionMeta)
  .filter(([, meta]) => meta.type === "union-territory")
  .map(([name, meta]) => ({
    name,
    slug: normalizePlaceName(name),
    type: meta.type,
    capital: meta.capital,
    cities: getCitiesForRegion(name),
    districts: [],
    touristPlaces: touristPlaceMap[name] || [],
    pincodePrefixes: INDIA_PINCODE_PREFIXES[name] || [],
  }));

export const INDIA_REGIONS: IndiaRegion[] = [
  ...INDIAN_STATES,
  ...UNION_TERRITORIES,
];

export const ALL_TOURIST_PLACES: TouristPlace[] = INDIA_REGIONS.flatMap(
  (region) => region.touristPlaces,
);

export const STATE_AND_CAPITALS: StateAndCapital[] = INDIA_REGIONS.map(
  ({ name, slug, capital, type }) => ({
    name,
    slug,
    capital,
    type,
  }),
);

export const POPULAR_DESTINATIONS: TouristPlace[] = [
  { name: "Visakhapatnam", slug: normalizePlaceName("Visakhapatnam") },
  { name: "Araku Valley", slug: normalizePlaceName("Araku Valley") },
  { name: "Tirupati", slug: normalizePlaceName("Tirupati") },
  { name: "Tirumala", slug: normalizePlaceName("Tirumala") },
  { name: "Tawang", slug: normalizePlaceName("Tawang") },
  { name: "Tawang Monastery", slug: normalizePlaceName("Tawang Monastery") },
  { name: "Guwahati", slug: normalizePlaceName("Guwahati") },
  { name: "Kamakhya Temple", slug: normalizePlaceName("Kamakhya Temple") },
  {
    name: "Kaziranga National Park",
    slug: normalizePlaceName("Kaziranga National Park"),
  },
  { name: "Majuli", slug: normalizePlaceName("Majuli") },
  { name: "Gaya", slug: normalizePlaceName("Gaya") },
  { name: "Bodh Gaya", slug: normalizePlaceName("Bodh Gaya") },
  { name: "Patna", slug: normalizePlaceName("Patna") },
  { name: "Nalanda", slug: normalizePlaceName("Nalanda") },
  { name: "Jagdalpur", slug: normalizePlaceName("Jagdalpur") },
  { name: "Chitrakote Falls", slug: normalizePlaceName("Chitrakote Falls") },
  { name: "North Goa", slug: normalizePlaceName("North Goa") },
  { name: "Calangute", slug: normalizePlaceName("Calangute") },
  { name: "South Goa", slug: normalizePlaceName("South Goa") },
  { name: "Palolem", slug: normalizePlaceName("Palolem") },
  { name: "Ahmedabad", slug: normalizePlaceName("Ahmedabad") },
  { name: "Sabarmati Ashram", slug: normalizePlaceName("Sabarmati Ashram") },
  { name: "Kutch", slug: normalizePlaceName("Kutch") },
  { name: "Rann of Kutch", slug: normalizePlaceName("Rann of Kutch") },
  { name: "Dwarka", slug: normalizePlaceName("Dwarka") },
  { name: "Somnath", slug: normalizePlaceName("Somnath") },
  { name: "Gurugram", slug: normalizePlaceName("Gurugram") },
  { name: "Kurukshetra", slug: normalizePlaceName("Kurukshetra") },
  { name: "Shimla", slug: normalizePlaceName("Shimla") },
  { name: "Kufri", slug: normalizePlaceName("Kufri") },
  { name: "Manali", slug: normalizePlaceName("Manali") },
  { name: "Solang Valley", slug: normalizePlaceName("Solang Valley") },
  { name: "Dharamshala", slug: normalizePlaceName("Dharamshala") },
  { name: "McLeod Ganj", slug: normalizePlaceName("McLeod Ganj") },
  { name: "Spiti Valley", slug: normalizePlaceName("Spiti Valley") },
  { name: "Kaza", slug: normalizePlaceName("Kaza") },
  { name: "Srinagar", slug: normalizePlaceName("Srinagar") },
  { name: "Dal Lake", slug: normalizePlaceName("Dal Lake") },
  { name: "Ranchi", slug: normalizePlaceName("Ranchi") },
  { name: "Hundru Falls", slug: normalizePlaceName("Hundru Falls") },
  { name: "Bengaluru", slug: normalizePlaceName("Bengaluru") },
  { name: "Nandi Hills", slug: normalizePlaceName("Nandi Hills") },
  { name: "Hampi", slug: normalizePlaceName("Hampi") },
  { name: "Badami", slug: normalizePlaceName("Badami") },
  { name: "Gokarna", slug: normalizePlaceName("Gokarna") },
  { name: "Udupi", slug: normalizePlaceName("Udupi") },
  { name: "Kochi", slug: normalizePlaceName("Kochi") },
  { name: "Fort Kochi", slug: normalizePlaceName("Fort Kochi") },
  { name: "Munnar", slug: normalizePlaceName("Munnar") },
  { name: "Thekkady", slug: normalizePlaceName("Thekkady") },
  {
    name: "Thiruvananthapuram",
    slug: normalizePlaceName("Thiruvananthapuram"),
  },
  { name: "Kovalam", slug: normalizePlaceName("Kovalam") },
  { name: "Indore", slug: normalizePlaceName("Indore") },
  { name: "Ujjain", slug: normalizePlaceName("Ujjain") },
  { name: "Bhopal", slug: normalizePlaceName("Bhopal") },
  { name: "Sanchi", slug: normalizePlaceName("Sanchi") },
  { name: "Khajuraho", slug: normalizePlaceName("Khajuraho") },
  {
    name: "Kanha National Park",
    slug: normalizePlaceName("Kanha National Park"),
  },
  { name: "Mumbai", slug: normalizePlaceName("Mumbai") },
  { name: "Gateway of India", slug: normalizePlaceName("Gateway of India") },
  { name: "Pune", slug: normalizePlaceName("Pune") },
  { name: "Lonavala", slug: normalizePlaceName("Lonavala") },
  { name: "Mahabaleshwar", slug: normalizePlaceName("Mahabaleshwar") },
  { name: "Panchgani", slug: normalizePlaceName("Panchgani") },
  { name: "Nashik", slug: normalizePlaceName("Nashik") },
  { name: "Igatpuri", slug: normalizePlaceName("Igatpuri") },
  { name: "Aurangabad", slug: normalizePlaceName("Aurangabad") },
  { name: "Ajanta Caves", slug: normalizePlaceName("Ajanta Caves") },
  { name: "Imphal", slug: normalizePlaceName("Imphal") },
  { name: "Loktak Lake", slug: normalizePlaceName("Loktak Lake") },
  { name: "Shillong", slug: normalizePlaceName("Shillong") },
  { name: "Cherrapunji", slug: normalizePlaceName("Cherrapunji") },
  { name: "Aizawl", slug: normalizePlaceName("Aizawl") },
  { name: "Reiek", slug: normalizePlaceName("Reiek") },
  { name: "Kohima", slug: normalizePlaceName("Kohima") },
  { name: "Dzukou Valley", slug: normalizePlaceName("Dzukou Valley") },
  { name: "Bhubaneswar", slug: normalizePlaceName("Bhubaneswar") },
  { name: "Puri", slug: normalizePlaceName("Puri") },
  {
    name: "Simlipal National Park",
    slug: normalizePlaceName("Simlipal National Park"),
  },
  { name: "Gopalpur", slug: normalizePlaceName("Gopalpur") },
  { name: "Amritsar", slug: normalizePlaceName("Amritsar") },
  { name: "Golden Temple", slug: normalizePlaceName("Golden Temple") },
  { name: "Jaipur", slug: normalizePlaceName("Jaipur") },
  { name: "Hawa Mahal", slug: normalizePlaceName("Hawa Mahal") },
  { name: "Udaipur", slug: normalizePlaceName("Udaipur") },
  {
    name: "City Palace Udaipur",
    slug: normalizePlaceName("City Palace Udaipur"),
  },
  { name: "Jodhpur", slug: normalizePlaceName("Jodhpur") },
  { name: "Mehrangarh Fort", slug: normalizePlaceName("Mehrangarh Fort") },
  { name: "Jaisalmer", slug: normalizePlaceName("Jaisalmer") },
  { name: "Sam Sand Dunes", slug: normalizePlaceName("Sam Sand Dunes") },
  { name: "Pushkar", slug: normalizePlaceName("Pushkar") },
  { name: "Ajmer", slug: normalizePlaceName("Ajmer") },
  { name: "Gangtok", slug: normalizePlaceName("Gangtok") },
  { name: "Tsomgo Lake", slug: normalizePlaceName("Tsomgo Lake") },
  { name: "Chennai", slug: normalizePlaceName("Chennai") },
  { name: "Marina Beach", slug: normalizePlaceName("Marina Beach") },
  { name: "Ooty", slug: normalizePlaceName("Ooty") },
  { name: "Coonoor", slug: normalizePlaceName("Coonoor") },
  { name: "Madurai", slug: normalizePlaceName("Madurai") },
  { name: "Rameswaram", slug: normalizePlaceName("Rameswaram") },
  { name: "Hyderabad", slug: normalizePlaceName("Hyderabad") },
  { name: "Charminar", slug: normalizePlaceName("Charminar") },
  { name: "Agra", slug: normalizePlaceName("Agra") },
  { name: "Taj Mahal", slug: normalizePlaceName("Taj Mahal") },
  { name: "Varanasi", slug: normalizePlaceName("Varanasi") },
  {
    name: "Kashi Vishwanath Temple",
    slug: normalizePlaceName("Kashi Vishwanath Temple"),
  },
  { name: "Nainital", slug: normalizePlaceName("Nainital") },
  { name: "Bhimtal", slug: normalizePlaceName("Bhimtal") },
  { name: "Mussoorie", slug: normalizePlaceName("Mussoorie") },
  { name: "Dhanaulti", slug: normalizePlaceName("Dhanaulti") },
  { name: "Rishikesh", slug: normalizePlaceName("Rishikesh") },
  { name: "Haridwar", slug: normalizePlaceName("Haridwar") },
  { name: "Kedarnath", slug: normalizePlaceName("Kedarnath") },
  { name: "Badrinath", slug: normalizePlaceName("Badrinath") },
  { name: "Kolkata", slug: normalizePlaceName("Kolkata") },
  { name: "Victoria Memorial", slug: normalizePlaceName("Victoria Memorial") },
  { name: "Darjeeling", slug: normalizePlaceName("Darjeeling") },
  { name: "Tiger Hill", slug: normalizePlaceName("Tiger Hill") },
  { name: "Port Blair", slug: normalizePlaceName("Port Blair") },
  {
    name: "Swaraj Dweep (Havelock)",
    slug: normalizePlaceName("Swaraj Dweep (Havelock)"),
  },
  { name: "New Delhi", slug: normalizePlaceName("New Delhi") },
  { name: "India Gate", slug: normalizePlaceName("India Gate") },
  { name: "Leh", slug: normalizePlaceName("Leh") },
  { name: "Nubra Valley", slug: normalizePlaceName("Nubra Valley") },
  { name: "Puducherry", slug: normalizePlaceName("Puducherry") },
  { name: "Auroville", slug: normalizePlaceName("Auroville") },
  { name: "Chandigarh", slug: normalizePlaceName("Chandigarh") },
  { name: "Rock Garden", slug: normalizePlaceName("Rock Garden") },
  { name: "Daman", slug: normalizePlaceName("Daman") },
  { name: "Diu", slug: normalizePlaceName("Diu") },
  { name: "Lakshadweep", slug: normalizePlaceName("Lakshadweep") },
  { name: "Agatti", slug: normalizePlaceName("Agatti") },
];

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === '"') {
      if (quoted && line[index + 1] === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      values.push(value.trim());
      value = "";
    } else {
      value += char;
    }
  }

  values.push(value.trim());

  return values;
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (char === '"') {
      row += char;

      if (quoted && text[index + 1] === '"') {
        row += text[index + 1];
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (row.trim()) rows.push(parseCsvLine(row));

      row = "";

      if (char === "\r" && text[index + 1] === "\n") {
        index += 1;
      }
    } else {
      row += char;
    }
  }

  if (row.trim()) rows.push(parseCsvLine(row));

  return rows;
}

function titleCaseAdministrativeName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(
      /(^|[\s-])([a-z])/g,
      (_, prefix, letter) => `${prefix}${letter.toUpperCase()}`,
    );
}

export function normalizePlaceName(value: string): string {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getRegionByName(
  name: string,
  regions: IndiaRegion[] = INDIA_REGIONS,
): IndiaRegion | undefined {
  const query = String(name || "")
    .trim()
    .toLowerCase();

  return regions.find(
    (region) =>
      region.name.toLowerCase() === query ||
      region.slug === normalizePlaceName(query),
  );
}

export function getCapitalByRegion(
  name: string,
  regions: IndiaRegion[] = INDIA_REGIONS,
): string {
  return getRegionByName(name, regions)?.capital || "";
}

export function getPincodePrefixesByState(
  stateName: string,
  regions: IndiaRegion[] = INDIA_REGIONS,
): string[] {
  return getRegionByName(stateName, regions)?.pincodePrefixes || [];
}

export function isValidIndianPincode(
  pincode: string,
  stateName: string,
  regions: IndiaRegion[] = INDIA_REGIONS,
): boolean {
  const cleanPincode = String(pincode || "")
    .replace(/\D/g, "")
    .trim();

  if (!/^[0-9]{6}$/.test(cleanPincode)) {
    return false;
  }

  const prefixes = getPincodePrefixesByState(stateName, regions);

  if (!prefixes.length) {
    return false;
  }

  return prefixes.some((prefix) => cleanPincode.startsWith(prefix));
}

export function getPopularPlaces(
  limit = POPULAR_DESTINATIONS.length,
): TouristPlace[] {
  return POPULAR_DESTINATIONS.slice(0, Math.max(0, Number(limit) || 0));
}

export function searchTouristPlaces(
  query: string,
  regions: IndiaRegion[] = INDIA_REGIONS,
): TouristPlace[] {
  const normalized = String(query || "")
    .trim()
    .toLowerCase();

  if (!normalized) return ALL_TOURIST_PLACES;

  return regions
    .flatMap((region) => region.touristPlaces)
    .filter((place) =>
      [
        place.name,
        place.slug,
        ...(place.tags || []),
        place.description || "",
      ].some((value) => value.toLowerCase().includes(normalized)),
    );
}

export function getRegionPlacesAndCapital(
  name: string,
  regions: IndiaRegion[] = INDIA_REGIONS,
) {
  const region = getRegionByName(name, regions);

  return {
    region,
    capital: region?.capital || "",
    cities: region?.cities || [],
    touristPlaces: region?.touristPlaces || [],
    districts: region?.districts || [],
  };
}

export function getCitiesByRegion(
  name: string,
  regions: IndiaRegion[] = INDIA_REGIONS,
): string[] {
  return getRegionByName(name, regions)?.cities || [];
}

export function searchCitiesByRegion(
  regionName: string,
  query: string,
  regions: IndiaRegion[] = INDIA_REGIONS,
): string[] {
  const cities = getCitiesByRegion(regionName, regions);

  const normalized = String(query || "")
    .trim()
    .toLowerCase();

  if (!normalized) {
    return cities;
  }

  return cities.filter((city) => city.toLowerCase().includes(normalized));
}

export function getDistrictsByRegion(
  name: string,
  regions: IndiaRegion[] = INDIA_REGIONS,
): IndiaDistrict[] {
  return getRegionByName(name, regions)?.districts || [];
}

export function getSubDistrictsByDistrict(
  regionName: string,
  districtName: string,
  regions: IndiaRegion[] = INDIA_REGIONS,
): SubDistrict[] {
  const district = getDistrictsByRegion(regionName, regions).find(
    (item) =>
      item.name.toLowerCase() ===
        String(districtName || "")
          .trim()
          .toLowerCase() || item.slug === normalizePlaceName(districtName),
  );

  return district?.subDistricts || [];
}

export async function loadIndiaAdministrativeData(
  options: { url?: string; signal?: AbortSignal } = {},
): Promise<IndiaRegion[]> {
  const response = await fetch(options.url || LGD_SUBDISTRICT_CSV_URL, {
    signal: options.signal,
  });

  if (!response.ok) {
    throw new Error(
      `Unable to load LGD administrative data (${response.status}).`,
    );
  }

  const csv = await response.text();
  const rows = parseCsv(csv);

  if (rows.length < 2) {
    throw new Error("LGD administrative data is empty.");
  }

  const headers = rows[0].map((header) => header.replace(/^\uFEFF/, "").trim());

  const indexOf = (names: string[]) => {
    const index = headers.findIndex((header) =>
      names.some((name) => header.toLowerCase() === name.toLowerCase()),
    );

    if (index < 0) {
      throw new Error(`LGD CSV column missing: ${names[0]}`);
    }

    return index;
  };

  const stateIndex = indexOf(["State Name (In English)", "State Name"]);

  const districtIndex = indexOf([
    "District Name (In English)",
    "District Name",
  ]);

  const districtCodeIndex = indexOf(["District Code"]);

  const subDistrictIndex = indexOf(["Sub-District Name", "Subdistrict Name"]);

  const subDistrictCodeIndex = indexOf([
    "Sub-District Code",
    "Subdistrict Code",
  ]);

  const regionMap = new Map<string, IndiaRegion>();

  for (const [name, meta] of Object.entries(regionMeta)) {
    regionMap.set(name.toLowerCase(), {
      name,
      slug: normalizePlaceName(name),
      type: meta.type,
      capital: meta.capital,
      cities: getCitiesForRegion(name),
      districts: [],
      touristPlaces: touristPlaceMap[name] || [],
      pincodePrefixes: INDIA_PINCODE_PREFIXES[name] || [],
    });
  }

  const districtMaps = new Map<string, Map<string, IndiaDistrict>>();

  for (const row of rows.slice(1)) {
    const stateRaw = row[stateIndex] || "";
    const districtRaw = row[districtIndex] || "";
    const subDistrictRaw = row[subDistrictIndex] || "";

    if (!stateRaw || !districtRaw || !subDistrictRaw) {
      continue;
    }

    const normalizedState = stateRaw.trim().toLowerCase();

    const region = regionMap.get(normalizedState);

    if (!region) {
      continue;
    }

    if (!districtMaps.has(region.slug)) {
      districtMaps.set(region.slug, new Map());
    }

    const districts = districtMaps.get(region.slug)!;
    const districtKey = districtRaw.trim().toLowerCase();

    let district = districts.get(districtKey);

    if (!district) {
      district = {
        name: titleCaseAdministrativeName(districtRaw),
        slug: normalizePlaceName(districtRaw),
        code: row[districtCodeIndex] || undefined,
        subDistricts: [],
      };

      districts.set(districtKey, district);
      region.districts.push(district);
    }

    const subDistrictName = titleCaseAdministrativeName(subDistrictRaw);

    if (
      !district.subDistricts.some(
        (item) => item.name.toLowerCase() === subDistrictName.toLowerCase(),
      )
    ) {
      district.subDistricts.push({
        name: subDistrictName,
        slug: normalizePlaceName(subDistrictRaw),
        code: row[subDistrictCodeIndex] || undefined,
      });
    }
  }

  for (const region of regionMap.values()) {
    const administrativeCities = [
      ...region.districts.map((district) => district.name),
      ...region.districts.flatMap((district) =>
        district.subDistricts.map((subDistrict) => subDistrict.name),
      ),
    ];

    region.cities = getCitiesForRegion(region.name, administrativeCities);
  }

  const loaded = [...regionMap.values()];

  const states = loaded.filter((region) => region.type === "state");
  const uts = loaded.filter((region) => region.type === "union-territory");

  INDIAN_STATES.splice(0, INDIAN_STATES.length, ...states);
  UNION_TERRITORIES.splice(0, UNION_TERRITORIES.length, ...uts);
  INDIA_REGIONS.splice(0, INDIA_REGIONS.length, ...loaded);

  return INDIA_REGIONS;
}

export default INDIA_REGIONS;
