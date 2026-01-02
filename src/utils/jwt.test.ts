import { decodeJwt, isJwtExpired, isJwtValid } from "./jwt";

describe("jwt utility", () => {
  const createToken = (payload: object) => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payloadStr = btoa(JSON.stringify(payload)).replace(/=/g, "");
    const signature = "fake-signature";
    return `${header}.${payloadStr}.${signature}`;
  };

  describe("decodeJwt", () => {
    it("decodes a valid token", () => {
      const payload = { sub: "123", name: "John Doe" };
      const token = createToken(payload);
      expect(decodeJwt(token)).toMatchObject(payload);
    });

    it("returns null for invalid tokens", () => {
      expect(decodeJwt("invalid-token")).toBeNull();
      expect(decodeJwt("a.b")).toBeNull();
    });
  });

  describe("isJwtExpired", () => {
    it("returns true if token is expired", () => {
      const payload = { exp: Math.floor(Date.now() / 1000) - 60 };
      const token = createToken(payload);
      expect(isJwtExpired(token)).toBe(true);
    });

    it("returns false if token is not expired", () => {
      const payload = { exp: Math.floor(Date.now() / 1000) + 60 };
      const token = createToken(payload);
      expect(isJwtExpired(token)).toBe(false);
    });

    it("returns true if token has no exp claim", () => {
      const token = createToken({ sub: "123" });
      expect(isJwtExpired(token)).toBe(true);
    });
  });

  describe("isJwtValid", () => {
    it("returns true for valid non-expired token", () => {
      const payload = { exp: Math.floor(Date.now() / 1000) + 60 };
      const token = createToken(payload);
      expect(isJwtValid(token)).toBe(true);
    });

    it("returns false for expired token", () => {
      const payload = { exp: Math.floor(Date.now() / 1000) - 60 };
      const token = createToken(payload);
      expect(isJwtValid(token)).toBe(false);
    });

    it("returns false for null token", () => {
      expect(isJwtValid(null)).toBe(false);
    });
  });
});
