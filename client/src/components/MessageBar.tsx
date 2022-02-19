import { Box, Button, TextField } from "@mui/material";
import { useContext, useState } from "react";
import socket from "../socket";
import AuthContext from "./AuthContext";
import ChatContext from "./ChatContext";

export default function MessageBar() {
    const { activeChat } = useContext(ChatContext);
    const [message, setMessage] = useState<string>("");
    const { username } = useContext(AuthContext);

    const sendMessage = async () => {
        if (!message) {
            return;
        }
        socket.emit("send-message", {
            from: username,
            to: activeChat,
            content: message,
        });
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                marginRight: 1,
                marginBottom: 1,
                marginLeft: 1,
            }}>
            <TextField
                label="Multiline"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                multiline
                maxRows={4}
                sx={{ flexGrow: 1 }}
                onKeyPress={async (e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        await sendMessage();
                        setMessage("");
                    }
                }}
            />
            <Button
                onClick={async (e) => {
                    e.preventDefault();
                    await sendMessage();
                    setMessage("");
                }}
                sx={{ marginLeft: 1 }}>
                Send
            </Button>
        </Box>
    );
}
