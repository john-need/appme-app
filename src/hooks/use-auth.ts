import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./index";
import { setCredentials, clearCredentials, setJwt, setUser } from "../features/auth/auth-slice";
import type { AuthUser } from "../features/auth/auth-slice";

export function useAuth() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((s) => s.auth);

  const login = useCallback((jwt: string, user: AuthUser) => {
    dispatch(setCredentials({ jwt, user }));
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch(clearCredentials());
  }, [dispatch]);

  const updateJwt = useCallback((jwt: string | null) => {
    dispatch(setJwt(jwt));
  }, [dispatch]);

  const updateUser = useCallback((user: AuthUser | null) => {
    dispatch(setUser(user));
  }, [dispatch]);

  return { auth, login, logout, updateJwt, updateUser };
}

export function useIsAuthenticated() {
  return useAppSelector((s) => !!s.auth?.isAuthenticated);
}

export function useCurrentUser() {
  return useAppSelector((s) => s.auth?.user ?? null);
}

export function useJwt() {
  return useAppSelector((s) => s.auth?.jwt ?? null);
}

