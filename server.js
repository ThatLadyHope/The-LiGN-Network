// Custom server: Next.js + self-hosted Socket.io on one origin (no Supabase).
// Rooms are conversation/space ids. Persistence stays authoritative in the
// API; sockets only relay ("message" in → "message" out to the room).
// NOTE (local MVP): rooms are not socket-authenticated yet — ids are
// unguessable cuids and all reads/writes still pass API session checks.
const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const NAMESPACES = ["/chat", "/spaces", "/listeners", "/notify"];

app.prepare().then(() => {
  const server = createServer((req, res) => handle(req, res));
  const io = new Server(server, {
    cors: { origin: process.env.APP_URL || "http://localhost:3000" },
  });
  for (const ns of NAMESPACES) {
    io.of(ns).on("connection", (socket) => {
      socket.on("join", (room) => {
        if (typeof room === "string" && room.length > 0 && room.length <= 100) socket.join(room);
      });
      socket.on("leave", (room) => socket.leave(room));
      socket.on("message", (payload) => {
        if (payload && typeof payload.room === "string" && payload.room.length <= 100) {
          socket.to(payload.room).emit("message", payload);
        }
      });
    });
  }
  server.listen(3000, () => console.log("LiGN ready on http://localhost:3000"));
});
