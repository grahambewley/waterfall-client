import React from 'react';
import classes from './playerRenameModal.module.scss';
import baseUrl from '../../../utils/baseUrl';
import axios from 'axios';

const PlayerRenameModal = ({ shortId, playerToRename, hideModal, hidePlayerAdmin, transmitGameStatus }) => {
    const [newName, setNewName] = React.useState('');

    async function handleRenamePlayer() {
        try {
            const url = `${baseUrl}/renamePlayer`;
            const payload = {
                shortId,
                player_id: playerToRename,
                newName
            }
            const response = await axios.post(url, payload);
            console.log(response);
            transmitGameStatus();
            hidePlayerAdmin();
            hideModal();
        } catch(error) {
            console.log("Sorry, there was an error renaming that player: ", error);
        } 
    }

    return (
        <div className={classes.backdrop}>
            <div className={classes.modal}>
                <h2 className={classes.modal__header}>Rename Player</h2>
                <p className={classes.modal__text}>Please enter the player's new name below:</p>
                <input 
                    className={classes.modal__input} 
                    placeholder='New Name' 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)}/>
                <div className={classes.modal__actions}>
                    <button 
                        className={classes.modal__normalAction}
                        onClick={handleRenamePlayer}>Rename</button> 
                    <button 
                        className={classes.modal__negativeAction}
                        onClick={hideModal}>Cancel</button> 
                </div>
            </div>
        </div>
    )
}

export default PlayerRenameModal;