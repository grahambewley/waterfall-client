import React from 'react';
import classes from './start.module.scss';

const Start = () => {
    return(<>
        <div className={ classes.wrapper }>
            <h1 className={ classes.header }>Waterfall</h1>
            <h2 className={ classes.subhead }>The Drinking Game: Online</h2>

            <button className={ classes.joinButton }>Join Game</button>
            <button className={ classes.startButton }>Start New Game</button>
        </div>
    </>)
}

export default Start;