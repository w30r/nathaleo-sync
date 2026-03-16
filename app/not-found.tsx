import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ghost, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="h-[100dvh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      {/* Visual Icon */}
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
        <Ghost className="w-24 h-24 text-primary relative animate-bounce" />
      </div>

      {/* Text Content */}
      <div className="space-y-2">
        <h1 className="text-6xl font-black tracking-tighter">404</h1>
        <h2 className="text-xl font-bold uppercase tracking-widest text-muted-foreground">
          Room is Empty
        </h2>
        <p className="max-w-70 text-sm text-muted-foreground leading-3 tracking-wide text-center">
          The movie session you're looking for doesn't exist or the squad has
          already disbanded.
        </p>
      </div>

      {/* Action Button */}
      <Link href="/" passHref>
        <Button
          variant="outline"
          size="lg"
          className="rounded-2xl font-bold gap-2 px-8"
        >
          <Home className="w-4 h-4" /> BACK TO HOME
        </Button>
      </Link>
    </main>
  );
}
