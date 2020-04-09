import React from 'react';
import classes from './playBoard.module.scss';
import cardBack from './cardback.png';
import cards from './cardImages';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi } from '@fortawesome/free-solid-svg-icons';

const PlayBoard = ({ gameStatus, takeTurn, isAdmin, yourTurn, handleShowModal, hideModal, socketConnected }) => {

    // When the play board mounts, create a new Image for each card, so all cards are pre-loaded
    React.useEffect(() => {
        Object.keys(cards).forEach(cardName => {
            const img = new Image();
            img.src = cards[cardName];
        })
    },[])

    function handleCardClick() {
        if(yourTurn || isAdmin) {
            takeTurn();
        } else {
            const header = "Wait your turn!";
            const text = `When it's your turn, you'll be able to draw a card`;
            const normal = {
                action: () => {
                    hideModal();
                },
                text: "Got It"
            };

            const modalContent = {
                header,
                text,
                normal
            }
            handleShowModal(modalContent);
        }
    }

    return (
    <div className={classes.wrapper}>
        <div className={classes.pullCardWrapper} onClick={handleCardClick}>
            <img src={cardBack} className={classes.pullCardImage} alt='playing card back' style={ (yourTurn || isAdmin) ? null : {filter: 'grayscale(100%)'}}/>
            <span className={classes.pullCardRemaining}>{gameStatus.unplayedCards.length} Cards Left</span>
        </div>

        { gameStatus.lastPulledCard ? 
        <div className={classes.lastPulledWrapper}>
            <p className={classes.lastPulledCardOutcome}>{ gameStatus.lastPulledCardOutcome }</p>
            <p className={classes.lastPulledCardInstruction}>{ gameStatus.lastPulledCardInstruction }</p>
            
            <img src={cards[gameStatus.lastPulledCard]} alt={`card ${gameStatus.lastPulledCard}`} className={classes.lastPulledCardImage}/>
        </div>
        : null }
        <div className={classes.playerTurnWrapper}>
            <span className={classes.playerTurn}>{`${gameStatus.players[gameStatus.turnIndex].player_name}'s Turn`}</span>
        </div>
        { socketConnected === false ?
        <div className={classes.connectionStatus}>
            <p className={classes.connectionStatusLine}>
                <span>Disconnected</span>
                <FontAwesomeIcon icon={faWifi}/>
            </p>
        </div>
        : null }  
    </div>
    );
} 

export default PlayBoard;