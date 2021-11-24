import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useAuth } from "../context/AuthContext";
import { Alert, CircularProgress } from "@mui/material";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
} from "@firebase/firestore";
import { db, storage } from "../firebase/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";

const theme = createTheme();

export default function UpdateProfile() {
  const { currentUser } = useAuth();
  const userCollectionRef = collection(db, "users");

  const [userData, setUserData] = useState();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState();
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    const q = query(userCollectionRef, where("id", "==", currentUser.uid));
    onSnapshot(q, (snapShot) => {
      setUserData({ ...snapShot.docs[0].data(), docId: snapShot.docs[0].id });
      setImageSrc(snapShot.docs[0].data().image);
    });
  }, [currentUser]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      setError("");
      setLoading(true);

      if (file) {
        const storageRef = ref(storage, `/user/${userData?.docId}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            alert(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (URL) => {
              await updateDoc(doc(db, "users", userData?.docId), {
                email: data.get("email"),
                firstName: data.get("firstName"),
                lastName: data.get("lastName"),
                image: URL,
              });
            });
          }
        );
      } else {
        await updateDoc(doc(db, "users", userData?.docId), {
          email: data.get("email"),
          firstName: data.get("firstName"),
          lastName: data.get("lastName"),
          image: userData?.image,
        });
      }

      // setMessage("user created successfully");

      // window.location.reload();
    } catch (error) {
      setError("Failed to create an account");
    }
    setLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {userData ? (
            <>
              <Typography component="h1" variant="h5">
                Update Profile
              </Typography>
              {error ? <Alert severity="error">{error}</Alert> : null}
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 3 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <input
                      style={{ display: "none" }}
                      id="raised-button-file"
                      multiple
                      type="file"
                      onChange={(e) => {
                        setFile(e?.target?.files[0]);
                        if (e.target.files.length !== 0) {
                          setImageSrc(
                            URL?.createObjectURL(e?.target?.files[0])
                          );
                        }
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <label htmlFor="raised-button-file">
                        <Button
                          variant="contained"
                          component="span"
                          // className={classes.button}
                        >
                          Upload
                        </Button>
                      </label>

                      <img
                        alt="profileImage"
                        width={50}
                        height={50}
                        src={imageSrc}
                        style={{
                          borderRadius: "50%",
                          border: "2px solid black",
                          display: imageSrc ? "block" : "none",
                        }}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      defaultValue={userData?.firstName}
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      autoComplete="family-name"
                      defaultValue={userData?.lastName}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      defaultValue={userData?.email}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loading}
                >
                  Update Profile
                </Button>
              </Box>
            </>
          ) : (
            <CircularProgress />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}
