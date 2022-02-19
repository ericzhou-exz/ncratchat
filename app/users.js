const { Socket } = require("socket.io");

/**
 * Function to collect the most recently contacted users and their corresponding final messages.
 * @param {Socket} socket
 * @param {Collection<Document>} users
 * @param {Collection<Document>} messages
 * @param {number} limit
 * @returns List of dicts containing username, type and most recent message
 */
async function getContacts(socket, users, messages, limit = 10) {
    var userType = socket.data.type;

    // Find limit most recently send/received messages
    var listMessages = await messages
        .aggregate([
            {
                $match: {
                    $or: [
                        { from: socket.data.username },
                        { to: socket.data.username },
                    ],
                },
            },
            { $sort: { conversation: 1, time: -1 } },
            {
                $group: {
                    _id: "$conversation",
                    from: { $first: "$from" },
                    to: { $first: "$to" },
                    time: { $first: "$time" },
                    content: { $first: "$content" },
                },
            },
            { $sort: { time: -1 } },
        ])
        .limit(limit)
        .toArray();

    // List of users, each with format:
    // {
    //     username: String,
    //     type: Number,
    //     lastMessage: {
    //         _id: String,
    //         from: String,
    //         to: String,
    //         time: String,
    //         content: String,
    //     }
    // }
    var listUsers = [];

    // List of all the usernames which are active chats and our own username
    var listFoundUsers = [socket.data.username];
    for (var i = 0; i < listMessages.length; i++) {
        var message = listMessages[i];
        var otherUser =
            message.from == socket.data.username ? message.to : message.from;

        // TODO: fix projection on this find
        var user = await users.findOne({ username: otherUser });
        if (user) {
            delete user._id;
            delete user.passwordHash;
            delete user.authToken;
            user.lastMessage = message;
            listUsers.push(user);
            listFoundUsers.push(otherUser);
        }
    }

    // If we have not filled the limit with active chats then we get other users
    // These have no `lastMessage` field but the frontend handles that
    if (listUsers.length < limit) {
        var visibleUserTypes = socket.data.type == 2 ? [0, 1] : [0, 1, 2];
        console.log("Adding other users");
        var uncontactedUsers = await users
            .find(
                {
                    username: { $nin: listFoundUsers },
                    type: { $in: visibleUserTypes },
                }
                // TODO: fix projection
            )
            .limit(limit - listUsers.length)
            .toArray();
        for (var i = 0; i < uncontactedUsers.length; i++) {
            delete uncontactedUsers[i]._id;
            delete uncontactedUsers[i].passwordHash;
            delete uncontactedUsers[i].authToken;
        }
        listUsers = listUsers.concat(uncontactedUsers);
    }

    socket.emit("users", listUsers);
}

async function updatePermission(
    socket,
    users,
    messages,
    targetUser,
    targetPermission
) {
    console.log(`Attempt to update ${targetUser} to ${targetPermission}`);
    const thisUser = users.findOne({ username: socket.data.username });
    const thatUser = users.findOne({ username: targetUser });
    if (socket.data.type != 0) return;
    if (targetPermission < 0 || targetPermission > 2) return;
    if (!thatUser) return;
    if (thatUser.type == targetPermission) return;
    await users.updateOne(
        { username: targetUser },
        { $set: { type: targetPermission } }
    );

    getContacts(socket, users, messages);
}

async function deleteAccount(socket, users, messages, target) {
    const thisUser = await users.findOne({
        username: socket.data.username,
    });
    if (socket.data.username == target && thisUser.type == 0) {
        console.log("Here");
        return;
    } else if (socket.data.username != target && socket.data.type != 0) {
        console.log(socket.data.type);
        console.log("now here");
        console.log(thisUser);
        return;
    }

    const thatUser = users.findOne({ username: target });
    if (!thatUser) return;

    console.log("Deleting user: ", target);
    users.deleteOne({ username: target });
    messages.deleteMany({ $or: [{ from: target }, { to: target }] });
}

exports.getContacts = getContacts;
exports.updatePermission = updatePermission;
exports.deleteAccount = deleteAccount;
