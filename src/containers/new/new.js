import React from 'react';
import { useHistory } from "react-router-dom";
import classes from './new.module.scss';
import baseUrl from '../../utils/baseUrl';
import axios from 'axios';
import randomString from 'randomstring';
import cookie from 'js-cookie';
import Tip from '../../components/tip/tip';

const New = () => {
    const [formDisabled, setFormDisabled] = React.useState(false);
    const [gameData, setGameData] = React.useState();
    const [playerName, setPlayerName] = React.useState('');
    
    const history = useHistory();

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
            if(response.data.newPlayer) {
                cookie.set('player_name', response.data.newPlayer.player_name);
                cookie.set('player_id', response.data.newPlayer.player_id);
                cookie.set('shortId', gameData.shortId);
                cookie.set('showIntroModal', true);
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
                                <h2>Classic Rules:</h2>
                                <p><strong>2 - 3:</strong>
                                    <br/>Red = take this number of drinks
                                    <br/>Black = give this number of drinks (can be split between players)</p>
                                <p><strong>4:</strong> Ladies drink</p>
                                <p><strong>5:</strong> Social, everyone drinks</p>
                                <p><strong>6:</strong> Guys drink</p>
                                <p><strong>7: Heaven</strong>
                                <br/>Last to point to the sky drinks (video chat recommended!)</p>
                                <p><strong>8: Date</strong>
                                    <br/>This player picks a date. When this player has to drink, so does their date</p>
                                <p><strong>9: Rhyme Time</strong>
                                    <br/>This player picks a word to rhyme with. Each player, in order, shouts a word that rhymes with it. First player to fail to come up with a rhyming word must drink</p>
                                <p><strong>10: Categories</strong>
                                    <br/>This player picks a category (e.g. soda brands, US Presidents, etc.). Each player, in order, names something that fits the category. First player to fail to come up with one must drink</p>
                                <p><strong>Jack: Thumb Master</strong>
                                    <br/>This player is now Thumb Master. Whenever they put their thumb on the table (or in the air on video chat), all others must do the same. Last one to do so must drink</p>
                                <p><strong>Queen: Question Master</strong>
                                    <br/>This player is now Question Master. If they ask a question and another player answers, that player must drink</p>
                                <p><strong>King: Rule Master</strong>
                                    <br/>This player makes a new rule that others must follow for the rest of the game (e.g. no touching your face, etc). If a player breaks this rule, they must drink</p>
                                <p><strong>Ace: Waterfall!</strong>
                                    <br/>All players begin to drink. When the player who started the waterfall chooses to stop, the player after them can stop, and so on. The last player in line must finish last.</p>

                                    <h2>Simplified Rules:</h2>
                                <p><strong>2 - 6:</strong>
                                    <br/>Red = take this number of drinks
                                    <br/>Black = give this number of drinks (can be split between players)</p>
                                <p><strong>7: Heaven</strong>
                                <br/>Last to point to the sky drinks (video chat recommended!)</p>
                                <p><strong>8: Date</strong>
                                    <br/>This player picks a date. When this player has to drink, so does their date</p>
                                <p><strong>9: Rhyme Time</strong>
                                    <br/>This player picks a word to rhyme with. Each player, in order, shouts a word that rhymes with it. First player to fail to come up with a rhyming word must drink</p>
                                <p><strong>10: Categories</strong>
                                    <br/>This player picks a category (e.g. soda brands, US Presidents, etc.). Each player, in order, names something that fits the category. First player to fail to come up with one must drink</p>
                                <p><strong>Jack: Thumb Master</strong>
                                    <br/>This player is now Thumb Master. Whenever they put their thumb on the table (or in the air on video chat), all others must do the same. Last one to do so must drink</p>
                                <p><strong>Queen: Question Master</strong>
                                    <br/>This player is now Question Master. If they ask a question and another player answers, that player must drink</p>
                                    <p><strong>King: Rule Master</strong>
                                    <br/>This player makes a new rule that others must follow for the rest of the game (e.g. no touching your face, etc). If a player breaks this rule, they must drink</p>
                                <p><strong>Ace: Waterfall!</strong>
                                    <br/>All players begin to drink. When the player who started the waterfall chooses to stop, the player after them can stop, and so on. The last player in line must finish last.</p>
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
                            placeholder='i.e John'/>
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