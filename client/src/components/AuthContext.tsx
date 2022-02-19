import React from "react";

const AuthContext = React.createContext({
    username: "",
    setusername: (user: any) => {},
    token: "",
    settoken: (tok: any) => {},
    type: 2,
    setType: (type: number) => {},
});
export default AuthContext;
