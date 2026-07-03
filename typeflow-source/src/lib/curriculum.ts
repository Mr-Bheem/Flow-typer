export interface Lesson {
  id: string;
  unit: number;
  unitTitle: string;
  title: string;
  description: string;
  /** Keys introduced in this lesson, used for the on-screen keyboard highlight */
  keysIntroduced: string[];
  /** Short drill lines (no shift, no punctuation unless part of lesson) */
  drills: string[];
  /** Final challenge sentence/paragraph */
  challenge: string;
  /** Suggested target WPM before moving on */
  targetWpm: number;
}

export const CURRICULUM: Lesson[] = [
  // ---------------- Unit 1: Home Row ----------------
  {
    id: "u1-l1",
    unit: 1,
    unitTitle: "Home Row Foundations",
    title: "Home Row: Left Hand",
    description:
      "Place your left hand on ASDF with fingers resting gently on the keys. Your index finger goes on F (feel the bump). Reach each key without lifting your wrist.",
    keysIntroduced: ["a", "s", "d", "f"],
    drills: ["aaa sss ddd fff", "asdf asdf asdf", "fad fad fad", "sad sad dad dad"],
    challenge:
      "a fast dad sat at a sad fad; as a fad fades, a dad adds a fad",
    targetWpm: 15,
  },
  {
    id: "u1-l2",
    unit: 1,
    unitTitle: "Home Row Foundations",
    title: "Home Row: Right Hand",
    description:
      "Place your right hand on JKL; with index on J (feel the bump). Keep your wrists floating and use only finger motion to press each key.",
    keysIntroduced: ["j", "k", "l", ";"],
    drills: ["jjj kkk lll ;;;", "jkl; jkl; jkl;", "lkj lkj lkj", "all; all; all;"],
    challenge:
      "a lass; jak asks; sal laks; all jaks; lask a lass; ask a jak",
    targetWpm: 18,
  },
  {
    id: "u1-l3",
    unit: 1,
    unitTitle: "Home Row Foundations",
    title: "Home Row: Both Hands",
    description:
      "Combine both hands on the home row. This is the most important foundation of touch typing — return to these keys after every reach.",
    keysIntroduced: ["a", "s", "d", "f", "j", "k", "l", ";"],
    drills: [
      "asdf jkl; asdf jkl;",
      "sad lad fad jak",
      "ask dad; fall jak",
      "a flask; a salad; dads lads",
    ],
    challenge:
      "a dad asks; a lad falls; salad flask; jak adds; lads ask dads; a fad fades",
    targetWpm: 22,
  },
  {
    id: "u1-l4",
    unit: 1,
    unitTitle: "Home Row Foundations",
    title: "Home Row: G and H",
    description:
      "Reach G with your left index finger and H with your right index finger. Always return to F and J after the reach — never let your hands drift.",
    keysIntroduced: ["g", "h"],
    drills: [
      "ggg hhh ggg hhh",
      "gh gh gh hg hg hg",
      "gag hag had jag",
      "dash flash glad shag",
    ],
    challenge:
      "a glad lad had a dash; a flash gag; dads glad; jags dash; shag adds a flask",
    targetWpm: 24,
  },

  // ---------------- Unit 2: Top Row ----------------
  {
    id: "u2-l1",
    unit: 2,
    unitTitle: "Top Row Letters",
    title: "Top Row: Left Hand",
    description:
      "Reach up to the top row. R is reached by your left index (F finger), E by middle (D), W by ring (S), Q by pinky (A). Always come back to home row after each press.",
    keysIntroduced: ["q", "w", "e", "r"],
    drills: ["qqq www eee rrr", "qwer qwer qwer", "raw far few dew", "we red dear ware"],
    challenge:
      "we read a rare dear; a few raw weeds; we wear red; deer fear weeds",
    targetWpm: 24,
  },
  {
    id: "u2-l2",
    unit: 2,
    unitTitle: "Top Row Letters",
    title: "Top Row: Right Hand",
    description:
      "U is reached by your right index (J finger), I by middle (K), O by ring (L), P by pinky (;). Keep your other fingers on home row.",
    keysIntroduced: ["u", "i", "o", "p"],
    drills: ["uuu iii ooo ppp", "uiop uiop uiop", "our pour soil polo", "oil pair sour pour"],
    challenge:
      "pour oil; our soil; pair a polo; sour soil; pour our oil; polo pairs",
    targetWpm: 26,
  },
  {
    id: "u2-l3",
    unit: 2,
    unitTitle: "Top Row Letters",
    title: "Top Row: T and Y",
    description:
      "T is reached by your left index finger (F), Y by your right index (J). These are the longest reaches so far — keep wrists steady.",
    keysIntroduced: ["t", "y"],
    drills: ["ttt yyy ttt yyy", "ty ty ty yt yt yt", "they they they", "yet toy try dry"],
    challenge:
      "they try yet; a dry toy; they tied a toy; yet they try; dry ties try",
    targetWpm: 28,
  },
  {
    id: "u2-l4",
    unit: 2,
    unitTitle: "Top Row Letters",
    title: "Top Row: Full Review",
    description:
      "Combine all top-row letters with the home row. Practice moving up to the top row and returning to home position smoothly.",
    keysIntroduced: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    drills: [
      "the quick brown fox",
      "pretty wild reqquire",
      "type writer poetry",
      "we write poetry daily",
    ],
    challenge:
      "the quick brown fox; pretty poetry; we write daily; type wild words",
    targetWpm: 30,
  },

  // ---------------- Unit 3: Bottom Row ----------------
  {
    id: "u3-l1",
    unit: 3,
    unitTitle: "Bottom Row Letters",
    title: "Bottom Row: Left Hand",
    description:
      "Reach down to the bottom row. Z is reached by left pinky, X by ring, C by middle, V by index. Reach down without moving the whole hand.",
    keysIntroduced: ["z", "x", "c", "v"],
    drills: ["zzz xxx ccc vvv", "zxcv zxcv zxcv", "cab van ace zed", "cave dice fox zest"],
    challenge:
      "a cave with a fox; dice in a van; zest of an ace; fox dice cave",
    targetWpm: 28,
  },
  {
    id: "u3-l2",
    unit: 3,
    unitTitle: "Bottom Row Letters",
    title: "Bottom Row: Right Hand",
    description:
      "N is reached by right index, M by middle, comma by ring, period by pinky. The / (slash) is also reached by the right pinky.",
    keysIntroduced: ["n", "m", ",", ".", "/"],
    drills: ["nnn mmm ,,, ...", "nm, . nm, .", "man can ran van", "come, go, run, sit."],
    challenge:
      "man, come, run, sit. a van can come. men run. an ace can win.",
    targetWpm: 28,
  },
  {
    id: "u3-l3",
    unit: 3,
    unitTitle: "Bottom Row Letters",
    title: "Bottom Row: B",
    description:
      "B is reached by your left index finger reaching across slightly. Keep your right hand on home row while reaching B.",
    keysIntroduced: ["b"],
    drills: ["bbb bbb bbb", "babe babe babe", "rib cab bat bad", "bare bike bear band"],
    challenge:
      "a bear in a band; bare ribs; bad bikes; a babe in a cab; bat a bear",
    targetWpm: 30,
  },

  // ---------------- Unit 4: Shift & Capitals ----------------
  {
    id: "u4-l1",
    unit: 4,
    unitTitle: "Shift and Capitals",
    title: "Shift: Capital Letters",
    description:
      "Hold the opposite Shift key from the hand typing the letter. For example, type A with right Shift held, and L with left Shift held.",
    keysIntroduced: ["shift"],
    drills: ["Apple Banana Cherry", "Dog Elephant Frog", "Hello World Type", "Quick Brown Fox"],
    challenge:
      "The Quick Brown Fox Jumps Over The Lazy Dog. Apple, Banana, Cherry.",
    targetWpm: 28,
  },
  {
    id: "u4-l2",
    unit: 4,
    unitTitle: "Shift and Capitals",
    title: "Punctuation: . , ! ?",
    description:
      "Period is on the bottom-right. Comma is next to M. ! and ? use Shift. Place punctuation directly after the previous character with no space before.",
    keysIntroduced: [".", ",", "!", "?"],
    drills: ["Hi. Bye. Wow! Why?", "Stop, look, go. Wow!", "Yes? No! Maybe.", "Fast, slow, fast. Done!"],
    challenge:
      "Hello! How are you? I am fine, thanks. The sun is bright. Wow! What a day.",
    targetWpm: 30,
  },
  {
    id: "u4-l3",
    unit: 4,
    unitTitle: "Shift and Capitals",
    title: "Punctuation: : ; \" '",
    description:
      "Semicolon (;) is on the home row right pinky. Colon (:) is Shift+;. Quotes (\") use Shift+' and apostrophe (') is on the home row.",
    keysIntroduced: [":", ";", "\"", "'"],
    drills: ["She said: \"Hi.\" I'm here.", "Time: 5:00; Done.", "Don't; won't; can't.", "\"Yes,\" he said; \"ok.\""],
    challenge:
      "He said: \"Don't worry.\" She replied: \"I won't.\" Time: 5:30; Let's go.",
    targetWpm: 32,
  },

  // ---------------- Unit 5: Numbers ----------------
  {
    id: "u5-l1",
    unit: 5,
    unitTitle: "Numbers",
    title: "Number Row: 1-5",
    description:
      "Reach up to the number row. 1 is reached by left pinky, 2 by ring, 3 by middle, 4 by index, 5 by index (cross-over).",
    keysIntroduced: ["1", "2", "3", "4", "5"],
    drills: ["123 123 123", "45 45 45 45", "12345 12345", "1 cat 2 dogs 3 fish"],
    challenge:
      "I have 2 cats, 3 dogs, and 1 fish. There are 45 apples in 3 baskets.",
    targetWpm: 30,
  },
  {
    id: "u5-l2",
    unit: 5,
    unitTitle: "Numbers",
    title: "Number Row: 6-0",
    description:
      "6 is reached by right index, 7 by index, 8 by middle, 9 by ring, 0 by pinky. Keep your other fingers anchored to home row.",
    keysIntroduced: ["6", "7", "8", "9", "0"],
    drills: ["678 678 678", "90 90 90 90", "67890 67890", "7 days 8 weeks 9 months"],
    challenge:
      "Call 911 for help. The temperature is 68 degrees. There are 100 pages in 10 chapters.",
    targetWpm: 32,
  },

  // ---------------- Unit 6: Real Text ----------------
  {
    id: "u6-l1",
    unit: 6,
    unitTitle: "Real-World Typing",
    title: "Common Words",
    description:
      "Practice with the 100 most common English words. Aim for smooth, even rhythm rather than bursts of speed.",
    keysIntroduced: [],
    drills: [
      "the be to of and a in that have it",
      "for not on with he as you do at",
      "this but his by from they we say her",
    ],
    challenge:
      "The most common words in English are short, and you should be able to type them without looking. Practice them often, and your speed will rise quickly.",
    targetWpm: 35,
  },
  {
    id: "u6-l2",
    unit: 6,
    unitTitle: "Real-World Typing",
    title: "Sentences",
    description:
      "Real sentences mix capitals, punctuation, and numbers. Focus on rhythm and accuracy — speed will follow naturally.",
    keysIntroduced: [],
    drills: [
      "She sells seashells by the seashore.",
      "How much wood would a woodchuck chuck?",
      "The five boxing wizards jump quickly.",
    ],
    challenge:
      "Pack my box with five dozen liquor jugs. The five boxing wizards jump quickly. She sells seashells by the seashore, while he watches whales in the waves.",
    targetWpm: 40,
  },
  {
    id: "u6-l3",
    unit: 6,
    unitTitle: "Real-World Typing",
    title: "Paragraphs",
    description:
      "Type a full paragraph. This trains your stamina and the ability to maintain speed over long stretches. Keep your eyes on the screen, not the keyboard.",
    keysIntroduced: [],
    drills: [
      "Touch typing is a skill that anyone can learn with practice. The key is to type without looking at the keyboard, using all ten fingers and the muscle memory you build over time.",
    ],
    challenge:
      "When you learn to touch type, you give yourself a lifelong skill. Your fingers learn where each letter lives, and the words flow onto the screen as fast as you can think them. Start slow, focus on accuracy, and speed will come naturally with daily practice.",
    targetWpm: 45,
  },
];

export function getUnits() {
  const units: { unit: number; unitTitle: string; lessons: Lesson[] }[] = [];
  for (const lesson of CURRICULUM) {
    let u = units.find((x) => x.unit === lesson.unit);
    if (!u) {
      u = { unit: lesson.unit, unitTitle: lesson.unitTitle, lessons: [] };
      units.push(u);
    }
    u.lessons.push(lesson);
  }
  return units;
}

export function getLessonById(id: string): Lesson | undefined {
  return CURRICULUM.find((l) => l.id === id);
}

export function getNextLesson(currentId: string): Lesson | undefined {
  const idx = CURRICULUM.findIndex((l) => l.id === currentId);
  if (idx === -1 || idx === CURRICULUM.length - 1) return undefined;
  return CURRICULUM[idx + 1];
}

export function getPrevLesson(currentId: string): Lesson | undefined {
  const idx = CURRICULUM.findIndex((l) => l.id === currentId);
  if (idx <= 0) return undefined;
  return CURRICULUM[idx - 1];
}
