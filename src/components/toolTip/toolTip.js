import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import classes from './toolTip.module.scss';

const ToolTip = (tooltipText) => {
    return(
        <div className={classes.questionMarkWrapper}>
            <FontAwesomeIcon icon={faQuestion}/>
            <div className={classes.textBox}>
                <p>{tooltipText}</p>
            </div>
        </div>
    );
}

export default ToolTip;