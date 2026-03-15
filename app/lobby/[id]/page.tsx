/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, Film, Timer, Share2, Play } from "lucide-react";
import { getRoomData } from "@/app/actions/roomActions";

export default function LobbyPage() {
  const { id } = useParams();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const refreshLobby = async () => {
      const data = await getRoomData(id as string);
      if (data) setRoom(data);
      setLoading(false);
      setCountdown(10); // Reset visual timer after fetch
    };

    refreshLobby();

    // 1. This interval handles the actual Data Fetch (every 10s)
    const fetchInterval = setInterval(refreshLobby, 10000);

    // 2. This interval handles the Visual Countdown (every 1s)
    const visualInterval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 10));
    }, 1000);

    return () => {
      clearInterval(fetchInterval);
      clearInterval(visualInterval);
    };
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!room) return <div className="p-10 text-center">Room not found!</div>;

  return (
    <main className="min-h-[100dvh] bg-background p-6 flex flex-col max-w-md mx-auto">
      {/* Header with Room Code */}
      <div className="text-center space-y-2 mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Room Code
        </p>
        <h1 className="text-5xl font-black tracking-tighter text-primary">
          {id}
        </h1>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full gap-2 border-2"
          onClick={() => navigator.clipboard.writeText(window.location.href)}
        >
          <Share2 className="w-4 h-4" /> Copy Link
        </Button>
      </div>

      <div className="flex-1 space-y-6">
        {/* Participants Section */}
        {/* Participants Section */}
        <section className="bg-card border-2 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase">
              <Users className="w-4 h-4" /> Squad
            </h2>
            <span className="text-[10px] font-medium text-muted-foreground bg-card px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
              </span>
              Refreshing in {countdown}s
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* DYNAMIC MAPPING START */}
            {room.participants?.map((player: any, index: number) => {
              // Handle if player is an object or just a string ID
              const name = typeof player === "object" ? player.name : player;
              const isHost = index === 0;

              return (
                <div key={index} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold border-2 ${isHost ? "bg-primary border-primary" : "bg-orange-500 border-orange-600"}`}
                  >
                    {name ? name[0].toUpperCase() : "?"}
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                    {isHost ? "Host" : name.split(" ")[0]}
                  </span>
                </div>
              );
            })}

            {/* Only show the "+" slot if there's room or just as a placeholder */}
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center text-muted-foreground/30">
              +
            </div>
            {/* DYNAMIC MAPPING END */}
          </div>
        </section>

        {/* Room Rules Summary */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-secondary/30 p-4 rounded-2xl space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase opacity-60">
              <Film className="w-3 h-3" /> Genres
            </div>
            <p className="font-bold text-sm">Action, Sci-Fi</p>
          </div>
          <div className="bg-secondary/30 p-4 rounded-2xl space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase opacity-60">
              <Timer className="w-3 h-3" /> Timer
            </div>
            <p className="font-bold text-sm">5 Minutes</p>
          </div>
        </section>
      </div>

      {/* Start Button (Only for Host) */}
      <div className="pt-8">
        <Button className="w-full h-16 rounded-2xl text-xl font-black tracking-tight shadow-lg gap-2">
          <Play className="w-6 h-6 fill-current" /> START SESSION
        </Button>
      </div>
    </main>
  );
}
