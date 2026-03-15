// app/page.tsx
import SwipeContainer from "./components/SwipeContainer";
import GenreFilter from "./components/GenreFilter";

async function getData(genreId?: string) {
  const API_KEY = process.env.TMBD_API_KEY; // Use your 32-char key
  const BASE_URL = "https://api.themoviedb.org/3";

  try {
    // Standardize: Use api_key in the URL for BOTH fetches
    const [genreRes, movieRes] = await Promise.all([
      fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`),
      fetch(
        `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId || ""}&language=en-US&sort_by=popularity.desc`,
        { next: { revalidate: 3600 } },
      ),
    ]);

    const genreData = await genreRes.json();
    const movieData = await movieRes.json();

    // If API returns an error, log it to your TERMINAL (not browser console)
    if (genreData.success === false) {
      console.error("TMDB Genre Error:", genreData.status_message);
    }

    return {
      genres: genreData.genres || [],
      movies: movieData.results || [],
    };
  } catch (error) {
    console.error("Fetch implementation error:", error);
    return { genres: [], movies: [] };
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string }>;
}) {
  const params = await searchParams;
  const { genres, movies } = await getData(params.genre);

  // If genres is empty here, the GenreFilter will hit your "if empty return h-10" logic
  // and essentially become invisible.

  return (
    <main className="min-h-[100dvh] bg-black flex flex-col items-center overflow-hidden text-white">
      <div className="w-full pt-6 text-center shrink-0">
        <h1 className="text-2xl font-black tracking-tighter text-primary">
          FLIXTER
        </h1>
      </div>

      {/* Force a height and background so we can see if it's there */}
      <div className="w-full z-50 bg-zinc-900 border-y border-zinc-800">
        <GenreFilter genres={genres} />
      </div>

      <div className="flex-1 w-full flex items-center justify-center relative">
        <SwipeContainer initialMovies={movies} key={params.genre || "all"} />
      </div>
    </main>
  );
}
