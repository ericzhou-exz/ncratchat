import { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button, Link, Typography } from "@mui/material";
import AuthContext from "./AuthContext";
import socket from "../socket";

export default function Login() {
    const [signup, setsignup] = useState<boolean>(false);
    const { setusername, settoken, setType } = useContext(AuthContext);
    const [locusername, setlocusername] = useState<string>("");
    const [locpass, setlocpass] = useState<string>("");
    const [logissue, setlogissue] = useState<boolean>(false);

    async function handleSubmit() {
        socket.auth = {
            username: locusername,
            password: locpass,
            method: signup ? "signup" : "signin",
        };
        socket.connect();
    }

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected");
            console.log(socket);
        });

        socket.on("connect_error", (err) => {
            console.log(err);
        });

        socket.on("auth-packet", ({ token, username, type }) => {
            settoken(token);
            setusername(username);
            setType(type);
            console.log(type);
            socket.auth = {
                username: username,
                token: token,
            };
        });

        return function cleanup() {
            socket.off("connect");
            socket.off("connect_error");
            socket.off("auth-packet");
        };
    });

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                height: window.innerHeight,
            }}>
            <Typography variant="h4" gutterBottom>
                {signup ? "Sign Up" : "Sign In"}
            </Typography>
            <TextField
                error={logissue}
                value={locusername}
                label="Username"
                variant="standard"
                onChange={(e) => {
                    setlocusername(e.target.value);
                    setlogissue(false);
                }}
                required
            />
            <TextField
                value={locpass}
                sx={{ marginTop: 2, marginBottom: 3 }}
                onChange={(e) => {
                    setlocpass(e.target.value);
                    setlogissue(false);
                }}
                label="Password"
                variant="standard"
                type="password"
                required
            />
            <Button
                type="submit"
                variant="contained"
                onClick={() => handleSubmit()}>
                {signup ? "Sign Up" : "Sign In"}
            </Button>
            <Link onClick={() => setsignup(!signup)} sx={{ marginTop: 2 }}>
                {signup ? "Sign In" : "Sign Up"}
            </Link>
        </Box>
    );
}
