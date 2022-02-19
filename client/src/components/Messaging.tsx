import {
    Box,
    Button,
    FormControl,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import socket from "../socket";
import AuthContext from "./AuthContext";
import ChatContext from "./ChatContext";
import Message from "./Message";
import MessageBar from "./MessageBar";
import userTypes from "./UserTypes";
import { MessageType } from "../models/Types";
import { collectMessageHistory } from "../utils/MessagingUtils";

export default function Messaging() {
    const {
        activeChat,
        setActiveChat,
        activeType,
        setActiveType,
        numHistory,
        setNumHistory,
        initialUpdate,
        setInitialUpdate,
    } = useContext(ChatContext);
    const { username, type } = useContext(AuthContext);
    const [messages, setMessages] = useState<MessageType[]>([]);

    useEffect(() => {
        socket.on("message-history-collect", (messageList) => {
            setMessages(messageList);
            console.log(`Messages, `, messageList);
        });
        return function cleanup() {
            socket.off("message-history-collect");
        };
    });

    useEffect(() => {
        socket.on("message-error", (msg: { message: string }) => {
            alert(msg.message);
            console.log(msg.message);
        });
        return function cleanup() {
            socket.off("message-error");
        };
    });

    function loadMore() {
        collectMessageHistory(activeChat, numHistory + 15);
        setNumHistory(numHistory + 15);
    }

    useEffect(() => {
        socket.on("receive-message", async (msg: MessageType) => {
            console.log("Received message", msg);
            const chatParticipants = [username, activeChat];
            if (
                chatParticipants.indexOf(msg.from) !== -1 &&
                chatParticipants.indexOf(msg.to) !== -1
            ) {
                setMessages([msg, ...messages]);
            }
            if (!initialUpdate) {
                socket.emit("update-contacts");
                setInitialUpdate(true);
            }
        });

        return function cleanup() {
            socket.off("receive-message");
        };
    });

    function handleSelectChange(e: any) {
        if (e.target.value === activeType) return;
        setActiveType(e.target.value);
        socket.emit("update-permission", {
            targetUser: activeChat,
            targetPermission: e.target.value,
        });
        socket.emit("update-contacts");
    }

    function deleteUser() {
        if (activeChat === username) return;
        socket.emit("delete-account", { target: activeChat });
        setActiveChat("");
        socket.emit("update-contacts");
    }

    return activeChat ? (
        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
            {/* Chat header */}
            <Box
                sx={{
                    borderBottom: 1,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                <Typography sx={{ margin: 1 }} variant="h5">
                    {activeChat} - {userTypes[activeType]}
                </Typography>
                {type === 0 && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            padding: 1,
                        }}>
                        <FormControl
                            variant="standard"
                            sx={{ paddingRight: 1 }}>
                            <Select
                                value={activeType}
                                onChange={handleSelectChange}
                                // label={"User type"}
                            >
                                <MenuItem value={1}>RA</MenuItem>
                                <MenuItem value={2}>Collegian</MenuItem>
                            </Select>
                        </FormControl>
                        <Button onClick={deleteUser}>Delete user</Button>
                    </Box>
                )}
            </Box>
            {/* Message section */}
            <Box
                sx={{
                    flexGrow: 1,
                    height: "1px",
                    overflow: "scroll",
                    display: "flex",
                    flexDirection: "column-reverse",
                }}>
                <Box sx={{ float: "left", clear: "both" }}></Box>
                {messages.map((message: MessageType, index: number) => {
                    return (
                        <Message
                            key={index}
                            content={message.content}
                            time={message.time}
                            from={message.from}
                            to={message.to}
                        />
                    );
                })}
                {messages.length >= numHistory && (
                    <Button
                        onClick={async (e) => {
                            e.preventDefault();
                            loadMore();
                        }}>
                        Load more
                    </Button>
                )}
            </Box>
            {/* Message box and send button */}
            <MessageBar />
        </Box>
    ) : (
        <Box
            sx={{
                flexGrow: 1,
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
            }}>
            <Typography variant="h5">
                Select a contact to begin chatting
            </Typography>
        </Box>
    );
}
