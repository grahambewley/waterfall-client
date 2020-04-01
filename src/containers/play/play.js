import React from 'react';
import socketIOClient from 'socket.io-client';
import baseUrl from '../../utils/baseUrl';
import classes from './play.module.scss';
import PlayBoard from '../../components/playBoard/playBoard';
import PlayColumn from '../../components/playColumn/playColumn';

const Play = () => {
    const [gameStatus, setGameStatus] = React.useState(false);

    const socket = socketIOClient(baseUrl);

    React.useEffect(() => {
        // const socket = socketIOClient(endpoint);
        socket.on("currentGameStatus", gameStatus => {
            console.log("Current game status: ", gameStatus);
            setGameStatus(gameStatus);
        });
    }, []);

    function takeTurn() {
        const randomIndex = Math.floor(Math.random() * gameStatus.unplayedCards.length);
        const pulledCard = gameStatus.unplayedCards[randomIndex];
        socket.emit('takeTurn', pulledCard);
    }

    return (
        <div className={classes.wrapper}>
        {gameStatus ? <>
            <PlayBoard gameStatus={gameStatus} takeTurn={takeTurn}/>
            <PlayColumn gameStatus={gameStatus} />
        </>
        : <p>Loading...</p>}
        </div>
    );
}

export default Play;