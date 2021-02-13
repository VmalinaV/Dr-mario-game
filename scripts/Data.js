import { GameField } from './GameField.js';

export class Data {
    /**
     * 
     * @param {GameField} gameField data of specified GameField will be created
     */
    constructor(gameField) {
        this.gameField = gameField;
        this.arrayOfPills = [];
        this.arrayOfViruses = [];
        this.createArrayOfPositions();
    }

    createArrayOfPositions() {
        this.arrayOfPositions = [];
        for (let i = 0; i < this.gameField.countY; i++) {
            this.arrayOfPositions.push([]);
            for (let j = 0; j < this.gameField.countX; j++) {
                this.arrayOfPositions[i].push([]);
                this.arrayOfPositions[i][j] = { id: 0, color: 'none', textureDirection: 'none' };
            }
        }
    }
}