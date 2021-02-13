import {
    data, 
    images, 
    score, 
    viruses, 
    highscoreImages, 
    currentScoreImages, 
    virusCountImages,
    stageCompletedDiv,
    sleep
} from './main.js'

export class GameField {
    /**
     * 
     * @param {HTMLElement} box element to put cells in
     * @param {number} countX count of cells in a row
     * @param {number} countY count of cells in a column
     */
    constructor(box, countX, countY) {
        this.countX = countX;
        this.countY = countY;
        this.box = box;

        this.canvasWidth = Math.round(this.box.clientWidth / this.countX);    // both should be the same if a correct ratio is preserved
        this.canvasHeight = Math.round(this.box.clientHeight / this.countY);

        this.createCanvas();
    }

    createCanvas() {
        for (let i = 0; i < this.countY; i++) {
            for (let j = 0; j < this.countX; j++) {
                const canvas = document.createElement('canvas');
                canvas.id = `i-${i}-${j}`;
                canvas.classList.add('cell');
                canvas.width = this.canvasWidth;
                canvas.height = this.canvasHeight;
                this.box.appendChild(canvas);
            }
        }
    }

    updateDisplay() {
        for (let i = 0; i < this.countY; i++) {
            for (let j = 0; j < this.countX; j++) {
                if (data.arrayOfPositions[i][j].id != 0) {
                    const canvas = document.querySelector(`#i-${i}-${j}`);
                    const context = canvas.getContext('2d');
                    const position = data.arrayOfPositions[i][j];

                    switch (position.color) {
                        case 'blue':
                            context.drawImage(images[`bl_${position.textureDirection}`], 0, 0, this.canvasWidth, this.canvasHeight);
                            break;
                        case 'brown':
                            context.drawImage(images[`br_${position.textureDirection}`], 0, 0, this.canvasWidth, this.canvasHeight);
                            break;
                        case 'yellow':
                            context.drawImage(images[`yl_${position.textureDirection}`], 0, 0, this.canvasWidth, this.canvasHeight);
                            break;
                        default:
                            alert('ERROR! Unknown color of pill!');
                    }
                }
                else {
                    const canvas = document.querySelector(`#i-${i}-${j}`);
                    const context = canvas.getContext('2d');
                    context.clearRect(0, 0, canvas.width, canvas.height);
                }
            }
        }
    }

    async checkColors() {
        for (let i = 0; i < this.countY; i++) {
            for (let j = 0; j < this.countX; j++) {
                if (data.arrayOfPositions[i][j].color != 'none') {
                    let countTop = 1, countRight = 1, countBottom = 1, countLeft = 1;

                    // check top
                    if (i - 1 != -1) {
                        let firstPosition = data.arrayOfPositions[i][j]
                        let secondPosition = data.arrayOfPositions[i - countTop][j];
                        while (firstPosition.color == secondPosition.color) {
                            countTop++;
                            if (i - countTop != -1) {
                                firstPosition = secondPosition;
                                secondPosition = data.arrayOfPositions[i - countTop][j];
                            }
                            else
                                break;
                        }
                    }
                    // check right
                    if (j + 1 != data.arrayOfPositions[0].length) {
                        let firstPosition = data.arrayOfPositions[i][j]
                        let secondPosition = data.arrayOfPositions[i][j + countRight];
                        while (firstPosition.color == secondPosition.color) {
                            countRight++;
                            if (j + countRight != data.arrayOfPositions[0].length) {
                                firstPosition = secondPosition;
                                secondPosition = data.arrayOfPositions[i][j + countRight];
                            }
                            else
                                break;
                        }
                    }
                    // check bottom
                    if (i + 1 != data.arrayOfPositions.length) {
                        let firstPosition = data.arrayOfPositions[i][j]
                        let secondPosition = data.arrayOfPositions[i + countBottom][j];
                        while (firstPosition.color == secondPosition.color) {
                            countBottom++;
                            if (i + countBottom != data.arrayOfPositions.length) {
                                firstPosition = secondPosition;
                                secondPosition = data.arrayOfPositions[i + countBottom][j];
                            }
                            else
                                break;
                        }
                    }
                    // check left
                    if (j - 1 != -1) {
                        let firstPosition = data.arrayOfPositions[i][j]
                        let secondPosition = data.arrayOfPositions[i][j - countLeft];
                        while (firstPosition.color == secondPosition.color) {
                            countLeft++;
                            if (j - countLeft != -1) {
                                firstPosition = secondPosition;
                                secondPosition = data.arrayOfPositions[i][j - countLeft];
                            }
                            else
                                break;
                        }
                    }

                    if (countTop >= 4)
                        this.markElements(i, j, 'Top', countTop);
                    if (countRight >= 4)
                        this.markElements(i, j, 'Right', countRight);
                    if (countBottom >= 4)
                        this.markElements(i, j, 'Bottom', countBottom);
                    if (countLeft >= 4)
                        this.markElements(i, j, 'Left', countLeft);
                }
            }
        }
        return await this.destroyElements();
    }

    /**
     * 
     * @param {number} positionI
     * @param {number} positionJ
     * @param {string} direction 'Top' 'Left' 'Bottom' or 'Right
     * @param {number} count
     */
    markElements(positionI, positionJ, direction, count) {
        switch (direction) {
            case 'Top':
                for (let i = 0; i < count; i++)
                    data.arrayOfPositions[positionI - i][positionJ].toDestroy = true;
                break;
            case 'Right':
                for (let i = 0; i < count; i++)
                    data.arrayOfPositions[positionI][positionJ + i].toDestroy = true;
                break;
            case 'Bottom':
                for (let i = 0; i < count; i++)
                    data.arrayOfPositions[positionI + i][positionJ].toDestroy = true;
                break;
            case 'Left':
                for (let i = 0; i < count; i++)
                    data.arrayOfPositions[positionI][positionJ - i].toDestroy = true;
                break;
        }
    }

