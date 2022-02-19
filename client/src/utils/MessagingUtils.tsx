import socket from "../socket";

export function collectMessageHistory(target: string, numMessages: number) {
    socket.emit("message-history-request", {
        target: target,
        numMessages: numMessages,
    });
    console.log(`Requesting ${numMessages} from ${target}`);
}
