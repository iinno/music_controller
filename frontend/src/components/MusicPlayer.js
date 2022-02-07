import React, { useEffect, useState } from 'react';
import { Grid, Typography, Card, IconButton, LinearProgress} from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";

function  MusicPlayer({song}) {

    const pauseSong = () => {
        const requestOptions = {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
        };
        fetch("/spotify/pause", requestOptions);
    }

    const playSong = () => {
        const requestOptions = {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
        };
        fetch("/spotify/play", requestOptions);
    }

    return (
        <Card>
            <Grid container alignItems='center'>
                <Grid item align="center" xs={4}>
                    <img src={song.image_url} height="100%" width="100%" />
                </Grid>
                <Grid item align="center" xs={8}>
                    <Typography componet="h5" variant="h5">
                        {song.title}
                    </Typography>
                    <Typography color="textSecondary" variant="subtitle1">
                        {song.artist}
                    </Typography>
                    <div>
                        <IconButton onClick={() => {song.is_playing ? pauseSong() : playSong()}}>
                            {song.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
                        </IconButton>
                        <IconButton>
                            <SkipNextIcon />
                        </IconButton>
                    </div>
                </Grid>
            </Grid>
            <LinearProgress variant="determinate" value={(song.time / song.duration) * 100} />
        </Card>

    )
}

export default MusicPlayer;