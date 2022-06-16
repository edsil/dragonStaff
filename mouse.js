"use strict";

export class Pointer {
    constructor(targetElement) {
        this.left = false;
        this.right = false;
        this.position = { x: 0, y: 0 };
        this.isover = false;
        this.elem = targetElement;
        this.elem.onpointerover = this.overHandler;
        this.elem.onpointerdown = this.downHandler;
        this.elem.onpointerup = this.upHandler;
        this.elem.onpointerout = this.outHandler;
        this.elem.onpointermove = this.moveHandler;
        this.areas = Array();
    }

    overHandler(e) {
        this.isover = true;
        this.position = { x: e.clientX, y: e.clientY };
    }

    downHandler(e) {
        switch (e.button) {
            case 0:
                this.left = true;
                break;
            case 2:
                this.right = true;
                break;
        }
        e.preventDefault();
    }

    upHandler(e) {
        switch (e.button) {
            case 0:
                this.left = false;
                break;
            case 2:
                this.right = false;
                break;
        }
        e.preventDefault();
    }

    outHandler(e) {
        this.isover = false;
        this.left = this.right = false;
    }

    moveHandler(e) {
        e.preventDefault();
        this.position = { x: e.clientX, y: e.clientY };
    }

    setHitArea(x, y, width, height, callback, event) {
        this.areas.push({ x: x, y: y, w: width, h: height, cb: callback, e: event });
    }

    clearHitAreas() {
        this.areas.length = 0;
    }

    eventTypes = {};
}
