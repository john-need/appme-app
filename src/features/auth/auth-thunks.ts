import auth from "../../data-layer/auth";
import { setCredentials, clearCredentials } from "./auth-slice";
import type { AuthUser } from "./auth-slice";
import { addNotification } from "../notification/notification-slice";
import type { AppDispatch } from "@/store/root-store";
import { queryClient } from "@/api/query-client";
import { AUTH_PERSIST_KEY } from "@/config/persist-keys";
import { fetchActivitiesThunk } from "../activities/activities-slice";
import { fetchPomodorosThunk } from "@/features/pomodoros/pomodoros-slice";

export const loginThunk = (email: string, password: string) => async (dispatch: AppDispatch) => {
  try {
    const { token, user } = await auth(email, password);

    // user returned from the API is treated as AuthUser here; cast to satisfy TS types
    dispatch(setCredentials({ jwt: token, user: user as AuthUser }));

    // fetch activities for the authenticated user and store in Redux
    try {
      // the activities thunk will read the JWT from the auth slice
      // cast dispatch to a callable that accepts the thunk's return type to avoid `any`
      await (dispatch as unknown as (th: ReturnType<typeof fetchActivitiesThunk>) => Promise<unknown>)(
        fetchActivitiesThunk()
      );
    } catch (e) {
      // non-fatal - the activities thunk already dispatches notifications on error
    }

    // fetch pomodoros for the authenticated user and store in Redux
    try {
      // the pomodoros thunk will read the JWT from the auth slice
      // cast dispatch to a callable that accepts the thunk's return type to avoid `any`
      await (dispatch as unknown as (th: ReturnType<typeof fetchPomodorosThunk>) => Promise<unknown>)(
        fetchPomodorosThunk()
      );
    } catch (e) {
      // non-fatal - the activities thunk already dispatches notifications on error
    }


    try {
      // prime react-query cache with current user data and token
      queryClient.setQueryData(["auth", "user"], user);
      queryClient.setQueryData(["auth", "token"], token);
    } catch (e) {
      // non-fatal if query client isn't available
    }

    return { jwt: token, user };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err ?? "Login failed");
    dispatch(addNotification({ id: String(Date.now()), message, severity: "error" }));
    throw err;
  }
};

export const logoutThunk = () => (dispatch: AppDispatch) => {
  dispatch(clearCredentials());
  try {
    // Clear react-query cache on logout
    queryClient.clear();
  } catch (e) {
    // ignore
  }

  try {
    localStorage.removeItem(AUTH_PERSIST_KEY);
  } catch (e) {
    // ignore
  }
};
