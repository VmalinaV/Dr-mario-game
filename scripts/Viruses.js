import { data, score, virusCountImages } from './main.js'

export class Viruses {
    /**
     * @param {number} count minimum 3 viruses
     */
    constructor(count) {
        this.count = count;
        this.assignColors();
        score.updateScore(virusCountImages, this.count);
    }

    assignColors() {
        const colors = ['blue', 'brown', 'yellow'];

        let virusesColors = colors;

        for (let i = 0; i < this.count - 3; i++) {
            const number = Math.floor(Math.random() * 3);
            virusesColors.push(colors[number]);
        }

        for (let i = 0; i < this.count; i++) {
            let numberI, numberJ;
            do {
                numberI = Math.floor(Math.random() * data.arrayOfPositions.length * 0.75 + data.arrayOfPositions.length * 0.25);
                numberJ = Math.floor(Math.random() * data.arrayOfPositions[0].length);
            } while (data.arrayOfPositions[numberI][numberJ].id == 'virus')

            data.arrayOfPositions[numberI][numberJ].id = 'virus';
            data.arrayOfPositions[numberI][numberJ].color = virusesColors[i];
            data.arrayOfPositions[numberI][numberJ].textureDirection = 'virus';
        }
    }
}