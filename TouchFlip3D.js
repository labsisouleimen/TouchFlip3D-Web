class TouchFlip3D extends HTMLElement {
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
                user-select: none; /* يمنع التظليل */
                -webkit-user-select: none; 
            }
            .scene { width: 100%; height: 100%; position: relative; transform-style: preserve-3d; transition: transform 0.1s ease-out; }
            ::slotted(*) { position: absolute !important; width: 100% !important; height: 100% !important; backface-visibility: hidden; }
            ::slotted([slot="back"]) { transform: rotateY(180deg); }
        </style>
        <div class="scene" id="card"><slot name="back"></slot><slot name="front"></slot></div>`;

        this.card = shadow.getElementById('card');
        this.rotateX = 0; this.rotateY = 0; this.isDragging = false;
        this.initEvents();
    }

    initEvents() {
        const start = (e) => {
            // منع المتصفح من البدء بتحديد النص أو سحب العناصر
            if (e.cancelable) e.preventDefault(); 
            
            this.isDragging = true;
            this.startX = e.pageX || (e.touches ? e.touches[0].pageX : 0);
            this.startY = e.pageY || (e.touches ? e.touches[0].pageY : 0);
        };

        const move = (e) => {
            if (!this.isDragging) return;
            if (e.cancelable) e.preventDefault(); 
            
            const x = e.pageX || (e.touches ? e.touches[0].pageX : 0);
            const y = e.pageY || (e.touches ? e.touches[0].pageY : 0);
            
            this.rotateY += (x - this.startX) * 0.5;
            this.rotateX -= (y - this.startY) * 0.5;
            
            this.card.style.transform = `rotateX(${this.rotateX}deg) rotateY(${this.rotateY}deg)`;
            this.startX = x; 
            this.startY = y;
        };

        const end = () => this.isDragging = false;

        this.addEventListener('mousedown', start);
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', end);
        this.addEventListener('touchstart', start, {passive: false});
        window.addEventListener('touchmove', move, {passive: false});
        window.addEventListener('touchend', end);
    }
}
customElements.define('touch-flip-3d', TouchFlip3D);
