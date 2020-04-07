import React from 'react';
import classes from './tip.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faQuestion, faTimes } from '@fortawesome/free-solid-svg-icons';

const Tip = ({ title, children }) => {

    const [showTipContent, setShowTipContent] = React.useState(false);

    return (<>
        <div 
            className={ title ? classes.tip : classes.tipNoTitle }
            onClick={() => setShowTipContent(true)}>
            <FontAwesomeIcon icon={ title ? faQuestionCircle : faQuestion } style={{ color: '#777'}}/>
            { title && <span className={classes.tip__title}>{ title }</span> }
        </div>
        
        { showTipContent &&
        <div className={classes.tipContentBackdrop}>
            <div className={classes.tipContent}>
                <div 
                    className={classes.tipContent__close}
                    onClick={() => setShowTipContent(false)}>
                    <FontAwesomeIcon icon={faTimes} />
                </div>
                { children }
            </div>
        </div> }
    </>)
}

export default Tip;