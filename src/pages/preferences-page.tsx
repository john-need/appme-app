import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useColorMode } from "@/theme/theme-provider";
import { useCurrentUser, useAuth, useJwt } from "@/hooks";
import type { AuthUser } from "@/features/auth/auth-slice";
import useUpdateUser from "@/data-layer/update-user";

export default function PreferencesPage() {
  const { mode, toggleMode } = useColorMode();
  const currentUser = useCurrentUser();
  const { updateUser: setUserInStore } = useAuth();
  const jwt = useJwt();

  const [name, setName] = useState(currentUser?.name || "");
  const [startOfWeek, setStartOfWeek] = useState<User["startOfWeek"]>(currentUser?.startOfWeek || "MONDAY");
  const [defaultView, setDefaultView] = useState<User["defaultView"]>(currentUser?.defaultView || "DAY");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const mutation = useUpdateUser({
    onSuccess: (data) => {
      const authUser: AuthUser = {
        id: data.id ?? "",
        name: data.name,
        email: data.email,
        startOfWeek: data.startOfWeek,
        defaultView: data.defaultView,
        timezone: data.timezone,
        created: data.created,
        updated: data.updated,
      };
      setUserInStore(authUser);
      setSuccess(true);
      setError(null);
      setSaving(false);
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : String(err ?? "An unknown error occurred");
      setError(message);
      setSuccess(false);
      setSaving(false);
    },
  });

  const handleSave = async () => {
    setError(null);
    setSuccess(false);
    setSaving(true);
    if (!currentUser?.id) {
      setError("No current user to update");
      setSaving(false);
      return;
    }
    const userToUpdate: Partial<User> & { id: string } = {
      id: currentUser.id,
      name,
      startOfWeek,
      defaultView,
    };
    mutation.mutate({ user: userToUpdate, jwt: jwt ?? undefined });
  };

  const handleReset = () => {
    if (!currentUser) return;
    setName(currentUser.name ?? "");
    setStartOfWeek(currentUser.startOfWeek ?? "MONDAY");
    setDefaultView(currentUser.defaultView ?? "DAY");
    setError(null);
    setSuccess(false);
  };

  return (
    <Box p={2}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h4">Preferences</Typography>
        <IconButton color="inherit" aria-label="toggle theme" onClick={toggleMode}>
          {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>

      {error && (
        <Box mb={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {success && (
        <Box mb={2}>
          <Alert severity="success">Preferences saved.</Alert>
        </Box>
      )}

      <Box component="form" noValidate autoComplete="off" sx={{ display: "grid", gap: 2, maxWidth: 480 }}>
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />

        <FormControl>
          <InputLabel id="startOfWeek-label">Week Start</InputLabel>
          <Select
            labelId="startOfWeek-label"
            value={startOfWeek}
            label="Week Start"
            onChange={(e) => setStartOfWeek(e.target.value as User["startOfWeek"])}
          >
            <MenuItem value="MONDAY">Monday</MenuItem>
            <MenuItem value="SUNDAY">Sunday</MenuItem>
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel id="defaultView-label">Default View</InputLabel>
          <Select
            labelId="defaultView-label"
            value={defaultView}
            label="Default View"
            onChange={(e) => setDefaultView(e.target.value as User["defaultView"])}
          >
            <MenuItem value="WEEK">Week</MenuItem>
            <MenuItem value="DAY">Day</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          <Button variant="contained" onClick={handleSave} disabled={saving || mutation.isLoading}>
            Save
          </Button>
          <Button variant="outlined" onClick={handleReset} disabled={saving || mutation.isLoading}>
            Reset
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
