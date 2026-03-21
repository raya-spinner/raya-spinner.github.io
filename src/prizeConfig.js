export const GITHUB_BASE_URL = "https://raw.githubusercontent.com/agustyawan-arif/raya-wheel/main/prize/";

export const prizeCatalog = [
  { name: "Chocolito Cookie Mini Rich", qty: 0, image: "choco-lito-extra.jpg" },
  { name: "Chocolito Cookie Mini Original", qty: 2, image: "choco-lito.jpg" },
  { name: "Chomp-Chomp Marsh Blueberry", qty: 2, image: "mallow-puff-blueberry.jpg" },
  { name: "Chomp-Chomp Marsh Strawberry", qty: 0, image: "mallow-puff-strawberry.jpg" },
  { name: "Chomp-Chomp Marsh Peach", qty: 0, image: "mallow-puff-peach.jpg" },
  { name: "Fruzz Ball Permen", qty: 2, image: "fruzz-balls.jpg" },
  { name: "Joa-Yo Rumput Laut", qty: 0, image: "korean-seaweed.jpg" },
  { name: "Tini Wini Biti Whizpy", qty: 0, image: "whizpy.jpg" },
  { name: "KOALA-LA Strawberry", qty: 1, image: "koala-la-strawberry.jpg" },
  { name: "Sugus Stick Blackcurrant", qty: 0, image: "sugus-blueberry.jpg" },
  { name: "Sugus Stick Strawberry", qty: 1, image: "sugus-strawberry.jpg" },
  { name: "Relaxa Play Boboiboy", qty: 1, image: "relaxa-play.jpg" },
  { name: "Milkita Bites", qty: 0, image: "milkita-bytes.jpg" },
  { name: "NyamNyam Popstix", qty: 2, image: "nyam-nyam.jpg" },
  { name: "KOALA-LA Blueberry", qty: 1, image: "koala-la-blueberry.jpg" },
  { name: "French Fries", qty: 2, image: "alfamart-potatoes.jpg" },
  { name: "Youka Jeli Roll", qty: 0, image: "youka-roll.jpg" },
  { name: "Chupa Chups Ropes", qty: 0, image: "chupa-chups.jpg" },
  { name: "Gemez Enaak", qty: 0, image: "gemez-enaak.jpg" },
  { name: "THR", qty: 5, image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=300&q=80", isAbsoluteUrl: true }
];

// Generate individual slices so each item has its own place on the wheel!
export const generateWheelSlices = () => {
  const slices = [];
  let idCounter = 1;
  
  for (const item of prizeCatalog) {
    for (let i = 0; i < item.qty; i++) {
      slices.push({
        id: `prize-${idCounter++}`,
        name: item.name,
        image: item.isAbsoluteUrl ? item.image : `${GITHUB_BASE_URL}${item.image}`
      });
    }
  }
  
  // Optional: Shuffle the slices so they aren't grouped by prize type
  for (let i = slices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [slices[i], slices[j]] = [slices[j], slices[i]];
  }
  
  return slices;
};
