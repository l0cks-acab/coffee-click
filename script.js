// Main script.js for game
document.addEventListener('DOMContentLoaded', () => {
  // Variables (keep your existing ones)
  let coffees = 0;
  let totalCoffeesBrewed = 0;
  let coffeePerClick = 1;
  // ... all your other variables (items, costs, goals, etc.)

  // Hook into global brew action
  window.brewCoffeeClick = (amount) => {
    coffees += amount;
    totalCoffeesBrewed += amount;
    updateDisplay();
  };

  document.getElementById('coffee-btn').onclick = (event) => {
    const x = event.clientX;
    const y = event.clientY;
    createEmojiExplosion(x, y);
    window.brewCoffeeClick(calculateCoffeePerClick());
  };

  // All your item purchase handlers
  document.getElementById('buyBaristaBtn').onclick = () => {
    const c = getReducedCost(baristaCost);
    if (coffees >= c) {
      coffees -= c; baristas++; baristaCost = Math.floor(baristaCost * 1.55);
      updateDisplay();
    }
  };
  // similar for other items: trucks, espresso, pour over, filter, cold brew, upgrade, etc.

  // Activate boost
  document.getElementById('boostBtn').onclick = () => {
    if (!boostReady) return;
    boostActive = true;
    updateDisplay();
    startBoostCooldown();
    setTimeout(() => {
      boostActive = false;
      updateDisplay();
    }, boostDuration);
  };

  // Prestige
  document.getElementById('prestigeBtn').onclick = () => {
    if (totalCoffeesBrewed >= 10000) {
      const pts = Math.floor(Math.sqrt(totalCoffeesBrewed / 1000));
      cafePoints += pts;
      // reset game
      coffees=0; totalCoffeesBrewed=0; coffeePerClick=1; upgradeLevel=1;
      baristas=0; baristaCost=50; trucks=0; truckCost=500;
      // reset all items, costs, etc.
      updateDisplay();
    }
  };

  // === helper functions ===
  function getReducedCost(c) {
    const r=0.02*costReduceCount; return Math.ceil(c*Math.max(0.5,1-r));
  }
  function startBoostCooldown() {
    boostReady = false; boostCooldown = baseBoostCooldown - marketingLevel*15000;
    if (boostCooldown<60000) boostCooldown=60000;
    boostCooldownRemaining = boostCooldown;
    if (boostTimerInterval) clearInterval(boostTimerInterval);
    boostTimerInterval = setInterval(()=>{
      boostCooldownRemaining -= 1000;
      if (boostCooldownRemaining <= 0) {
        clearInterval(boostTimerInterval); boostTimerInterval=null; boostReady = true;
      }
      updateDisplay();
    },1000);
  }
  function createEmojiExplosion(x,y) {
    const count=20, emoji='☕';
    for (let i=0;i<count;i++) {
      const elt=document.createElement('div');
      elt.className='emoji-particle';
      elt.textContent=emoji;
      document.body.appendChild(elt);
      const angle = Math.random()*2*Math.PI;
      const radius = Math.random()*100+50;
      const dx = Math.cos(angle)*radius+'px';
      const dy = Math.sin(angle)*radius+'px';
      elt.style.left= x+'px'; elt.style.top= y+'px';
      elt.style.setProperty('--dx',dx); elt.style.setProperty('--dy',dy);
      elt.style.animationDelay=`${i*20}ms`;
      elt.addEventListener('animationend', ()=>{ elt.remove(); });
    }
  }

  // All your display update code
  window.updateDisplay = ()=>{ 
    /* your existing code to update DOM elements for all variables and buttons */
    // Example:
    document.getElementById('coffees').textContent = Math.floor(coffees);
    document.getElementById('coffeePerClick').textContent = calculateCoffeePerClick().toFixed(1);
    // similar for all items, effects, achievement checks, button enable/disable, cooldown timers etc.
  };

  // Loop to generate passive coffees
  setInterval(()=>{
    const passive = (baristas*1 + trucks*2 + espressoMachines*brewingPassiveRates.espresso + pourOverSetups*brewingPassiveRates.pourOver +
                     filterSetups*brewingPassiveRates.filter + coldBrewSetups*brewingPassiveRates.coldBrew)
                     * (1 + cafePointMultiplier) * (boostActive ? 2 : 1);
    coffees += passive; totalCoffeesBrewed += passive; updateDisplay();
  },1000);
});
