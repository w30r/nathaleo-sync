"use client";

import React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Heart, X, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

export default function MovieCard({
  movie,
  onSwipe,
}: {
  movie: Movie;
  onSwipe: (dir: "left" | "right") => void;
}) {
  const x = useMotionValue(0);

  // Physics & Visuals
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  const opacity = useTransform(x, [-250, -150, 0, 150, 250], [0, 1, 1, 1, 0]);

  // Overlay Opacity
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-50, -150], [0, 1]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 120) onSwipe("right");
    else if (info.offset.x < -120) onSwipe("left");
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 w-full h-full touch-none"
    >
      {/* Dynamic Overlays using your Theme Colors */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-12 left-8 z-30 border-4 border-secondary text-secondary font-black px-6 py-2 rounded-lg text-4xl uppercase -rotate-12 pointer-events-none"
      >
        Dope
      </motion.div>
      <motion.div
        style={{ opacity: nopeOpacity }}
        className="absolute top-12 right-8 z-30 border-4 border-primary text-primary font-black px-6 py-2 rounded-lg text-4xl uppercase rotate-12 pointer-events-none"
      >
        Nope
      </motion.div>

      <Card className="w-full h-full overflow-hidden border-none shadow-2xl bg-card">
        <CardContent className="p-0 h-full relative">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-full object-cover select-none"
            draggable={false}
          />

          {/* Content Overlay */}
          <div className="absolute bottom-0 inset-x-0 h-2/5 bg-gradient-to-t from-background via-background/80 to-transparent p-6 flex flex-col justify-end gap-2">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-accent text-accent-foreground font-bold"
              >
                <Star className="w-3 h-3 mr-1 fill-current" />
                {movie.vote_average.toFixed(1)}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {movie.release_date.split("-")[0]}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-foreground leading-tight tracking-tight">
              {movie.title}
            </h2>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
