var SHA256 = require("crypto-js/sha256");
require("dotenv").config();

const key = process.env.KEY;
const salt = process.env.SALT;

async function hashString(message, addKey = false) {
    const hash = SHA256(message + salt + (addKey ? key : "")).words.join("");
    return hash;
}

async function signUp(socket, users, authToken, username, passwordHash, next) {
    const user = await users.findOne({ username: username });

    if (user) {
        console.log(`User ${username} already exists`);
        return next(new Error("User already exists"));
    } else {
        if (username.length < 6 || username.length > 15)
            next(new Error("Username must be between 6 and 15 characters"));

        await users.insertOne({
            username: username,
            passwordHash: passwordHash,
            authToken: authToken,
            type: 2,
        });
        socket.data.username = username;
        socket.data.token = authToken;
        socket.data.type = 2;
        console.log(`Created user ${username}`);
        return next();
    }
}

async function signIn(socket, users, authToken, username, passwordHash, next) {
    const user = await users.findOne({ username: username });

    if (user) {
        console.log("Logging in as user");

        if (user.passwordHash !== passwordHash) {
            console.log("Incorrect password");
            next(new Error("Incorrect password"));
        } else {
            socket.data.username = username;
            socket.data.token = authToken;
            socket.data.type = user.type;
            console.log(`Signed in as ${username}`);
            next();
        }
    } else {
        next(new Error("User does not exist"));
    }
}

exports.signIn = signIn;
exports.signUp = signUp;
exports.hashString = hashString;
