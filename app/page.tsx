import { WordleGame } from "@/components/WordleGame";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="w-full max-w-xl px-4 py-8">
        <WordleGame />
      </main>
    </div>
  );
}
