import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Home from "./App";
import reportWebVitals from "./reportWebVitals";
import AuthContext from "./components/AuthContext";
import Login from "./components/Login";

function App() {
    const [username, setusername] = React.useState<string>("");
    const [token, settoken] = React.useState<string>("");
    const [type, setType] = React.useState<number>(2);

    return (
        <React.StrictMode>
            {/* <SWRConfig value={{
                revalidateOnMount: true,
                revalidateOnFocus: true,
                revalidateOnReconnect: true,
            }}> */}
            <AuthContext.Provider
                value={{
                    username,
                    setusername,
                    token,
                    settoken,
                    type,
                    setType,
                }}>
                {token ? <Home /> : <Login />}
            </AuthContext.Provider>
            {/* </SWRConfig> */}
        </React.StrictMode>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
