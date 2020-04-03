import React from 'react';
import socketIOClient from 'socket.io-client';
import cookie from 'js-cookie';
import baseUrl from '../../utils/baseUrl';
import classes from './play.module.scss';
import PlayBoard from '../../components/playBoard/playBoard';
import PlayColumn from '../../components/playColumn/playColumn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const Play = () => {
    const [gameStatus, setGameStatus] = React.useState(false);
    const [playerId, setPlayerId] = React.useState();
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    const socket = socketIOClient(baseUrl);

    React.useEffect(() => {
        // On mount, join game using data from cookies
        const player_id = cookie.get('player_id');
        const player_name = cookie.get('player_name');
        const shortId = cookie.get('shortId');

        setPlayerId(player_id);

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
        // Disable pulling of another card
        
        const randomIndex = Math.floor(Math.random() * gameStatus.unplayedCards.length);
        const pulledCard = gameStatus.unplayedCards[randomIndex];
        socket.emit('takeTurn', { shortId: gameStatus.shortId, player_id: playerId, pulledCard });

        // re-enable pulling of cards
    }

    return (
        <div className={classes.wrapper}>
            <div className={classes.openSidebar} onClick={ () => setSidebarOpen(true) } >
                <FontAwesomeIcon icon={faBars} style={{fontSize: '3.5rem'}}/>
            </div>
            { gameStatus ? <>
                <PlayBoard gameStatus={gameStatus} takeTurn={takeTurn}/>
                <PlayColumn 
                    gameStatus={gameStatus} 
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}/>
                
            </>
            : <p>Loading...</p>}
            
        </div>
    );
}

export default Play;