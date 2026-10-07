// Browser-side realtime client helper.
import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export function realtime(namespace: string): Socket {
  if (!socket) {
    socket = io(namespace, { autoConnect: true });
  }
  return socket;
}
