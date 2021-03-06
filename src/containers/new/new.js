import React from 'react';
import { useHistory, Link } from "react-router-dom";
import classes from './new.module.scss';
import baseUrl from '../../utils/baseUrl';
import axios from 'axios';
import randomString from 'randomstring';
import cookie from 'js-cookie';
import Tip from '../../components/tip/tip';
import ClassicRules from '../../components/rules/classicRules';
import SimplifiedRules from '../../components/rules/simplifiedRules';
import { initGA, logPageView } from "../../components/googleAnalytics";

const New = () => {
    const [formDisabled, setFormDisabled] = React.useState(false);
    const [gameData, setGameData] = React.useState();
    const [playerName, setPlayerName] = React.useState('');
    
    const history = useHistory(); 

    React.useEffect(() => {
        if (!window.GA_INITIALIZED) {
            initGA()
            window.GA_INITIALIZED = true
        }
        console.log("Logging page view");
        logPageView();
    }, [])

    async function createGame(e) {
        e.preventDefault();
        setFormDisabled(true);
        //document.getElementById('createGameForm').reset();

        const gameName = e.target.elements.gameName.value;
        const gameMode = e.target.elements.gameMode.value;
        const password = e.target.elements.gamePassword.value;

        try {
            // Create game and get back game ID
            const url = `${baseUrl}/createGame`;
            const payload = {
                gameName,
                gameMode,
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
            const inTwelveHours = new Date(new Date().getTime() + 12 * 60 * 60 * 1000);

            if(response.data.newPlayer) {
                cookie.set('player_name', response.data.newPlayer.player_name, { expires: inTwelveHours });
                cookie.set('player_id', response.data.newPlayer.player_id, { expires: inTwelveHours });
                cookie.set('shortId', gameData.shortId, { expires: inTwelveHours });
                cookie.set('gameName', gameData.name, { expires: inTwelveHours });
                cookie.set('showIntroModal', true, { expires: inTwelveHours });
                history.push('/play');
            }

        } catch(error) {
            alert("Sorry, there was an error adding you to the game: ", error);
        } finally {
            setFormDisabled(false);
        }
    }

    return ( <>

        <div className={classes.wrapper}>
            <div className={classes.goHome}>
                <Link to='/'>
                    <button className={classes.goHomeButton}>
                    <span 
                        role='img' 
                        aria-label='beer glasses'>&#127867;</span>
                        Go Home
                    </button>
                </Link>
            </div>
            <h1 className={classes.header}>Start New Game</h1>

            { !gameData ? 
                <form disabled={formDisabled} className={classes.form} id='createGameForm' onSubmit={createGame}>
                    <div className={classes.formItem}>
                        <label className={classes.formLabel} htmlFor='gameName'>Game Name</label>
                        <input className={classes.formInput} name='gameName' type='text' placeholder='e.g. Happy Hour Club'/>
                    </div>
                    <div className={classes.formItem}>
                        <label className={classes.formLabel} htmlFor='gameMode'>Game Rules</label>
                        <div className={classes.formItemWithTipWrapper}>
                            <select name='gameMode' className={classes.formSelect}>
                                <option className={classes.formOption} value='classic'>Classic</option>
                                <option className={classes.formOption} value='simplified'>Simplified</option>
                            </select>
                            <Tip>
                                <ClassicRules/>
                                <SimplifiedRules/>
                            </Tip>
                        </div>
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
                        <input 
                            className={classes.formInput} 
                            name='playerName' 
                            value={playerName} 
                            onChange={(e) => setPlayerName(e.target.value)}
                            type='text' 
                            placeholder='e.g. John'/>
                    </div>
                    
                    <div className={classes.formItem}>
                         <button className={classes.formButton} type='submit'>Start</button>
                    </div>
                </form>
            }
        </div>
    </> )
}

export default New;