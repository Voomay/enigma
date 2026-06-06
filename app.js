document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Header Scroll Indicator
    const header = document.querySelector('header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check immediately on load

    // 2. Mobile Drawer Navigation
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavClose = document.getElementById('mobile-nav-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    const openDrawer = () => {
        mobileNav.classList.add('active');
    };

    const closeDrawer = () => {
        mobileNav.classList.remove('active');
    };

    menuToggle.addEventListener('click', openDrawer);
    mobileNavClose.addEventListener('click', closeDrawer);
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    // 2.5 Smart Link Interceptor for index.html Smooth Scrolling
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('index.html#')) {
            const isHomePage = window.location.pathname.endsWith('index.html') || 
                               window.location.pathname.endsWith('/') ||
                               !window.location.pathname.includes('.html');
            if (isHomePage) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = href.split('#')[1];
                    const targetEl = document.getElementById(targetId);
                    if (targetEl) {
                        targetEl.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            }
        }
    });

    // 3. Interactive Gallery Lightbox
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.getAttribute('data-src');
            const imgCaption = item.getAttribute('data-caption');
            
            if (imgSrc) {
                lightboxImg.src = imgSrc;
                lightboxCaption.textContent = imgCaption || '';
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Stop scrolling behind modal
            }
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable scroll
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        // Close if click is outside the content wrapping
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // 4. Quote Request Form Handling
    const quoteForm = document.getElementById('quoteForm');
    const successMsg = document.getElementById('successMsg');

    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Extract details for debugging or local console logging
            const name = document.getElementById('fullName').value;
            const email = document.getElementById('emailAddr').value;
            const phone = document.getElementById('phoneNum').value;
            const service = document.getElementById('serviceSelect').value;
            const msg = document.getElementById('userMsg').value;

            console.log('Form Submitted Successfully:', { name, email, phone, service, msg });

            // Show confirmation animation
            successMsg.style.display = 'block';
            successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Reset fields
            quoteForm.reset();

            // Clear notice after 8 seconds
            setTimeout(() => {
                successMsg.style.display = 'none';
            }, 8000);
        });
    }

    // 5. Pest Simulation & Infestation Feature (Cockroaches & Rats)
    class Pest {
        constructor(type) {
            this.type = type || (Math.random() < 0.6 ? 'cockroach' : 'rat');
            this.element = document.createElement('img');
            
            let startX, startY;
            const w = window.innerWidth;
            const h = window.innerHeight;
            const offset = 100; // start offset offscreen
            
            if (this.type === 'rat') {
                this.element.src = 'rat-running.gif';
                this.element.className = 'pest rat-type';
                this.speed = 2.6 + Math.random() * 2.4; 
                this.facingLeft = false; // Rat faces right by default in rat-running.gif
                
                // Rats always spawn at the bottom of the screen
                startX = Math.random() * w;
                startY = h + offset;
                this.stage = 0; // Tracks their upward progression
            } else {
                this.element.src = 'Cockroaches-Runningr2l.gif';
                this.element.className = 'pest cockroach-type';
                this.speed = 1.8 + Math.random() * 2.8; 
                this.facingLeft = true; // Cockroach faces left by default in Cockroaches-Runningr2l.gif
                
                // Cockroaches spawn from any edge
                const edges = ['top', 'bottom', 'left', 'right'];
                const edge = edges[Math.floor(Math.random() * edges.length)];
                
                if (edge === 'top') {
                    startX = Math.random() * w;
                    startY = -offset;
                } else if (edge === 'bottom') {
                    startX = Math.random() * w;
                    startY = h + offset;
                } else if (edge === 'left') {
                    startX = -offset;
                    startY = Math.random() * h;
                } else { // right
                    startX = w + offset;
                    startY = Math.random() * h;
                }
            }
            
            this.x = startX;
            this.y = startY;
            
            // Set initial target
            this.setNewTarget();
            
            // Pause state (pests scurry then pause)
            this.isPaused = false;
            this.pauseTimer = 0;
            
            // Dead state
            this.isDead = false;
            
            this.element.style.left = `${this.x}px`;
            this.element.style.top = `${this.y}px`;
            
            // Set rotation variable
            this.rotation = 0;
            
            // Clicking or tapping squishes this pest
            const onSquish = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.squish();
            };
            this.element.addEventListener('mousedown', onSquish);
            this.element.addEventListener('touchstart', onSquish, { passive: false });
            
            document.body.appendChild(this.element);
            this.updateRotation();
        }
        
        setNewTarget() {
            const w = window.innerWidth;
            const h = window.innerHeight;
            
            if (this.type === 'rat') {
                const offset = 120;
                if (this.stage === 0) {
                    // Stage 0: Scurry to lower/middle section of viewport
                    this.targetX = Math.random() * (w - 150) + 75;
                    this.targetY = h * 0.5 + Math.random() * (h * 0.35);
                    this.stage = 1;
                } else if (this.stage === 1) {
                    // Stage 1: Scurry to upper section of viewport
                    this.targetX = Math.random() * (w - 150) + 75;
                    this.targetY = h * 0.1 + Math.random() * (h * 0.3);
                    this.stage = 2;
                } else {
                    // Stage 2: Run off-screen at the top
                    this.targetX = Math.random() * w;
                    this.targetY = -offset;
                    this.stage = 3; // Mark for cleanup once offscreen
                }
            } else {
                // Cockroaches: Sometimes head off-screen to recycle, sometimes head somewhere on screen
                if (Math.random() < 0.12) {
                    const edges = ['top', 'bottom', 'left', 'right'];
                    const edge = edges[Math.floor(Math.random() * edges.length)];
                    const offset = 120;
                    if (edge === 'top') { this.targetX = Math.random() * w; this.targetY = -offset; }
                    else if (edge === 'bottom') { this.targetX = Math.random() * w; this.targetY = h + offset; }
                    else if (edge === 'left') { this.targetX = -offset; this.targetY = Math.random() * h; }
                    else { this.targetX = w + offset; this.targetY = Math.random() * h; }
                } else {
                    this.targetX = Math.random() * (w - 100) + 50;
                    this.targetY = Math.random() * (h - 100) + 50;
                }
            }
        }
        
        squish() {
            if (this.isDead) return;
            this.isDead = true;
            this.element.classList.add('splatted');
            setTimeout(() => {
                this.destroy();
            }, 800);
        }
        
        fumigate() {
            if (this.isDead) return;
            this.isDead = true;
            this.element.classList.add('flipped');
            setTimeout(() => {
                this.destroy();
            }, 1500);
        }
        
        updateRotation() {
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const angleRad = Math.atan2(dy, dx);
            let angleDeg = angleRad * (180 / Math.PI);
            
            // Align orientation depending on default asset direction
            if (this.facingLeft) {
                this.rotation = angleDeg + 180;
            } else {
                this.rotation = angleDeg;
            }
            
            this.element.style.setProperty('--rot', `${this.rotation}deg`);
            this.element.style.transform = `rotate(${this.rotation}deg)`;
        }
        
        update() {
            if (this.isDead) return;
            
            if (this.isPaused) {
                this.pauseTimer--;
                if (this.pauseTimer <= 0) {
                    this.isPaused = false;
                    this.setNewTarget();
                    this.updateRotation();
                }
                return;
            }
            
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 10) {
                if (Math.random() < 0.65) {
                    this.isPaused = true;
                    this.pauseTimer = 35 + Math.random() * 50;
                } else {
                    this.setNewTarget();
                    this.updateRotation();
                }
                
                const w = window.innerWidth;
                const h = window.innerHeight;
                if (this.x < -100 || this.x > w + 100 || this.y < -100 || this.y > h + 100) {
                    this.destroy();
                }
                return;
            }
            
            const step = Math.min(this.speed, dist);
            this.x += (dx / dist) * step;
            this.y += (dy / dist) * step;
            
            this.element.style.left = `${this.x}px`;
            this.element.style.top = `${this.y}px`;
            
            // Random pauses or direction adjustments mid-run
            if (Math.random() < 0.006) {
                this.isPaused = true;
                this.pauseTimer = 15 + Math.random() * 25;
            } else if (Math.random() < 0.012) {
                this.setNewTarget();
                this.updateRotation();
            }
        }
        
        destroy() {
            if (this.element && this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
            const index = activePests.indexOf(this);
            if (index > -1) {
                activePests.splice(index, 1);
            }
        }
    }
    
    let activePests = [];
    let simulationInterval = null;
    let autoSpawnInterval = null;
    
    const startSimulation = () => {
        let overlay = document.querySelector('.fumigation-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'fumigation-overlay';
            const smoke = document.createElement('div');
            smoke.className = 'fumigation-smoke';
            overlay.appendChild(smoke);
            document.body.appendChild(overlay);
        }
        
        const spawnCount = 5 + Math.floor(Math.random() * 3);
        for (let i = 0; i < spawnCount; i++) {
            activePests.push(new Pest());
        }
        
        if (!simulationInterval) {
            simulationInterval = setInterval(() => {
                const list = [...activePests];
                list.forEach(c => c.update());
                
                if (activePests.length === 0) {
                    const nextSpawn = 2 + Math.floor(Math.random() * 2);
                    for (let i = 0; i < nextSpawn; i++) {
                        activePests.push(new Pest());
                    }
                }
            }, 1000 / 60);
        }
        
        if (!autoSpawnInterval) {
            autoSpawnInterval = setInterval(() => {
                if (activePests.length < 10) {
                    activePests.push(new Pest());
                }
            }, 2500);
        }
    };
    
    const stopSimulation = () => {
        if (simulationInterval) {
            clearInterval(simulationInterval);
            simulationInterval = null;
        }
        if (autoSpawnInterval) {
            clearInterval(autoSpawnInterval);
            autoSpawnInterval = null;
        }
        
        const list = [...activePests];
        list.forEach(c => c.destroy());
        activePests = [];
    };
    
    const triggerFumigation = () => {
        const overlay = document.querySelector('.fumigation-overlay');
        const fumigateBtn = document.querySelector('.float-fumigate');
        const bugBtn = document.querySelector('.float-bug');
        
        if (overlay) {
            overlay.classList.add('active');
        }
        
        const list = [...activePests];
        list.forEach(c => c.fumigate());
        
        if (fumigateBtn) {
            fumigateBtn.classList.remove('visible');
        }
        if (bugBtn) {
            bugBtn.classList.remove('active');
            bugBtn.setAttribute('data-tooltip', 'Simulate Pests');
        }
        
        setTimeout(() => {
            stopSimulation();
            if (overlay) {
                overlay.classList.remove('active');
            }
        }, 2200);
    };
    
    let floatingActions = document.querySelector('.floating-actions');
    if (!floatingActions) {
        floatingActions = document.createElement('div');
        floatingActions.className = 'floating-actions';
        document.body.appendChild(floatingActions);
    }
    
    const fumigateBtn = document.createElement('button');
    fumigateBtn.innerHTML = '<i class="fa-solid fa-spray-can"></i>';
    fumigateBtn.className = 'float-btn float-fumigate';
    fumigateBtn.setAttribute('data-tooltip', 'Fumigate Screen');
    
    const bugBtn = document.createElement('button');
    bugBtn.innerHTML = '<i class="fa-solid fa-bug"></i>';
    bugBtn.className = 'float-btn float-bug';
    bugBtn.setAttribute('data-tooltip', 'Simulate Pests');
    
    // Insert them at the top of floating actions so they stack properly
    floatingActions.insertBefore(bugBtn, floatingActions.firstChild);
    floatingActions.insertBefore(fumigateBtn, floatingActions.firstChild);
    
    bugBtn.addEventListener('click', () => {
        if (bugBtn.classList.contains('active')) {
            bugBtn.classList.remove('active');
            bugBtn.setAttribute('data-tooltip', 'Simulate Pests');
            fumigateBtn.classList.remove('visible');
            stopSimulation();
        } else {
            bugBtn.classList.add('active');
            bugBtn.setAttribute('data-tooltip', 'Stop Simulation');
            fumigateBtn.classList.add('visible');
            startSimulation();
        }
    });
    
    fumigateBtn.addEventListener('click', () => {
        triggerFumigation();
    });
});
