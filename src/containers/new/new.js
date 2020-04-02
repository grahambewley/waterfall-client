import React from 'react';
import classes from './new.module.scss';
import baseUrl from '../../utils/baseUrl';
import axios from 'axios';

const New = () => {
    const [formDisabled, setFormDisabled] = React.useState(false);
    const [gameData, setGameData] = React.useState();
    const [password, setPassword] = React.useState(); // Stored separately so it can be used to join the game after creating

    async function createGame(e) {
        e.preventDefault();
        
        setFormDisabled(true);
        
        const gameName = e.target.elements.gameName.value;
        const password = e.target.elements.gamePassword.value;
        setPassword(password);

        try {
            // Create game and get back game ID
            const url = `${baseUrl}/createGame`;
            const payload = {
                gameName,
                password
            };
            const response = await axios.post(url, payload);
            setGameData(response.data.gameData);
            console.log(response);
        } catch(error) {
            alert("Sorry, there was an error starting your game: ", error);
        } finally {
            setFormDisabled(false);
        }
    }

    async function joinGame(e) {
        e.preventDefault();
        
        setFormDisabled(true);
        
        const playerName = e.target.elements.playerName.value;
        
        try {
            // Join game and get back status (either response or error)
            const url = `${baseUrl}/joinGame`;
            const payload = {
                shortId: gameData.shortId,
                password,
                playerName
            };
            const response = await axios.post(url, payload);
            console.log(response);
        } catch(error) {
            alert("Sorry, there was an error joining the game: ", error);
        } finally {
            setFormDisabled(false);
        }
    }

    return (
        <div className={classes.wrapper}>
            <h1 className={classes.header}>Start New Game</h1>

            { !gameData ? 
                <form disabled={formDisabled} className={classes.form} onSubmit={createGame}>
                    <div className={classes.formItem}>
                        <label className={classes.formLabel} htmlFor='gameName'>Game Name</label>
                        <input className={classes.formInput} name='gameName' type='text' placeholder='i.e. Happy Hour Club'/>
                    </div>
                    <div className={classes.formItem}>
                        <label className={classes.formLabel} htmlFor='gamePassword'>Password (required to enter game)</label>
                        <input className={classes.formInput} name='gamePassword' type='password'/>
                    </div>
                    <div className={classes.formItem}>
                        <input className={classes.formButton} type='submit' value='Create'/>
                    </div>
                </form>
            :
                <form disabled={formDisabled} className={classes.form} onSubmit={joinGame}>
                    <div className={classes.formItem}>
                        <label className={classes.formLabel} htmlFor='playerName'>Your Display Name</label>
                        <input className={classes.formInput} name='playerName' type='text' placeholder='i.e John'/>
                    </div>
                    
                    <div className={classes.formItem}>
                        <input className={classes.formButton} type='submit' value='Start'/>
                    </div>
                </form>
            }
        </div>
    )
}

export default New;