const { assign } = Object;
const smileys = ['=)', 'Hi', 'Hei'];

// Sjekk om bruker er på Windows
const isWindows = navigator.platform.indexOf('Win') > -1;

// Bare kjør animasjon hvis ikke Windows
if (!isWindows) {
    function letter() {
        let c = Math.random() * 155;
        const el = assign(
            document.createElement('div'), {
                innerHTML: smileys[Math.floor(Math.random() * smileys.length)],
                style: `
                    position: absolute;
                    font-family: Helvetica;
                    color: rgb(${c}, ${c}, ${c});
                    transition: opacity 0.3s
                `
            }
        );
        document.querySelector('.animation-container').append(el);
        el.x = innerWidth / 2;
        el.y = innerHeight / 3;
        el.s = Math.random() * 5 + .3;
        el.vy = Math.random() * 2 + .1;
        el.r = Math.random() * 360;
        el.ri = Math.random() * 10 - 5;
        el.vx = 0;
        if (Math.abs(el.ri) < 1) el.ri = 1;
        
        const o = {
            el,
            run() {
                el.r += el.ri;
                assign(el.style, {
                    transform: `translate(${el.x}px, ${el.y}px) rotate(${el.r}deg) scale(${el.s})`
                });
                
                for (let i = 0; i < NUM; i++) {
                    const l = letters[i];
                    if (l && l.el && l !== o) {
                        let dx = el.x - l.el.x;
                        let dy = el.y - l.el.y;
                        const d = Math.sqrt(dx * dx + dy * dy);
                        if (d < 100 * el.s / 4) {
                            let ang = Math.atan2(dy, dx);
                            el.vx += .02 * Math.cos(ang);
                            el.vy += .02 * Math.sin(ang);
                            l.el.vx += .02 * Math.cos(-ang);
                            l.el.vy += .02 * Math.sin(-ang);
                        }
                    }
                }
                
                el.vx *= .98;
                el.vy *= .98;
                el.y += el.vy;
                el.x += el.vx;

                if (el.x > innerWidth + 100) {
                    el.style.opacity = '0';
                    setTimeout(() => {
                        el.x = -50;
                        el.style.opacity = '1';
                    }, 300);
                }
                if (el.y < -50) {
                    el.style.opacity = '0';
                    setTimeout(() => {
                        el.y = 320;
                        el.style.opacity = '1';
                    }, 300);
                }
                if (el.y > 320) {
                    el.style.opacity = '0';
                    setTimeout(() => {
                        el.y = -50;
                        el.style.opacity = '1';
                    }, 300);
                }
            }
        };
        return o;
    }
    const NUM = 20;
    let letters = [];

    document.addEventListener('DOMContentLoaded', () => {
        for (let i = 0; i < NUM; i++) {
            letters[i] = letter();
        }
        
        function loop() {
            for (let i = 0; i < NUM; i++) {
                letters[i].run();
            }
            requestAnimationFrame(loop);
        }
        
        loop();
    });
}