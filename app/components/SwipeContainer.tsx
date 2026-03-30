/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import { Button } from "@/components/ui/button";
import {
  fetchMoreMovies,
  finishSwipingAction,
  getRoomData,
  recordSwipeAction,
} from "../actions/roomActions";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// --- 1. MOVE THIS OUTSIDE THE MAIN COMPONENT ---
function WaitingForSquad({ roomCode }: { roomCode: string }) {
  const router = useRouter();

  useEffect(() => {
    const checkStatus = setInterval(async () => {
      const room = await getRoomData(roomCode);
      if (!room) return;

      const allFinished = room.participants.every(
        (p: { status: string }) => p.status === "finished",
      );

      if (allFinished) {
        clearInterval(checkStatus);
        router.push(`/summary/${roomCode}`);
      }
    }, 2000);

    return () => clearInterval(checkStatus);
  }, [roomCode, router]); // Added router to dependencies

  return (
    <div className="flex flex-col items-center justify-center space-y-6 text-center">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="absolute inset-0 flex items-center justify-center font-black text-sm">
          WAIT
        </p>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black uppercase tracking-tight">
          Time's Up!
        </h2>
        <p className="text-muted-foreground text-sm max-w-[200px]">
          Waiting for the rest of the squad...
        </p>
      </div>
    </div>
  );
}

// --- 2. MAIN COMPONENT ---
export default function SwipeContainer({
  initialMovies,
  roomCode,
  durationInMinutes,
  genres,
}: {
  genres: any[];
  initialMovies: any[];
  roomCode: string;
  durationInMinutes: number;
}) {
  const [movies, setMovies] = useState(initialMovies);
  const [isFinished, setIsFinished] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Initialize with the dynamic duration
  const [timeLeft, setTimeLeft] = useState(durationInMinutes * 60);

  const triggerFetchMore = async () => {
    setIsFetching(true);
    const nextPage = currentPage + 1;
    try {
      const newMovies = await fetchMoreMovies(genres, nextPage);
      setMovies((prev) => [...prev, ...newMovies]);
      setCurrentPage(nextPage);
    } catch (err) {
      console.error("Failed to load more movies", err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSwipe = async (direction: "left" | "right") => {
    const swipedMovie = movies[0];
    if (!swipedMovie) return;

    const storedUser = localStorage.getItem("flixter_user");
    if (storedUser) {
      const { id: userId } = JSON.parse(storedUser);
      // Don't 'await' this if you want the UI to feel snappy
      recordSwipeAction(roomCode, userId, swipedMovie.id, direction);
    }

    // ONLY remove the card here. Don't trigger the fetch here.
    setMovies((prev) => prev.slice(1));
  };

  useEffect(() => {
    const loadMore = async () => {
      if (movies.length <= 5 && !isFetching && !isFinished) {
        setIsFetching(true);
        try {
          const nextPage = currentPage + 1;
          const newMovies = await fetchMoreMovies(genres, nextPage);

          if (newMovies.length > 0) {
            setMovies((prev) => [...prev, ...newMovies]);
            setCurrentPage(nextPage);
          }
        } catch (err) {
          console.error("Failed to fetch more movies:", err);
        } finally {
          setIsFetching(false);
        }
      }
    };

    loadMore();
  }, [movies.length, isFetching, genres, currentPage, isFinished]);

  // const handleSwipe = async (direction: "left" | "right") => {
  //   const swipedMovie = movies[0];
  //   if (!swipedMovie) return;

  //   // 1. Record Swipe (Don't wait for this to update the UI)
  //   const storedUser = localStorage.getItem("flixter_user");
  //   if (storedUser) {
  //     const { id: userId } = JSON.parse(storedUser);
  //     recordSwipeAction(roomCode, userId, swipedMovie.id, direction);
  //   }

  //   // 2. Update state and check length simultaneously
  //   setMovies((prev) => {
  //     const nextList = prev.slice(1);

  //     // Check if we need more movies based on the NEW list
  //     if (nextList.length <= 5 && !isFetching) {
  //       triggerFetchMore(); // Move fetching to a separate function
  //     }

  //     return nextList;
  //   });
  // };

  const handleFinish = async () => {
    setIsFinished(true);
    const user = JSON.parse(localStorage.getItem("flixter_user") || "{}");
    if (user.id) {
      await finishSwipingAction(roomCode, user.id);
    }
  };

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isFinished) {
      handleFinish();
    }
  }, [timeLeft, isFinished]);

  if (isFinished) {
    return <WaitingForSquad roomCode={roomCode} />;
  }

  return (
    <div className="relative w-full max-w-120 h-[70vh] flex items-center justify-center perspective-1000">
      {/* Timer UI */}
      <div className="absolute -top-3 left-8 right-8 h-2 bg-card rounded-full overflow-hidden border border-white/5">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: "100%" }}
          animate={{
            width: `${(timeLeft / (durationInMinutes * 60)) * 100}%`,
            backgroundColor: timeLeft <= 10 ? "#ef4444" : "#adfa1d",
          }}
          transition={{ duration: 1, ease: "linear" }}
        />

        {/* Optional: Tiny Ticking Text if you still want the number, 
      otherwise just leave the bar for a super clean look */}
        {timeLeft <= 10 && (
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute right-0 -top-6 text-[10px] font-black text-red-500 tabular-nums"
          >
            {timeLeft}S
          </motion.span>
        )}
      </div>

      {/* Movie Stack */}
      {movies.length > 0 ? (
        movies.map((movie, index) => {
          if (index > 1) return null;
          return (
            <MovieCard
              key={movie.id}
              movie={movie}
              isTop={index === 0}
              onSwipe={handleSwipe}
              index={index}
            />
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground border-2 border-dashed rounded-3xl p-8">
          <p className="text-xl font-bold">No more movies! 🍿</p>
          <Button variant="link" onClick={() => window.location.reload()}>
            Refresh Deck
          </Button>
        </div>
      )}
    </div>
  );
}
