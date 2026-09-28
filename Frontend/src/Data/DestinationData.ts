export interface Destination {
  name: string;
  img: string;
}

const commons = (fileName: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
    fileName
  )}`;

export const destinations: Destination[] = [
  {
    name: "Goa",
    img: commons("Baga Beach, Goa.jpg"),
  },
  {
    name: "Nainital",
    img: commons("Naini lake of Nainital.jpg"),
  },
  {
    name: "Manali",
    img: commons("Solang Valley Manali.JPG"),
  },
  {
    name: "Rishikesh",
    img: commons("Rishikesh, Lakshman Jhula.jpg"),
  },
  {
    name: "Shimla",
    img: commons("Shimla Mall.jpg"),
  },
  {
    name: "Mussoorie",
    img: commons("Kempty Waterfalls.jpg"),
  },
  {
    name: "Darjeeling",
    img: commons("Tiger Hill Darjeeling.jpg"),
  },
  {
    name: "Munnar",
    img: commons("Munnar Tea gardens.jpg"),
  },
  {
    name: "Ooty",
    img: commons("Ooty lake(1).jpg"),
  },
  {
    name: "Srinagar",
    img: commons("DalLake.jpeg"),
  },
  {
    name: "Leh",
    img: commons("Pangong lake in Ladakh.jpg"),
  },
  {
    name: "Andaman",
    img: commons(
      "Radhanagar Beach (Swaraj Dweep), Andaman and Nicobar Island.jpg"
    ),
  },
  {
    name: "Lakshadweep",
    img: commons("Agatti Island Lakshadweep.jpg"),
  },
  {
    name: "Mount Abu",
    img: commons("NAKKI LAKE, MOUNT ABU, RAJASTHAN.jpg"),
  },
  {
    name: "Amritsar",
    img: commons("Golden Temple (Amritsar).jpg"),
  },
  {
    name: "Agra",
    img: commons("The Taj Mahal , Agra.jpg"),
  },
  {
    name: "Varanasi",
    img: commons("DASHASHWAMEDH GHAT, VARANASI.jpg"),
  },
  {
    name: "Coorg",
    img: commons("AbbeyFallsCoorg.jpg"),
  },
  {
    name: "Jaipur",
    img: commons("Jaipur-Hawa-Mahal.jpg"),
  },
  {
    name: "Udaipur",
    img: commons("Lake Pichola Udaipur Rajasthan.jpg"),
  },
];