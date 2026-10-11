# Storage layout + access rules (Supabase Storage, bucket `lign`)

One bucket. Access is decided by path prefix — never by filename.

## Layout

| Prefix | Visibility | Contents |
|---|---|---|
| `avatars/` | **Public** | Profile avatars/photos. Display images, chosen to be seen. Readable by anyone with the URL. |
| `memories/` | **Private** | Photos attached to shared memories. Participant-only. |
| `chat/` | **Private** | Images shared inside 1-on-1 or space conversations. Participant-only. Reserved — no feature writes here yet. |

## Rules

1. Avatars are the ONLY public content. Anything personal goes under
   `memories/` or `chat/` — never beside avatars.
2. Private paths are served exclusively through short-lived signed URLs
   minted server-side after a membership check (participant of the
   memory/conversation). No signed URL, no bytes.
3. Chat/spaces stay text-only until an explicit image-sharing feature ships
   with these rules enforced; the API rejects attachments today.
4. Keys embed owner scope: `avatars/{userId}.{ext}`,
   `memories/{memoryId}/{file}`, `chat/{conversationOrSpaceId}/{file}`.
   No user-controlled path segments — no traversal, no collisions.
5. Deletion follows the account: avatar keys die with the account;
   memory/chat objects follow the memory-withdraw and retention rules
   (see `docs/deletion-retention.md`).
