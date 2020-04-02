import React from 'react';
import socketIOClient from 'socket.io-client';
import cookie from 'js-cookie';
import baseUrl from '../../utils/baseUrl';
import classes from './play.module.scss';
import PlayBoard from '../../components/playBoard/playBoard';
import PlayColumn from '../../components/playColumn/playColumn';

const Play = () => {
    const [gameStatus, setGameStatus] = React.useState(false);

    const socket = socketIOClient(baseUrl);

    React.useEffect(() => {
        // On mount, join game using data from cookies
        const player_id = cookie.get('player_id');
        const player_name = cookie.get('player_name');
        const shortId = cookie.get('shortId');

        socket.emit('join', { shortId, player_id, player_name }, (response) => {
            if(response.error) {
                alert(response.error);
            } else {
                setGameStatus(response.gameStatus);
            }
        });

        // When currentGameStatus is transmitted to client, update game status
        socket.on("currentGameStatus", gameStatus => {
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