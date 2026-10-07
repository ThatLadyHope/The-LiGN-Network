// Self-hosted realtime gateway (Socket.io 4, same Node process, no Supabase).
// Namespaces isolate traffic: 1-on-1 chat, spaces, listener queue, notifications.
import { Server as SocketIOServer } from "socket.io";

export const RealtimeNamespace = {
  CHAT: "/chat",
  SPACES: "/spaces",
  LISTENERS: "/listeners",
  NOTIFY: "/notify",
} as const;

export function createGateway(): SocketIOServer {
  const io = new SocketIOServer({
    cors: { origin: process.env.APP_URL ?? "http://localhost:3000" },
  });
  for (const ns of Object.values(RealtimeNamespace)) {
    io.of(ns).on("connection", (socket) => {
      socket.on("join", (room: string) => {
        if (typeof room === "string" && room.length > 0 && room.length <= 100) {
          socket.join(room);
        }
      });
      socket.on("leave", (room: string) => socket.leave(room));
    });
  }
  return io;
}
