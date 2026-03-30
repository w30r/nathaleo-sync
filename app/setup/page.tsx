"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  // Play,
  Film,
  Timer,
  Calendar,
  ChevronLeft,
} from "lucide-react";
import { createRoomAction } from "../actions/roomActions";
import { select } from "framer-motion/client";

const GENRES = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
  { id: 878, name: "Sci-Fi" },
  { id: 16, name: "Animation" },
  { id: 12, name: "Adventure" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

const YEAR_RANGES = [
  { label: "All Time", value: "all" },
  { label: "Modern (2010+)", value: "2010" },
  { label: "Retro (90s & 00s)", value: "1990-2010" },
  { label: "Classic (Pre-90s)", value: "0-1990" },
];

export default function SetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [duration, setDuration] = useState("5");
  const [yearRange, setYearRange] = useState("all");
  const [user, setUser] = useState<{ name: string; id: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("flixter_user");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setUser(JSON.parse(saved));
    else router.push("/");
  }, [router]);

  const toggleGenre = (id: number) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );
    console.log(selectedGenres);
  };

  const handleSelectAllGenres = () => {
    setSelectedGenres(GENRES.map((g) => g.id));
  };
  const handleDeselectAllGenres = () => {
    setSelectedGenres([]);
  };

  const handleCreateRoom = async () => {
    setLoading(true);
    try {
      // Call the Server Action directly like a normal function
      const result = await createRoomAction({
        hostId: user?.id,
        hostName: user?.name,
        genres: selectedGenres,
        duration: parseInt(duration),
        yearRange: yearRange,
      });

      console.log("DEBUG: Response from Server Action:", result);

      if (result.success) {
        router.push(`/lobby/${result.roomCode}`);
        console.log("Room created:", result);
        console.log("selectedGenres:", selectedGenres);
      } else {
        alert("Something went wrong!");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-dvh bg-background p-6 flex flex-col max-w-md mx-auto select-none">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/")}
          className="rounded-full"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl font-black tracking-tighter">SESSION SETUP</h1>
      </div>

      <div className="flex-1 space-y-8">
        {/* Genres */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
            <Film className="w-4 h-4" /> Pick Genres
          </label>
          <div className="flex flex-wrap gap-2">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={
                  selectedGenres.length === GENRES.length
                    ? "default"
                    : "secondary"
                }
                className="px-4 py-2 rounded-xl text-sm transition-all border-2"
                onClick={handleSelectAllGenres}
              >
                Select All
              </Button>
              <Button variant="destructive" onClick={handleDeselectAllGenres}>
                Deselect All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <Badge
                  key={g.id}
                  variant={
                    selectedGenres.includes(g.id) ? "default" : "outline"
                  }
                  className="cursor-pointer px-4 py-2 rounded-xl text-sm transition-all border-2"
                  onClick={() => toggleGenre(g.id)}
                >
                  {g.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Year Range */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
            <Calendar className="w-4 h-4" /> Release Era
          </label>
          <div className="grid grid-cols-2 gap-2">
            {YEAR_RANGES.map((range) => (
              <Button
                key={range.value}
                variant={yearRange === range.value ? "default" : "outline"}
                className="justify-start font-bold rounded-xl border-2 h-12"
                onClick={() => setYearRange(range.value)}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Timer */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
            <Timer className="w-4 h-4" /> Swiping Time
          </label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="w-full h-14 rounded-xl border-2 bg-card font-bold text-lg">
              <SelectValue placeholder="How long?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Minute (Panic!)</SelectItem>
              <SelectItem value="2">2 Minutes</SelectItem>
              <SelectItem value="5">5 Minutes</SelectItem>
              <SelectItem value="10">10 Minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-10">
        <Button
          onClick={handleCreateRoom}
          disabled={loading || selectedGenres.length === 0}
          className="w-full h-16 rounded-2xl text-xl font-black tracking-tight shadow-lg hover:translate-y-[-2px] active:translate-y-[1px] transition-all"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            "GENERATE ROOM CODE"
          )}
        </Button>
      </div>
    </main>
  );
}
