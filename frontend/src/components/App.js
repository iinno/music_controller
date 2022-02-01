import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Routes, Route, Link, Redirect } from "react-router-dom";
import HomePage from "./HomePage";
import JoinRoomPage from "./JoinRoomPage";
import CreateRoomPage from "./CreateRoomPage"
import Room from "./Room"

export default function App() {
    return (
        <div className="center">
            <Router>
                <Routes>
                    <Route path='/' element={<HomePage/>} />
                    <Route path='/join' element={<JoinRoomPage/>} />
                    <Route path='/create' element={<CreateRoomPage/>} />
                    <Route path='/room/:roomCode' element={<Room/>} />
                </Routes>
            </Router>
        </div>
    );
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);