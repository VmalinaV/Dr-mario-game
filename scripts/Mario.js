import { data, images, sleep, gameField } from './main.js'

const marioCanvas = document.querySelector('#mario');
const throwCanvas = document.querySelector('#throw-field')

export class Mario {
    constructor() {
        this.image = images.mario;

        marioCanvas.width = 224;
        marioCanvas.height = 192;
        throwCanvas.width = 360;
        throwCanvas.height = 180;

        this.drawState('up');
    }

    /**
     * @param {string} state up, middle, down or gameOver
     */
    drawState(state) {
        const context = marioCanvas.getContext('2d');
        context.clearRect(0, 0, marioCanvas.width, marioCanvas.height);

        if (state == 'up')
            context.drawImage(this.image, 0, 0, 112, 96, 0, 0, 224, 192);
        else if (state == 'middle')
            context.drawImage(this.image, 112, 0, 112, 96, 0, 0, 224, 192);
        else if (state == 'down')
            context.drawImage(this.image, 0, 96, 112, 96, 0, 0, 224, 192);
        else if (state == 'gameOver')
            context.drawImage(this.image, 112, 96, 112, 96, 0, 0, 224, 192);
    }

    clearThrowCanvas() {
        const context = throwCanvas.getContext('2d');
        context.clearRect(0, 0, throwCanvas.width, throwCanvas.height);
    }

    updatePillPosition() {
        const context = throwCanvas.getContext('2d');
        context.drawImage(images[`${this.colorA}_${this.directionA}`], this.pillAPositionX, this.pillAPositionY, 30, 30);
        context.drawImage(images[`${this.colorB}_${this.directionB}`], this.pillBPositionX, this.pillBPositionY, 30, 30);
    }

    movePillLeft() {
        this.pillAPositionX -= 30;
        this.pillBPositionX -= 30;
    }

    movePillUp() {
        this.pillAPositionY -= 30;
        this.pillBPositionY -= 30;
    }

    movePillDown() {
        this.pillAPositionY += 30;
        this.pillBPositionY += 30;
    }

    rotatePillLeft() {
        if (this.horizontal) {
            this.horizontal = false;
            if (this.pillBPositionX > this.pillAPositionX) {
                this.pillBPositionX -= 30;
                this.pillBPositionY -= 30;
                this.directionA = 'down';
                this.directionB = 'up';
            }
            else {
                this.pillAPositionX -= 30;
                this.pillAPositionY -= 30;
                this.directionB = 'down';
                this.directionA = 'up';
            }
        }
        else {
            this.horizontal = true;
            if (this.pillBPositionY > this.pillAPositionY) {
                this.pillAPositionY += 30;
                this.pillBPositionX += 30;
                this.directionB = 'right';
                this.directionA = 'left';
            }
            else {
                this.pillBPositionY += 30;
                this.pillAPositionX += 30;
                this.directionA = 'right';
                this.directionB = 'left';
            }
        }
    }

    async throwPill(delay) {
        let rotateAndUpdate = async () => {
            this.clearThrowCanvas();
            this.rotatePillLeft();
            this.updatePillPosition();
            await sleep(delay);
        }

        let moveLeftUpRotateAndUpdate = async () => {
            this.clearThrowCanvas();
            this.movePillLeft();
            this.movePillUp();
            this.rotatePillLeft();
            this.updatePillPosition();
            await sleep(delay);
        }

        let moveLeftRotateAndUpdate = async () => {
            this.clearThrowCanvas();
            this.movePillLeft();
            this.rotatePillLeft();
            this.updatePillPosition();
            await sleep(delay);
        }

        let moveLeftDownRotateAndUpdate = async () => {
            this.clearThrowCanvas();
            this.movePillLeft();
            this.movePillDown();
            this.rotatePillLeft();
            this.updatePillPosition();
            await sleep(delay);
        }

        let moveDownAndUpdate = async () => {
            this.clearThrowCanvas();
            this.movePillDown();
            this.updatePillPosition();
            await sleep(delay);
        }

        await rotateAndUpdate();
        await moveLeftUpRotateAndUpdate();
        await rotateAndUpdate();
        await moveLeftUpRotateAndUpdate();
        this.drawState('middle');
        await rotateAndUpdate();

        await moveLeftRotateAndUpdate();
        await rotateAndUpdate();
        this.drawState('down');
        await moveLeftRotateAndUpdate();
        await rotateAndUpdate();
        await moveLeftRotateAndUpdate();
        await rotateAndUpdate();
        await moveLeftRotateAndUpdate();
        await rotateAndUpdate();
        await moveLeftRotateAndUpdate();
        await rotateAndUpdate();
        await moveLeftRotateAndUpdate();
        await rotateAndUpdate();

        await moveLeftDownRotateAndUpdate();
        await rotateAndUpdate();
        await moveLeftRotateAndUpdate();

        await moveDownAndUpdate();
        await moveDownAndUpdate();
        await moveDownAndUpdate();
    }

    displayNextPill() {
        const colors = ['blue', 'brown', 'yellow'];

        let firstNumber, secondNumber;
        firstNumber = Math.floor(Math.random() * 3);
        secondNumber = Math.floor(Math.random() * 3);

        data.nextColorA = colors[firstNumber];
        data.nextColorB = colors[secondNumber];

        this.pillAPositionX = throwCanvas.width - 30 * 2;
        this.pillAPositionY = 90;
        this.pillBPositionX = throwCanvas.width - 30;
        this.pillBPositionY = 90;
        this.directionA = 'left';
        this.directionB = 'right';
        this.horizontal = true;

        switch (data.nextColorA) {
            case 'blue':
                this.colorA = 'bl';
                break;
            case 'brown':
                this.colorA = 'br';
                break;
            case 'yellow':
                this.colorA = 'yl';
                break;
            default:
                alert('ERROR! Unknown color of pill!');
        }
        switch (data.nextColorB) {
            case 'blue':
                this.colorB = 'bl';
                break;
            case 'brown':
                this.colorB = 'br';
                break;
            case 'yellow':
                this.colorB = 'yl';
                break;
            default:
                alert('ERROR! Unknown color of pill!');
        }
        this.clearThrowCanvas();
        
        this.drawState('up');
        this.updatePillPosition();
    }
}