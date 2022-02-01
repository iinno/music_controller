import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, Button, Typography } from '@material-ui/core';

function Room() {
    let navigate = useNavigate();
    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);

    const { roomCode } = useParams();

    useEffect(() => {
        fetch("/api/get-room" + "?code=" + roomCode)
        .then(response => {
            if (!response.ok) {
                navigate("/");
            };
        })
        .then(data => {          
            setVotesToSkip(data.votes_to_skip);
            setGuestCanPause(data.guest_can_pause);
            setIsHost(data.is_host);
        });
    });

    const handleLeaveButtonPressed = () => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        };

        fetch("/api/leave-room", requestOptions)
        .then((response) => { navigate("/"); 
        });
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Code: {roomCode}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Votes: {votesToSkip}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Guest Can Pause: {guestCanPause.toString()}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Host: {isHost.toString()}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" onClick={handleLeaveButtonPressed}>
                    Leave Room
                </Button>
            </Grid>
        </Grid>
    );
};

export default Room;