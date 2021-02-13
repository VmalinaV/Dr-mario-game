import { setIntervalAndRun } from "./main.js";

const magnifyImages = document.querySelectorAll('img.magnify');

export class Magnify {
    constructor() {
        this.startDancing();
        this.startRotation();
        setTimeout(() => {
            magnifyImages.forEach((image) => {
                image.style.display = 'block';
            });
        }, 0);
        this.centerPosition = { top: 540, left: 220 };
    }

    startDancing() {
        let currentImgNumber = 1;

        this.dancingInterval = setInterval(() => {
            if (currentImgNumber > 3) currentImgNumber = 1;

            magnifyImages[0].src = `gfx/magnify/bl/${currentImgNumber}.png`;
            magnifyImages[1].src = `gfx/magnify/br/${currentImgNumber}.png`;
            magnifyImages[2].src = `gfx/magnify/yl/${currentImgNumber}.png`;

            currentImgNumber++;
        }, 350);
    }

    startRotation() {
        let radius = 85, angle = 0, rad, currentAngle = 0;

        this.rotationInterval = setIntervalAndRun(() => {
            angle += 15;
            if (angle >= 360) angle -= 360;
            magnifyImages.forEach((virus, index) => {
                currentAngle += angle + index * 120;
                if (currentAngle >= 360) currentAngle -= 360;
                rad = currentAngle * Math.PI / 180;  // conversion to radians

                // cos(a) = x/r => x = cos(a) * r (+ center point at the beginning)
                virus.style.left = `${this.centerPosition.left + Math.cos(rad) * radius}px`;

                // sin(a) = y/r => y = sin(a) * r (+ center point at the beginning)
                virus.style.top = `${this.centerPosition.top + Math.sin(rad) * radius}px`;

                currentAngle = 0;
            });
        }, 1000);
    }

    startLaughing() {
        let imageNumber = 4;
        this.laughingInterval = setInterval(() => {
            if (imageNumber == 4) imageNumber = 2;
            else imageNumber = 4;

            magnifyImages[0].src = `gfx/magnify/bl/${imageNumber}.png`;
            magnifyImages[1].src = `gfx/magnify/br/${imageNumber}.png`;
            magnifyImages[2].src = `gfx/magnify/yl/${imageNumber}.png`;
        }, 350);
    }
}