// LiGN Phase 10 — journal (private) + shared memories (mutual) (PRD §58, §60).

export interface JournalEntry {
  id: string;
  ownerId: string;
  connectionId: string | null;
  content: string;
  createdAt: string;
}

// Invariant: journal entries are never automatically shared. No share path exists.
export function journalIsShareable(): false {
  return false;
}

export function createJournalEntry(
  id: string,
  ownerId: string,
  connectionId: string | null,
  content: string,
  createdAt: string,
): JournalEntry {
  if (!content.trim()) throw new Error("journal: empty entry");
  return { id, ownerId, connectionId, content, createdAt };
}

export interface SharedMemory {
  id: string;
  participantIds: [string, string];
  content: string;
  approvals: [boolean, boolean];
  withdrawnBy: string[];
}

// Creation requires explicit participation from BOTH people.
export function createSharedMemory(
  id: string,
  a: string,
  b: string,
  content: string,
): SharedMemory {
  return { id, participantIds: [a, b], content, approvals: [true, true], withdrawnBy: [] };
}

// Withdrawal: disappears from the withdrawer's view; the other is notified
// WITHOUT the reason; the other keeps their own personal version.
export function withdrawMemory(
  memory: SharedMemory,
  userId: string,
): { memory: SharedMemory; notifyOther: true; reasonDisclosed: false } {
  if (!memory.participantIds.includes(userId)) throw new Error("memory: not a participant");
  return {
    memory: { ...memory, withdrawnBy: [...memory.withdrawnBy, userId] },
    notifyOther: true,
    reasonDisclosed: false,
  };
}

export function memoryVisibleTo(memory: SharedMemory, userId: string): boolean {
  return memory.participantIds.includes(userId) && !memory.withdrawnBy.includes(userId);
}
