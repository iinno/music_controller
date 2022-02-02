import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, Button, Typography } from '@material-ui/core';
import CreateRoomPage from './CreateRoomPage';

function Room() {
    let navigate = useNavigate();
    const [roomSettings, setRoomSettings] = useState({
        votesToSkip: 2,
        guestCanPause: false,
        isHost: false,
        showSettings: false,
    })

    const { roomCode } = useParams();

    useEffect(() => {
        fetch("/api/get-room" + "?code=" + roomCode)
        .then(response => {
            if (!response.ok) {
                navigate("/");
            };
            
            return response.json()
        })
        .then(data => {       
            console.log(data)
            // Here, I used to call hooks for each variable but that would result in a rerender each time.
            setRoomSettings({
                votesToSkip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.is_host,
                ...data
            });
        });
    }, []);

    const handleLeaveButtonPressed = () => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        };

        fetch("/api/leave-room", requestOptions)
        .then((response) => { navigate("/"); 
        });
    };

    const handleShowSettings = () => {
        setRoomSettings ({
            ...roomSettings,
            showSettings: !roomSettings.showSettings
        })
        console.log(roomSettings.showSettings)
    };

    const settingsButton = <Button variant="contained" color="primary" onClick={handleShowSettings}>Settings</Button>;

    if (!roomSettings.showSettings) {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        Code: {roomCode}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        Votes: {roomSettings.votesToSkip}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        Guest Can Pause: {roomSettings.guestCanPause.toString()}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        Host: {roomSettings.isHost.toString()}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" onClick={handleLeaveButtonPressed}>
                        Leave Room
                    </Button>
                    {roomSettings.isHost ? settingsButton : null}
                </Grid>
            </Grid>
        );
    } else {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <CreateRoomPage 
                        update={true} 
                        votesToSkip={roomSettings.votesToSkip} 
                        guestCanPause={roomSettings.guestCanPause}
                        roomCode={roomCode}
                    />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant='contained' color='secondary' onClick={handleShowSettings}>
                        Close
                    </Button>
                </Grid>
            </Grid>
        );
    };
};

export default Room;