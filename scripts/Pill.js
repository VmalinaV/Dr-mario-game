import { data, gameField, keyDownFunction, enableInteractionObj, gameOverDiv, magnify, mario } from './main.js'

export class Pill {
    /**
     * 
     * @param {number} pillID start with 1
     */
    constructor(pillID) {
        this.id = pillID;
        this.iA = 0, this.iB = 0;
        this.jA = parseInt(data.arrayOfPositions[0].length / 2) - 1;
        this.jB = parseInt(data.arrayOfPositions[0].length / 2);
        this.textureDirectionA = 'left';
        this.textureDirectionB = 'right';
        this.rotation = 'horizontal';

        data.arrayOfPills.push(this);
        
        this.colorA = data.nextColorA;
        this.colorB = data.nextColorB;

        this.throw();
    }

    async throw() {
        await mario.throwPill(25);

        const positionA = data.arrayOfPositions[this.iA][this.jA];
        const positionB = data.arrayOfPositions[this.iB][this.jB];
        
        positionA.id = this.id;
        positionA.color = this.colorA;
        positionA.textureDirection = this.textureDirectionA;
        
        positionB.id = this.id;
        positionB.color = this.colorB;
        positionB.textureDirection = this.textureDirectionB;
        
        mario.displayNextPill();

        this.interval = setInterval(this.moveDown, 500);

        document.addEventListener('keydown', keyDownFunction);
        enableInteractionObj.enable = true;

        gameField.updateDisplay();
    }

    // this function runs in an interval
    moveDown = async () => {
        if ( // reached bottom
            this.iA + 1 == data.arrayOfPositions.length || this.iB + 1 == data.arrayOfPositions.length ||
            (data.arrayOfPositions[this.iA + 1][this.jA].id != 0 && data.arrayOfPositions[this.iA + 1][this.jA].id != this.id) || 
            (data.arrayOfPositions[this.iB + 1][this.jB].id != 0 && data.arrayOfPositions[this.iB + 1][this.jB].id != this.id)
        ) {
            clearInterval(this.interval);
            document.removeEventListener('keydown', keyDownFunction);
            clearInterval(enableInteractionObj.reactInterval);
            enableInteractionObj.enable = false;

            const middleOfJar = parseInt(data.arrayOfPositions[0].length / 2);
            
            if ( // game over
                (this.iA == 0 && (this.jA == middleOfJar || this.jA == middleOfJar - 1)) || 
                (this.iB == 0 && (this.jB == middleOfJar || this.jB == middleOfJar - 1))
            ) {
                gameOverDiv.style.display = 'block';

                mario.clearThrowCanvas();
                mario.drawState('gameOver');
                clearInterval(magnify.rotationInterval);
                clearInterval(magnify.dancingInterval);
                magnify.startLaughing();
            }
            else {
                let result;
                do {
                    result = await gameField.checkColors();
                    if (result == 'stageCompleted') {
                        break;
                    }
                } while (result > 0)
                
                if (result != 'stageCompleted') {
                    new Pill(data.arrayOfPills.length + 1);
                }
            }
            gameField.updateDisplay();
        }
        else {
            this.clearCurrentPosition();
    
            data.arrayOfPositions[this.iA + 1][this.jA] = { id: this.id, color: this.colorA, textureDirection: this.textureDirectionA };
            data.arrayOfPositions[this.iB + 1][this.jB] = { id: this.id, color: this.colorB, textureDirection: this.textureDirectionB };
    
            this.iA++; this.iB++;
    
            gameField.updateDisplay();
        }
    }

    moveLeft() {
        // move is possible if
        if (this.jA != 0 && this.jB != 0) {  // left edge not reached
            if (  // and there is no object on the left
            (data.arrayOfPositions[this.iA][this.jA - 1].id == 0 || data.arrayOfPositions[this.iA][this.jA - 1].id == this.id) && 
            (data.arrayOfPositions[this.iB][this.jB - 1].id == 0 || data.arrayOfPositions[this.iB][this.jB - 1].id == this.id)) {
                this.clearCurrentPosition();
    
                data.arrayOfPositions[this.iA][this.jA - 1] = { id: this.id, color: this.colorA, textureDirection: this.textureDirectionA };
                data.arrayOfPositions[this.iB][this.jB - 1] = { id: this.id, color: this.colorB, textureDirection: this.textureDirectionB };
        
                this.jA--; this.jB--;
        
                gameField.updateDisplay();
                return 'success';
            }
        }
        return 'fail';
    }

