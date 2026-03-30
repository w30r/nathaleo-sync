"use server";

import clientPromise from "@/lib/mongodb";
import { nanoid } from "nanoid";
import { notFound } from "next/navigation";

export async function getRoomResults(roomCode) {
  try {
    const client = await clientPromise;
    const db = client.db("flixter-db");

    const room = await db.collection("room").findOne({
      roomCode: roomCode.toUpperCase(),
    });

    if (!room) return null;

    // 1. Get all movie IDs liked by every participant
    const participantLikes = room.participants.map((p) => p.likes || []);

    // Find the intersection (movies everyone liked)
    const matches = participantLikes.reduce((a, b) =>
      a.filter((movieID) => b.includes(movieID)),
    );

    // 2. (Optional) Get movies liked by at least 2 people if no total match
    const partialMatches = [...new Set(participantLikes.flat())].filter(
      (movieID) => {
        const count = participantLikes.filter((likes) =>
          likes.includes(movieID),
        ).length;
        return count >= 2 && !matches.includes(movieID);
      },
    );

    return {
      matches,
      partialMatches,
      participants: room.participants,
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function finishSwipingAction(roomCode, userId) {
  try {
    const client = await clientPromise;
    const db = client.db("flixter-db");

    await db.collection("room").updateOne(
      {
        roomCode: roomCode.toUpperCase(),
        "participants.id": userId,
      },
      { $set: { "participants.$.status": "finished" } },
    );

    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

export async function joinRoomAction(roomCode, userData) {
  try {
    const client = await clientPromise;
    const db = client.db("flixter-db");

    const room = await db.collection("room").findOne({
      roomCode: roomCode.toUpperCase(),
      status: "open",
    });

    if (!room) {
      // router push to not-found page if room doesn't exist or isn't open
      notFound();
      return { success: false, error: "Room not found or not open" };
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
    return { success: false, error: e.message || "Failed to join room" };
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
      genres: roomData.genres,
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

export async function startRoomAction(roomCode) {
  try {
    const client = await clientPromise;
    const db = client.db("flixter-db");

    await db
      .collection("room")
      .updateOne(
        { roomCode: roomCode.toUpperCase() },
        { $set: { status: "active", startedAt: new Date() } },
      );

    return { success: true };
  } catch (e) {
    console.error("Start Room Error:", e);
    return { success: false };
  }
}

export async function getMoviesAction(genres, yearRange) {
  // Eventually, this will fetch from TMDB API
  // For now, let's return a Mock Array to test the UI
  return [
    {
      id: "1",
      title: "Inception",
      image: "https://image.tmdb.org/t/p/w500/9gk7Fn9sVAsS9696G1oV0Q1Xvub.jpg",
      year: 2010,
    },
    {
      id: "2",
      title: "The Matrix",
      image: "https://image.tmdb.org/t/p/w500/f89U3Y9L7dbptqyQej86Z7SqiU9.jpg",
      year: 1999,
    },
    {
      id: "3",
      title: "Interstellar",
      image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlSaba7.jpg",
      year: 2014,
    },
  ];
}

export async function recordSwipeAction(roomCode, userId, movieId, direction) {
  try {
    const client = await clientPromise;
    const db = client.db("flixter-db");

    // 1. Record the individual swipe for matching logic
    // We update the specific participant's 'likes' array if they swipe right
    const updateQuery =
      direction === "right"
        ? { $addToSet: { "participants.$.likes": movieId } }
        : { $addToSet: { "participants.$.dislikes": movieId } };

    const result = await db.collection("room").updateOne(
      {
        roomCode: roomCode.toUpperCase(),
        "participants.id": userId,
      },
      updateQuery,
    );

    // 2. Optional: Trigger a "Match Check" logic here
    // If the direction was 'right', we could check if everyone else likes it too.

    return { success: true, match: false };
  } catch (e) {
    console.error("Database Swipe Error:", e);
    return { success: false };
  }
}

export async function fetchMoreMovies(genreIds, page) {
  const API_KEY = process.env.TMDB_API_KEY;
  const genreFilter =
    genreIds?.length > 0 ? `&with_genres=${genreIds.join("|")}` : "";

  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&page=${page}${genreFilter}`;

  const res = await fetch(url);
  const data = await res.json();
  return data.results || [];
}
