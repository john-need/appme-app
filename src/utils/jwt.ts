
export interface JwtPayload {
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export const decodeJwt = (token: string): JwtPayload | null => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

export const isJwtExpired = (token: string): boolean => {
  const payload = decodeJwt(token);
  if (!payload || !payload.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
};

export const isJwtValid = (token: string | null): boolean => {
  if (!token) return false;
  const payload = decodeJwt(token);
  if (!payload) return false;
  return !isJwtExpired(token);
};
