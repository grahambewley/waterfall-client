import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle, faThumbsUp, faTimes } from '@fortawesome/free-solid-svg-icons'

import classes from './playColumn.module.scss';

const PlayColumn = ({ gameStatus, sidebarOpen, setSidebarOpen }) => {
    
    return (
        <div className={classes.wrapper} style={ sidebarOpen ? {transform:'translateX(0)'} : null } >
            <div className={classes.closeSidebar} onClick={() => setSidebarOpen(false)}>
                <FontAwesomeIcon icon={faTimes} style={{fontSize: '3.5rem', color: 'var(--color-blue'}}/>
            </div>
            <h1 className={classes.gameName}>{gameStatus.name}</h1>
            <div className={classes.gameIdWrapper}>
                <span className={classes.gameIdLabel}>Game ID: </span>
                <span className={classes.gameId}>{gameStatus.shortId}</span>
            </div>
            <div className={classes.playersWrapper}>
                <h2 className={classes.columnHeader}>Players:</h2>
                    { gameStatus.players.map((player, index) => {
                    let classNames = [classes.playerName];
                    if(gameStatus.turnIndex === index) {
                        classNames.push(classes.yourTurn);
                    }

                    return (    
                        <div className={classes.player} key={index}>
                            <p className={classNames.join(' ')}>
                                { player.player_name }
                                { player.player_isQmaster && <FontAwesomeIcon className={classes.playerIcon} icon={faQuestionCircle}/> }
                                { player.player_isTmaster && <FontAwesomeIcon className={classes.playerIcon} icon={faThumbsUp}/> }
                            </p>
                        </div>
                    )
                })}
            </div>
            {/* <div className={classes.rulesWrapper}>
                <h2 className={classes.columnHeader}>Rules:</h2>
                { gameStatus.rules.length > 0 ? 
                    <ol className={classes.ruleList}>
                    { gameStatus.rules.map((rule, index) => {
                        return <li key={index} className={classes.ruleItem}>{rule}</li>;
                    }) }
                    </ol>
                    : <p className={classes.noRules}>No rules yet.</p>
                }
            </div> */}
        </div>
    );
}

export default PlayColumn;