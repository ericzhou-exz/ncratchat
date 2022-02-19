import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Contacts from "./components/Contacts";
import ChatContext from "./components/ChatContext";
import Messaging from "./components/Messaging";
import { Box } from "@mui/material";

function Home() {
    const [activeChat, setActiveChat] = React.useState<string>("");
    const [activeType, setActiveType] = React.useState<number>(2);
    const [numHistory, setNumHistory] = React.useState<number>(15);
    const [initialUpdate, setInitialUpdate] = React.useState<boolean>(false);

    return (
        <ChatContext.Provider
            value={{
                activeChat,
                setActiveChat,
                activeType,
                setActiveType,
                numHistory,
                setNumHistory,
                initialUpdate,
                setInitialUpdate,
            }}>
            <Box
                sx={{
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                }}>
                <Navbar />
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        flexGrow: 1,
                        height: "1px",
                    }}>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: "flex",
                            flexDirection: "column",
                            borderRight: 1,
                        }}>
                        <Contacts />
                    </Box>
                    <Box
                        sx={{
                            flexGrow: 8,
                            display: "flex",
                            flexDirection: "column",
                        }}>
                        <Messaging />
                    </Box>
                </Box>
            </Box>
        </ChatContext.Provider>
    );
}

export default Home;
