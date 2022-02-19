import React from "react";

/**
 * Context which contains information about current chats.
 * `activeChat`: Username of user we are chatting to
 * `activeType`: Permission of user we are chatting to
 * `numHistory`: Number of messages we request in chat history
 * `initialUpdate`: Indicates if contact list has been updated after sending a message to activeUser
 */
const ChatContext = React.createContext({
    activeChat: "",
    setActiveChat: (user: string) => {},
    activeType: 2,
    setActiveType: (type: number) => {},
    numHistory: 15,
    setNumHistory: (num: number) => {},
    initialUpdate: false,
    setInitialUpdate: (val: boolean) => {},
});

export default ChatContext;
