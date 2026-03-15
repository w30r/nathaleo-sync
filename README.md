# 🎬 Nathaleo-Sync

**Nathaleo-Sync** is a high-energy, real-time movie selection app designed to end the "What should we watch?" debate forever. Host a room, invite your squad, and sync your tastes through a seamless swiping experience.

---

## 🚀 The Vision
Stop sharing your screen or shouting movie titles across the room. Nathaleo-Sync allows a group of people to join a shared session, swipe on movie cards independently, and find the "Match" that everyone actually wants to watch.

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) (Direct Node.js Driver)
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide-React](https://lucide.dev/)
- **Styling**: Tailwind CSS
- **Code Generation**: [Nanoid](https://github.com/ai/nanoid) for unique Room IDs

---

## 📡 Core Architecture: The "Heartbeat" Sync

Instead of heavy WebSockets, Nathaleo-Sync utilizes an optimized **Client-Side Polling** strategy to keep the squad in sync.

### 1. Atomic Database Actions
We use Next.js **Server Actions** to communicate directly with MongoDB. 
* `createRoomAction`: Initializes the session and generates a 4-character uppercase code.
* `joinRoomAction`: Uses MongoDB's `$push` and validation logic to add participants without duplicates.
* `getRoomData`: A lightning-fast fetcher that hydrates the lobby state.

### 2. The Lobby Polling Hook
The Lobby (`/lobby/[id]`) features a dual-interval "Heartbeat":
* **Data Fetch**: Hits the database every few seconds to refresh the participant list.
* **UI Countdown**: A 1-second interval that powers a visual "Syncing in X seconds" indicator, giving users immediate feedback that the app is alive.



---

## 🚦 Getting Started

### 1. Prerequisites
* Node.js 18+ 
* A MongoDB Atlas Cluster

### 2. Environment Setup
Create a `.env.local` file in the root directory:

### 3. Installation
```text
npm install
```
### 4. Run Development
```text
npm run dev
```
Navigate to http://localhost:3000 to create your first room.
