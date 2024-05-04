export type LujvoAndScore = {
  /** Includes hyphens */
  parts: ({ selrafsi: string; part: string; experimental: boolean } | { selrafsi: null; part: string; experimental: false })[];
  lujvo: string;
  score: number;
  cmevla: boolean;
  usesExperimentalRafsi: boolean;
  forbiddenLaLaiDoiCmevla: boolean;
};
export type Consonant = "r" | "l" | "n" | "m" | "b" | "v" | "d" | "g" | "j" | "z" | "s" | "c" | "x" | "k" | "t" | "f" | "p";
