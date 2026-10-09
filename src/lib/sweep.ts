// LiGN — deletion purge sweep (PRD §61).
// Past-window accounts with no active safety hold are purged automatically.
// What goes: sessions/accounts (cascade), availability, listener queue entry,
// my blocks, my reconnect wishes, my deletion feedback, then the user row.
// What stays (retention + shared history, disclosed in deletion-retention.md):
// connections, conversations, messages, reports, blocks others placed on me.

export function isPurgeDue(pendingDeletionAt: Date | null, now: Date): boolean {
  if (!pendingDeletionAt) return false;
  return now.getTime() >= pendingDeletionAt.getTime();
}

export interface PurgeDb {
  spaceReconnectWish: { deleteMany(args: unknown): Promise<unknown> };
  listenerQueueEntry: { deleteMany(args: unknown): Promise<unknown> };
  deletionFeedback: { deleteMany(args: unknown): Promise<unknown> };
  availability: { deleteMany(args: unknown): Promise<unknown> };
  block: { deleteMany(args: unknown): Promise<unknown> };
  user: { delete(args: unknown): Promise<unknown> };
}

export async function purgeUserData(db: PurgeDb, userId: string): Promise<void> {
  await db.spaceReconnectWish.deleteMany({
    where: { OR: [{ wanterId: userId }, { wantedId: userId }] },
  });
  await db.listenerQueueEntry.deleteMany({ where: { userId } });
  await db.deletionFeedback.deleteMany({ where: { userId } });
  await db.availability.deleteMany({ where: { userId } });
  await db.block.deleteMany({ where: { blockerId: userId } });
  await db.user.delete({ where: { id: userId } });
}
