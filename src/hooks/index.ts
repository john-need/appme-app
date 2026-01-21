import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/root-store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export * from "./use-auth";
export * from "./use-login";
export { default as useAddPomodoro } from "./use-add-pomodoro";
export { default as useAddPomodoroEntry } from "./use-add-pomodoro-entry";
export { default as useUpdatePomodoroEntry } from "./use-update-pomodoro-entry";
export * from "./use-fetch-pomodoro-entries";
