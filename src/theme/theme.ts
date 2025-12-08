import { createTheme } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";

export default function getTheme(mode: PaletteMode) {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#9c27b0",
      },
      background: {
        default: mode === "dark" ? "#121212" : "#fafafa",
        paper: mode === "dark" ? "#1d1d1d" : "#ffffff",
      },
    },
    typography: {
      fontFamily: ["Inter", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: mode === "dark" ? "#121212" : "#fafafa",
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
            margin: 0,
            padding: 0,
            color: mode === "dark" ? "#e0e0e0" : "inherit",
          },
          "*": {
            boxSizing: "border-box",
          },
        },
      },
    },
  });
}
