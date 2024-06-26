import { ArrowBack, Email, TaskAlt } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Container,
  CssBaseline,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const EmailConfirmSuccess = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMail, setIsMail] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (
      searchParams.get("mailSent") &&
      searchParams.get("email") &&
      searchParams.get("mailSent") === "true"
    ) {
      setEmail(searchParams.get("email"));
      setIsMail(true);
      searchParams.delete("mailSent");
      searchParams.delete("email");
      setSearchParams(searchParams);
    }
  }, [searchParams]);

  return !isMail ? (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "#f8f5fe", width: 60, height: 60 }}>
          <Avatar sx={{ m: 1, bgcolor: "#f5ecfe" }}>
            <TaskAlt htmlColor="#7d56d4" />
          </Avatar>
        </Avatar>
        <Typography component="h1" variant="h5">
          Confirmation Successful
        </Typography>
        <Typography
          textAlign="center"
          component="h6"
          variant="body2"
          marginTop={1}
        >
          Email confirmation completed successfully. <br />
          You can now login to you account.
        </Typography>
        <Box
          component="form"
          noValidate
          sx={{ mt: 3 }}
          width="100%"
          textAlign="center"
        >
          <Grid container marginTop={2}>
            <Grid item xs>
              <Link
                href="/auth/login"
                sx={{ textDecoration: "none", color: "gray" }}
                variant="body2"
              >
                <Box justifyContent="center" display="flex" gap={0.2}>
                  <ArrowBack fontSize="small" color="inherit" /> Go to login
                </Box>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  ) : (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "#f8f5fe", width: 60, height: 60 }}>
          <Avatar sx={{ m: 1, bgcolor: "#f5ecfe" }}>
            <Email htmlColor="#7d56d4" />
          </Avatar>
        </Avatar>
        <Typography component="h1" variant="h5">
          Check your email
        </Typography>
        <Typography
          textAlign="center"
          component="h6"
          variant="body2"
          marginTop={1}
        >
          We have sent a confirmation email to <br />
          {email}
        </Typography>
        <Box
          component="form"
          noValidate
          sx={{ mt: 3 }}
          width="100%"
          textAlign="center"
        >
          <Grid container marginTop={2}>
            <Grid item xs>
              <Link
                href="/auth/login"
                sx={{ textDecoration: "none", color: "gray" }}
                variant="body2"
              >
                <Box justifyContent="center" display="flex" gap={0.2}>
                  <ArrowBack fontSize="small" color="inherit" /> Go to login
                </Box>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default EmailConfirmSuccess;
