// Defer animasjonslogikken
(() => {
    // Flyttet konstanter utenfor hovedfunksjonen
    const NUM = 20;
    const SMILEYS = ['=)', 'Hi', 'Hei'];
    const letters = [];
    
    // Sjekk plattform én gang ved oppstart
    const isWindows = navigator.platform.indexOf('Win') > -1;
    
    // Return tidlig hvis Windows
    if (isWindows) return;
  
    function createLetter() {
      const brightness = Math.random() * 155;
      const el = Object.assign(document.createElement('div'), {
        innerHTML: SMILEYS[Math.floor(Math.random() * SMILEYS.length)],
        style: `
          position: absolute;
          font-family: Helvetica;
          color: rgb(${brightness}, ${brightness}, ${brightness});
          transition: opacity 0.3s
        `
      });
  
      // Cache DOM lookup
      const container = document.querySelector('.animation-container');
      container.append(el);
  
      // Samle alle variabler i et objekt
      const letterObj = {
        el,
        x: innerWidth / 2,
        y: innerHeight / 3,
        s: Math.random() * 5 + 0.3,
        vy: Math.random() * 2 + 0.1,
        r: Math.random() * 360,
        ri: Math.random() * 10 - 5,
        vx: 0,
  
        run() {
          this.updatePosition();
          this.handleCollisions();
          this.updateVelocity();
          this.checkBoundaries();
        },
  
        updatePosition() {
          this.r += this.ri;
          this.el.style.transform = 
            `translate(${this.x}px, ${this.y}px) rotate(${this.r}deg) scale(${this.s})`;
        },
  
        handleCollisions() {
          for (const letter of letters) {
            if (letter && letter.el && letter !== this) {
              const dx = this.x - letter.x;
              const dy = this.y - letter.y;
              const d = Math.sqrt(dx * dx + dy * dy);
              
              if (d < 100 * this.s / 4) {
                const ang = Math.atan2(dy, dx);
                this.vx += 0.02 * Math.cos(ang);
                this.vy += 0.02 * Math.sin(ang);
                letter.vx += 0.02 * Math.cos(-ang);
                letter.vy += 0.02 * Math.sin(-ang);
              }
            }
          }
        },
  
        updateVelocity() {
          this.vx *= 0.98;
          this.vy *= 0.98;
          this.y += this.vy;
          this.x += this.vx;
        },
  
        checkBoundaries() {
          const resetOpacity = (resetFunc) => {
            this.el.style.opacity = '0';
            setTimeout(() => {
              resetFunc();
              this.el.style.opacity = '1';
            }, 300);
          };
  
          if (this.x > innerWidth + 100) {
            resetOpacity(() => this.x = -50);
          }
          if (this.y < -50) {
            resetOpacity(() => this.y = 320);
          }
          if (this.y > 320) {
            resetOpacity(() => this.y = -50);
          }
        }
      };
  
      // Sett ri til minimum 1 hvis for lav
      if (Math.abs(letterObj.ri) < 1) letterObj.ri = 1;
  
      return letterObj;
    }
  
    // Bruk requestIdleCallback hvis tilgjengelig, ellers fallback til setTimeout
    const scheduleInit = window.requestIdleCallback || 
      (cb => setTimeout(cb, 1));
  
    scheduleInit(() => {
      // Vent til DOM er klar
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnimation);
      } else {
        initAnimation();
      }
    });
  
    function initAnimation() {
      // Opprett bokstaver i batches
      const batchSize = 5;
      let created = 0;
  
      function createBatch() {
        const remaining = Math.min(batchSize, NUM - created);
        for (let i = 0; i < remaining; i++) {
          letters[created + i] = createLetter();
        }
        created += remaining;
  
        if (created < NUM) {
          requestAnimationFrame(createBatch);
        } else {
          startAnimation();
        }
      }
  
      createBatch();
    }
  
    function startAnimation() {
      let animationFrameId;
  
      function animate() {
        for (const letter of letters) {
          letter.run();
        }
        animationFrameId = requestAnimationFrame(animate);
      }
  
      animate();
  
      // Cleanup ved behov
      window.addEventListener('unload', () => {
        cancelAnimationFrame(animationFrameId);
      });
    }
  })();