import type { LetterStatus } from "@/lib/game";

type CellProps = {
  letter: string | null;
  status: LetterStatus;
};

export function Cell({ letter, status }: CellProps) {
  const statusStyles = {
    correct: "bg-green-600 border-green-600 text-white",
    present: "bg-amber-500 border-amber-500 text-white",
    absent: "bg-zinc-600 border-zinc-600 text-white dark:bg-zinc-500 dark:border-zinc-500",
    null: "border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-900",
  };

  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 text-lg font-bold uppercase transition-colors sm:h-14 sm:w-14 sm:text-2xl ${statusStyles[status ?? "null"]}`}
    >
      {letter ?? ""}
    </div>
  );
}
