/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import MovieCard from "./MovieCard";
import { Button } from "@/components/ui/button";

export default function SwipeContainer({
  initialMovies,
}: {
  initialMovies: any[];
}) {
  const [movies, setMovies] = useState(initialMovies);

  const handleSwipe = (direction: "left" | "right") => {
    setMovies((prev) => {
      const newStack = prev.slice(1);
      // If we're getting low on movies, we could fetch more here
      return newStack;
    });
  };

  return (
    <div className="relative w-full max-w-[400px] h-[70vh] flex items-center justify-center perspective-1000">
      {movies.length > 0 ? (
        movies.map((movie, index) => {
          // Only render top 2 cards
          if (index > 1) return null;

          return (
            <MovieCard
              key={movie.id}
              movie={movie}
              isTop={index === 0}
              onSwipe={handleSwipe}
              // Pass index so we can scale the background card
              index={index}
            />
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground border-2 border-dashed rounded-3xl">
          <p className="text-xl font-bold">No more movies! 🍿</p>
          <Button variant="link" onClick={() => window.location.reload()}>
            Refresh Deck
          </Button>
        </div>
      )}
    </div>
  );
}
