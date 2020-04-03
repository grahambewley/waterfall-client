import React from 'react';
import classes from './playBoard.module.scss';
import cardBack from './cardback.png';
import cards from './cardImages';
import cookie from 'js-cookie';

const PlayBoard = ({ gameStatus, takeTurn }) => {

    const [yourTurn, setYourTurn] = React.useState(false);
    const [isAdmin, setIsAdmin] = React.useState(false);

    React.useEffect(() => {
        // When game status updates,
        // Find out what turn position you are
        console.log('Calculating my turn index, gameStatus is: ', gameStatus);
        const index = gameStatus.players.findIndex((player) => {
            return player.player_id === cookie.get('player_id');
        });
    
        setYourTurn(index === gameStatus.turnIndex);

        // and find out if you're an admin
        const isAdmin = gameStatus.players[index].player_isAdmin;
        setIsAdmin(isAdmin);

    }, [gameStatus])


    function handleCardClick() {
        if(yourTurn || isAdmin) {
            takeTurn();
        } else {
            alert("Wait for your turn!");
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