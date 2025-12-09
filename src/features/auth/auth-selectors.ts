import type { RootState } from "../../store/root-store";
import type { AuthUser } from "./auth-slice";

export const selectAuthState = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) => !!state.auth?.isAuthenticated;
export const selectCurrentUser = (state: RootState): AuthUser | null => state.auth?.user ?? null;
export const selectJwt = (state: RootState): string | null => state.auth?.jwt ?? null;

