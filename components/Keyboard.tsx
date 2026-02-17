"use client";

import type { LetterStatus } from "@/lib/game";

// Mac風レイアウト：数字最上段 + 英字3段
const ROW_NUMBERS = "0123456789";
const ROW1 = "qwertyuiop";
const ROW2 = "asdfghjkl";
const ROW3 = "zxcvbnm";

type KeyboardProps = {
  onKeyPress: (key: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
  usedKeys: Record<string, LetterStatus>;
};

function Key({
  children,
  onClick,
  status,
}: {
  children: string;
  onClick: () => void;
  status: LetterStatus;
}) {
  const statusStyles = {
    correct: "bg-green-600 text-white",
    present: "bg-amber-500 text-white",
    absent: "bg-zinc-600 text-white dark:bg-zinc-500",
    null: "bg-zinc-200 dark:bg-zinc-700",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-w-[28px] rounded px-2 py-3 text-sm font-medium uppercase transition-colors hover:bg-zinc-300 dark:hover:bg-zinc-600 sm:min-w-[36px] sm:px-3 sm:text-base ${statusStyles[status ?? "null"]}`}
    >
      {children}
    </button>
  );
}

export function Keyboard({
  onKeyPress,
  onEnter,
  onBackspace,
  usedKeys,
}: KeyboardProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* 1段目: 数字 */}
      <div className="flex justify-center gap-1">
        {ROW_NUMBERS.split("").map((key) => (
          <Key
            key={key}
            onClick={() => onKeyPress(key)}
            status={usedKeys[key] ?? null}
          >
            {key}
          </Key>
        ))}
      </div>
      {/* 2段目: qwertyuiop */}
      <div className="flex justify-center gap-1">
        {ROW1.split("").map((key) => (
          <Key
            key={key}
            onClick={() => onKeyPress(key)}
            status={usedKeys[key] ?? null}
          >
            {key}
          </Key>
        ))}
      </div>
      {/* 3段目: asdfghjkl */}
      <div className="flex justify-center gap-1">
        {ROW2.split("").map((key) => (
          <Key
            key={key}
            onClick={() => onKeyPress(key)}
            status={usedKeys[key] ?? null}
          >
            {key}
          </Key>
        ))}
      </div>
      {/* 4段目: zxcvbnm + Enter + Backspace */}
      <div className="flex justify-center gap-1">
        <button
          type="button"
          onClick={onEnter}
          className="rounded px-3 py-3 text-sm font-medium bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600"
        >
          Enter
        </button>
        {ROW3.split("").map((key) => (
          <Key
            key={key}
            onClick={() => onKeyPress(key)}
            status={usedKeys[key] ?? null}
          >
            {key}
          </Key>
        ))}
        <button
          type="button"
          onClick={onBackspace}
          className="rounded px-3 py-3 text-sm font-medium bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600"
        >
          ⌫
        </button>
      </div>
    </div>
  );
}
