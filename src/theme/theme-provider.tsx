import React, { createContext, useContext, useMemo } from "react";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import getTheme from "./theme";
import type { PaletteMode } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/root-store";
import { setMode, toggleMode as toggleModeAction } from "../features/preferences/preferences-slice";

type ColorModeContextValue = { mode: PaletteMode; toggleMode: () => void; setMode: (m: PaletteMode) => void };
const ColorModeContext = createContext<ColorModeContextValue | undefined>(undefined);

export const useColorMode = () => {
  const ctx = useContext(ColorModeContext);
  if (!ctx) throw new Error("useColorMode must be used within ThemeProvider");
  return ctx;
};

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const mode = useSelector((s: RootState) => (s.preferences?.mode ? (s.preferences.mode as PaletteMode) : ("light" as PaletteMode)));

  const toggleMode = () => dispatch(toggleModeAction());
  const setModeLocal = (m: PaletteMode) => dispatch(setMode(m));

  const theme = useMemo(() => getTheme(mode), [mode]);
  const value = useMemo(() => ({ mode, toggleMode, setMode: setModeLocal }), [mode]);

  return (
    <ColorModeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
}
