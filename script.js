document.addEventListener('DOMContentLoaded', () => {
  // Game state variables
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
  const baseBoostCooldown = 300000; // 5 minutes in ms
  let boostCooldown = baseBoostCooldown;
  let boostCooldownRemaining = 0;
  let boostReady = true;
  const boostDuration = 30000; // 30 seconds

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

  // Theme handling
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

  // Utility function: safe text set
  function safeSetText(id, text) {
    const e = document.getElementById(id);
    if (e) e.textContent = text;
  }

  // Calculations
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

  // Format time for cooldown display
  function formatTime(ms) {
    let totalSeconds = Math.ceil(ms / 1000);
    let mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    let secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  // Boost cooldown timer management
  function startBoostCooldown() {
    boostReady = false;
    boostCooldown = baseBoostCooldown - marketingLevel * 15000;
    if (boostCooldown < 60000) boostCooldown = 60000; // minimum cooldown 60s
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

  // Update display for all UI elements safely
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

      // Achievements updates
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

      // Buttons enable/disable status
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

  // Coffee Emoji Explosion effect
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

  // Brew button with explosion
  document.getElementById('coffee-btn').onclick = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    createEmojiExplosion(x, y);

    const earned = calculateCoffeePerClick();
    coffees += earned;
    totalCoffeesBrewed += earned;
    updateDisplay();
  };

  document.getElementById('buyBaristaBtn').onclick = () => {
    if (coffees >= baristaCost) {
      coffees -= baristaCost;
      baristas++;
      baristaCost = Math.floor(baristaCost * 1.55);
      updateDisplay();
    }
  };

  document.getElementById('buyTruckBtn').onclick = () => {
    if (coffees >= truckCost) {
      coffees -= truckCost;
      trucks++;
      truckCost = Math.floor(truckCost * 1.6);
      updateDisplay();
    }
  };

  document.getElementById('buyEspressoMachineBtn').onclick = () => {
    if (coffees >= espressoCost) {
      coffees -= espressoCost;
      espressoMachines++;
      espressoCost = Math.floor(espressoCost * 1.75);
      updateDisplay();
    }
  };

  document.getElementById('buyPourOverBtn').onclick = () => {
    if (coffees >= pourOverCost) {
      coffees -= pourOverCost;
      pourOverSetups++;
      pourOverCost = Math.floor(pourOverCost * 1.75);
      updateDisplay();
    }
  };

  document.getElementById('buyFilterBtn').onclick = () => {
    if (coffees >= filterCost) {
      coffees -= filterCost;
      filterSetups++;
      filterCost = Math.floor(filterCost * 1.8);
      updateDisplay();
    }
  };

  document.getElementById('buyColdBrewBtn').onclick = () => {
    if (coffees >= coldBrewCost) {
      coffees -= coldBrewCost;
      coldBrewSetups++;
      coldBrewCost = Math.floor(coldBrewCost * 1.8);
      updateDisplay();
    }
  };

  document.getElementById('buyUpgradeBtn').onclick = () => {
    if (coffees >= upgradeCost) {
      coffees -= upgradeCost;
      upgradeLevel++;
      coffeePerClick += upgradeLevel;
      upgradeCost = Math.floor(upgradeCost * 2.2);
      updateDisplay();
    }
  };

  document.getElementById('marketingBtn').onclick = () => {
    if (coffees >= marketingCost && marketingLevel < marketingMaxLevel) {
      coffees -= marketingCost;
      marketingLevel++;
      marketingCost = Math.floor(marketingCost * 1.7);
      updateDisplay();
    }
  };

  document.getElementById('prestigeBtn').onclick = () => {
    if (totalCoffeesBrewed >= 10000) {
      const pointsGained = Math.floor(Math.sqrt(totalCoffeesBrewed / 1000));
      cafePoints += pointsGained;
      cafePointMultiplier = 1 + cafePoints * 0.1;

      coffees = 0;
      totalCoffeesBrewed = 0;
      coffeePerClick = 1;
      upgradeLevel = 1;

      baristas = 0;
      baristaCost = 50;

      trucks = 0;
      truckCost = 500;

      espressoCost = 1000;
      pourOverCost = 2000;
      filterCost = 3500;
      coldBrewCost = 5000;

      upgradeCost = 100;

      marketingCost = 500;
      // marketingLevel persists

      updateDisplay();
    }
  };

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

  setInterval(() => {
    let passive =
      baristas * 1 +
      trucks * 2 +
      espressoMachines * brewingPassiveRates.espresso +
      pourOverSetups * brewingPassiveRates.pourOver +
      filterSetups * brewingPassiveRates.filter +
      coldBrewSetups * brewingPassiveRates.coldBrew;
    passive *= cafePointMultiplier * (boostActive ? 2 : 1);
    coffees += passive;
    totalCoffeesBrewed += passive;
    updateDisplay();
  }, 1000);

  // Theme switching
  document.getElementById('themeSwitchBtn').onclick = () => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    applyTheme(themes[currentThemeIndex]);
  };

  function exportSave() {
    const saveData = {
      coffees,
      totalCoffeesBrewed,
      coffeePerClick,
      upgradeLevel,
      baristas,
      baristaCost,
      trucks,
      truckCost,
      espressoMachines,
      espressoCost,
      pourOverSetups,
      pourOverCost,
      filterSetups,
      filterCost,
      coldBrewSetups,
      coldBrewCost,
      upgradeCost,
      cafePoints,
      marketingLevel,
      marketingCost,
      achievements,
    };
    return btoa(encodeURIComponent(JSON.stringify(saveData)));
  }

  function importSave(encodedStr) {
    try {
      const decoded = decodeURIComponent(atob(encodedStr));
      const data = JSON.parse(decoded);

      coffees = data.coffees ?? coffees;
      totalCoffeesBrewed = data.totalCoffeesBrewed ?? totalCoffeesBrewed;
      coffeePerClick = data.coffeePerClick ?? coffeePerClick;
      upgradeLevel = data.upgradeLevel ?? upgradeLevel;
      baristas = data.baristas ?? baristas;
      baristaCost = data.baristaCost ?? baristaCost;
      trucks = data.trucks ?? trucks;
      truckCost = data.truckCost ?? truckCost;
      espressoMachines = data.espressoMachines ?? espressoMachines;
      espressoCost = data.espressoCost ?? espressoCost;
      pourOverSetups = data.pourOverSetups ?? pourOverSetups;
      pourOverCost = data.pourOverCost ?? pourOverCost;
      filterSetups = data.filterSetups ?? filterSetups;
      filterCost = data.filterCost ?? filterCost;
      coldBrewSetups = data.coldBrewSetups ?? coldBrewSetups;
      coldBrewCost = data.coldBrewCost ?? coldBrewCost;
      upgradeCost = data.upgradeCost ?? upgradeCost;
      cafePoints = data.cafePoints ?? cafePoints;
      marketingLevel = data.marketingLevel ?? marketingLevel;
      marketingCost = data.marketingCost ?? marketingCost;
      achievements = data.achievements ?? achievements;

      cafePointMultiplier = 1 + cafePoints * 0.1;

      updateDisplay();
      alert('Save imported successfully!');
    } catch {
      alert('Invalid save data! Please check your input.');
    }
  }

  document.getElementById('exportBtn').onclick = () => {
    const saveHash = exportSave();
    const textarea = document.getElementById('importExportArea');
    textarea.value = saveHash;
    textarea.select();
    document.execCommand('copy');
    alert('Save exported and copied to clipboard.');
  };

  document.getElementById('importBtn').onclick = () => {
    const val = document.getElementById('importExportArea').value.trim();
    if (val.length > 0) {
      importSave(val);
    } else {
      alert('Please paste your save data into the text box to import.');
    }
  };

  document.getElementById('achievementsToggle').onclick = () => {
    const container = document.getElementById('achievements-container');
    const btn = document.getElementById('achievementsToggle');
    if (container.classList.contains('collapsed')) {
      container.classList.remove('collapsed');
      btn.textContent = 'Hide Achievements ▲';
    } else {
      container.classList.add('collapsed');
      btn.textContent = 'Show Achievements ▼';
    }
  };

  // Themes definitions and apply function
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

  document.getElementById('themeSwitchBtn').onclick = () => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    applyTheme(themes[currentThemeIndex]);
  };

  // Apply initial theme
  applyTheme(themes[currentThemeIndex]);

  updateDisplay();
});
