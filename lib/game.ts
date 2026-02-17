import { isValidWord, WORD_LIST } from "./words";

export type LetterStatus = "correct" | "present" | "absent" | null;

export function getLetterStatus(
  guess: string,
  answer: string,
  index: number
): LetterStatus {
  const char = guess[index].toLowerCase();
  const answerChar = answer[index]?.toLowerCase();

  // 正解より前の位置：位置も一致すれば緑、単語内にあれば黄、なければ黒
  if (index < answer.length) {
    if (char === answerChar) return "correct";

    const countInAnswer = (answer.match(new RegExp(char, "gi")) ?? []).length;
    const countCorrectBefore = guess
      .slice(0, index)
      .split("")
      .filter((c, i) => c.toLowerCase() === char && answer[i]?.toLowerCase() === char).length;
    const countPresentBefore = guess
      .slice(0, index)
      .split("")
      .filter((c) => c.toLowerCase() === char).length;

    const usedCorrect = countCorrectBefore;
    const usedPresent = countPresentBefore - usedCorrect;
    const available = countInAnswer - usedCorrect - usedPresent;

    return available > 0 ? "present" : "absent";
  }

  // 正解より長い部分：単語内に残りがあれば黄、なければ黒
  const countInAnswer = (answer.match(new RegExp(char, "gi")) ?? []).length;
  const countCorrectBefore = guess
    .slice(0, index)
    .split("")
    .filter((c, i) => c.toLowerCase() === char && answer[i]?.toLowerCase() === char).length;
  const countPresentBefore = guess
    .slice(0, index)
    .split("")
    .filter((c) => c.toLowerCase() === char).length;

  const usedCorrect = countCorrectBefore;
  const usedPresent = countPresentBefore - usedCorrect;
  const available = countInAnswer - usedCorrect - usedPresent;

  return available > 0 ? "present" : "absent";
}

export function evaluateGuess(guess: string, answer: string): LetterStatus[] {
  return guess.split("").map((_, i) => getLetterStatus(guess, answer, i));
}

export function validateGuess(guess: string): {
  valid: boolean;
  error?: string;
} {
  if (guess.length === 0) {
    return { valid: false, error: "入力してください" };
  }
  if (guess.length > 8) {
    return { valid: false, error: "8文字以内で入力してください" };
  }
  if (!/^[a-zA-Z0-9]+$/.test(guess)) {
    return { valid: false, error: "アルファベットと数字のみ使用できます" };
  }
  if (!isValidWord(guess)) {
    return { valid: false, error: "この単語はリストにありません" };
  }
  return { valid: true };
}

/**
 * 日付ベースでシードを生成し、その日の正解単語を返す
 */
export function getTodaysAnswer(): string {
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();
  const index = seed % WORD_LIST.length;
  return WORD_LIST[index].toLowerCase();
}
