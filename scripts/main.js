import { Data } from './Data.js';
import { GameField } from './GameField.js'
import { Pill } from './Pill.js';
import { Viruses } from './Viruses.js';
import { Score } from './Score.js';
import { Magnify } from './Magnify.js';
import { Mario } from './Mario.js';

const gameFieldDiv = document.querySelector('#game-field');

export let data = {};
export let score = {};
export let images = {};
export let viruses = {};
export let magnify = {};
export let mario = {};
export let enableInteractionObj = { enable: true };
export const gameField = new GameField(gameFieldDiv, 8, 16);
export const highscoreImages = document.querySelectorAll('#score #top .digits *');
export const currentScoreImages = document.querySelectorAll('#score #current .digits *');
export const virusCountImages = document.querySelectorAll('#info #viruses .indent *');
export const stageCompletedDiv = document.querySelector('#stage-completed');
export const gameOverDiv = document.querySelector('#game-over');

export function sleep(miliseconds) {
    return new Promise(resolve => setTimeout(resolve, miliseconds));
}

export function setIntervalAndRun(callback, timeout) {
    setTimeout(callback, 0);
    return setInterval(callback, timeout);
}
    

export const keyDownFunction = (event) => {
    document.removeEventListener('keydown', keyDownFunction);
    const key = event.key;
    const currentPill = data.arrayOfPills[data.arrayOfPills.length - 1];

    reactOnKey();
    enableInteractionObj.reactInterval = setInterval(reactOnKey, 200);

    document.addEventListener('keyup', (eventOnUp) => { stopReacting(eventOnUp) });

    function stopReacting(eventOnUp) {
        if (eventOnUp.key == key) {
            document.removeEventListener('keyup', stopReacting);
            clearInterval(enableInteractionObj.reactInterval);
            if (enableInteractionObj.enable)
                document.addEventListener('keydown', keyDownFunction);
        }
    }

    function reactOnKey() {
        switch (key) {
            case 'ArrowLeft':
            case 'a':
                currentPill.moveLeft();
                break;
            case 'ArrowRight':
            case 'd':
                currentPill.moveRight()
                break;
            case 'ArrowUp':
            case 'w':
                currentPill.rotateLeft();
                break;
            case 'Shift':
                currentPill.rotateRight();
                break;
            case 'ArrowDown':
            case 's':
                currentPill.drop();
        }
    }
}

startGame();

async function startGame() {
    await loadImages();
    
    data = new Data(gameField);
    score = new Score();
    viruses = new Viruses(4);
    magnify = new Magnify();
    mario = new Mario();

    mario.displayNextPill();
    new Pill(1);
    
    gameField.updateDisplay();
}

function loadImages() {
    return new Promise((resolve) => {
        images.bl_dot = new Image();
        images.bl_dot.src = 'gfx/bl_dot.png';
        images.bl_down = new Image();
        images.bl_down.src = 'gfx/bl_down.png';
        images.bl_left = new Image();
        images.bl_left.src = 'gfx/bl_left.png';
        images.bl_o = new Image();
        images.bl_o.src = 'gfx/bl_o.png';
        images.bl_right = new Image();
        images.bl_right.src = 'gfx/bl_right.png';
        images.bl_up = new Image();
        images.bl_up.src = 'gfx/bl_up.png';
        images.bl_x = new Image();
        images.bl_x.src = 'gfx/bl_x.png';

        images.br_dot = new Image();
        images.br_dot.src = 'gfx/br_dot.png';
        images.br_down = new Image();
        images.br_down.src = 'gfx/br_down.png';
        images.br_left = new Image();
        images.br_left.src = 'gfx/br_left.png';
        images.br_o = new Image();
        images.br_o.src = 'gfx/br_o.png';
        images.br_right = new Image();
        images.br_right.src = 'gfx/br_right.png';
        images.br_up = new Image();
        images.br_up.src = 'gfx/br_up.png';
        images.br_x = new Image();
        images.br_x.src = 'gfx/br_x.png';

        images.yl_dot = new Image();
        images.yl_dot.src = 'gfx/yl_dot.png';
        images.yl_down = new Image();
        images.yl_down.src = 'gfx/yl_down.png';
        images.yl_left = new Image();
        images.yl_left.src = 'gfx/yl_left.png';
        images.yl_o = new Image();
        images.yl_o.src = 'gfx/yl_o.png';
        images.yl_right = new Image();
        images.yl_right.src = 'gfx/yl_right.png';
        images.yl_up = new Image();
        images.yl_up.src = 'gfx/yl_up.png';
        images.yl_x = new Image();
        images.yl_x.src = 'gfx/yl_x.png';

        images.bl_virus = new Image();
        images.bl_virus.src = 'gfx/bl_virus.png';
        images.br_virus = new Image();
        images.br_virus.src = 'gfx/br_virus.png';
        images.yl_virus = new Image();
        images.yl_virus.src = 'gfx/yl_virus.png';

        images.go = new Image();
        images.go.src = 'gfx/go.png';
        images.sc = new Image();
        images.sc.src = 'gfx/sc.png';

        images.mario = new Image;
        images.mario.src = 'gfx/mario-x16.png';
        images.mario.addEventListener('load', () => {
            resolve();
        });
    });
}