
/* Though I could have written separate CSS animations or scripts for each html page
What I ended up doing was turning all the effects into separate JavaScript functions 
This was through functions & really turning about functions & especially how to make clean pages
*/

// PAGE TRANSITIONS
 
const overlay = document.createElement('div');
overlay.id = 'page-overlay';
overlay.style.cssText = `
  position: fixed; top: 0; left: 0;
  width: 100%; height: 100%;
  background: #1a1008; z-index: 9999;
  pointer-events: none; opacity: 1;
  transition: opacity 0.8s ease;
`;
document.body.appendChild(overlay);
 
//When page is fully loaded, fade the curtain to reveal the rooms
window.addEventListener('load', () => {
  setTimeout(() => { overlay.style.opacity = '0'; }, 50);
});
 
document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (!link || !link.href) return;
  if (!link.href.includes('.html')) return;

  e.preventDefault(); //Stopping browser from leaving immediately
  const destination = link.href;

  overlay.style.transition = 'opacity 0.6s ease';
  overlay.style.opacity = '1'; //Bringing it back up 
  setTimeout(() => { window.location.href = destination; }, 650); //Waiting for 650ms animation to finish before changing URL 
});
 

//DUST PARTICLES 

function createParticles() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: fixed; top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none; z-index: 5; opacity: 0.4;
  `;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
 
  //Ensuring drawing area = window size 
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
 
  //Collaction of particles using random 
  const particles = Array.from({ length: 35 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 2.5 + 0.5,
    speedY: Math.random() * 0.4 + 0.1, //Random upward speed
    speedX: (Math.random() - 0.5) * 0.3, //Random horizontal sway
    opacity: Math.random() * 0.6 + 0.2,
  }));
 
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      //Drawing the actual particle itself 
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(210, 185, 140, ${p.opacity})`;
      ctx.fill();

      //Updating position for next frame 
      p.y -= p.speedY;
      p.x += p.speedX;

      //If a particle leaves the top, it moves back to the bottom
      if (p.y < -5) { 
        p.y = window.innerHeight + 5; 
        p.x = Math.random() * window.innerWidth; }
      
      //Horizontal wrapping around
      if (p.x < -5) p.x = window.innerWidth + 5;
      if (p.x > window.innerWidth + 5) p.x = -5;
    });
    requestAnimationFrame(animate); //Ensures the loop keeps going
  }
  animate();
}
 
// THE CURSOR | Trying to create a halo effect 

 
function createCursorGlow() {
  document.body.style.cursor = 'none'; //This hides the default system cursor
 
  //The direct centre point
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position: fixed; width: 12px; height: 12px;
    background: rgba(210, 185, 100, 0.9); border-radius: 50%;
    pointer-events: none; z-index: 10000;
    transform: translate(-50%, -50%);
    transition: width 0.2s, height 0.2s;
    mix-blend-mode: screen;
  `;
 
  //Soft outer ring (halo)
  const halo = document.createElement('div');
  halo.style.cssText = `
    position: fixed; width: 36px; height: 36px;
    border: 1px solid rgba(210, 185, 100, 0.3); border-radius: 50%;
    pointer-events: none; z-index: 9999;
    transform: translate(-50%, -50%);
    transition: left 0.12s ease, top 0.12s ease;
  `;
 
  document.body.appendChild(cursor);
  document.body.appendChild(halo);
 
  //Updating coordinates on mouse move 
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    halo.style.left = e.clientX + 'px';
    halo.style.top = e.clientY + 'px';
  });
 
  //Makes it hover over clickable items 
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a') || e.target.tagName === 'IMG') {
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      cursor.style.background = 'rgba(255, 220, 80, 1)';
    }
  });
 
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a') || e.target.tagName === 'IMG') {
      cursor.style.width = '12px';
      cursor.style.height = '12px';
      cursor.style.background = 'rgba(210, 185, 100, 0.9)';
    }
  });
}

 // RIPPLES 
 
function createHoverRipples() {
  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('mouseenter', (e) => {
      //Finding centre of the link being hovered 
      const rect = e.currentTarget.getBoundingClientRect();
      const ripple = document.createElement('div');
      
      ripple.style.cssText = `
        position: fixed;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top + rect.height / 2}px;
        width: 10px; height: 10px;
        border: 1px solid rgba(210, 185, 100, 0.5);
        border-radius: 50%; pointer-events: none; z-index: 100;
        transform: translate(-50%, -50%) scale(1); opacity: 1;
        transition: transform 0.6s ease, opacity 0.6s ease;
      `;
      document.body.appendChild(ripple);

      //Triggering the 'expansion' animation
      setTimeout(() => {
        ripple.style.transform = `translate(-50%, -50%) scale(${Math.max(rect.width, rect.height) / 5})`;
        ripple.style.opacity = '0';
      }, 10);

      //Removes from the DOM after it fades 
      setTimeout(() => ripple.remove(), 700);
    });
  });
}

// BIRD ANIMATION
 
function animateBirds() {
  if (typeof anime === 'undefined') return;
 
  //Bobbing up & down
  anime({
    targets: 'img[src*="BirdFlying"]',
    translateY: [-12, 12],
    direction: 'alternate',
    loop: true,
    easing: 'easeInOutSine',
    duration: 2200
  });
 
  anime({
    //Swaying rotation
    targets: 'img[src*="BirdFlying"]',
    rotate: [-3, 3],
    direction: 'alternate',
    loop: true,
    easing: 'easeInOutQuad',
    duration: 3000,
    delay: anime.stagger(500) //Tries to make it more natural b/c it moves out of sync
  });

}
 
//Running all systems when DOM is ready 
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  createCursorGlow();
  createHoverRipples();
  typewriterEffect();
  animateBirds();
});