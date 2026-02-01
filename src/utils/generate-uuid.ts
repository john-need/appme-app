// Cross-platform UUID generator utility.
// Prefer Web Crypto's `randomUUID` in browsers if available, otherwise fall back to a RFC4122 v4 generator.
export default function generateUUID(): string {
  try {
    // try to access web crypto in a typed-safe way
    const g = globalThis as unknown as { crypto?: unknown };
    const webCrypto = g?.crypto as { randomUUID?: unknown } | undefined;
    if (webCrypto && typeof webCrypto.randomUUID === "function") return (webCrypto.randomUUID as () => string)();
  } catch (e) {
    // ignore
  }

  // fallback: not cryptographically secure, but acceptable for client-side ids
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
