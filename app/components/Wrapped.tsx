"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function SummaryWrapped({
  participants,
  matches,
  roomCode,
}: any) {
  const [step, setStep] = useState(0);

  // 1. Calculate the "Top Genre" (This requires the movie details for the matches)
  const topGenre = useMemo(() => {
    if (!matches || matches.length === 0) return "Unknown";

    // 1. Flatten the names specifically
    const genreNames: string[] = matches.flatMap((m: any) =>
      m.genres ? m.genres.map((g: any) => g.name) : [],
    );

    if (genreNames.length === 0) return "Movie Buffs";

    // 2. Count occurrences
    const counts = genreNames.reduce((acc: any, name: string) => {
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

    // 3. Find the key with the highest count
    return Object.keys(counts).reduce((a, b) =>
      counts[a] > counts[b] ? a : b,
    );
  }, [matches]);

  const slides = [
    // SLIDE 1: THE TALE OF THE TAPE (Stats)
    {
      id: "stats",
      content: (
        <div className="space-y-8 text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h2 className="text-sm font-black text-primary uppercase tracking-[0.4em] mb-2">
              The Tale of the Tape
            </h2>
            <h3 className="text-6xl font-black italic tracking-tighter uppercase leading-none">
              Who Liked What?
            </h3>
          </motion.div>

          <div className="space-y-4">
            {participants.map((p: any, i: number) => (
              <motion.div
                key={p.id}
                initial={{ x: i % 2 === 0 ? -100 : 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.2, type: "spring" }}
                className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl flex justify-between items-center"
              >
                <div className="text-left">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                    Participant
                  </p>
                  <p className="text-2xl font-black italic">{p.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-5xl font-black text-primary">
                    {(p.likes || []).length}
                  </p>
                  <p className="text-[10px] font-bold uppercase text-zinc-500">
                    Likes
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    // SLIDE 2: THE GENRE VIBE
    {
      id: "genre",
      content: (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ rotate: -10, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            className="w-32 h-32 bg-primary rounded-full mx-auto flex items-center justify-center text-black"
          >
            <span className="text-4xl">🍿</span>
          </motion.div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold uppercase tracking-tighter text-zinc-400">
              The Room Vibe was...
            </h2>
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-7xl font-black italic uppercase text-white tracking-tighter"
            >
              {topGenre}
            </motion.h3>
          </div>
          <p className="text-muted-foreground max-w-[250px] mx-auto text-sm">
            You both seem to have a taste for the dramatic (or just the
            popular).
          </p>
        </div>
      ),
    },
    // SLIDE 3: THE PERFECT MATCHES
    {
      id: "matches",
      content: (
        // Use h-full and min-h-0 to tell flexbox to contain itself
        <div className="h-full flex flex-col pt-10 min-h-0">
          <div className="text-center mb-4 flex-shrink-0">
            {" "}
            {/* flex-shrink-0 prevents header from squishing */}
            <h2 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
              The Finalists
            </h2>
            <p className="text-primary font-bold text-xs uppercase tracking-widest mt-2">
              {matches.length} Unanimous Picks
            </p>
          </div>

          {/* This is the key: overflow-y-auto combined with flex-1 */}
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <div className="grid grid-cols-3 gap-3 pb-4">
              {matches.map((m: any, i: number) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative aspect-[2/3] rounded-2xl overflow-hidden border border-zinc-800"
                >
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                    alt={m.title}
                    fill
                    sizes="xl"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                    <p className="text-[10px] font-black uppercase truncate">
                      {m.title}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-background text-foreground p-6 flex flex-col">
      {/* Progress Ticks at Top (Spotify Style) */}
      <div className="flex gap-1.5 mb-8">
        {slides.map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 bg-card rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-foreground"
              initial={{ width: "0%" }}
              animate={{
                width: step === i ? "100%" : step > i ? "100%" : "0%",
              }}
              transition={{ duration: step === i ? 5 : 0.3 }} // 5s slide duration
            />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 1.1, x: -20 }}
          className="flex-1 flex flex-col justify-center"
        >
          {slides[step].content}
        </motion.div>
      </AnimatePresence>

      <div className="mt-auto pt-6 flex gap-3">
        {step > 0 && (
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            className="h-14 px-6 border-zinc-800 rounded-2xl"
          >
            ←
          </Button>
        )}

        {step < slides.length - 1 ? (
          <Button
            onClick={() => setStep(step + 1)}
            className="flex-1 h-14 bg-white text-black font-black uppercase italic rounded-2xl text-lg"
          >
            Next Story
          </Button>
        ) : (
          <Button
            onClick={() => (window.location.href = "/")}
            className="flex-1 h-14 bg-primary text-black font-black uppercase italic rounded-2xl text-lg"
          >
            Finish Session
          </Button>
        )}
      </div>
    </div>
  );
}
