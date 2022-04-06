import { UserType } from "../models/Types";
import { Box, Typography } from "@mui/material";
import userTypes from "./UserTypes";

export default function ContactCard(props: { user: UserType }) {
    var messagePreview: string = props.user.lastMessage
        ? props.user.lastMessage?.from + ": " + props.user.lastMessage.content
        : "No recent messages";

    if (messagePreview.length > 40)
        messagePreview = messagePreview.substring(0, 37) + "...";

    return (
        <Box
            sx={{
                flexGrow: 1,
            }}>
            <Typography variant="h6">
                {props.user.username} - {userTypes[props.user.type]}
            </Typography>
            <Typography sx={{ opacity: 0.6 }} variant="caption">
                {messagePreview}
            </Typography>
        </Box>
    );
}
