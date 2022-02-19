import { Box, List, ListItem, ListItemButton, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import socket from "../socket";
import ChatContext from "./ChatContext";
import ContactCard from "./ContactCard";
import { UserType } from "../models/Types";
import { collectMessageHistory } from "../utils/MessagingUtils";

export default function Contacts() {
    const [visibleUsers, setVisibleUsers] = useState<UserType[]>([]);
    const {
        activeChat,
        setActiveChat,
        setActiveType,
        setNumHistory,
        setInitialUpdate,
    } = useContext(ChatContext);

    useEffect(() => {
        socket.on("users", (users) => {
            setVisibleUsers(users);
        });
        return function cleanup() {
            socket.off("users");
        };
    });

    function getMessages(activeUsername: string) {
        collectMessageHistory(activeUsername, 15);
    }

    async function changeActive(user: UserType) {
        setActiveChat(user.username);
        setActiveType(user.type);
        setNumHistory(15);
        getMessages(user.username);
        setInitialUpdate(false);
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography sx={{ padding: "10px" }} variant="h5">
                Contacts
            </Typography>
            {visibleUsers.length <= 0 ? (
                <Box
                    sx={{
                        height: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                    <Typography variant="subtitle1">None found</Typography>
                </Box>
            ) : (
                <List disablePadding>
                    {visibleUsers &&
                        visibleUsers.map((user: UserType, index: number) => (
                            <ListItem key={index} disablePadding>
                                <ListItemButton
                                    disableTouchRipple={
                                        activeChat === user.username
                                    }
                                    selected={activeChat === user.username}
                                    onClick={() => {
                                        changeActive(user);
                                    }}>
                                    <ContactCard user={user} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                </List>
            )}
        </Box>
    );
}
