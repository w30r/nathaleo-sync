"use server";

import clientPromise from "@/lib/mongodb";
import { nanoid } from "nanoid";

export async function joinRoomAction(roomCode, userData) {
  try {
    const client = await clientPromise;
    const db = client.db("flixter-db");

    const room = await db.collection("room").findOne({
      roomCode: roomCode.toUpperCase(),
      status: "open",
    });

    if (!room) {
      return { success: false, error: "Room not found or session ended" };
    }

    // Check if the user ID is already in the participants list
    const isAlreadyInRoom = room.participants?.some(
      (p) => p.id === userData.id,
    );

    if (isAlreadyInRoom) {
      // If they are already there, just let them in without adding a duplicate
      return { success: true };
    }

    // If they aren't in the room, add them
    await db.collection("room").updateOne(
      { roomCode: roomCode.toUpperCase() },
      {
        $push: {
          participants: {
            id: userData.id,
            name: userData.name,
            role: "member",
            joinedAt: new Date(),
          },
        },
      },
    );

    return { success: true };
  } catch (e) {
    console.error("Join Error:", e);
    return { success: false, error: "External database error" };
  }
}

export async function createRoomAction(roomData) {
  try {
    const client = await clientPromise;
    const db = client.db("flixter-db");

    // Generate a 4-character room code
    const roomCode = nanoid(4).toUpperCase();

    const newRoom = {
      // spread roomData (hostId, hostName, genres, duration, yearRange)
      ...roomData,
      roomCode,
      status: "open",
      createdAt: new Date(),
      // UPDATED: Store the host as an object inside the array
      participants: [
        {
          id: roomData.hostId,
          name: roomData.hostName,
          role: "host",
          joinedAt: new Date(),
        },
      ],
    };

    await db.collection("room").insertOne(newRoom);

    return { success: true, roomCode };
  } catch (e) {
    console.error("Database Error:", e);
    return { success: false, error: "Failed to create room" };
  }
}

export async function getRoomData(roomCode) {
  try {
    const client = await clientPromise;
    const db = client.db("flixter-db");

    // Find the room using the singular collection name
    const room = await db.collection("room").findOne({
      roomCode: roomCode.toUpperCase(),
    });

    if (!room) return null;

    // MongoDB objects have a unique 'ObjectID' that Next.js can't pass
    // to the frontend easily, so we convert it to a plain string.
    return JSON.parse(JSON.stringify(room));
  } catch (e) {
    console.error("Fetch Error:", e);
    return null;
  }
}
