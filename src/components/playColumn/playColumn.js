import React from 'react';
import baseUrl from '../../utils/baseUrl';
import axios from 'axios';
import randomString from 'randomstring';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle, faThumbsUp, faTimes, faCheck, faUserSlash, faArrowUp, faArrowDown, faUserEdit } from '@fortawesome/free-solid-svg-icons'

import classes from './playColumn.module.scss';

const PlayColumn = ({ gameStatus, sidebarOpen, setSidebarOpen, isAdmin, handleShowModal, hideModal, transmitGameStatus }) => {
    
    const [showNewPlayerInput, setShowNewPlayerInput] = React.useState(false);
    const [newOfflinePlayer, setNewOfflinePlayer] = React.useState('');
    const [showNewRuleInput, setShowNewRuleInput] = React.useState(false);
    const [newRule, setNewRule] = React.useState('');
    const [formDisabled, setFormDisabled] = React.useState(false);

    function removePlayerModal(player_id, player_name) {
        const header = "Are you sure?";
        const text = `Are you sure you want to remove ${player_name} from the game?`;
        const affirmative = {
            action: () => removePlayer(player_id),
            text: "Remove"
        };
        const negative = {
            action: hideModal,
            text: "Cancel"
        };

        const modalContent = {
            header,
            text,
            affirmative,
            negative
        }

        handleShowModal(modalContent);
    }

    function removeRuleModal(rule) {
        const header = "Are you sure?";
        const text = `Are you sure you want to remove the rule: "${rule}"?`;
        const affirmative = {
            action: () => removeRule(rule),
            text: "Remove"
        };
        const negative = {
            action: hideModal,
            text: "Cancel"
        };

        const modalContent = {
            header,
            text,
            affirmative,
            negative
        }

        handleShowModal(modalContent);
    }

    async function removePlayer(player_id) {
        try {
            // add user to game with name and id
            const url = `${baseUrl}/removePlayer`;
            const payload = {
                shortId: gameStatus.shortId,
                player_id
            }
            const response = await axios.post(url, payload);
            hideModal();
            transmitGameStatus();           
        } catch(error) {
            alert("Sorry, there was an error removing that player from the game: ", error);
        }
    }

    async function removeRule(rule) {
        try {
            // add user to game with name and id
            const url = `${baseUrl}/removeRule`;
            const payload = {
                shortId: gameStatus.shortId,
                rule
            }
            const response = await axios.post(url, payload);

            hideModal();      
            transmitGameStatus();      
        } catch(error) {
            alert("Sorry, there was an error removing that rule from the game: ", error);
        }
    }

    async function handleAddOfflinePlayer() {
        setFormDisabled(true);
        
        // generate random string to identify this user
        const player_id = randomString.generate(7);

        try {
            // add user to game with name and id
            const url = `${baseUrl}/addPlayerToGame`;
            const payload = {
                shortId: gameStatus.shortId,
                player_name: newOfflinePlayer,
                player_id,
                player_isOffline: true
            }
            const response = await axios.post(url, payload);
            setShowNewPlayerInput(false);
            setNewOfflinePlayer('');
            transmitGameStatus();
        } catch(error) {
            alert("Sorry, there was an error adding you to the game: ", error);
        } finally {
            setFormDisabled(false);
        }
    }

    async function handleAddRule() {
        setFormDisabled(true);
        try {
            // add rule to game
            const url = `${baseUrl}/addRuleToGame`;
            const payload = {
                shortId: gameStatus.shortId,
                rule: newRule
            }
            const response = await axios.post(url, payload);
            setShowNewRuleInput(false);
            setNewRule('');
            transmitGameStatus();
        } catch(error) {
            alert("Sorry, there was an error adding the rule: ", error);
        } finally {
            setFormDisabled(false);
        }
    }

    function handleTogglePlayerAdmin(e) {
        if(isAdmin) {
            const adminRow = e.target.nextSibling;
            adminRow.classList.toggle(classes.open);
        }
    }

    async function movePlayerDown(player_id) {
        const adminRows = document.querySelectorAll(`.${classes.playerAdminRow}`);
        adminRows.forEach(adminRow => adminRow.classList.remove(classes.open));
        try {
            const url = `${baseUrl}/movePlayerDown`;
            const payload = {
                shortId: gameStatus.shortId,
                player_id
            }
            const response = await axios.post(url, payload);
            transmitGameStatus();
        } catch(error) {
            alert("Sorry, there was an error moving that player");
        }
    }
    async function movePlayerUp(player_id) {
        const adminRows = document.querySelectorAll(`.${classes.playerAdminRow}`);
        adminRows.forEach(adminRow => adminRow.classList.remove(classes.open));
        try {
            const url = `${baseUrl}/movePlayerUp`;
            const payload = {
                shortId: gameStatus.shortId,
                player_id
            }
            const response = await axios.post(url, payload);
            transmitGameStatus();
        } catch(error) {
            alert("Sorry, there was an error moving that player");
        }
    }

    return (
        <div className={classes.wrapper} style={ sidebarOpen ? {transform:'translateX(0)'} : null } >
            <div className={classes.closeSidebar} onClick={() => setSidebarOpen(false)}>
                <FontAwesomeIcon icon={faTimes} style={{fontSize: '3.5rem', color: 'var(--color-blue'}}/>
            </div>
            <div>
                <h1 className={classes.gameName}>{gameStatus.name}</h1>
                <div className={classes.playersWrapper}>
                    <h2 className={classes.columnHeader}>Players:</h2>
                        { gameStatus.players.map((player, index) => {
                        return (    
                            <div className={classes.player} key={index}>
                                <p className={classes.playerName} onClick={handleTogglePlayerAdmin}>
                                    { player.player_name }
                                    { player.player_isOffline && <FontAwesomeIcon style={{color: '#aaa', fontSize:'1.4rem'}} className={classes.playerIcon} icon={faUserSlash}/>}
                                    { player.player_isQmaster && <FontAwesomeIcon className={classes.playerIcon} icon={faQuestionCircle}/> }
                                    { player.player_isTmaster && <FontAwesomeIcon className={classes.playerIcon} icon={faThumbsUp}/> }
                                </p>
                                <div className={classes.playerAdminRow}>
                                    <button 
                                        className={classes.playerAdminButton}
                                        style={{backgroundColor: 'var(--color-light-blue)'}}>
                                        <FontAwesomeIcon icon={faUserEdit}/>
                                    </button>
                                    <button 
                                        className={classes.playerAdminButton}
                                        onClick={() => movePlayerDown(player.player_id)}>
                                        <FontAwesomeIcon icon={faArrowDown}/>
                                    </button>
                                    <button 
                                        className={classes.playerAdminButton}
                                        onClick={() => movePlayerUp(player.player_id)}>
                                        <FontAwesomeIcon icon={faArrowUp}/>
                                    </button>
                                    <button 
                                        className={classes.playerAdminButton}
                                        style={{backgroundColor: 'var(--color-danger-red)'}}
                                        onClick={() => removePlayerModal(player.player_id, player.player_name)} >
                                        <FontAwesomeIcon icon={faTimes}/>
                                    </button>
                                </div>

                                {/* { isAdmin && 
                                    <div className={classes.adminControls}>
                                        <div className={classes.adminControl} onClick={() => movePlayerDown(player.player_id)}>
                                            <FontAwesomeIcon icon={faArrowDown}/>
                                        </div>
                                        <div className={classes.adminControl} onClick={() => movePlayerUp(player.player_id)}>
                                            <FontAwesomeIcon icon={faArrowUp}/>
                                        </div>
                                        <div className={classes.adminControl} onClick={() => removePlayerModal(player.player_id, player.player_name)}>
                                            <FontAwesomeIcon icon={faTimes}/>
                                        </div>
                                    </div>
                                } */}
                            </div>
                        )
                    })}
                    { isAdmin && 
                    <div className={classes.addPlayerWrapper}>
                        { showNewPlayerInput ?
                        <div className={classes.addInputWrapper}>
                            <input 
                                disabled={formDisabled}
                                className={classes.addInput}
                                value={newOfflinePlayer}
                                onChange={(e) => setNewOfflinePlayer(e.target.value)}
                                type='text' 
                                placeholder='Player Name'/>
                            <div className={classes.smallButtonWrapper}>
                                <button 
                                    disabled={formDisabled}
                                    style={{backgroundColor: 'rgba(122, 229, 130, .2)'}}
                                    className={classes.addSmallButton}
                                    onClick={handleAddOfflinePlayer}>
                                    <FontAwesomeIcon icon={faCheck}/>
                                </button>
                                <button 
                                    disabled={formDisabled}
                                    style={{backgroundColor: 'var(--color-danger-red'}}
                                    className={classes.addSmallButton} 
                                    onClick={() => setShowNewPlayerInput(false)}>
                                    <FontAwesomeIcon icon={faTimes}/>
                                </button>
                            </div>
                        </div>
                        : 
                        <button 
                            onClick={() => setShowNewPlayerInput(true)}
                            className={classes.addButton}>
                            Add Offline Player</button>
                        }
                    </div>
                    }
                </div>
                <div className={classes.rulesWrapper}>
                    <h2 className={classes.columnHeader}>Rules:</h2>
                    
                    {gameStatus.rules.length === 0 ?
                        <p className={classes.noRules}>No rules yet</p>
                    : 
                        gameStatus.rules.map((rule, index) => {
                            return <p className={classes.rule}>
                                <span>{ rule }</span>
                                { isAdmin && 
                                    <span style={{marginLeft: '1rem'}} className={classes.adminControl} onClick={() => removeRuleModal(rule)}>
                                        <FontAwesomeIcon icon={faTimes}/>
                                    </span>
                                }
                            </p>;
                        })}
                    
                    { isAdmin && 
                    <div className={classes.addRuleWrapper}>
                        { showNewRuleInput ?
                        <div className={classes.addInputWrapper}>
                            <input 
                                disabled={formDisabled}
                                className={classes.addInput}
                                value={newRule}
                                onChange={(e) => setNewRule(e.target.value) }
                                type='text' 
                                placeholder='Rule'/>
                            <div className={classes.smallButtonWrapper}>
                                <button 
                                    disabled={formDisabled}
                                    style={{backgroundColor: 'rgba(122, 229, 130, .2)'}}
                                    className={classes.addSmallButton}
                                    onClick={handleAddRule}>
                                    <FontAwesomeIcon icon={faCheck}/>
                                </button>
                                <button 
                                    disabled={formDisabled}
                                    style={{backgroundColor: 'rgba(219, 22, 47, .2)'}}
                                    className={classes.addSmallButton} 
                                    onClick={() => setShowNewRuleInput(false)}>
                                    <FontAwesomeIcon icon={faTimes}/>
                                </button>
                            </div>
                        </div>
                        : 
                        <button 
                            onClick={() => setShowNewRuleInput(true)}
                            className={classes.addButton}>
                            Add Rule</button>
                        }
                    </div>
                    }
                </div>
            </div>
            <div className={classes.gameIdWrapper}>
                <p className={classes.gameIdLine}>
                    <span className={classes.gameIdLabel}>Game ID: </span>
                    <span className={classes.gameId}>{gameStatus.shortId}</span>
                </p>
                <p className={classes.gameIdTip}>(Share this with your friends)</p>
            </div>
        </div>
    );
}

export default PlayColumn;