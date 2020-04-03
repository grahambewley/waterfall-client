import React from 'react';
import classes from './modal.module.scss';

const Modal = ({ modalContent }) => {

    const { header, text, affirmative, negative, normal } = modalContent;

    return (   
        <div className={classes.backdrop}>
            <div className={classes.modal}>
                <h2 className={classes.modal__header}>{header}</h2>
                <p className={classes.modal__text}>{text}</p>

                <div className={classes.modal__actions}>
                    { normal && <button className={classes.modal__normalAction} onClick={normal.action}>{normal.text}</button> }
                    { affirmative && <button className={classes.modal__affirmativeAction} onClick={affirmative.action}>{affirmative.text}</button> }
                    { negative && <button className={classes.modal__negativeAction} onClick={negative.action}>{negative.text}</button> }
                </div>
            </div>
        </div>
    );
}

export default Modal;