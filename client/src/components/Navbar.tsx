import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AuthContext from "./AuthContext";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Menu,
    MenuItem,
} from "@mui/material";
import socket from "../socket";
import userTypes from "./UserTypes";

export default function ButtonAppBar() {
    const { username, setusername, settoken, type } =
        React.useContext(AuthContext);
    const [accountOpen, setAccountOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    function handleDelete() {
        socket.emit("delete-account", { target: username });
        settoken("");
        setusername("");
        socket.disconnect();
    }

    const info = [
        "You can delete any account (but your own), message anyone and change any other account from a Collegian account to an RA account.",
        "You can view any account and message anyone. Everyone can see that you are an RA.",
        "You can message RAs and the admin account, and only they can message you.",
    ];

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}>
                        RatChat
                    </Typography>
                    <Button
                        id="basic-button"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleClick}
                        color="inherit">
                        {username}
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}>
                        <MenuItem
                            onClick={() => {
                                setAccountOpen(true);
                            }}>
                            Account details
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setusername("");
                                settoken("");
                                socket.disconnect();
                            }}>
                            Logout
                        </MenuItem>
                    </Menu>
                    <Dialog open={accountOpen} onClose={setAccountOpen}>
                        <DialogTitle>Account details</DialogTitle>
                        <DialogContent>
                            <DialogContent>
                                <Typography gutterBottom>
                                    Hello, {username}. You have{" "}
                                    {type < 2 ? "an" : "a"} {userTypes[type]}{" "}
                                    account.
                                </Typography>
                            </DialogContent>
                            <DialogContent>
                                <Typography>{info[type]}</Typography>
                            </DialogContent>
                            <DialogActions>
                                {type !== 0 && (
                                    <Button onClick={() => handleDelete()}>
                                        Delete account
                                    </Button>
                                )}
                                <Button onClick={() => setAccountOpen(false)}>
                                    Close
                                </Button>
                            </DialogActions>
                        </DialogContent>
                    </Dialog>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
