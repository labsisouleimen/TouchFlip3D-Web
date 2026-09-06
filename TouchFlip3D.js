export default class TouchFlip3D extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
        <style>
            :host { 
                display: block; 
                perspective: 1200px; 
                width: 100%; 
                height: 100%; 
                touch-action: none; 
                user-select: none; 
                -webkit-user-select: none; 
            }
            .scene { 
                width: 100%; 
                height: 100%; 
                position: relative; 
                transform-style: preserve-3d; 
                --shine-x: 50%;
                --shine-y: 50%;
                --shine-opacity: 0;
                /* A shorter transition makes it more responsive while dragging */
                transition: transform 0.1s ease-out; 
            }
            .scene::after {
                content: '';
                position: absolute;
                inset: 0;
                pointer-events: none;
                z-index: 10;
                border-radius: inherit;
                background: radial-gradient(circle at var(--shine-x) var(--shine-y), rgba(255, 255, 255, 0.15) 5%, transparent 30%);
                opacity: var(--shine-opacity);
                transition: opacity 0.15s ease-out;
            }
            ::slotted(*) { 
                position: absolute !important; 
                top: 0;
                left: 0;
                width: 100% !important; 
                height: 100% !important; 
                transform-style: preserve-3d !important;
                backface-visibility: hidden !important; 
                -webkit-backface-visibility: hidden !important;
            }
            ::slotted([slot="front"]) {
                transform: rotateY(0deg) !important;
            }
            ::slotted([slot="back"]) { 
                transform: rotateY(180deg) !important; 
            }
        </style>
        <div class="scene" id="card">
            <slot name="back"></slot>
            <slot name="front"></slot>
        </div>`;

        this.card = shadow.getElementById('card');
        this.rotateX = 0; 
        this.rotateY = 0; 
        this.isDragging = false;
        this.initEvents();
    }

    get maxRotationX() {
        return this.getRotationLimit('max-rotation-x');
    }

    set maxRotationX(value) {
        this.setRotationLimit('max-rotation-x', value);
    }

    get maxRotationY() {
        return this.getRotationLimit('max-rotation-y');
    }

    set maxRotationY(value) {
        this.setRotationLimit('max-rotation-y', value);
    }

    get returnToNormal() {
        return this.getBooleanOption('return-to-normal');
    }

    set returnToNormal(value) {
        this.setBooleanOption('return-to-normal', value);
    }

    get wiggle() {
        return this.getBooleanOption('wiggle');
    }

    set wiggle(value) {
        this.setBooleanOption('wiggle', value);
    }

    get shine() {
        return this.getBooleanOption('shine');
    }

    set shine(value) {
        this.setBooleanOption('shine', value);
    }

    getRotationLimit(attribute) {
        const value = Number.parseFloat(this.getAttribute(attribute));
        return Number.isFinite(value) && value >= 0 ? value : Infinity;
    }

    setRotationLimit(attribute, value) {
        if (value === null || value === undefined || value === '') {
            this.removeAttribute(attribute);
            return;
        }

        const limit = Number(value);
        if (!Number.isFinite(limit) || limit < 0) {
            throw new TypeError(`${attribute} must be a non-negative number`);
        }
        this.setAttribute(attribute, String(limit));
    }

    clampRotation(value, limit) {
        return Math.max(-limit, Math.min(limit, value));
    }

    clampRotationAround(value, center, limit) {
        return Math.max(center - limit, Math.min(center + limit, value));
    }

    getBooleanOption(attribute) {
        const value = this.getAttribute(attribute);
        return value !== null && value.toLowerCase() !== 'false';
    }

    setBooleanOption(attribute, value) {
        if (value) {
            this.setAttribute(attribute, 'true');
        } else {
            this.removeAttribute(attribute);
        }
    }

    applyTransform() {
        this.card.style.transform = `rotateX(${this.rotateX}deg) rotateY(${this.rotateY}deg)`;

        const shineX = 50 - (this.rotateY * 1.5);
        const shineY = 50 + (this.rotateX * 1.5);
        this.card.style.setProperty('--shine-x', `${shineX}%`);
        this.card.style.setProperty('--shine-y', `${shineY}%`);
        this.card.style.setProperty('--shine-opacity', this.shine ? '1' : '0');
    }

    snapToNearestSide() {
        const normalizedY = ((this.rotateY % 360) + 360) % 360;
        this.rotateY = normalizedY > 90 && normalizedY < 270 ? 180 : 0;
        this.rotateX = 0;
        this.applyTransform();
    }

    initEvents() {
        const flip = () => {
            this.rotateY = (this.rotateY % 360) < 90 || (this.rotateY % 360) > 270 ? 180 : 0;
            this.rotateX = 0;
            this.applyTransform();
        };

        const start = (e) => {
            if (e.cancelable) e.preventDefault(); 
            this.isDragging = true;
            this.hasDragged = false;
            this.isTouchGesture = e.type === 'touchstart';
            this.startX = e.pageX || (e.touches ? e.touches[0].pageX : 0);
            this.startY = e.pageY || (e.touches ? e.touches[0].pageY : 0);
            // Disable smoothing during dragging for better performance
            this.card.style.transition = 'none';
        };

        const move = (e) => {
            if (!this.isDragging) return;
            if (e.cancelable) e.preventDefault(); 
            
            const x = e.pageX || (e.touches ? e.touches[0].pageX : 0);
            const y = e.pageY || (e.touches ? e.touches[0].pageY : 0);

            this.hasDragged = true;
            
            const faceRotation = Math.round(this.rotateY / 180) * 180;
            this.rotateY += (x - this.startX) * 0.5;
            this.rotateX -= (y - this.startY) * 0.5;

            this.rotateX = this.clampRotation(this.rotateX, this.maxRotationX);
            this.rotateY = this.clampRotationAround(this.rotateY, faceRotation, this.maxRotationY);
            
            this.applyTransform();
            this.startX = x; 
            this.startY = y;
        };

        const end = (e) => {
            this.isDragging = false;
            // Restore smoothing after dragging ends
            this.card.style.transition = 'transform 0.1s ease-out';
            if (this.returnToNormal && this.hasDragged) {
                this.snapToNearestSide();
            }
            if (e.type === 'touchend') {
                if (!this.hasDragged) {
                    flip();
                }
                this.ignoreNextClick = true;
            }
        };

        const hoverMove = (e) => {
            if (this.isDragging || !this.wiggle) return;

            const bounds = this.getBoundingClientRect();
            const horizontalPosition = ((e.clientX - bounds.left) / bounds.width) * 2 - 1;
            const verticalPosition = ((e.clientY - bounds.top) / bounds.height) * 2 - 1;
            const baseRotationY = Math.round(this.rotateY / 180) * 180;

            this.rotateX = this.clampRotation(-verticalPosition * 15, this.maxRotationX);
            this.rotateY = baseRotationY + this.clampRotation(horizontalPosition * 15, this.maxRotationY);
            this.card.style.transition = 'transform 0.2s ease-out';
            this.applyTransform();
        };

        const hoverEnd = () => {
            if (this.isDragging || !this.wiggle) return;
            this.rotateX = 0;
            this.rotateY = Math.round(this.rotateY / 180) * 180;
            this.applyTransform();
        };

        const tap = (e) => {
            if (e.cancelable) e.preventDefault(); 
            if (this.ignoreNextClick) {
                this.ignoreNextClick = false;
                return;
            }
            if (this.hasDragged) {
                this.hasDragged = false;
                return;
            }
            flip();
        }

        this.addEventListener('mousedown', start);
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', end);
        this.addEventListener('touchstart', start, {passive: false});
        window.addEventListener('touchmove', move, {passive: false});
        window.addEventListener('touchend', end);
        this.addEventListener('mousemove', hoverMove);
        this.addEventListener('mouseleave', hoverEnd);
        this.addEventListener('click', tap);
    }
}

if (!customElements.get('touch-flip-3d')) {
    customElements.define('touch-flip-3d', TouchFlip3D);
}
