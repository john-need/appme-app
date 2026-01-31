import React, { useEffect } from "react";
import {
  SwipeableDrawer,
  Box,
  IconButton,
  Typography,
  Divider,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useIsAuthenticated, useAuth } from "@/hooks";

interface LeftNavDrawerProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function LeftNavDrawer({ open, onOpen, onClose }: LeftNavDrawerProps) {
  const location = useLocation();
  const isAuthenticated = useIsAuthenticated();
  const { logout } = useAuth();

  // When the route changes, close the drawer if it's open (covers clicks on links or programmatic navigation)
  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <SwipeableDrawer anchor="left" open={open} onClose={onClose} onOpen={onOpen}>
      <Box sx={{ width: 280 }} role="presentation">
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 1 }}>
          <Typography variant="h6" component="div">
            Navigation
          </Typography>
          <IconButton aria-label="close drawer" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          <ListItemButton component={RouterLink} to="/dashboard" onClick={onClose}>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
          <ListItemButton component={RouterLink} to="/" onClick={onClose}>
            <ListItemText primary="Entries" />
          </ListItemButton>
          <ListItemButton component={RouterLink} to="/todos" onClick={onClose}>
            <ListItemText primary="Todos" />
          </ListItemButton>
          <ListItemButton component={RouterLink} to="/pomodoro" onClick={onClose}>
            <ListItemText primary="Pomodoro" />
          </ListItemButton>
          <ListItemButton component={RouterLink} to="/activities" onClick={onClose}>
            <ListItemText primary="Activities" />
          </ListItemButton>
          <ListItemButton component={RouterLink} to="/preferences" onClick={onClose}>
            <ListItemText primary="Preferences" />
          </ListItemButton>
          {isAuthenticated && (
            <ListItemButton
              onClick={() => {
                logout();
                onClose();
              }}
            >
              <ListItemText primary="Logout" />
            </ListItemButton>
          )}
          {/* Add more nav items here as needed */}
        </List>
      </Box>
    </SwipeableDrawer>
  );
}
