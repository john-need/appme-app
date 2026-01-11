import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useIsAuthenticated, useCurrentUser } from "@/hooks";
import LeftNavDrawer from "../left-nav-drawer/left-nav-drawer";

export default function Header() {
  const isAuthenticated = useIsAuthenticated();
  const currentUser = useCurrentUser();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <AppBar position="sticky" sx={{ top: 0, zIndex: (theme) => theme.zIndex.appBar }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={openDrawer}>
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AppMe{currentUser ? ` - ${currentUser.name}` : ""}
          </Typography>
          {isAuthenticated && (
            <>
              {location.pathname === "/" && (
                <Button color="inherit" component={RouterLink} to="/pomodoro">
                  Pomodoro
                </Button>
              )}
              {location.pathname !== "/" && (
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
