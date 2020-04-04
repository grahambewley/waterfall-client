import React from 'react';
import { useHistory } from "react-router-dom";
import classes from './new.module.scss';
import baseUrl from '../../utils/baseUrl';
import axios from 'axios';
import randomString from 'randomstring';
import cookie from 'js-cookie';

const New = () => {
    const [formDisabled, setFormDisabled] = React.useState(false);
    const [gameData, setGameData] = React.useState();

    const history = useHistory();

    async function createGame(e) {
        e.preventDefault();
        setFormDisabled(true);
        //document.getElementById('createGameForm').reset();

        const gameName = e.target.elements.gameName.value;
        const password = e.target.elements.gamePassword.value;

        try {
            // Create game and get back game ID
            const url = `${baseUrl}/createGame`;
            const payload = {
                gameName,
                password
            };
            const response = await axios.post(url, payload);
            setGameData(response.data.gameData);
        } catch(error) {
            console.log(error);
            alert("Sorry, there was an error starting your game: ", error);
        } finally {
            setFormDisabled(false);
        }
    }

    async function addPlayerToGame(e) {
        e.preventDefault();
        
        setFormDisabled(true);
        
        const playerName = e.target.elements.playerName.value;
        // generate random string to identify this user
        const playerId = randomString.generate(7);

        try {
            // add user to game with name and id
            const url = `${baseUrl}/addPlayerToGame`;
            const payload = {
                shortId: gameData.shortId,
                player_name: playerName,
                player_id: playerId,
                player_isAdmin: true
            }
            const response = await axios.post(url, payload);

            // If a newPlayer was returned, then store player name and ID in cookies and load game
            if(response.data.newPlayer) {
                cookie.set('player_name', response.data.newPlayer.player_name);
                cookie.set('player_id', response.data.newPlayer.player_id);
                cookie.set('shortId', gameData.shortId);
                history.push('/play');
            }

        } catch(error) {
            alert("Sorry, there was an error adding you to the game: ", error);
        } finally {
            setFormDisabled(false);
        }

    }

    return (
        <div className={classes.wrapper}>
            <h1 className={classes.header}>Start New Game</h1>

            { !gameData ? 
                <form disabled={formDisabled} className={classes.form} id='createGameForm' onSubmit={createGame}>
                    <div className={classes.formItem}>
                        <label className={classes.formLabel} htmlFor='gameName'>Game Name</label>
                        <input className={classes.formInput} name='gameName' type='text' placeholder='i.e. Happy Hour Club'/>
                    </div>
                    <div className={classes.formItem}>
                        <label className={classes.formLabel} htmlFor='gamePassword'>Game Password</label>
                        <input className={classes.formInput} name='gamePassword' type='password'/>
                    </div>
                    <div className={classes.formItem}>
                        <input className={classes.formButton} type='submit' value='Create'/>
                    </div>
                </form>
            :
                <form disabled={formDisabled} className={classes.form} id='addPlayerForm' onSubmit={addPlayerToGame}>
                    <div className={classes.formItem}>
                        <label className={classes.formLabel} htmlFor='playerName'>Your Display Name</label>
                        <input className={classes.formInput} name='playerName' type='text' placeholder='i.e John'/>
                    </div>
                    
                    <div className={classes.formItem}>
                         <button className={classes.formButton} type='submit'>Join</button>
                    </div>
                </form>
            }
        </div>
    )
}

export default New;