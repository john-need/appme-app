import React, { useEffect, useState } from "react";
import { Container, Box, TextField, Button, Typography, CircularProgress, Checkbox, FormControlLabel } from "@mui/material";
import { useLogin } from "../../hooks";
import { useAppDispatch } from "../../hooks";
import { addNotification } from "../../features/notification/notification-slice";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { login, isLoading, isError, error, isSuccess } = useLogin();

  // load remembered email on mount
  useEffect(() => {
    const saved = localStorage.getItem("appme:rememberedEmail") || "";
    if (saved) {
      setEmail(saved);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (isError) {
      // const msg = error instanceof Error ? error.message : String(error ?? "Login failed");
      // error toast is already added by useLogin, optional extra handling available
      // dispatch(addNotification({ id: String(Date.now()), message: msg, severity: 'error' }))
    }
  }, [isError, error, dispatch]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(addNotification({ id: String(Date.now()), message: "Logged in", severity: "success" }));
      navigate("/");
    }
  }, [isSuccess, dispatch, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // client-side validation
    const nextErrors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      nextErrors.email = "Please enter a valid email address";
    }
    if (!password || password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // persist email if rememberMe
    if (rememberMe) {
      localStorage.setItem("appme:rememberedEmail", email);
    } else {
      localStorage.removeItem("appme:rememberedEmail");
    }

    login(email, password);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }} component="form" onSubmit={handleSubmit}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          fullWidth
          margin="normal"
          required
          error={!!errors.email}
          helperText={errors.email}
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          fullWidth
          margin="normal"
          required
          error={!!errors.password}
          helperText={errors.password}
        />

        <FormControlLabel
          control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
          label="Remember me"
        />

        <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? <CircularProgress size={20} color="inherit" /> : "Login"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
