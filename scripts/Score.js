import { highscoreImages } from './main.js'

export class Score {
    constructor() {
        this.score = 0;
        this.updateScore(highscoreImages, localStorage.getItem('highscore'))
    }

    /**
     * @param {Array} arrayOfImages
     * @param {number} number
     */
    updateScore(arrayOfImages, numberToRepresent) {
        for (let i = 0; i < arrayOfImages.length; i++) {
            let number = 10;
            for (let j = 0; j < i; j++)
                number *= 10;
            
            arrayOfImages[arrayOfImages.length - i - 1].src = `gfx/${Math.floor((numberToRepresent % number) / (number / 10))}.png`;
        }
    }
}