import React from 'react';
import classes from './new.module.scss';
import baseUrl from '../../utils/baseUrl';
import axios from 'axios';

const New = () => {
    // const [gameId, setGameId] = React.useState();

    async function createGame(e) {
        e.preventDefault();
        // Create game and get back game ID
        const url = `${baseUrl}/createGame`;
        const payload = {
            gameName: e.target.elements.gameName.value
        };
        console.log("gameName to send is " + e.target.elements.gameName.value);
        const response = await axios.post(url, payload);
        console.log(response);
    }

    return (
        <div className={classes.wrapper}>
            <h1 className={classes.header}>Start New Game</h1>

            <form className={classes.form} onSubmit={createGame}>
                <label htmlFor='gameName'>Game Name</label>
                <input name='gameName' type='text' placeholder='i.e. Happy Hour Club'/>   
            </form>
        </div>
    )
}

export default New;