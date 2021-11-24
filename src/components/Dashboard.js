import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";

import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const [error, setError] = useState("");
  const { currentUser, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    setError("");
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      setError("Failed to Log out");
    }
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          {currentUser && currentUser.email}
        </Typography>
        <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          <Link
            to="/update-profile"
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            Update Profile
          </Link>
        </Button>
        <Button fullWidth sx={{ mt: 3, mb: 2 }} onClick={handleLogOut}>
          Log Out
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;
