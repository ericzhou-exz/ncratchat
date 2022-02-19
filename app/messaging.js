const { Socket } = require("socket.io");

/**
 * Collects the message history between two users. Uses `socket.data.username` as current user and target as the other user.
 * @param {Socket} socket 
 * @param {Collection<Document>} users 
 * @param {Collection<Document>} messages 
 * @param {string} target 
 * @param {*} numMessages 
 */
async function messageHistoryRequest(
    socket,
    users,
    messages,
    target,
    numMessages
) {
    console.log("Trying to find messages");
    var userExists = await users.find({ username: target }).toArray();
    if (userExists.length != 1) {
        socket.emit("message-error", {
            message: "Invalid target to collect messages from",
        });
    }
    var listMessages = await messages
        .find({
            $and: [
                { from: { $in: [target, socket.data.username] } },
                { to: { $in: [target, socket.data.username] } },
            ],
        })
        .sort({ time: -1 })
        .limit(numMessages)
        .toArray();
    console.log("Found messages");
    socket.emit("message-history-collect", listMessages);
}

/**
 * Send a message from username 'from' to username 'to' with content 'content'.
 * Requires the users and messages collection
 * @param {Socket} socket 
 * @param {Collection<Document>} users 
 * @param {Collection<Document>} messages 
 * @param {string} from 
 * @param {string} to 
 * @param {string} content 
 * @returns 
 */
async function sendMessage(socket, users, messages, from, to, content) {
    let conversation = [from, to];
    conversation.sort();
    conversation = conversation.join("-");
    var msg = {
        from: from,
        to: to,
        content: content,
        time: new Date(Date.now()),
        conversation: conversation,
    };
    var conversationUsers = await users
        .find({ username: { $in: [from, to] } })
        .toArray();
    if (conversationUsers.length !== 2) {
        socket.emit("message-error", {
            message: "Invalid recipient and/or sender",
        });
        return;
    }
    await messages.insertOne(msg);
    console.log(`Sending from ${from} to ${to}. Conversation: ${conversation}`);

    socket.to(to).emit("receive-message", msg);
    socket.emit("receive-message", msg);
}

exports.messageHistoryRequest = messageHistoryRequest;
exports.sendMessage = sendMessage;
