export interface KeyInfo {
  /** main char (lowercase) */
  main: string;
  /** shifted char */
  shifted?: string;
  /** finger that should press this key */
  finger:
    | "L-pinky"
    | "L-ring"
    | "L-middle"
    | "L-index"
    | "R-index"
    | "R-ring"
    | "R-middle"
    | "R-pinky"
    | "thumb";
  /** finger color group (used for visualization) */
  colorGroup: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
}

export const FINGER_COLORS: Record<number, string> = {
  1: "oklch(0.78 0.14 25)",   // L-pinky - red-orange
  2: "oklch(0.78 0.14 75)",   // L-ring - amber
  3: "oklch(0.78 0.14 145)",  // L-middle - green
  4: "oklch(0.78 0.14 195)",  // L-index - teal
  5: "oklch(0.78 0.14 250)",  // R-index - cyan-blue (but soft)
  6: "oklch(0.78 0.14 295)",  // R-middle - purple
  7: "oklch(0.78 0.14 335)",  // R-ring - pink
  8: "oklch(0.78 0.14 15)",   // R-pinky - rose
};

/** QWERTY layout, 4 rows. Each key shows the lowercase letter and (in shifted) the symbol. */
export const QWERTY_ROWS: KeyInfo[][] = [
  // Row 1: number row
  [
    { main: "`", shifted: "~", finger: "L-pinky", colorGroup: 1 },
    { main: "1", shifted: "!", finger: "L-pinky", colorGroup: 1 },
    { main: "2", shifted: "@", finger: "L-ring", colorGroup: 2 },
    { main: "3", shifted: "#", finger: "L-middle", colorGroup: 3 },
    { main: "4", shifted: "$", finger: "L-index", colorGroup: 4 },
    { main: "5", shifted: "%", finger: "L-index", colorGroup: 4 },
    { main: "6", shifted: "^", finger: "R-index", colorGroup: 5 },
    { main: "7", shifted: "&", finger: "R-index", colorGroup: 5 },
    { main: "8", shifted: "*", finger: "R-middle", colorGroup: 6 },
    { main: "9", shifted: "(", finger: "R-ring", colorGroup: 7 },
    { main: "0", shifted: ")", finger: "R-pinky", colorGroup: 8 },
    { main: "-", shifted: "_", finger: "R-pinky", colorGroup: 8 },
    { main: "=", shifted: "+", finger: "R-pinky", colorGroup: 8 },
  ],
  // Row 2: QWERTY
  [
    { main: "q", shifted: "Q", finger: "L-pinky", colorGroup: 1 },
    { main: "w", shifted: "W", finger: "L-ring", colorGroup: 2 },
    { main: "e", shifted: "E", finger: "L-middle", colorGroup: 3 },
    { main: "r", shifted: "R", finger: "L-index", colorGroup: 4 },
    { main: "t", shifted: "T", finger: "L-index", colorGroup: 4 },
    { main: "y", shifted: "Y", finger: "R-index", colorGroup: 5 },
    { main: "u", shifted: "U", finger: "R-index", colorGroup: 5 },
    { main: "i", shifted: "I", finger: "R-middle", colorGroup: 6 },
    { main: "o", shifted: "O", finger: "R-ring", colorGroup: 7 },
    { main: "p", shifted: "P", finger: "R-pinky", colorGroup: 8 },
    { main: "[", shifted: "{", finger: "R-pinky", colorGroup: 8 },
    { main: "]", shifted: "}", finger: "R-pinky", colorGroup: 8 },
    { main: "\\", shifted: "|", finger: "R-pinky", colorGroup: 8 },
  ],
  // Row 3: ASDF
  [
    { main: "a", shifted: "A", finger: "L-pinky", colorGroup: 1 },
    { main: "s", shifted: "S", finger: "L-ring", colorGroup: 2 },
    { main: "d", shifted: "D", finger: "L-middle", colorGroup: 3 },
    { main: "f", shifted: "F", finger: "L-index", colorGroup: 4 },
    { main: "g", shifted: "G", finger: "L-index", colorGroup: 4 },
    { main: "h", shifted: "H", finger: "R-index", colorGroup: 5 },
    { main: "j", shifted: "J", finger: "R-index", colorGroup: 5 },
    { main: "k", shifted: "K", finger: "R-middle", colorGroup: 6 },
    { main: "l", shifted: "L", finger: "R-ring", colorGroup: 7 },
    { main: ";", shifted: ":", finger: "R-pinky", colorGroup: 8 },
    { main: "'", shifted: "\"", finger: "R-pinky", colorGroup: 8 },
  ],
  // Row 4: ZXCV
  [
    { main: "z", shifted: "Z", finger: "L-pinky", colorGroup: 1 },
    { main: "x", shifted: "X", finger: "L-ring", colorGroup: 2 },
    { main: "c", shifted: "C", finger: "L-middle", colorGroup: 3 },
    { main: "v", shifted: "V", finger: "L-index", colorGroup: 4 },
    { main: "b", shifted: "B", finger: "L-index", colorGroup: 4 },
    { main: "n", shifted: "N", finger: "R-index", colorGroup: 5 },
    { main: "m", shifted: "M", finger: "R-middle", colorGroup: 6 },
    { main: ",", shifted: "<", finger: "R-ring", colorGroup: 7 },
    { main: ".", shifted: ">", finger: "R-pinky", colorGroup: 8 },
    { main: "/", shifted: "?", finger: "R-pinky", colorGroup: 8 },
  ],
];

/** Special keys (Shift, Space) shown in the virtual keyboard */
export const SPECIAL_KEYS = {
  shiftLeft: { label: "Shift", width: 2.5 },
  shiftRight: { label: "Shift", width: 2.5 },
  space: { label: "Space", width: 8 },
};

/** Returns the home-row key for each finger — used for the "rest position" highlight */
export const HOME_ROW_KEYS = ["a", "s", "d", "f", "j", "k", "l", ";"];

/** Look up the KeyInfo for a given character (handles shifted chars). */
export function findKeyByChar(char: string): KeyInfo | undefined {
  for (const row of QWERTY_ROWS) {
    for (const key of row) {
      if (key.main === char || key.shifted === char) return key;
    }
  }
  if (char === " ") {
    return { main: " ", finger: "thumb", colorGroup: 4 };
  }
  return undefined;
}

/** Find the next key to press given a target character */
export function getKeyForChar(char: string): {
  key: KeyInfo | undefined;
  isShifted: boolean;
} {
  for (const row of QWERTY_ROWS) {
    for (const key of row) {
      if (key.main === char) return { key, isShifted: false };
      if (key.shifted === char) return { key, isShifted: true };
    }
  }
  if (char === " ") {
    return {
      key: { main: " ", finger: "thumb", colorGroup: 4 },
      isShifted: false,
    };
  }
  return { key: undefined, isShifted: false };
}
