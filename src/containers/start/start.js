import React from 'react';
import { Link } from 'react-router-dom';
import { Like } from 'react-facebook';
import classes from './start.module.scss';
import Tip from '../../components/tip/tip';
import { initGA, logPageView } from '../../components/googleAnalytics';
import cookie from 'js-cookie';

const Start = () => {
  const [gameInProgress, setGameInProgress] = React.useState(false);

  React.useEffect(() => {
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView();

    if (cookie.get('gameName')) {
      setGameInProgress(true);
    }
  }, []);

  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.mainWrapper}>
          <span
            role="img"
            aria-label="beer glasses"
            style={{ fontSize: '6rem', marginTop: '4rem' }}
          >
            &#127867;
          </span>
          <h1 className={classes.header}>Waterfall</h1>
          <h2 className={classes.subhead}>The Drinking Game: Online</h2>

          {gameInProgress && (
            <>
              <Link to="/play">
                <button className={classes.rejoinButton}>{`Rejoin "${cookie.get(
                  'gameName'
                )}"`}</button>
              </Link>
              <span className={classes.rejoinOr}>OR</span>
            </>
          )}
          <Link to="/join">
            <button className={classes.joinButton}>Join Game</button>
          </Link>
          <Link to="/new">
            <button className={classes.startButton}>Start New Game</button>
          </Link>
          <Like
            href="https://www.waterfall.beer"
            showFaces
            layout="button_count"
            size="large"
            share
          />
        </div>
        <div className={classes.tipWrapper}>
          <Tip title="How to Play">
            <p style={{ fontWeight: 'bold' }}>How to Play:</p>
            <p>
              Start a game.
              <br />
              Start a video call.
              <br />
              Invite your friends.
            </p>
            <p>Cheers!</p>
          </Tip>
        </div>
      </div>
    </>
  );
};
export default Start;
