const express = require("express");
const http = require("http");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const { updatePermission, deleteAccount, getContacts } = require("./users");
const { hashString, signUp, signIn } = require("./authentication");
const { messageHistoryRequest, sendMessage } = require("./messaging");
require("dotenv").config();

const client = new MongoClient(process.env.MONGODB_CONNECTION);

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origins: ["*"],
    },
    handlePreflightRequest: (req, res) => {
        res.writeHead(200, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST",
            "Access-Control-Allow_headers": "someHeader",
            "Access-Control-Allow-Credentials": true,
        });
        res.end();
    },
});

app.use(cors());

var users;
var messages;

io.use(async (socket, next) => {
    const username = socket.handshake.auth.username;
    const token = socket.handshake.auth.token;

    const authToken = await hashString(username, true);

    if (token)
        return authToken == token && username == socket.data.username
            ? next()
            : next(new Error("Invalid token"));

    const method = socket.handshake.auth.method;
    const password = socket.handshake.auth.password;

    const passwordHash = await hashString(password);

    if (!password) {
        return next(new Error("Password required"));
    }

    if (method == "signup") {
        signUp(socket, users, authToken, username, passwordHash, next);
    } else if (method == "signin") {
        signIn(socket, users, authToken, username, passwordHash, next);
    } else {
        console.warn(`Method '${method}' not found`);
        return next(new Error(`Method '${method}' not found`));
    }
});

io.on("connection", async (socket) => {
    // Join our users channel
    socket.join(socket.data.username);

    // Also get them to join RA/Collegian channel
    socket.join(socket.data.type);

    // Send authentication token and username to user
    socket.emit("auth-packet", {
        token: socket.data.token,
        username: socket.data.username,
        type: socket.data.type,
    });

    // Collect visible users and send them to user
    getContacts(socket, users, messages);

    socket.on("update-contacts", async () => {
        getContacts(socket, users, messages);
    });

    // Send message history for a target user to active user
    socket.on("message-history-request", async ({ target, numMessages }) => {
        messageHistoryRequest(socket, users, messages, target, numMessages);
    });

    // Update the permission of a user
    socket.on("update-permission", async ({ targetUser, targetPermission }) => {
        updatePermission(socket, users, messages, targetUser, targetPermission);
    });

    // Send a message to user
    socket.on("send-message", async ({ from, to, content }) => {
        sendMessage(socket, users, messages, from, to, content);
    });

    // Delete an account
    socket.on("delete-account", async ({ target }) => {
        deleteAccount(socket, users, messages, target);
    });
});

server.listen(process.env.PORT || 5000, async () => {
    try {
        await client.connect();
        users = client.db("ratchat").collection("users");
        messages = client.db("ratchat").collection("messages");
        var somethingElse = client.db("ratchat").collection("messages");
        console.log("Listening on port: ", process.env.PORT || 5000);
    } catch (e) {
        console.log(e);
    }
});
