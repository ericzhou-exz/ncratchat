import { Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import { useContext } from "react";
import AuthContext from "./AuthContext";

export default function Message(props: {
    from: string;
    to: string;
    content: string;
    time: string;
}) {
    const { username } = useContext(AuthContext);

    return (
        <Box
            sx={{
                padding: 1,
                margin: 1,
                display: "flex",
                justifyContent: props.from === username ? "right" : "left",
            }}>
            <Tooltip
                title={props.time}
                placement={props.from === username ? "left" : "right"}>
                <Box
                    sx={{
                        color: props.from === username ? "#ffffff" : "#000000",
                        backgroundColor:
                            props.from === username ? "#1976d2" : "#dddddd",
                        padding: 1,
                        borderRadius: 3,
                    }}>
                    {props.content}
                </Box>
            </Tooltip>
        </Box>
    );
}
