import React from 'react';
import baseUrl from '../../utils/baseUrl';
import axios from 'axios';
import randomString from 'randomstring';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle, faThumbsUp, faTimes, faCheck, faUserSlash, faArrowUp, faArrowDown, faUserEdit, faAdjust } from '@fortawesome/free-solid-svg-icons'
import PlayerRenameModal from './playerRenameModal/playerRenameModal';
import Tip from '../tip/tip';
import ClassicRules from '../../components/rules/classicRules';
import SimplifiedRules from '../../components/rules/simplifiedRules';
import classes from './playColumn.module.scss';

const PlayColumn = ({ gameStatus, sidebarOpen, setSidebarOpen, isAdmin, handleShowModal, hideModal, transmitGameStatus, darkMode, toggleDarkMode }) => {
    
    const [showNewPlayerInput, setShowNewPlayerInput] = React.useState(false);
    const [newOfflinePlayer, setNewOfflinePlayer] = React.useState('');
    const [showNewRuleInput, setShowNewRuleInput] = React.useState(false);
    const [newRule, setNewRule] = React.useState('');
    const [playerToRename, setPlayerToRename] = React.useState();
    const [showPlayerRenameModal, setShowPlayerRenameModal] = React.useState(false);
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
            await axios.post(url, payload);
            hideModal();
            hideAllPlayerAdmin();
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
            await axios.post(url, payload);

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
            await axios.post(url, payload);
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
            await axios.post(url, payload);
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

    function renamePlayerModal(player_id) {
        setPlayerToRename(player_id);
        setShowPlayerRenameModal(true);
    }

    async function movePlayerDown(player_id) {
        hideAllPlayerAdmin();
        try {
            const url = `${baseUrl}/movePlayerDown`;
            const payload = {
                shortId: gameStatus.shortId,
                player_id
            }
            await axios.post(url, payload);
            transmitGameStatus();
        } catch(error) {
            alert("Sorry, there was an error moving that player");
        }
    }
    async function movePlayerUp(player_id) {
        hideAllPlayerAdmin();
        try {
            const url = `${baseUrl}/movePlayerUp`;
            const payload = {
                shortId: gameStatus.shortId,
                player_id
            }
            await axios.post(url, payload);
            transmitGameStatus();
        } catch(error) {
            alert("Sorry, there was an error moving that player");
        }
    }

    function hideAllPlayerAdmin() {
        const adminRows = document.querySelectorAll(`.${classes.playerAdminRow}`);
        adminRows.forEach(adminRow => adminRow.classList.remove(classes.open));
    }

    return (<>

        { showPlayerRenameModal && 
            <PlayerRenameModal 
                shortId={gameStatus.shortId} 
                playerToRename={playerToRename} 
                hideModal={() => setShowPlayerRenameModal(false)}
                hidePlayerAdmin={hideAllPlayerAdmin}
                transmitGameStatus={transmitGameStatus}/>
        }  

        <div className={classes.wrapper} style={ sidebarOpen ? {transform:'translateX(0)'} : null } >

            <div className={classes.closeSidebar} onClick={() => setSidebarOpen(false)}>
                <FontAwesomeIcon icon={faTimes} style={{fontSize: '3.5rem', color: 'var(--color-blue'}}/>
            </div>
            <div>
                <div className={classes.gameNameWrapper}>
                    <h1 className={classes.gameName}>{gameStatus.name}</h1>
                    <div style={{display:'inline-block'}}>
                        <Tip title='Rules'>
                            { gameStatus.mode === 'classic' ? <ClassicRules/> : <SimplifiedRules /> }
                        </Tip>
                    </div>
                </div>
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
                                        title='Rename player'
                                        style={{backgroundColor: 'var(--color-light-blue)'}}
                                        onClick={() => renamePlayerModal(player.player_id)}>
                                        <FontAwesomeIcon icon={faUserEdit}/>
                                    </button>
                                    <button 
                                        className={classes.playerAdminButton}
                                        title='Move player down'
                                        style={{backgroundColor: 'var(--color-background)'}}
                                        onClick={() => movePlayerDown(player.player_id)}>
                                        <FontAwesomeIcon icon={faArrowDown}/>
                                    </button>
                                    <button 
                                        className={classes.playerAdminButton}
                                        title='Move player up'
                                        style={{backgroundColor: 'var(--color-background)'}}
                                        onClick={() => movePlayerUp(player.player_id)}>
                                        <FontAwesomeIcon icon={faArrowUp}/>
                                    </button>
                                    <button 
                                        className={classes.playerAdminButton}
                                        title='Remove player'
                                        style={{backgroundColor: 'var(--color-danger-red)'}}
                                        onClick={() => removePlayerModal(player.player_id, player.player_name)} >
                                        <FontAwesomeIcon icon={faTimes}/>
                                    </button>
                                </div>
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
                                    style={{backgroundColor: 'var(--color-success-green)'}}
                                    className={classes.addSmallButton}
                                    onClick={handleAddOfflinePlayer}>
                                    <FontAwesomeIcon icon={faCheck}/>
                                </button>
                                <button 
                                    disabled={formDisabled}
                                    style={{backgroundColor: 'var(--color-danger-red)'}}
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
                                    style={{backgroundColor: 'var(--color-success-green'}}
                                    className={classes.addSmallButton}
                                    onClick={handleAddRule}>
                                    <FontAwesomeIcon icon={faCheck}/>
                                </button>
                                <button 
                                    disabled={formDisabled}
                                    style={{backgroundColor: 'var(--color-danger-red)'}}
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
                    <span className={classes.gameIdLabel}>Share Link:</span>
                    {/* <span className={classes.gameId}>{gameStatus.shortId}</span> */}
                </p>
                
                <p className={classes.gameIdUrl}>{`waterfall.beer/join/${gameStatus.shortId}`}</p>
                {/* <p className={classes.gameIdShareLabel}>(Click to Copy)</p> */}
            </div>

            <div className={classes.darkModeToggleWrapper}>
                <button className={classes.darkModeToggle} title='Toggle dark mode' onClick={toggleDarkMode}>
                    <FontAwesomeIcon icon={faAdjust} />
                </button>
            </div>
        </div>
    </>);
}

export default PlayColumn;