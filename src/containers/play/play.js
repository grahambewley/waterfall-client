import React from 'react';
import socketIOClient from 'socket.io-client';
import cookie from 'js-cookie';
import baseUrl from '../../utils/baseUrl';
import classes from './play.module.scss';
import PlayBoard from '../../components/playBoard/playBoard';
import PlayColumn from '../../components/playColumn/playColumn';
import Modal from '../../components/modal/modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { initGA, logPageView } from "../../components/googleAnalytics";

const Play = () => {
    const [darkMode, setDarkMode] = React.useState();
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const [showModal, setShowModal] = React.useState(false);
    const [modalContent, setModalContent] = React.useState();

    const [socketConnected, setSocketConnected] = React.useState(true);
    const [gameStatus, setGameStatus] = React.useState(false);
    const [gameOver, setGameOver] = React.useState();
    const [playerId, setPlayerId] = React.useState();
    
    const [allowTurn, setAllowTurn] = React.useState(true);
    const [yourTurn, setYourTurn] = React.useState(false);
    const [isAdmin, setIsAdmin] = React.useState(false);
    
    const socket = socketIOClient(baseUrl);

    React.useEffect(() => {
        if (!window.GA_INITIALIZED) {
            initGA()
            window.GA_INITIALIZED = true
        }
        logPageView();

        // On mount, join game using data from cookies
        const player_id = cookie.get('player_id');
        const player_name = cookie.get('player_name');
        const shortId = cookie.get('shortId');

        if(cookie.get('darkMode') === 'true') {
            setDarkMode(true);
        }

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
            setGameOver(false);
            setGameStatus(gameStatus);
        });

        // When server triggers game over show appropriate components
        socket.on("gameOver", () => {
            setGameOver(true);
        });

        // If intro modal cookie is present (if client created the game), show modal with Game ID
        const showIntroModal = cookie.get('showIntroModal');
        if(showIntroModal) {
            const header = "Welcome to your Waterfall game!";
            const text = `For other players to join your game, you'll need to give them the Game Password. Players can join your game using the link below, or by entering your Game ID from the 'Join' page.`;
            const gameId = shortId;
            const normal = {
                action: () => {
                    cookie.remove('showIntroModal');
                    hideModal();
                },
                text: "Got It"
            };

            const modalContent = {
                header,
                text,
                gameId,
                normal
            }

            handleShowModal(modalContent);
        }

    }, []);

    // Function to run every second and check socket.io connection status
    React.useEffect(() => {
        const interval = setInterval(() => {
            setSocketConnected(socket.connected);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    React.useEffect(() => {
        if(gameStatus) {

            if(gameStatus.unplayedCards.length === 0) {
                setGameOver(true);
            }

            // Find out what turn position you are
            const index = gameStatus.players.findIndex((player) => {
                return player.player_id === cookie.get('player_id');
            });
        
            setYourTurn(index === gameStatus.turnIndex);

            // and find out if you're an admin
            const isAdmin = gameStatus.players[index].player_isAdmin;
            setIsAdmin(isAdmin);

            // Allow turn taking again
            setAllowTurn(true);
        }
    }, [gameStatus]);

    React.useEffect(() => {
        if(darkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            cookie.set('darkMode', true);
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            cookie.set('darkMode', false);
        }
    }, [darkMode]);

    function takeTurn() {
        if(allowTurn && !gameOver) {
            // Disable pulling of another card
            setAllowTurn(false);

            const randomIndex = Math.floor(Math.random() * gameStatus.unplayedCards.length);
            const pulledCard = gameStatus.unplayedCards[randomIndex];
            socket.emit('takeTurn', { 
                shortId: gameStatus.shortId, 
                player_id: playerId, 
                pulledCard,
                gameMode: gameStatus.mode
            });
        } 
    }

    function transmitGameStatus() {
        socket.emit('transmitGameStatus', { shortId: gameStatus.shortId });
    }

    function handleShowModal(modalContent) {
        setModalContent(modalContent);
        setShowModal(true);
    }

    function hideModal() {
        setShowModal(false);
    }

    function handlePlayAgain() {
        console.log("Handling game over click")
        if(gameOver) {
            console.log("Emiting playAgain message");
            socket.emit('playAgain', {
                shortId: gameStatus.shortId
            });
        }
    }

    return (
        <div className={classes.wrapper}>
            
            { showModal && <Modal modalContent={modalContent} /> }
            <div className={classes.openSidebar} onClick={ () => setSidebarOpen(true) } >
                <FontAwesomeIcon icon={faBars} style={{fontSize: '3.5rem', color: 'var(--color-blue'}}/>
            </div>
            { gameStatus ? <>
                <PlayBoard 
                    gameStatus={gameStatus} 
                    takeTurn={takeTurn}
                    isAdmin={isAdmin}
                    yourTurn={yourTurn}
                    handleShowModal={handleShowModal}
                    hideModal={hideModal}
                    sidebarOpen={sidebarOpen}
                    hideSidebar={() => setSidebarOpen(false)}
                    socketConnected={socketConnected}
                    gameOver={gameOver}
                    handlePlayAgain={handlePlayAgain}/>
                <PlayColumn 
                    gameStatus={gameStatus} 
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    isAdmin={isAdmin}
                    handleShowModal={handleShowModal}
                    hideModal={hideModal}
                    transmitGameStatus={transmitGameStatus}
                    darkMode={darkMode}
                    toggleDarkMode={() => setDarkMode(!darkMode)}/>
            </>
            : <p>Loading...</p>}
            
        </div>
    );
}

export default Play;