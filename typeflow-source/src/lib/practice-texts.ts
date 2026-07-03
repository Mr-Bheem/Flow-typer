export interface PracticeSet {
  id: string;
  title: string;
  description: string;
  icon: string; // emoji or short label
  difficulty: "easy" | "medium" | "hard";
  texts: string[];
}

export const PRACTICE_SETS: PracticeSet[] = [
  {
    id: "quotes",
    title: "Inspiring Quotes",
    description: "Short, memorable quotes to type quickly and accurately.",
    icon: "“”",
    difficulty: "easy",
    texts: [
      "The only way to do great work is to love what you do.",
      "In the middle of every difficulty lies opportunity.",
      "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      "The future belongs to those who believe in the beauty of their dreams.",
      "Whether you think you can, or you think you can't, you're right.",
      "The journey of a thousand miles begins with a single step.",
      "Do not wait to strike till the iron is hot; but make it hot by striking.",
      "What you get by achieving your goals is not as important as what you become.",
    ],
  },
  {
    id: "pangrams",
    title: "Pangrams",
    description: "Sentences that use every letter of the alphabet.",
    icon: "AZ",
    difficulty: "medium",
    texts: [
      "The quick brown fox jumps over the lazy dog.",
      "Pack my box with five dozen liquor jugs.",
      "Sphinx of black quartz, judge my vow.",
      "How vexingly quick daft zebras jump!",
      "The five boxing wizards jump quickly.",
      "Bright vixens jump; dozy fowl quack.",
      "Quick zephyrs blow, vexing daft Jim.",
    ],
  },
  {
    id: "facts",
    title: "Fun Facts",
    description: "Interesting facts to keep your mind engaged while typing.",
    icon: "★",
    difficulty: "medium",
    texts: [
      "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over three thousand years old and still perfectly edible.",
      "Octopuses have three hearts, nine brains, and blue blood. Two of their hearts pump blood through the gills, while the third pumps it through the rest of the body.",
      "A day on Venus is longer than a year on Venus. It takes Venus longer to rotate once on its axis than to complete one orbit around the Sun.",
      "Bananas are berries, but strawberries are not. Botanically, a berry must have seeds inside its flesh, which bananas do, but strawberries do not.",
      "The shortest war in history was between Britain and Zanzibar in 1896. It lasted only 38 minutes, making it the briefest recorded war in history.",
    ],
  },
  {
    id: "literature",
    title: "Literature",
    description: "Passages from classic literature to build endurance.",
    icon: "✦",
    difficulty: "hard",
    texts: [
      "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity.",
      "All happy families are alike; each unhappy family is unhappy in its own way. Everything was in confusion in the Oblonskys' house.",
      "Call me Ishmael. Some years ago, never mind how long precisely, having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little.",
      "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
    ],
  },
  {
    id: "tech",
    title: "Tech & Code",
    description: "Technical writing with symbols, numbers, and jargon.",
    icon: "</>",
    difficulty: "hard",
    texts: [
      "function add(a, b) { return a + b; } // returns the sum of two numbers",
      "const arr = [1, 2, 3].map(x => x * 2).filter(x => x > 2);",
      "git commit -m 'fix: resolve race condition in async loader'",
      "SELECT name, email FROM users WHERE created_at > '2024-01-01' ORDER BY name;",
      "HTTP/1.1 200 OK — Content-Type: application/json; charset=utf-8",
    ],
  },
  {
    id: "proverbs",
    title: "Proverbs",
    description: "Short, punchy proverbs from around the world.",
    icon: "❖",
    difficulty: "easy",
    texts: [
      "A journey of a thousand miles begins with a single step.",
      "The early bird catches the worm, but the second mouse gets the cheese.",
      "A rolling stone gathers no moss.",
      "Actions speak louder than words.",
      "Don't count your chickens before they hatch.",
      "The pen is mightier than the sword.",
      "When in Rome, do as the Romans do.",
      "Where there's smoke, there's fire.",
    ],
  },
];

export function getPracticeSetById(id: string): PracticeSet | undefined {
  return PRACTICE_SETS.find((s) => s.id === id);
}