    moveRight() {
        // move is possible if
        if (this.jA != data.arrayOfPositions[0].length - 1 && this.jB != data.arrayOfPositions[0].length - 1) {  // right edge not reached
            if (  // and there is no object on the right
            (data.arrayOfPositions[this.iA][this.jA + 1].id == 0 || data.arrayOfPositions[this.iA][this.jA + 1].id == this.id) && 
            (data.arrayOfPositions[this.iB][this.jB + 1].id == 0 || data.arrayOfPositions[this.iB][this.jB + 1].id == this.id)) {
                this.clearCurrentPosition();
    
                data.arrayOfPositions[this.iA][this.jA + 1] = { id: this.id, color: this.colorA, textureDirection: this.textureDirectionA };
                data.arrayOfPositions[this.iB][this.jB + 1] = { id: this.id, color: this.colorB, textureDirection: this.textureDirectionB };
        
                this.jA++; this.jB++;
        
                gameField.updateDisplay();
            }
        }
    }

    rotateLeft() {
        if (this.rotation == 'horizontal') {
            if (this.jA < this.jB && this.iA != 0) {
                if (data.arrayOfPositions[this.iB - 1][this.jB - 1].id == 0) {
                    this.clearCurrentPosition();

                    this.rotation = 'vertical';
                    this.textureDirectionA = 'down';
                    this.textureDirectionB = 'up';

                    data.arrayOfPositions[this.iA][this.jA] = { id: this.id, color: this.colorA, textureDirection: this.textureDirectionA };
                    data.arrayOfPositions[this.iB - 1][this.jB - 1] = { id: this.id, color: this.colorB, textureDirection: this.textureDirectionB };

                    this.iB--; this.jB--;

                    gameField.updateDisplay();
                }
            }
            else if (this.jA > this.jB && this.iA != 0) {
                if (data.arrayOfPositions[this.iA - 1][this.jA - 1].id == 0) {
                    this.clearCurrentPosition();

                    this.rotation = 'vertical';
                    this.textureDirectionA = 'up';
                    this.textureDirectionB = 'down';

                    data.arrayOfPositions[this.iA - 1][this.jA - 1] = { id: this.id, color: this.colorA, textureDirection: this.textureDirectionA };
                    data.arrayOfPositions[this.iB][this.jB] = { id: this.id, color: this.colorB, textureDirection: this.textureDirectionB };

                    this.iA--; this.jA--;

                    gameField.updateDisplay();
                }
            }
        }
        else {
            if (this.iA < this.iB) {
                let result = 'success';
                if (this.jB == data.arrayOfPositions[0].length - 1 || data.arrayOfPositions[this.iB][this.jB + 1].id != 0)
                    result = this.moveLeft();

                if (result == 'success') {
                    if (data.arrayOfPositions[this.iB][this.jB + 1].id == 0) {
                        this.clearCurrentPosition();
    
                        this.rotation = 'horizontal';
                        this.textureDirectionA = 'left';
                        this.textureDirectionB = 'right';
    
                        data.arrayOfPositions[this.iA + 1][this.jA] = { id: this.id, color: this.colorA, textureDirection: this.textureDirectionA };
                        data.arrayOfPositions[this.iB][this.jB + 1] = { id: this.id, color: this.colorB, textureDirection: this.textureDirectionB };
    
                        this.iA++; this.jB++;
    
                        gameField.updateDisplay();
                    }
                }
            }
            else if (this.iA > this.iB) {
                let result = 'success';
                if (this.jA == data.arrayOfPositions[0].length - 1 || data.arrayOfPositions[this.iA][this.jA + 1].id != 0)
                    result = this.moveLeft();

                if (result == 'success') {
                    if (data.arrayOfPositions[this.iA][this.jA + 1].id == 0) {
                        this.clearCurrentPosition();
    
                        this.rotation = 'horizontal';
                        this.textureDirectionA = 'right';
                        this.textureDirectionB = 'left';
    
                        data.arrayOfPositions[this.iA][this.jA + 1] = { id: this.id, color: this.colorA, textureDirection: this.textureDirectionA };
                        data.arrayOfPositions[this.iB + 1][this.jB] = { id: this.id, color: this.colorB, textureDirection: this.textureDirectionB };
    
                        this.iB++; this.jA++;
    
                        gameField.updateDisplay();
                    }
                }
            }
        }
    }

