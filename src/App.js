import React from 'react';
import socketIOClient from 'socket.io-client';
import baseUrl from './utils/baseUrl';

function App() {
  const [gameStatus, setGameStatus] = React.useState(false);
  const [endpoint, setEndpoint] = React.useState(baseUrl);
  
  const socket = socketIOClient(endpoint);

  React.useEffect(() => {
    // const socket = socketIOClient(endpoint);
    socket.on("currentGameStatus", gameStatus => {
      console.log("Current game status: ", gameStatus);
      setGameStatus(gameStatus);
    });
  }, []);

  function pickCard() {
    const randomCardIndex = Math.floor(Math.random() * gameStatus.unplayedCards.length);
    const randomCard = gameStatus.unplayedCards[randomCardIndex];

    console.log("Selected card " + randomCard);
    socket.emit('pullCard', randomCard);
  }

  return (

    <div style={{ textAlign: "center" }}>
      {gameStatus ? <>
        <h2>Players:</h2>
        { gameStatus.players.map(player => {
          return <p>{ player.name }</p>
        })}

        <button onClick={pickCard}>Pick Card</button>
      </>
      : <p>Loading...</p>}
    </div>
  );
}

export default App;
