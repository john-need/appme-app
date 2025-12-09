import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useIsAuthenticated } from "../../hooks";
import LeftNavDrawer from "../left-nav-drawer/left-nav-drawer";

export default function Header() {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={openDrawer}>
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AppMe
          </Typography>
          {isAuthenticated && (
            <>
              {location.pathname === "/" && (
                <Button color="inherit" component={RouterLink} to="/dashboard">
                  Dashboard
                </Button>
              )}
              {location.pathname === "/dashboard" && (
                <Button color="inherit" component={RouterLink} to="/">
                  Entries
                </Button>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>

      <LeftNavDrawer open={drawerOpen} onOpen={openDrawer} onClose={closeDrawer} />
    </>
  );
}
