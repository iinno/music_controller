import React, { useState } from "react";
import { TextField, Button, Grid, Typography } from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";

function JoinRoomPage() {
    let navigate = useNavigate();
    const [roomCode, setRoomCode] = useState("");
    const [error, setErrorCode] = useState("");

    const handleTextFieldChange = e => {
        setRoomCode(e.target.value);
    };

    const handleRoomButtonPressed = () => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                code: roomCode
            })
        };

        fetch("/api/join-room", requestOptions)
        .then(response => {
            if (response.ok) {
                navigate("/room/" + roomCode)
            } else {
                setErrorCode("Room not found")
            }
        })
        .catch(error => {
            console.log(error);
        });
    };

    return (
        <Grid container spacing={1} align="center" direction="column">
            <Grid item xs={12}>
                <Typography var="h4" component="h4">
                    Join a Room
                </Typography>
            </Grid>
            <Grid item xd={12}>
                <TextField 
                    error={error}
                    label="Code"
                    placeholder="Enter a Room Code."
                    value={roomCode}
                    helperText={error}
                    variant="outlined"
                    onChange={handleTextFieldChange}
                />
            </Grid>
            <Grid item xd={12}>
                <Button variant="contained" color="primary" onClick={handleRoomButtonPressed}>
                    Enter Room
                </Button>
                <Button variant="contained" color="secondary" to="/" component={Link}>
                    Back
                </Button>
            </Grid>
        </Grid>
    );
};
export default JoinRoomPage;