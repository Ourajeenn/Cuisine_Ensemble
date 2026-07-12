import lasagnaImg from "@/assets/meal-lasagna.jpg";
import tagineImg from "@/assets/meal-tagine.jpg";
import curryImg from "@/assets/meal-curry.jpg";
import sushiImg from "@/assets/meal-sushi.jpg";

export type Diet = "Végétarien" | "Vegan" | "Sans gluten" | "Halal" | "Sans lactose" | "Poisson";

export type Meal = {
  id: string;
  title: string;
  cuisine: string;
  host: string;
  hostRating: number;
  neighborhood: string;
  distanceKm: number;
  latitude: number;
  longitude: number;
  date: string;
  time: string;
  seatsTotal: number;
  seatsLeft: number;
  pricePerPerson: number;
  diets: Diet[];
  image: string;
  popular?: boolean;
  description?: string;
  address?: string;
  menu?: string[];
  allergens?: string[];
};

export const MEALS: Meal[] = [
  {
    id: "m1",
    title: "Lasagnes maison de Nonna",
    cuisine: "Italienne",
    host: "Giulia · Croix-Rousse",
    hostRating: 4.9,
    neighborhood: "Croix-Rousse",
    distanceKm: 0.6,
    latitude: 45.7772,
    longitude: 4.8333,
    date: "Ven. 24 janv.",
    time: "19h30",
    seatsTotal: 6,
    seatsLeft: 2,
    pricePerPerson: 12,
    diets: ["Végétarien"],
    image: lasagnaImg,
    popular: true,
    description:
      "Recette familiale transmise depuis trois générations : pâtes fraîches roulées à la main, sauce tomate longuement mijotée et béchamel maison. Ambiance chaleureuse dans un appartement lumineux de la Croix-Rousse.",
    address: "12 rue des Pierres Plantées, Lyon 1er",
    menu: ["Antipasti de saison", "Lasagnes végétariennes", "Tiramisu classique", "Café italien"],
    allergens: ["Gluten", "Œufs", "Lactose"],
  },
  {
    id: "m2",
    title: "Tajine agneau & couscous",
    cuisine: "Marocaine",
    host: "Karim · Guillotière",
    hostRating: 4.8,
    neighborhood: "Guillotière",
    distanceKm: 1.2,
    latitude: 45.7538,
    longitude: 4.8466,
    date: "Sam. 25 janv.",
    time: "20h00",
    seatsTotal: 8,
    seatsLeft: 4,
    pricePerPerson: 15,
    diets: ["Halal", "Sans lactose"],
    image: tagineImg,
    description:
      "Tajine d'agneau aux pruneaux et amandes, servi avec un couscous fin et légumes de saison. Thé à la menthe et pâtisseries orientales à la fin du repas.",
    address: "45 cours Gambetta, Lyon 7e",
    menu: ["Salades marocaines", "Tajine agneau pruneaux", "Couscous légumes", "Cornes de gazelle"],
    allergens: ["Fruits à coque"],
  },
  {
    id: "m3",
    title: "Curry de légumes du marché",
    cuisine: "Indienne",
    host: "Aïsha · Confluence",
    hostRating: 5.0,
    neighborhood: "Confluence",
    distanceKm: 2.4,
    latitude: 45.7428,
    longitude: 4.8177,
    date: "Dim. 26 janv.",
    time: "12h30",
    seatsTotal: 5,
    seatsLeft: 3,
    pricePerPerson: 10,
    diets: ["Vegan", "Sans gluten"],
    image: curryImg,
    description:
      "Brunch indien 100% végétal : curry de légumes du marché de la Confluence, riz basmati parfumé, chutneys maison et pain naan sans gluten.",
    address: "8 quai Rambaud, Lyon 2e",
    menu: ["Samoussas de légumes", "Curry de saison", "Riz basmati", "Lassi mangue"],
    allergens: [],
  },
  {
    id: "m4",
    title: "Atelier sushis à partager",
    cuisine: "Japonaise",
    host: "Léo · Part-Dieu",
    hostRating: 4.7,
    neighborhood: "Part-Dieu",
    distanceKm: 1.8,
    latitude: 45.7618,
    longitude: 4.8527,
    date: "Mer. 29 janv.",
    time: "19h00",
    seatsTotal: 4,
    seatsLeft: 1,
    pricePerPerson: 18,
    diets: ["Poisson"],
    image: sushiImg,
    popular: true,
    description:
      "Atelier participatif : on roule ses makis ensemble, puis on partage un grand plateau. Poissons frais du jour, riz vinaigré maison, saké en option.",
    address: "22 rue Garibaldi, Lyon 3e",
    menu: ["Edamame", "Makis & nigiris à rouler", "Soupe miso", "Mochi glacé"],
    allergens: ["Poisson", "Soja", "Sésame"],
  },
];

export const DIET_FILTERS: (Diet | "Tous")[] = [
  "Tous",
  "Végétarien",
  "Vegan",
  "Sans gluten",
  "Halal",
  "Sans lactose",
];

export function getMeal(id: string): Meal | undefined {
  return MEALS.find((m) => m.id === id);
}
