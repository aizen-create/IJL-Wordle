"use client";

import { useCallback, useEffect, useState } from "react";
import {
  evaluateGuess,
  getTodaysAnswer,
  validateGuess,
  type LetterStatus,
} from "@/lib/game";

function statusToEmoji(s: LetterStatus): string {
  if (s === "correct") return "🟩";
  if (s === "present") return "🟨";
  return "⬛";
}

function rowsToEmoji(rows: Row[]): string {
  return rows.map((row) => row.statuses.map(statusToEmoji).join("")).join("\n");
}
import { GameGrid } from "./GameGrid";
import { Keyboard } from "./Keyboard";

const MAX_GUESSES = 5;

type Row = { letters: (string | null)[]; statuses: LetterStatus[] };

export function WordleGame() {
  const [answer, setAnswer] = useState<string | null>(null);

  const [puzzleDate, setPuzzleDate] = useState<string>("");

  useEffect(() => {
    setAnswer(getTodaysAnswer());
    const d = new Date();
    setPuzzleDate(
      `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`
    );
  }, []);
  const [rows, setRows] = useState<Row[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState<"win" | "lose" | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usedKeys, setUsedKeys] = useState<Record<string, LetterStatus>>({});

  const showError = useCallback((msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 2000);
  }, []);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (!answer || gameOver) return;

      if (key === "Enter") {
        const validation = validateGuess(currentGuess);
        if (!validation.valid) {
          showError(validation.error ?? "無効な入力です");
          return;
        }

        const statuses = evaluateGuess(currentGuess, answer);

        setRows((prev) => [
          ...prev,
          {
            letters: currentGuess.split(""),
            statuses,
          },
        ]);

        setUsedKeys((prev) => {
          const next = { ...prev };
          currentGuess.split("").forEach((char, i) => {
            const k = char.toLowerCase();
            const s = statuses[i];
            if (!next[k] || s === "correct") next[k] = s ?? null;
            else if (s === "present" && next[k] !== "correct") next[k] = s;
            else if (s === "absent" && !next[k]) next[k] = s;
          });
          return next;
        });

        setCurrentGuess("");

        if (currentGuess.toLowerCase() === answer.toLowerCase()) {
          setGameOver("win");
        } else if (rows.length + 1 >= MAX_GUESSES) {
          setGameOver("lose");
        }
        return;
      }

      if (key === "Backspace" || key === "⌫") {
        setCurrentGuess((prev) => prev.slice(0, -1));
        return;
      }

      const char = key.toLowerCase();
      if (/^[a-z0-9]$/.test(char) && currentGuess.length < 8) {
        setCurrentGuess((prev) => prev + char);
      }
    },
    [answer, currentGuess, gameOver, rows.length, showError]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "Enter") {
        e.preventDefault();
        handleKeyPress("Enter");
      } else if (e.key === "Backspace") {
        handleKeyPress("Backspace");
      } else if (/^[a-zA-Z0-9]$/.test(e.key)) {
        e.preventDefault();
        handleKeyPress(e.key.toLowerCase());
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleKeyPress]);

  if (!answer) {
    return (
      <div className="flex flex-col items-center gap-6 p-4">
        <h1 className="text-3xl font-bold tracking-wider">IJL WORDLE</h1>
        <p className="text-zinc-500">読み込み中...</p>
      </div>
    );
  }

  const displayRows: Row[] = [
    ...rows,
    ...(gameOver
      ? []
      : [
          {
            letters: currentGuess
              .split("")
              .slice(0, 8)
              .concat(Array(Math.max(0, 8 - currentGuess.length)).fill(null)),
            statuses: Array(8).fill(null) as LetterStatus[],
          },
        ]),
  ];

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <h1 className="text-3xl font-bold tracking-wider">IJL WORDLE</h1>
      <p className="text-sm text-zinc-500">
        IJL選手名を当ててください（1〜8文字、最大{MAX_GUESSES}回）
      </p>

      {error && (
        <div
          role="alert"
          className="rounded bg-red-100 px-4 py-2 text-red-700 dark:bg-red-900/50 dark:text-red-300"
        >
          {error}
        </div>
      )}
      {copyMessage && (
        <div
          role="status"
          className="rounded bg-green-100 px-4 py-2 text-green-700 dark:bg-green-900/50 dark:text-green-300"
        >
          {copyMessage}
        </div>
      )}

      <GameGrid rows={displayRows} maxRows={MAX_GUESSES} />

      {gameOver && (
        <div className="flex flex-wrap items-center justify-center gap-3 rounded-lg bg-zinc-100 px-6 py-4 dark:bg-zinc-800">
          {gameOver === "win" ? (
            <p className="text-lg font-semibold text-green-600 dark:text-green-400">
              正解です！
            </p>
          ) : (
            <p className="text-lg font-semibold text-red-600 dark:text-red-400">
              残念！正解は「{answer}」でした
            </p>
          )}
          {rows.length > 0 && (
            <>
              <button
                type="button"
                onClick={async () => {
                  try {
                    const url = typeof window !== "undefined" ? window.location.origin : "";
                    const header = `IJL wordle ${puzzleDate} ${rows.length}/5 ${url}\n`;
                    await navigator.clipboard.writeText(header + rowsToEmoji(rows));
                    setCopyMessage("コピーしました");
                    setTimeout(() => setCopyMessage(null), 1500);
                  } catch {
                    setError("コピーに失敗しました");
                    setTimeout(() => setError(null), 2000);
                  }
                }}
                className="rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600"
              >
                コピー
              </button>
              {gameOver === "win" && puzzleDate && (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const url = typeof window !== "undefined" ? window.location.origin : "";
                      const text = `IJL wordle ${puzzleDate} ${rows.length}/5 ${url}`;
                      await navigator.clipboard.writeText(text);
                      setCopyMessage("コピーしました");
                      setTimeout(() => setCopyMessage(null), 1500);
                    } catch {
                      setError("コピーに失敗しました");
                      setTimeout(() => setError(null), 2000);
                    }
                  }}
                  className="rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                >
                  回数だけコピー
                </button>
              )}
            </>
          )}
        </div>
      )}

      <Keyboard
        onKeyPress={(k) => handleKeyPress(k === "⌫" ? "Backspace" : k)}
        onEnter={() => handleKeyPress("Enter")}
        onBackspace={() => handleKeyPress("Backspace")}
        usedKeys={usedKeys}
      />
    </div>
  );
}
