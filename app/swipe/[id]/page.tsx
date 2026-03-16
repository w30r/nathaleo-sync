import { getRoomData } from "@/app/actions/roomActions";
import { notFound } from "next/navigation";
import SwipeContainer from "../../components/SwipeContainer";

async function getMovies(genreId?: string) {
  const API_KEY = process.env.TMBD_API_KEY;
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId || ""}&language=en-US&sort_by=popularity.desc`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  const data = await res.json();
  console.log(data);
  return data.results || [];
}

export default async function SwipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log(id);
  const room = await getRoomData(id);

  if (!room) notFound();

  // Use the genre the host picked during setup
  const movies = await getMovies(room.config?.genre);

  return (
    <main className="h-dvh bg-background flex flex-col items-center overflow-hidden">
      {/* Dynamic Header */}
      <div className="w-full pt-20 px-8 flex justify-between items-end shrink-0 z-10 pb-6 ">
        <div className="">
          <h1 className="font-sans text-2xl font-black tracking-tighter text-primary leading-none">
            NATHALEO.SYNC
          </h1>
          <p className="text-[10px] font-bold text-muted-foreground tracking-[0.2em] uppercase mt-1">
            Swipe away!
          </p>
        </div>
      </div>

      <div className="w-full flex items-center justify-center relative p-4">
        <SwipeContainer
          initialMovies={movies}
          roomCode={id}
          durationInMinutes={room.duration || 1}
        />
      </div>
    </main>
  );
}
