import React from 'react';
import { useHistory, Link } from "react-router-dom";
import classes from './join.module.scss';
import baseUrl from '../../utils/baseUrl';
import axios from 'axios';
import randomString from 'randomstring';
import cookie from 'js-cookie';
import { initGA, logPageView } from "../../components/googleAnalytics";

const Join = ({ match }) => {

    const [formDisabled, setFormDisabled] = React.useState(false);
    const [gameId, setGameId] = React.useState();

    const history = useHistory(); 

    React.useEffect(() => {

        if(match.params.gameId && match.params.gameId.length === 5) {
            setGameId(match.params.gameId);
        }

        if (!window.GA_INITIALIZED) {
            initGA()
            window.GA_INITIALIZED = true
        }
        console.log("Logging page view");
        logPageView();
    }, [])
    
    async function validateGame(e) {
        e.preventDefault();
        setFormDisabled(true)

        const shortId = e.target.elements.gameId.value;
        const password = e.target.elements.gamePassword.value;
        const player_name = e.target.elements.playerName.value;
        
        // If this player already has this game stored in cookies, just navigate to /play
        // if(cookie.get('shortId') === shortId) {
        //     return history.push('/play');
        // }
        
        try {
            const url = `${baseUrl}/validate`;
            const payload = {
                shortId,
                password
            }
            const response = await axios.post(url, payload);
        
            // if response.data.gameData ... addPlayerToGame
            if(response.data.gameData) {
                
                addPlayerToGame(shortId, player_name, response.data.gameData.name);
            } else {
                alert(response.data.error);
            }
        } catch(error) {
            alert("Sorry, there was an error adding you to the game: ", error);
        } finally {
            setFormDisabled(false);
        }
        
    }

    async function addPlayerToGame(shortId, player_name, gameName) {
        setFormDisabled(true);
        
        // generate random string to identify this user
        const player_id = randomString.generate(7);

        try {
            // add user to game with name and id
            const url = `${baseUrl}/addPlayerToGame`;
            const payload = {
                shortId,
                player_name,
                player_id
            }
            const response = await axios.post(url, payload);

            // If a newPlayer was returned, then store player name and ID in cookies and load game
            const inTwelveHours = new Date(new Date().getTime() + 12 * 60 * 60 * 1000);
            
            if(response.data.newPlayer) {
                cookie.set('player_name', player_name, { expires: inTwelveHours });
                cookie.set('player_id', player_id, { expires: inTwelveHours });
                cookie.set('shortId', shortId, { expires: inTwelveHours });
                cookie.set('gameName', gameName, { expires: inTwelveHours });
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
            <h1 className={classes.header}>Join Existing Game</h1>
            <form disabled={formDisabled} className={classes.form} onSubmit={validateGame}>
                <div className={classes.formItem}>
                    <label className={classes.formLabel} htmlFor='gameId'>Game ID</label>
                    <input className={classes.formInput} style={{fontFamily: 'monospace'}} name='gameId' type='text' placeholder='5 character code' value={gameId} onChange={(e) => setGameId(e.target.value)}/>
                </div>
                <div className={classes.formItem}>
                    <label className={classes.formLabel} htmlFor='gamePassword'>Password</label>
                    <input className={classes.formInput} name='gamePassword' type='password'/>
                </div>
                <div className={classes.formItem}>
                    <label className={classes.formLabel} htmlFor='playerName'>Your Display Name</label>
                    <input className={classes.formInput} name='playerName' type='text' placeholder='e.g. John'/>
                </div>
                <div className={classes.formItem}>
                    <button className={classes.formButton} type='submit'>Join</button>
                </div>
            </form>
        </div>
    )
}

export default Join;