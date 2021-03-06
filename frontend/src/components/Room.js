import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, Button, Typography } from '@material-ui/core';
import CreateRoomPage from './CreateRoomPage';
import MusicPlayer from './MusicPlayer'

function Room() {
    let navigate = useNavigate();
    let interval = null;
    const [roomSettings, setRoomSettings] = useState({
        votesToSkip: 2,
        guestCanPause: false,
        isHost: false,
    });
    const [showSettings, setShowSettings] = useState(false);
    const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
    const [song, setSong] = useState({});
    const { roomCode } = useParams();

    // Should use websockets instaed of polling but spotify API does not support it.
    useEffect(() => {
        if (spotifyAuthenticated) {
            interval = setInterval(getCurrentSong, 1000);
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        }
    }, [spotifyAuthenticated]);

    useEffect(() => {
        fetch("/api/get-room" + "?code=" + roomCode)
        .then(response => {
            if (!response.ok) {
                navigate("/");
            };
            
            return response.json()
        })
        .then(data => {       
            setRoomSettings({
                votesToSkip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.is_host,
            });
            if (!spotifyAuthenticated && data.is_host) {
                authenticateSpotify();
            };
        });
    }, [showSettings]);

    const getCurrentSong = () => {
        fetch('/spotify/current-song')
        .then(response => {
            if (!response.ok) {
                return {}
            } else {
                return response.json()
            }
        })
        .then(data => {
            setSong(data)
        });
    }

    const authenticateSpotify = () => {
        fetch("/spotify/is-authenticated")
        .then(response => response.json())
        .then(data => {
            setSpotifyAuthenticated(data.status);
            if (!data.status) {
                fetch("/spotify/get-auth-url")
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    window.location.replace(data.url);
                });
            };
        })
    };

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
        setShowSettings(!showSettings)
    };

    const settingsButton = <Button variant="contained" color="primary" onClick={handleShowSettings}>Settings</Button>;

    if (!showSettings) {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        Code: {roomCode}
                    </Typography>
                </Grid>
                <MusicPlayer song={song} />
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
                        propVotesToSkip={roomSettings.votesToSkip} 
                        propGuestCanPause={roomSettings.guestCanPause}
                        update={true} 
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