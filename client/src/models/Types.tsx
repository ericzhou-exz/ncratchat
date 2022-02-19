export type MessageType = {
    from: string;
    to: string;
    time: string;
    content: string;
};

export type UserType = {
    username: string;
    type: number;
    lastMessage: undefined | MessageType;
};
