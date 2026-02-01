import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./index";
import { setCredentials, clearCredentials, setJwt, setUser } from "@/features/auth/auth-slice";
import type { AuthUser } from "@/features/auth/auth-slice";
import { isJwtValid } from "@/utils/jwt";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (auth.jwt && !isJwtValid(auth.jwt)) {
      dispatch(clearCredentials());
    }
  }, [auth.jwt, dispatch]);

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
};

export const useIsAuthenticated = () => {
  const dispatch = useAppDispatch();
  const { jwt, isAuthenticated } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (jwt && !isJwtValid(jwt)) {
      dispatch(clearCredentials());
    }
  }, [jwt, dispatch]);

  return !!(isAuthenticated && isJwtValid(jwt));
};

export const useCurrentUser = () => {
  const dispatch = useAppDispatch();
  const { jwt, user } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (jwt && !isJwtValid(jwt)) {
      dispatch(clearCredentials());
    }
  }, [jwt, dispatch]);

  return isJwtValid(jwt) ? user : null;
};

export const useJwt = () => {
  const dispatch = useAppDispatch();
  const { jwt } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (jwt && !isJwtValid(jwt)) {
      dispatch(clearCredentials());
    }
  }, [jwt, dispatch]);

  return isJwtValid(jwt) ? jwt : null;
};

