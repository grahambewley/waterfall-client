import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle, faThumbsUp } from '@fortawesome/free-solid-svg-icons'

import classes from './playColumn.module.scss';

const PlayColumn = ({ gameStatus }) => {
    return (
        <div className={classes.wrapper}>
            <div className={classes.playersWrapper}>
                <h2 className={classes.columnHeader}>Players:</h2>
                { gameStatus.players.map((player, index) => {
                    let classNames = [classes.playerName];
                    if(gameStatus.playerTurnIndex === index) {
                        classNames.push(classes.yourTurn);
                    }

                    return (    
                        <div className={classes.player} key={index}>
                            <p className={classNames.join(' ')}>
                                { player.player_name }
                                { player.qMaster && <FontAwesomeIcon className={classes.playerIcon} icon={faQuestionCircle}/> }
                                { player.tMaster && <FontAwesomeIcon className={classes.playerIcon} icon={faThumbsUp}/> }
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