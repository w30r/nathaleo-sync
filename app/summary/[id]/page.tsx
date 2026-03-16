import { getRoomResults } from "@/app/actions/roomActions";
import { notFound } from "next/navigation";
import SummaryWrapped from "@/app/components/Wrapped";

async function getMovieDetails(movieIds: string[]) {
  const API_KEY = process.env.TMBD_API_KEY;
  const requests = movieIds.map((id) =>
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`).then(
      (res) => res.json(),
    ),
  );
  return Promise.all(requests);
}

export default async function SummaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const results = await getRoomResults(id);
  if (!results) notFound();

  // Fetch the full details for the matches
  const matchedMovies = await getMovieDetails(results.matches);

  return (
    <SummaryWrapped
      roomCode={id}
      participants={results.participants}
      matches={matchedMovies}
    />
  );
}

// export default async function SummaryPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params;
//   const results = await getRoomResults(id);

//   if (!results) notFound();

//   const matchedMovies = await getMovieDetails(results.matches);

//   return (
//     <main className="min-h-screen bg-background text-foreground p-6 space-y-8 md:px-36">
//       <header className="text-center space-y-2">
//         <h1 className="text-4xl font-black tracking-tighter text-primary italic">
//           THE RESULTS
//         </h1>
//         <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.3em]">
//           Room: {id}
//         </p>
//       </header>

//       <section className="space-y-4">
//         <h2 className="text-xl font-bold border-l-4 border-primary pl-4 uppercase tracking-tight">
//           Perfect Matches ({matchedMovies.length})
//         </h2>

//         {matchedMovies.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 ">
//             {matchedMovies.map((movie) => (
//               <div
//                 key={movie.id}
//                 className="group relative rounded-2xl overflow-hidden border border-border bg-card"
//               >
//                 <div className="aspect-2/3 relative">
//                   <Image
//                     src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
//                     alt={movie.title}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//                 <div className="p-3 text-center">
//                   <p className="font-black text-xs line-clamp-1 truncate uppercase">
//                     {movie.title}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="p-12 rounded-3xl border-2 border-dashed border-zinc-800 text-center">
//             <p className="text-zinc-500 font-bold">
//               No unanimous matches... yet.
//             </p>
//           </div>
//         )}
//       </section>

//       {/* Button to start over or go home */}
//       <footer className="pt-10 flex items-center justify-center">
//         <Link href="/">
//           <Button
//             variant="destructive"
//             className="w-full h-12 font-bold md:w-md animate-bounce"
//           >
//             Start Over
//           </Button>
//         </Link>
//       </footer>
//     </main>
//   );
// }