    rotateRight() {
        if (this.rotation == 'horizontal') {
            if (this.jA < this.jB && this.iA != 0) {
                if (data.arrayOfPositions[this.iA - 1][this.jA].id == 0) {
                    this.clearCurrentPosition();

                    this.rotation = 'vertical';
                    this.textureDirectionA = 'up';
                    this.textureDirectionB = 'down';

                    data.arrayOfPositions[this.iA - 1][this.jA] = { id: this.id, color: this.colorA, textureDirection: this.textureDirectionA };
                    data.arrayOfPositions[this.iB][this.jB - 1] = { id: this.id, color: this.colorB, textureDirection: this.textureDirectionB };

                    this.iA--; this.jB--;

                    gameField.updateDisplay();
                }
            }
            else if (this.jA > this.jB && this.iB != 0) {
                if (data.arrayOfPositions[this.iB - 1][this.jB].id == 0) {
                    this.clearCurrentPosition();

                    this.rotation = 'vertical';
                    this.textureDirectionA = 'down';
                    this.textureDirectionB = 'up';

                    data.arrayOfPositions[this.iA][this.jA - 1] = { id: this.id, color: this.colorA, textureDirection: this.textureDirectionA };
                    data.arrayOfPositions[this.iB - 1][this.jB] = { id: this.id, color: this.colorB, textureDirection: this.textureDirectionB };

                    this.iB--; this.jA--;

                    gameField.updateDisplay();
                }
            }
        }
        else {
            if (this.iA < this.iB) {
                let result = 'success';
                if (this.jB == data.arrayOfPositions[0].length - 1 || data.arrayOfPositions[this.iB][this.jB + 1].id != 0)
                    result = this.moveLeft();

                if (result == 'success') {
                    if (data.arrayOfPositions[this.iB][this.jB + 1].id == 0) {
                        this.clearCurrentPosition();
    
                        this.rotation = 'horizontal';
                        this.textureDirectionA = 'right';
                        this.textureDirectionB = 'left';
    
                        data.arrayOfPositions[this.iA + 1][this.jA + 1] = { id: this.id, color: this.colorA, textureDirection: this.textureDirectionA };
                        data.arrayOfPositions[this.iB][this.jB] = { id: this.id, color: this.colorB, textureDirection: this.textureDirectionB };
    
                        this.iA++; this.jA++;
    
                        gameField.updateDisplay();
                    }
                }
            }
            else if (this.iA > this.iB) {
                let result = 'success';
                if (this.jA == data.arrayOfPositions[0].length - 1 || data.arrayOfPositions[this.iA][this.jA + 1].id != 0)
                    result = this.moveLeft();

                if (result == 'success') {
                    if (data.arrayOfPositions[this.iA][this.jA + 1].id == 0) {
                        this.clearCurrentPosition();
    
                        this.rotation = 'horizontal';
                        this.textureDirectionA = 'left';
                        this.textureDirectionB = 'right';
    
                        data.arrayOfPositions[this.iA][this.jA] = { id: this.id, color: this.colorA, textureDirection: this.textureDirectionA };
                        data.arrayOfPositions[this.iB + 1][this.jB + 1] = { id: this.id, color: this.colorB, textureDirection: this.textureDirectionB };
    
                        this.iB++; this.jB++;
    
                        gameField.updateDisplay();
                    }
                }
            }
        }
    }

    drop() {
        document.removeEventListener('keydown', keyDownFunction);
        clearInterval(enableInteractionObj.reactInterval);
        enableInteractionObj.enable = false;

        clearInterval(this.interval);
        this.interval = setInterval(this.moveDown, 25);
    }

    clearCurrentPosition() {
        data.arrayOfPositions[this.iA][this.jA] = { id: 0, color: 'none', textureDirection: 'none' };
        data.arrayOfPositions[this.iB][this.jB] = { id: 0, color: 'none', textureDirection: 'none' };
    }
}