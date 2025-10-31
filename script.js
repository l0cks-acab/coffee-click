document.addEventListener('DOMContentLoaded', () => {
  let coffees = 0;
  let totalCoffeesBrewed = 0;
  let coffeePerClick = 1;
  let upgradeLevel = 1;

  let baristas = 0;
  let baristaCost = 50;

  let trucks = 0;
  let truckCost = 500;

  let espressoMachines = 0;
  let espressoCost = 1000;

  let pourOverSetups = 0;
  let pourOverCost = 2000;

  let filterSetups = 0;
  let filterCost = 3500;

  let coldBrewSetups = 0;
  let coldBrewCost = 5000;

  let marketingLevel = 0;
  const marketingMaxLevel = 10;
  let marketingCost = 500;

  let upgradeCost = 100;
  let cafePoints = 0;
  let cafePointMultiplier = 1;

  let boostActive = false;
  const baseBoostCooldown = 300000;
  let boostCooldown = baseBoostCooldown;
  let boostCooldownRemaining = 0;
  let boostReady = true;
  const boostDuration = 30000;

  let boostTimerInterval = null;

  let prodBoostCount = 0;
  let prodBoostCost = 1;

  let costReduceCount = 0;
  let costReduceCost = 1;

  let automationUnlockCount = 0;
  let automationUnlockCost = 3;

  let automationEnabled = {
    baristas: false,
    trucks: false,
    espresso: false,
    pourOver: false,
    filter: false,
    coldBrew: false,
  };

  let achievements = {
    brew100: false,
    barista5: false,
    truck3: false,
    espresso2: false,
    boost1: false,
    brew10000: false,
    prestige1: false,
    allBrewingMethods: false,
  };

  const brewingPassiveRates = {
    espresso: 1.5,
    pourOver: 2.5,
    filter: 4,
    coldBrew: 6,
  };

  function calculateCoffeePerClick() {
    return coffeePerClick * (1 + espressoMachines * 0.5) * cafePointMultiplier * (boostActive ? 2 : 1) * (1 + 0.01 * prodBoostCount);
  }

  function calculatePassiveClick() {
    let basePassive =
      baristas * 1 +
      trucks * 2 +
      espressoMachines * brewingPassiveRates.espresso +
      pourOverSetups * brewingPassiveRates.pourOver +
      filterSetups * brewingPassiveRates.filter +
      coldBrewSetups * brewingPassiveRates.coldBrew;
    return basePassive * cafePointMultiplier * (boostActive ? 2 : 1) * (1 + 0.01 * prodBoostCount);
  }

  function formatTime(ms) {
    let totalSeconds = Math.ceil(ms / 1000);
    let mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    let secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  function getReducedCost(baseCost) {
    const reduction = 0.02 * costReduceCount;
    return Math.ceil(baseCost * Math.max(0.5, 1 - reduction));
  }

  function startBoostCooldown() {
    boostReady = false;
    boostCooldown = baseBoostCooldown - marketingLevel * 15000;
    if (boostCooldown < 60000) boostCooldown = 60000;
    boostCooldownRemaining = boostCooldown;
    updateDisplay();

    if (boostTimerInterval) clearInterval(boostTimerInterval);
    boostTimerInterval = setInterval(() => {
      boostCooldownRemaining -= 1000;
      if (boostCooldownRemaining <= 0) {
        boostCooldownRemaining = 0;
        boostReady = true;
        clearInterval(boostTimerInterval);
      }
      updateDisplay();
    }, 1000);
  }

  function safeSetText(id, text) {
    const e = document.getElementById(id);
    if (e) e.textContent = text;
  }

  function updateDisplay() {
    try {
      safeSetText('coffees', Math.floor(coffees));
      safeSetText('coffeePerClick', calculateCoffeePerClick().toFixed(1));
      safeSetText('passiveClick', calculatePassiveClick().toFixed(1));
      safeSetText('cafePoints', cafePoints);
      safeSetText('cafePoints2', cafePoints);

      safeSetText('baristasOwned', `${baristas} owned`);
      safeSetText('trucksOwned', `${trucks} owned`);
      safeSetText('espressoOwned', `${espressoMachines} owned`);
      safeSetText('espressoRate', (espressoMachines * brewingPassiveRates.espresso * cafePointMultiplier * (boostActive ? 2 : 1)).toFixed(1));
      safeSetText('pourOverOwned', `${pourOverSetups} owned`);
      safeSetText('pourOverRate', (pourOverSetups * brewingPassiveRates.pourOver * cafePointMultiplier * (boostActive ? 2 : 1)).toFixed(1));
      safeSetText('filterOwned', `${filterSetups} owned`);
      safeSetText('filterRate', (filterSetups * brewingPassiveRates.filter * cafePointMultiplier * (boostActive ? 2 : 1)).toFixed(1));
      safeSetText('coldBrewOwned', `${coldBrewSetups} owned`);
      safeSetText('coldBrewRate', (coldBrewSetups * brewingPassiveRates.coldBrew * cafePointMultiplier * (boostActive ? 2 : 1)).toFixed(1));

      safeSetText('baristaCost', getReducedCost(baristaCost));
      safeSetText('truckCost', getReducedCost(truckCost));
      safeSetText('espressoCost', getReducedCost(espressoCost));
      safeSetText('pourOverCost', getReducedCost(pourOverCost));
      safeSetText('filterCost', getReducedCost(filterCost));
      safeSetText('coldBrewCost', getReducedCost(coldBrewCost));
      safeSetText('upgradeCost', getReducedCost(upgradeCost));

      safeSetText('upgradeLevel', `Level ${upgradeLevel}`);
      safeSetText('marketingBtn', `Marketing Material (${marketingLevel}/${marketingMaxLevel}) - ${getReducedCost(marketingCost)} coffees`);
      safeSetText('marketingLevel', marketingLevel);
      safeSetText('marketingCost', marketingCost);

      safeSetText('prodBoostCost', prodBoostCost);
      safeSetText('costReduceCost', costReduceCost);
      safeSetText('automationUnlockCost', automationUnlockCost);

      document.getElementById('buyProdBoostBtn').disabled = cafePoints < prodBoostCost;
      document.getElementById('buyCostReduceBtn').disabled = cafePoints < costReduceCost;
      document.getElementById('buyAutomationUnlockBtn').disabled = cafePoints < automationUnlockCost || automationUnlockCount > 0;

      const togglePanel = document.getElementById('automation-toggles');
      togglePanel.style.display = automationUnlockCount > 0 ? 'block' : 'none';

      for (const key in automationEnabled) {
        const checkbox = document.getElementById('auto' + key.charAt(0).toUpperCase() + key.slice(1));
        if (checkbox) checkbox.checked = automationEnabled[key];
      }

      if (document.getElementById('achievement1') && totalCoffeesBrewed >= 100 && !achievements.brew100) {
        safeSetText('achievement1', 'Brew 100 Coffees: Unlocked!');
        achievements.brew100 = true;
      }
      if (document.getElementById('achievement2') && baristas >= 5 && !achievements.barista5) {
        safeSetText('achievement2', 'Hire 5 Baristas: Unlocked!');
        achievements.barista5 = true;
      }
      if (document.getElementById('achievement3') && trucks >= 3 && !achievements.truck3) {
        safeSetText('achievement3', 'Buy 3 Coffee Trucks: Unlocked!');
        achievements.truck3 = true;
      }
      if (document.getElementById('achievement4') && espressoMachines >= 2 && !achievements.espresso2) {
        safeSetText('achievement4', 'Buy 2 Espresso Machines: Unlocked!');
        achievements.espresso2 = true;
      }
      if (document.getElementById('achievement5') && !boostReady && boostActive && !achievements.boost1) {
        safeSetText('achievement5', 'Activate Coffee Rush Boost: Unlocked!');
        achievements.boost1 = true;
      }
      if (document.getElementById('achievement6') && totalCoffeesBrewed >= 10000 && !achievements.brew10000) {
        safeSetText('achievement6', 'Reach 10,000 Total Coffees Brewed: Unlocked!');
        achievements.brew10000 = true;
        if (document.getElementById('prestigeBtn')) document.getElementById('prestigeBtn').disabled = false;
      }
      if (document.getElementById('achievement7') && cafePoints > 0 && !achievements.prestige1) {
        safeSetText('achievement7', 'Prestige for the first time: Unlocked!');
        achievements.prestige1 = true;
      }
      if (document.getElementById('achievement8') && espressoMachines > 0 && pourOverSetups > 0 && filterSetups > 0 && coldBrewSetups > 0 && !achievements.allBrewingMethods) {
        safeSetText('achievement8', 'Unlock all Brewing Methods: Unlocked!');
        achievements.allBrewingMethods = true;
      }

      if (document.getElementById('buyBaristaBtn')) document.getElementById('buyBaristaBtn').disabled = coffees < getReducedCost(baristaCost);
      if (document.getElementById('buyTruckBtn')) document.getElementById('buyTruckBtn').disabled = coffees < getReducedCost(truckCost);
      if (document.getElementById('buyEspressoMachineBtn')) document.getElementById('buyEspressoMachineBtn').disabled = coffees < getReducedCost(espressoCost);
      if (document.getElementById('buyPourOverBtn')) document.getElementById('buyPourOverBtn').disabled = coffees < getReducedCost(pourOverCost);
      if (document.getElementById('buyFilterBtn')) document.getElementById('buyFilterBtn').disabled = coffees < getReducedCost(filterCost);
      if (document.getElementById('buyColdBrewBtn')) document.getElementById('buyColdBrewBtn').disabled = coffees < getReducedCost(coldBrewCost);
      if (document.getElementById('buyUpgradeBtn')) document.getElementById('buyUpgradeBtn').disabled = coffees < getReducedCost(upgradeCost);
      if (document.getElementById('marketingBtn')) document.getElementById('marketingBtn').disabled = coffees < getReducedCost(marketingCost) || marketingLevel >= marketingMaxLevel;
      if (document.getElementById('prestigeBtn')) document.getElementById('prestigeBtn').disabled = totalCoffeesBrewed < 10000;

      const boostBtnEl = document.getElementById('boostBtn');
      const boostTimerEl = document.getElementById('boostTimer');
      if (boostReady && !boostActive) {
        if (boostBtnEl) { boostBtnEl.disabled = false; boostBtnEl.textContent = 'Activate Coffee Rush (Ready)'; }
        if (boostTimerEl) boostTimerEl.textContent = 'Cooldown: 00:00';
      } else if (boostActive) {
        if (boostBtnEl) { boostBtnEl.disabled = true; boostBtnEl.textContent = 'Boost Active!'; }
        if (boostTimerEl) boostTimerEl.textContent = 'Boost Active!';
      } else {
        if (boostBtnEl) { boostBtnEl.disabled = true; boostBtnEl.textContent = 'Coffee Rush (Cooldown)'; }
        if (boostTimerEl) boostTimerEl.textContent = 'Cooldown: ' + formatTime(boostCooldownRemaining);
      }
    } catch (e) {
      console.error('updateDisplay error:', e);
    }
  }

  function createEmojiExplosion(x, y) {
    const numParticles = 20;
    const emoji = '☕';
    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement('div');
      particle.classList.add('emoji-particle');
      particle.textContent = emoji;
      document.body.appendChild(particle);

      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.random() * 100 + 50;

      const dx = Math.cos(angle) * radius + 'px';
      const dy = Math.sin(angle) * radius + 'px';

      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.setProperty('--dx', dx);
      particle.style.setProperty('--dy', dy);

      particle.style.animationDelay = `${i * 20}ms`;

      particle.addEventListener('animationend', () => {
        particle.remove();
      });
    }
  }

  document.getElementById('coffee-btn').onclick = (event) => {
    const x = event.clientX;
    const y = event.clientY;

    createEmojiExplosion(x, y);

    const earned = calculateCoffeePerClick();
    coffees += earned;
    totalCoffeesBrewed += earned;
    updateDisplay();
  };

  // Purchase handlers as previously described...
  // Automation toggles and auto-buy setup...
  // Export/import handlers...
  // Prestige and boost handlers...

  // Passive coffee generation every second
  setInterval(() => {
    let passive =
      baristas * 1 +
      trucks * 2 +
      espressoMachines * brewingPassiveRates.espresso +
      pourOverSetups * brewingPassiveRates.pourOver +
      filterSetups * brewingPassiveRates.filter +
      coldBrewSetups * brewingPassiveRates.coldBrew;
    passive *= cafePointMultiplier * (boostActive ? 2 : 1) * (1 + 0.01 * prodBoostCount);
    coffees += passive;
    totalCoffeesBrewed += passive;
    updateDisplay();
  }, 1000);

  updateDisplay();
});
