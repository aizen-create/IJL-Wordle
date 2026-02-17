import { Cell } from "./Cell";
import type { LetterStatus } from "@/lib/game";

type Row = { letters: (string | null)[]; statuses: LetterStatus[] };

const MAX_CELLS = 8;

type GameGridProps = {
  rows: Row[];
  maxRows: number;
};

export function GameGrid({ rows, maxRows }: GameGridProps) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: maxRows }).map((_, rowIndex) => {
        const row = rows[rowIndex] ?? {
          letters: Array(MAX_CELLS).fill(null),
          statuses: Array(MAX_CELLS).fill(null) as LetterStatus[],
        };
        return (
          <div key={rowIndex} className="flex justify-center gap-2">
            {Array.from({ length: MAX_CELLS }).map((_, colIndex) => (
              <Cell
                key={colIndex}
                letter={row.letters[colIndex] ?? null}
                status={row.statuses[colIndex] ?? null}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
