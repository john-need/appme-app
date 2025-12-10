import generateUUID from "./generate-uuid";

describe("generateUUID", () => {
  const g = globalThis as unknown as { crypto?: { randomUUID?: () => string } };
  const originalCrypto = g.crypto;

  afterEach(() => {
    // restore crypto
    g.crypto = originalCrypto;
  });

  it("uses crypto.randomUUID when available", () => {
    const fake = { crypto: { randomUUID: () => "11111111-2222-4333-8444-555555555555" } } as any;
    g.crypto = fake.crypto;
    expect(generateUUID()).toBe("11111111-2222-4333-8444-555555555555");
  });

  it("falls back to template-based generator when crypto.randomUUID is not available and matches v4 format", () => {
    // remove randomUUID
    g.crypto = {} as any;
    const uuid = generateUUID();
    const v4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(v4Regex.test(uuid)).toBe(true);
  });

  it("produces different values across calls (best-effort uniqueness)", () => {
    g.crypto = {} as any;
    const set = new Set<string>();
    for (let i = 0; i < 5; i++) set.add(generateUUID());
    expect(set.size).toBe(5);
  });
});
