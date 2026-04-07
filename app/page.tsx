"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { PlusCircle, Users, Pencil, Check, X, Wrench } from "lucide-react";
import { joinRoomAction } from "./actions/roomActions";

export default function HomePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinRoom = async () => {
    if (!roomCode || roomCode.length < 4) return;

    setIsJoining(true);
    try {
      // 1. Call the server action to add the user to the room's participant list
      const result = await joinRoomAction(roomCode, {
        id: user?.id,
        name: user?.name,
      });

      if (result.success) {
        // 2. Only redirect if the database update was successful
        router.push(`/lobby/${roomCode}`);
      } else {
        alert(result.error || "Room not found!");
        setIsJoining(false);
      }
    } catch (err) {
      console.error(err);
      setIsJoining(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("flixter_user");
    if (saved) {
      const parsed = JSON.parse(saved);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(parsed);
      setName(parsed.name); // Set initial name for editing
    }
  }, []);

  const handleSaveName = () => {
    if (!name.trim()) return;

    // Keep the same ID if editing, or generate new one if first time
    const newUser = {
      id: user?.id || Math.random().toString(36).substring(2, 9),
      name: name.trim(),
    };

    localStorage.setItem("flixter_user", JSON.stringify(newUser));
    setUser(newUser);
    setIsEditingName(false);
  };

  // View 1: Identify User (First Time)
  if (!user || isEditingName) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center p-6 bg-background">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center">
            <h1 className="text-5xl font-black tracking-tighter text-primary italic">
              NATHEO.SYNC
            </h1>
            <p className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold mt-2">
              Personalize your profile
            </p>
          </div>

          <Card className="p-6 border-2 border-border shadow-2xl">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-bold uppercase tracking-tight">
                  Display Name
                </p>
                {user && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditingName(false)}
                    className="h-6 w-6"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Input
                placeholder="What should we call you?"
                value={name}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSaveName();
                  }
                }}
                onChange={(e) => setName(e.target.value)}
                className="h-12 bg-background border-2 font-medium"
                autoFocus
              />
              <Button
                onClick={handleSaveName}
                className="w-full h-12 font-bold gap-2"
              >
                {user ? <Check className="w-4 h-4" /> : null}
                {user ? "UPDATE NAME" : "GET STARTED"}
              </Button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  // View 2: Create or Join
  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-sm space-y-12">
        <div className="text-center space-y-2 group">
          <h1 className="font-sans text-3xl font-black tracking-tighter text-primary italic mb-4">
            NATHEO.SYNC
          </h1>
          <div className="flex items-center justify-center gap-2 mt-4">
            <h1 className="text-4xl font-black tracking-tighter">
              Hey, {user.name}!
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditingName(true)}
              className="h-4 w-4 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <Pencil className="w-2 h-2" />
            </Button>
          </div>
          <p className="text-muted-foreground text-sm">
            Ready for a movie match?
          </p>
        </div>

        {/* ... Buttons for Create/Join stay the same ... */}
        <div className="grid gap-4">
          <Button
            onClick={() => router.push("/setup")}
            className="h-24 flex flex-col items-center justify-center gap-1 rounded-3xl border-2 border-primary/20 hover:border-primary transition-all bg-card text-foreground hover:bg-primary/5"
          >
            <PlusCircle className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg tracking-tight">
              CREATE SESSION
            </span>
          </Button>

          {/* Join Logic here */}
          {!isJoining ? (
            <Button
              // variant="outline"
              onClick={() => setIsJoining(true)}
              className="h-24 flex flex-col items-center justify-center gap-1 rounded-3xl border-2 border-primary/20 hover:border-primary transition-all bg-card text-foreground hover:bg-primary/5"
            >
              <Users className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg tracking-tight">
                JOIN SESSION
              </span>
            </Button>
          ) : (
            <Card className="p-4 border-2 border-primary rounded-3xl">
              {/* ... your previous join code ... */}
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Room Code"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleJoinRoom();
                    }
                  }}
                  maxLength={4}
                  className="h-12 text-center text-xl font-normal uppercase"
                />
                <Button
                  onClick={handleJoinRoom}
                  className="h-12 px-6 font-bold"
                >
                  GO
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Add the devtool button */}
        <div className="absolute bottom-4 right-4">
          <Button
            onClick={() => router.push("/devtool")}
            className="h-12 px-6 font-bold"
          >
            <Wrench className="w-4 h-4 mr-2" />
            Devtool
          </Button>
        </div>
      </div>
    </main>
  );
}
