import React from 'react';
import classes from './playBoard.module.scss';
import cardBack from './cardback.png';
import cards from './cardImages';

const PlayBoard = ({ gameStatus, takeTurn }) => {

    return (
    <div className={classes.wrapper}>
        <div className={classes.pullCardWrapper} onClick={takeTurn}>
            <img src={cardBack} className={classes.pullCardImage} alt='playing card back'/>
            <span className={classes.pullCardRemaining}>{gameStatus.unplayedCards.length} Cards Left</span>
        </div>

        { gameStatus.lastPulledCard ? 
        <div className={classes.lastPulledWrapper}>
            <p className={classes.lastPulledCardOutcome}>{ gameStatus.lastPulledCardOutcome }</p>
            <img src={cards[gameStatus.lastPulledCard]} alt={`card ${gameStatus.lastPulledCard}`} className={classes.lastPulledCardImage}/>
        </div>
        : null }
        <div className={classes.playerTurnWrapper}>
            <span className={classes.playerTurn}>{`${gameStatus.players[gameStatus.turnIndex].player_name}'s Turn`}</span>
        </div>
    </div>
    );
} 

export default PlayBoard;