import MovieCard from "./MovieCard";

// components/swipe-engine.tsx
export const SwipeEngine = ({ activeMovie, onAction }: any) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-md mx-auto p-4">
      <div className="relative w-full aspect-[2/3] perspective-1000">
        {/* We will map through a stack here later */}
        <MovieCard
          movie={activeMovie}
          onSwipe={(dir: string) =>
            onAction(dir === "right" ? "like" : "dislike")
          }
        />
      </div>

      <div className="flex gap-6 mt-12">
        <button
          onClick={() => onAction("dislike")}
          className="h-16 w-16 flex items-center justify-center rounded-full bg-card border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-lg"
        >
          <X size={32} />
        </button>
        <button
          onClick={() => onAction("like")}
          className="h-16 w-16 flex items-center justify-center rounded-full bg-card border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all shadow-lg"
        >
          <Heart size={32} fill="currentColor" />
        </button>
      </div>
    </div>
  );
};
