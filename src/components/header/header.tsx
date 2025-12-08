import React from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useColorMode } from "../../theme/theme-provider";
import { useIsAuthenticated, useAuth } from "../../hooks";

export default function Header() {
  const { mode, toggleMode } = useColorMode();
  const isAuthenticated = useIsAuthenticated();
  const { logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          AppMe
        </Typography>

        <Button color="inherit" component={RouterLink} to="/">
          Home
        </Button>
        <Button color="inherit" component={RouterLink} to="/about">
          About
        </Button>
        {!isAuthenticated ? (
          <Button color="inherit" component={RouterLink} to="/login">
            Login
          </Button>
        ) : (
          <Button color="inherit" onClick={() => logout()}>
            Logout
          </Button>
        )}

        <IconButton sx={{ ml: 1 }} color="inherit" onClick={toggleMode} aria-label="toggle theme">
          {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
