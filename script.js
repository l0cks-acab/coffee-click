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

  // Declare themes and catppuccinThemes once
  const themes = ['mocha', 'latte', 'frappe', 'macchiato', 'rosewater'];
  let currentThemeIndex = 0;

  const catppuccinThemes = {
    mocha: {
      '--base': '#1e1e2e',
      '--mantle': '#181825',
      '--crust': '#11111b',
      '--text': '#cdd6f4',
      '--surface0': '#313244',
      '--surface1': '#45475a',
      '--surface2': '#585b70',
      '--pink': '#f5c2e7',
      '--yellow': '#f9e2af',
      '--green': '#a6e3a1',
      '--peach': '#fab387',
      '--lavender': '#b4befe',
    },
    latte: {
      '--base': '#eff1f5',
      '--mantle': '#e6e9ef',
      '--crust': '#dce0e8',
      '--text': '#4c4f69',
      '--surface0': '#dce0e8',
      '--surface1': '#cad0e7',
      '--surface2': '#b5bfe2',
      '--pink': '#c59ae7',
      '--yellow': '#df8e1d',
      '--green': '#40a02b',
      '--peach': '#d7827e',
      '--lavender': '#7287fd',
    },
    frappe: {
      '--base': '#303446',
      '--mantle': '#292c3c',
      '--crust': '#232634',
      '--text': '#c6d0f5',
      '--surface0': '#4c4f69',
      '--surface1': '#585b70',
      '--surface2': '#767aa9',
      '--pink': '#f2cdcd',
      '--yellow': '#e5c890',
      '--green': '#a6d189',
      '--peach': '#eebebe',
      '--lavender': '#babbf1',
    },
    macchiato: {
      '--base': '#24273a',
      '--mantle': '#1e2030',
      '--crust': '#181926',
      '--text': '#cad3f5',
      '--surface0': '#363a4f',
      '--surface1': '#494d64',
      '--surface2': '#5b6078',
      '--pink': '#f4b8e4',
      '--yellow': '#eed49f',
      '--green': '#a6da95',
      '--peach': '#f4dbd6',
      '--lavender': '#b7bdf8',
    },
    rosewater: {
      '--base': '#f5e0dc',
      '--mantle': '#f2d5cf',
      '--crust': '#ddb6c6',
      '--text': '#6c6783',
      '--surface0': '#c4a7e7',
      '--surface1': '#988ba2',
      '--surface2': '#6e6a86',
      '--pink': '#ea76cb',
      '--yellow': '#ef9f76',
      '--green': '#40a02b',
      '--peach': '#bc6f3c',
      '--lavender': '#9d7cd8',
    }
  };

  function applyTheme(themeName) {
    const theme = catppuccinThemes[themeName];
    if (!theme) return;
    for (const [varName, color] of Object.entries(theme)) {
      document.documentElement.style.setProperty(varName, color);
    }
  }

  // Apply initial theme
  applyTheme(themes[currentThemeIndex]);

  // Coffee Emoji Explosion Effect
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

  function safeSetText(id, text) {
    const e = document.getElementById(id);
    if (e) e.textContent = text;
  }

  function calculateCoffeePerClick() {
    return coffeePerClick * (1 + espressoMachines * 0.5) * cafePointMultiplier * (boostActive ? 2 : 1);
  }

  function calculatePassiveClick() {
    let passive =
      baristas * 1 +
      trucks * 2 +
      espressoMachines * brewingPassiveRates.espresso +
      pourOverSetups * brewingPassiveRates.pourOver +
      filterSetups * brewingPassiveRates.filter +
      coldBrewSetups * brewingPassiveRates.coldBrew;
    return passive * cafePointMultiplier * (boostActive ? 2 : 1);
  }

  function formatTime(ms) {
    let totalSeconds = Math.ceil(ms / 1000);
    let mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    let secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
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

      safeSetText('baristaCost', baristaCost);
      safeSetText('truckCost', truckCost);
      safeSetText('espressoCost', espressoCost);
      safeSetText('pourOverCost', pourOverCost);
      safeSetText('filterCost', filterCost);
      safeSetText('coldBrewCost', coldBrewCost);
      safeSetText('upgradeCost', upgradeCost);

      safeSetText('upgradeLevel', `Level ${upgradeLevel}`);
      safeSetText('marketingBtn', `Marketing Material (${marketingLevel}/${marketingMaxLevel}) - ${marketingCost} coffees`);
      safeSetText('marketingLevel', marketingLevel);
      safeSetText('marketingCost', marketingCost);

      // Achievements
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
      if (document.getElementById('achievement5') && !boostReady && !achievements.boost1) {
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

      if (document.getElementById('buyBaristaBtn')) document.getElementById('buyBaristaBtn').disabled = coffees < baristaCost;
      if (document.getElementById('buyTruckBtn')) document.getElementById('buyTruckBtn').disabled = coffees < truckCost;
      if (document.getElementById('buyEspressoMachineBtn')) document.getElementById('buyEspressoMachineBtn').disabled = coffees < espressoCost;
      if (document.getElementById('buyPourOverBtn')) document.getElementById('buyPourOverBtn').disabled = coffees < pourOverCost;
      if (document.getElementById('buyFilterBtn')) document.getElementById('buyFilterBtn').disabled = coffees < filterCost;
      if (document.getElementById('buyColdBrewBtn')) document.getElementById('buyColdBrewBtn').disabled = coffees < coldBrewCost;
      if (document.getElementById('buyUpgradeBtn')) document.getElementById('buyUpgradeBtn').disabled = coffees < upgradeCost;
      if (document.getElementById('marketingBtn')) document.getElementById('marketingBtn').disabled = coffees < marketingCost || marketingLevel >= marketingMaxLevel;
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

  updateDisplay();
});
