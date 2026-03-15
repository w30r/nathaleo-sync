"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface Genre {
  id: number;
  name: string;
}

export default function GenreFilter({ genres = [] }: { genres: Genre[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("genre");

  const handleSelect = (id: number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) {
      params.set("genre", id.toString());
    } else {
      params.delete("genre");
    }
    // This updates the URL, triggering the Server Component to re-fetch
    router.push(`?${params.toString()}`);
  };

  // Optional: Add a check if the list is empty
  if (!genres || genres.length === 0) {
    return <div className="h-10" />; // Keep layout stable while empty
  }

  console.log("CLIENT SIDE GENRES:", genres);

  if (!genres || genres.length === 0) {
    return (
      <div className="w-full bg-yellow-500 p-2 text-black text-center">
        DATA ERROR: Genres array is empty! Check server console.
      </div>
    );
  }

  return (
    // Changed w-3/4 to w-full and added a border for visibility
    <div className="w-full bg-background overflow-x-auto no-scrollbar py-3 px-4 flex items-center gap-3 whitespace-nowrap">
      <span className="text-[10px] font-bold text-muted-background uppercase tracking-widest mr-2">
        Genres
      </span>

      <Badge
        variant={!selectedId ? "default" : "outline"}
        className="cursor-pointer px-4 py-1.5 rounded-full transition-all shrink-0"
        onClick={() => handleSelect(null)}
      >
        All
      </Badge>

      {genres.map((genre) => (
        <Badge
          key={genre.id}
          variant={selectedId === genre.id.toString() ? "default" : "outline"}
          className={cn(
            "cursor-pointer px-4 py-1.5 rounded-full transition-all shrink-0",
            // FIX: Use primary color for background and ensure text is readable
            selectedId === genre.id.toString()
              ? "bg-secondary text-primary-foreground shadow-lg shadow-primary/20"
              : "text-white border-white/20 hover:bg-white/10",
          )}
          onClick={() => handleSelect(genre.id)}
        >
          {genre.name}
        </Badge>
      ))}
    </div>
  );
}
