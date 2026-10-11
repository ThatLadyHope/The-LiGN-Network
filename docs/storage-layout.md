# Storage layout + access rules (Supabase Storage)

Supabase grants access per bucket, not per folder — so two buckets:

| Bucket | Visibility | Contents |
|---|---|---|
| `lign-public` | **Public** | Profile avatars/photos. Display images, chosen to be seen. |
| `lign-private` | **Private** | Shared-memory and chat images. Participant-only, signed URLs after membership check. Reserved — no feature writes here yet. |

## Rules

1. Avatars are the ONLY public content, and they live in the public bucket.
   Personal images live in the private bucket — never beside avatars.
2. Private objects are served exclusively through short-lived signed URLs
   minted server-side after a membership check (participant of the
   memory/conversation). No signed URL, no bytes.
3. Chat/spaces stay text-only until an explicit image-sharing feature ships
   with these rules enforced; the API rejects attachments today.
4. Keys embed owner scope: `avatars/{userId}.{ext}` in the public bucket;
   `memories/{memoryId}/{file}` and `chat/{conversationOrSpaceId}/{file}`
   in the private bucket.
   No user-controlled path segments — no traversal, no collisions.
5. Deletion follows the account: avatar keys die with the account;
   memory/chat objects follow the memory-withdraw and retention rules
   (see `docs/deletion-retention.md`).
