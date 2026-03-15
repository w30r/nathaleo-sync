/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Star, Undo2 } from "lucide-react";
import Image from "next/image";

export default function MovieCard({ movie, onSwipe, isTop, index }: any) {
  const [isFlipped, setIsFlipped] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(
    x,
    [-200, -150, 0, 150, 200],
    [0.5, 1, 1, 1, 0.5],
  );

  const handleDragEnd = (_: any, info: any) => {
    if (isFlipped) {
      animate(x, 0, { type: "spring", stiffness: 400, damping: 30 });
      return;
    }
    if (Math.abs(info.offset.x) > 100) {
      const direction = info.offset.x > 0 ? 1 : -1;
      animate(x, direction * 600, {
        velocity: info.velocity.x,
        duration: 0.4,
        ease: "easeIn",
      });
      setTimeout(() => onSwipe(direction === 1 ? "right" : "left"), 200);
    } else {
      animate(x, 0, { type: "spring", stiffness: 400, damping: 25 });
    }
  };

  const handleTap = () => {
    if (!isTop || Math.abs(x.get()) > 5) return;
    setIsFlipped(!isFlipped);
  };

  return (
    <motion.div
      initial={false}
      animate={{
        scale: isTop ? 1 : 0.9,
        y: isTop ? 0 : 20,
        zIndex: isTop ? 50 : 0,
      }}
      style={{
        x,
        rotate: isTop && !isFlipped ? rotate : 0,
        opacity,
      }}
      drag={isTop && !isFlipped ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      onTap={handleTap}
      transition={{ type: "spring", stiffness: 250, damping: 25 }}
      className="absolute inset-0 w-full h-full px-4 cursor-pointer touch-none [perspective:1000px]"
    >
      {/* THE FLIPPER - This handles the 3D rotation */}
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full h-full transition-shadow duration-500 rounded-3xl"
      >
        {/* FRONT FACE */}
        <div
          className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-2xl"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "translateZ(1px)", // Force layer separation
          }}
        >
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            fill
            className="object-cover pointer-events-none"
            priority={isTop}
          />
          <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-6 flex flex-col justify-end">
            <h2 className="text-3xl font-black text-white leading-tight">
              {movie.title}
            </h2>
            <div className="flex items-center gap-2 mt-3">
              <Badge className="bg-primary text-primary-background border-none">
                <Star className="w-3 h-3 mr-1 fill-yellow-500" />
                {movie.vote_average.toFixed(1)}
              </Badge>
            </div>
          </div>
        </div>

        {/* BACK FACE */}
        <div
          className="absolute inset-0 w-full h-full bg-card p-8 flex flex-col justify-between rounded-3xl shadow-2xl border border-border"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg) translateZ(1px)", // Separation + Flip
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <Undo2 className="w-6 h-6 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Overview
            </h3>
            <div className="w-6 h-6" />
          </div>

          <div className="flex-1 flex items-center justify-center">
            <p className="text-lg text-muted-foreground font-medium leading-relaxed text-center balance line-clamp-[12]">
              {movie.overview || "No description available for this title."}
            </p>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            <Badge variant="outline" className="border-primary/20 text-primary">
              Details
            </Badge>
            <Badge
              variant="outline"
              className="border-secondary/20 text-primary"
            >
              Movie
            </Badge>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
