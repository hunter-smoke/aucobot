/** Parse conversation id from `location.hash` (e.g. `#clx9abc`). */
export function parseConversationIdFromHash(hash: string): string | null {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  const id = raw.trim();
  return id.length > 0 ? id : null;
}

/** Build hash fragment for a conversation (no leading `#`). */
export function toConversationHash(conversationId: string): string {
  return conversationId.trim();
}