    async destroyElements() {
        let deleteCount = 0;
        for (let i = 0; i < this.countY; i++) {
            for (let j = 0; j < this.countX; j++) {
                if (data.arrayOfPositions[i][j].toDestroy) {
                    deleteCount++;

                    if (data.arrayOfPositions[i][j].id == 'virus') { // Virus is destroyed
                        score.score += 100; viruses.count--;
                        
                        score.updateScore(currentScoreImages, score.score);

                        if (score.score > localStorage.getItem('highscore')) {
                            localStorage.setItem('highscore', score.score);
                            score.updateScore(highscoreImages, localStorage.getItem('highscore'));
                        }
                        score.updateScore(virusCountImages, viruses.count);

                        if (viruses.count == 0) {
                            setTimeout(() => {
                                stageCompletedDiv.style.display = 'block';

                            }, 300);
                        }

                        data.arrayOfPositions[i][j].textureDirection = 'x';
                    }
                    else {
                        let pillToUpdate = data.arrayOfPills[data.arrayOfPositions[i][j].id - 1];
    
                        if (pillToUpdate.iA == i && pillToUpdate.jA == j && !data.arrayOfPositions[pillToUpdate.iB][pillToUpdate.jB].toDestroy) {
                            pillToUpdate.textureDirectionB = 'dot';
                            data.arrayOfPositions[pillToUpdate.iB][pillToUpdate.jB].textureDirection = pillToUpdate.textureDirectionB;
                        }
                        else if (pillToUpdate.iB == i && pillToUpdate.jB == j && !data.arrayOfPositions[pillToUpdate.iA][pillToUpdate.jA].toDestroy) {
                            pillToUpdate.textureDirectionA = 'dot';
                            data.arrayOfPositions[pillToUpdate.iA][pillToUpdate.jA].textureDirection = pillToUpdate.textureDirectionA;
                        }

                        data.arrayOfPositions[i][j].textureDirection = 'o';
                    }
                }
            }
        }
        this.updateDisplay();
        this.clearDestroyAnimation();

        await this.gravityDrop();
        if (viruses.count == 0)
            return 'stageCompleted';
        return deleteCount;
    }

    clearDestroyAnimation() {
        for (let i = 0; i < this.countY; i++) {
            for (let j = 0; j < this.countX; j++) {
                if (data.arrayOfPositions[i][j].toDestroy)
                    data.arrayOfPositions[i][j] = { id: 0, color: 'none', textureDirection: 'none' };
            }
        }
    }

    async gravityDrop() {
        this.keepCheckingGravity = true;
        this.gravityIntervalIsSet = false;
        await this.gravityMoveDown();
    }

    gravityMoveDown = () => {
        return new Promise((resolve) => {
            if (!this.gravityIntervalIsSet) {
                this.gravityInterval = setInterval(() => {
                    if (!this.keepCheckingGravity) {
                        clearInterval(this.gravityInterval);
                        resolve();
                    }
                    else {
                        this.keepCheckingGravity = false;
                        
                        for (let i = data.arrayOfPositions.length - 1; i >= 0; i--) {
                            for (let j = data.arrayOfPositions[0].length - 1; j >= 0; j--) {
                                if (data.arrayOfPositions[i][j].id != 0) {
                                    if (i != data.arrayOfPositions.length - 1) {
                                        if (data.arrayOfPositions[i][j].id == 'virus') continue;
                                        if (data.arrayOfPositions[i][j].textureDirection == 'dot') {
                                            if (data.arrayOfPositions[i + 1][j].id == 0) { // can be moved down
                                                this.keepCheckingGravity = true;
                                                data.arrayOfPositions[i + 1][j] = {
                                                    id: data.arrayOfPositions[i][j].id,
                                                    color: data.arrayOfPositions[i][j].color,
                                                    textureDirection: data.arrayOfPositions[i][j].textureDirection
                                                }
                                                data.arrayOfPositions[i][j] = { id: 0, color: 'none', textureDirection: 'none' };
                                            }
                                        }
                                        else {
                                            let pill = data.arrayOfPills[data.arrayOfPositions[i][j].id - 1];
            
                                            if ( // not reached bottom
                                                pill.iA + 1 != data.arrayOfPositions.length && pill.iB + 1 != data.arrayOfPositions.length &&
                                                (data.arrayOfPositions[pill.iA + 1][pill.jA].id == 0 || data.arrayOfPositions[pill.iA + 1][pill.jA].id == pill.id) && 
                                                (data.arrayOfPositions[pill.iB + 1][pill.jB].id == 0 || data.arrayOfPositions[pill.iB + 1][pill.jB].id == pill.id)
                                            ) {
                                                this.keepCheckingGravity = true;
            
                                                pill.clearCurrentPosition();
                                                data.arrayOfPositions[pill.iA + 1][pill.jA] = { id: pill.id, color: pill.colorA, textureDirection: pill.textureDirectionA };
                                                data.arrayOfPositions[pill.iB + 1][pill.jB] = { id: pill.id, color: pill.colorB, textureDirection: pill.textureDirectionB };
                
                                                pill.iA++; pill.iB++;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        this.updateDisplay();
                    }
                }, 150);
                this.gravityIntervalIsSet = true;
            }
        });
    }
}