import React from 'react';

const SimplifiedRules = () => {
    return(<>
        <h2>Simplified Rules:</h2>
        <p><strong>2 - 6:</strong>
            <br/>Red = take this number of drinks
            <br/>Black = give this number of drinks (can be split between players)</p>
        <p><strong>7: Heaven</strong>
        <br/>Last to point to the sky drinks (video chat recommended!)</p>
        <p><strong>8: Date</strong>
            <br/>This player picks a date. When this player has to drink, so does their date</p>
        <p><strong>9: Rhyme Time</strong>
            <br/>This player picks a word to rhyme with. Each player, in order, shouts a word that rhymes with it. First player to fail to come up with a rhyming word must drink</p>
        <p><strong>10: Categories</strong>
            <br/>This player picks a category (e.g. soda brands, US Presidents, etc.). Each player, in order, names something that fits the category. First player to fail to come up with one must drink</p>
        <p><strong>Jack: Thumb Master</strong>
            <br/>This player is now Thumb Master. Whenever they put their thumb on the table (or in the air on video chat), all others must do the same. Last one to do so must drink</p>
        <p><strong>Queen: Question Master</strong>
            <br/>This player is now Question Master. If they ask a question and another player answers, that player must drink</p>
            <p><strong>King: Rule Master</strong>
            <br/>This player makes a new rule that others must follow for the rest of the game (e.g. no touching your face, etc). If a player breaks this rule, they must drink</p>
        <p><strong>Ace: Waterfall!</strong>
            <br/>All players begin to drink. When the player who started the waterfall chooses to stop, the player after them can stop, and so on. The last player in line must finish last.</p>
    </>)
}

export default SimplifiedRules;