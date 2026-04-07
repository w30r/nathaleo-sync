"use client";
import { Button } from "@/components/ui/button";
import { getAllRooms } from "../actions/roomActions";
import { useEffect, useState } from "react";

export interface MongoDate {
  $date: string;
}
export interface MongoId {
  $oid: string;
}
export interface Participant {
  id: string;
  name: string;
  role: "host" | "member";
  joinedAt: MongoDate;
  likes: number[]; // Array of movie/content IDs
  dislikes: number[]; // Array of movie/content IDs
}
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

export interface Room {
  _id: MongoId;
  hostId: string;
  hostName: string;
  genres: number[];
  duration: number;
  yearRange: string;
  roomCode: string;
  status: "active" | "inactive" | "started"; // Adjust based on your logic
  createdAt: MongoDate;
  participants: Participant[];
  startedAt?: MongoDate; // Optional since a room might not have started yet
}

export default function Devtool() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [viewMode, setViewMode] = useState<"card" | "table" | "list">("card");

  useEffect(() => {
    const fetchRooms = async () => {
      const fetchedRooms = await getAllRooms();
      setRooms(fetchedRooms);
    };
    fetchRooms();
  }, []);

  const toggleViewMode = (mode: "card" | "table" | "list") => {
    setViewMode(mode);
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-background">
      <h1 className="font-bold text-3xl mb-2">Rooms</h1>
      <div className="flex-1 w-full">
        <div className="flex justify-center mb-4">
          <Button
            onClick={() => toggleViewMode("card")}
            className={viewMode === "card" ? "bg-primary text-white" : ""}
          >
            Card View
          </Button>
          <Button
            onClick={() => toggleViewMode("table")}
            className={viewMode === "table" ? "bg-primary text-white" : ""}
          >
            Table View
          </Button>
          <Button
            onClick={() => toggleViewMode("list")}
            className={viewMode === "list" ? "bg-primary text-white" : ""}
          >
            List View
          </Button>
        </div>
        {viewMode === "card" && (
          <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room: Room) => (
              <div
                key={room.roomCode}
                className="bg-card p-4 rounded-lg shadow-md"
              >
                <h2 className="text-lg font-bold">{room.roomCode}</h2>
                <p className="text-sm">{room.status}</p>
                <p className="text-sm">
                  {GENRES.filter((genre) => room.genres.includes(genre.id))
                    .map((genre) => genre.name)
                    .join(", ")}
                </p>
                <div className="mt-2">
                  <Button className="w-full">View Room</Button>
                </div>
              </div>
            ))}
          </div>
        )}
        {viewMode === "table" && (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th>Room Code</th>
                <th>Status</th>
                <th>Genres</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room: Room) => (
                <tr key={room.roomCode}>
                  <td>{room.roomCode}</td>
                  <td>{room.status}</td>
                  <td>
                    {GENRES.filter((genre) => room.genres.includes(genre.id))
                      .map((genre) => genre.name)
                      .join(", ")}
                  </td>
                  <td>
                    <Button className="w-full">View Room</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {viewMode === "list" && (
          <ul className="list-disc pl-4">
            {rooms.map((room: Room) => (
              <li key={room.roomCode}>
                <div className="bg-card p-4 rounded-lg shadow-md">
                  <h2 className="text-lg font-bold">{room.roomCode}</h2>
                  <p className="text-sm">{room.status}</p>
                  <p className="text-sm">
                    {GENRES.filter((genre) => room.genres.includes(genre.id))
                      .map((genre) => genre.name)
                      .join(", ")}
                  </p>
                  <div className="mt-2">
                    <Button className="w-full">View Room</Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
