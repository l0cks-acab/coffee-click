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
  let marketingMaxLevel = 10;
  let marketingCost = 500;

  let upgradeCost = 100;
  let cafePoints = 0;
  let cafePointMultiplier = 1;

  let boostActive = false;
  const baseBoostCooldown = 300000; // 5 minutes in ms
  let boostCooldown = baseBoostCooldown;
  let boostReady = true;

  const boostDuration = 30000; // 30 seconds

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
    return coffeePerClick * (1 + espressoMachines * 0.5) * cafePointMultiplier * (boostActive ? 2 : 1);
  }

  function calculateAutoClick() {
    let passive = 
      (baristas * 1) + 
      (trucks * 2) + 
      (espressoMachines * brewingPassiveRates.espresso) + 
      (pourOverSetups * brewingPassiveRates.pourOver) + 
      (filterSetups * brewingPassiveRates.filter) + 
      (coldBrewSetups * brewingPassiveRates.coldBrew);
    passive *= cafePointMultiplier * (boostActive ? 2 : 1);
    return passive;
  }

  function formatTime(ms) {
    const totalSeconds = Math.ceil(ms / 1000);
    const mins = Math.floor(totalSeconds / 60).toString().padStart(2,'0');
    const secs = (totalSeconds % 60).toString().padStart(2,'0');
    return `${mins}:${secs}`;
  }

  let boostTimerInterval = null;
  let boostCooldownRemaining = 0;

  function startBoostCooldown() {
    boostReady = false;
    boostCooldownRemaining = boostCooldown;
    updateDisplay();

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
    const el = (id) => document.getElementById(id);
    try {
      el('coffees').textContent = Math.floor(coffees);
      if (el('coffeePerClick')) el('coffeePerClick').textContent = calculateCoffeePerClick().toFixed(1);
      if (el('autoClick')) el('autoClick').textContent = calculateAutoClick().toFixed(1);
      if (el('cafePoints')) el('cafePoints').textContent = cafePoints;

      if (el('baristasOwned')) el('baristasOwned').textContent = `${baristas} owned`;
      if (el('trucksOwned')) el('trucksOwned').textContent = `${trucks} owned`;
      if (el('espressoOwned')) el('espressoOwned').textContent = `${espressoMachines} owned`;
      if (el('espressoOwnedRight')) el('espressoOwnedRight').textContent = `${espressoMachines} owned`;
      if (el('pourOverOwned')) el('pourOverOwned').textContent = `${pourOverSetups} owned`;
      if (el('filterOwned')) el('filterOwned').textContent = `${filterSetups} owned`;
      if (el('coldBrewOwned')) el('coldBrewOwned').textContent = `${coldBrewSetups} owned`;

      if (el('espressoRate')) el('espressoRate').textContent = (espressoMachines * brewingPassiveRates.espresso * cafePointMultiplier * (boostActive ? 2 : 1)).toFixed(1);
      if (el('pourOverRate')) el('pourOverRate').textContent = (pourOverSetups * brewingPassiveRates.pourOver * cafePointMultiplier * (boostActive ? 2 : 1)).toFixed(1);
      if (el('filterRate')) el('filterRate').textContent = (filterSetups * brewingPassiveRates.filter * cafePointMultiplier * (boostActive ? 2 : 1)).toFixed(1);
      if (el('coldBrewRate')) el('coldBrewRate').textContent = (coldBrewSetups * brewingPassiveRates.coldBrew * cafePointMultiplier * (boostActive ? 2 : 1)).toFixed(1);

      if (el('baristaCost')) el('baristaCost').textContent = baristaCost;
      if (el('truckCost')) el('truckCost').textContent = truckCost;
      if (el('espressoCost')) el('espressoCost').textContent = espressoCost;
      if (el('espressoCostRight')) el('espressoCostRight').textContent = espressoCost;
      if (el('pourOverCost')) el('pourOverCost').textContent = pourOverCost;
      if (el('filterCost')) el('filterCost').textContent = filterCost;
      if (el('coldBrewCost')) el('coldBrewCost').textContent = coldBrewCost;
      if (el('upgradeCost')) el('upgradeCost').textContent = upgradeCost;

      if (el('upgradeLevel')) el('upgradeLevel').textContent = `Level ${upgradeLevel}`;
      if (el('marketingBtn')) el('marketingBtn').textContent = `Marketing Material (${marketingLevel}/${marketingMaxLevel}) - ${marketingCost} coffees`;

      if (el('achievement1') && totalCoffeesBrewed >= 100 && !achievements.brew100) {
        el('achievement1').innerHTML = 'Brew 100 Coffees: <span class="ach-unlocked">Unlocked!</span>';
        achievements.brew100 = true;
      }
      if (el('achievement2') && baristas >= 5 && !achievements.barista5) {
        el('achievement2').innerHTML = 'Hire 5 Baristas: <span class="ach-unlocked">Unlocked!</span>';
        achievements.barista5 = true;
      }
      if (el('achievement3') && trucks >= 3 && !achievements.truck3) {
        el('achievement3').innerHTML = 'Buy 3 Coffee Trucks: <span class="ach-unlocked">Unlocked!</span>';
        achievements.truck3 = true;
      }
      if (el('achievement4') && espressoMachines >= 2 && !achievements.espresso2) {
        el('achievement4').innerHTML = 'Buy 2 Espresso Machines: <span class="ach-unlocked">Unlocked!</span>';
        achievements.espresso2 = true;
      }
      if (el('achievement5') && !boostReady && !achievements.boost1) {
        el('achievement5').innerHTML = 'Activate Coffee Rush Boost: <span class="ach-unlocked">Unlocked!</span>';
        achievements.boost1 = true;
      }
      if (el('achievement6') && totalCoffeesBrewed >= 10000 && !achievements.brew10000) {
        el('achievement6').innerHTML = 'Reach 10,000 Total Coffees Brewed: <span class="ach-unlocked">Unlocked!</span>';
        achievements.brew10000 = true;
        const prestigeBtn = el('prestigeBtn');
        if (prestigeBtn) prestigeBtn.disabled = false;
      }
      if (el('achievement7') && cafePoints > 0 && !achievements.prestige1) {
        el('achievement7').innerHTML = 'Prestige for the first time: <span class="ach-unlocked">Unlocked!</span>';
        achievements.prestige1 = true;
      }
      if (el('achievement8') && espressoMachines > 0 && pourOverSetups > 0 && filterSetups > 0 && coldBrewSetups > 0 && !achievements.allBrewingMethods) {
        el('achievement8').innerHTML = 'Unlock all Brewing Methods: <span class="ach-unlocked">Unlocked!</span>';
        achievements.allBrewingMethods = true;
      }

      // Button enable / disable
      if (el('buyBaristaBtn')) el('buyBaristaBtn').disabled = coffees < baristaCost;
      if (el('buyTruckBtn')) el('buyTruckBtn').disabled = coffees < truckCost;
      if (el('buyEspressoMachineBtn')) el('buyEspressoMachineBtn').disabled = coffees < espressoCost;
      if (el('buyEspressoBtnRight')) el('buyEspressoBtnRight').disabled = coffees < espressoCost;
      if (el('buyPourOverBtn')) el('buyPourOverBtn').disabled = coffees < pourOverCost;
      if (el('buyFilterBtn')) el('buyFilterBtn').disabled = coffees < filterCost;
      if (el('buyColdBrewBtn')) el('buyColdBrewBtn').disabled = coffees < coldBrewCost;
      if (el('buyUpgradeBtn')) el('buyUpgradeBtn').disabled = coffees < upgradeCost;
      if (el('marketingBtn')) el('marketingBtn').disabled = coffees < marketingCost || marketingLevel >= marketingMaxLevel;
      if (el('prestigeBtn')) el('prestigeBtn').disabled = totalCoffeesBrewed < 10000;

      // Boost button text and timer
      const boostBtnEl = el('boostBtn');
      const boostTimerEl = el('boostTimer');
      if (boostReady && !boostActive) {
        if(boostBtnEl) { boostBtnEl.disabled = false; boostBtnEl.textContent = 'Activate Coffee Rush (Ready)'; }
        if(boostTimerEl) boostTimerEl.textContent = "Cooldown: 00:00";
      } else if (boostActive) {
        if(boostBtnEl) { boostBtnEl.disabled = true; boostBtnEl.textContent = 'Coffee Rush Active!'; }
        if(boostTimerEl) boostTimerEl.textContent = "Boost Time Left!";
      } else {
        if(boostBtnEl) { boostBtnEl.disabled = true; boostBtnEl.textContent = 'Coffee Rush (Cooldown)'; }
        if(boostTimerEl) boostTimerEl.textContent = 'Cooldown: ' + formatTime(boostCooldownRemaining);
      }
    } catch(e) {
      // Prevent UI crash if any
      console.error('UpdateDisplay error:', e);
    }
  }

  // Formatting mm:ss for timers
  function formatTime(ms) {
    const totalSeconds = Math.ceil(ms / 1000);
    const mins = Math.floor(totalSeconds / 60).toString().padStart(2,'0');
    const secs = (totalSeconds % 60).toString().padStart(2,'0');
    return `${mins}:${secs}`;
  }

  // Refresh display timer for boost
  let boostTimerInterval = null;
  let boostCooldownRemaining = 0;
  
  function startBoostCooldown() {
    boostReady = false;
    boostCooldownRemaining = boostCooldown - (marketingLevel * 15000); // reduce cooldown by marketing upgrades
    
    if(boostCooldownRemaining < 60000) boostCooldownRemaining = 60000; // minimum 60s cooldown
    
    updateDisplay();

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

  // Event handlers
  document.getElementById('coffee-btn').onclick = () => {
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

  function buyEspresso() {
    if (coffees >= espressoCost) {
      coffees -= espressoCost;
      espressoMachines++;
      espressoCost = Math.floor(espressoCost * 1.75);
      updateDisplay();
    }
  }
  document.getElementById('buyEspressoMachineBtn').onclick = buyEspresso;
  document.getElementById('buyEspressoBtnRight').onclick = buyEspresso;

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

  // Marketing Material upgrade
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

      // Reset game except prestige and marketing
      coffees = 0;
      totalCoffeesBrewed = 0;
      coffeePerClick = 1;
      upgradeLevel = 1;
      baristas = 0;
      baristaCost = 50;
      trucks = 0;
      truckCost = 500;
      espressoMachines = 0;
      espressoCost = 1000;
      pourOverSetups = 0;
      pourOverCost = 2000;
      filterSetups = 0;
      filterCost = 3500;
      coldBrewSetups = 0;
      coldBrewCost = 5000;
      upgradeCost = 100;
      // Marketing upgrades persist on prestige

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
    let passive  = 
      (baristas * 1) +
      (trucks * 2) +
      (espressoMachines * brewingPassiveRates.espresso) +
      (pourOverSetups * brewingPassiveRates.pourOver) +
      (filterSetups * brewingPassiveRates.filter) +
      (coldBrewSetups * brewingPassiveRates.coldBrew);
    passive *= cafePointMultiplier * (boostActive ? 2 : 1);
    coffees += passive;
    totalCoffeesBrewed += passive;
    updateDisplay();
  }, 1000);

  // Save / Load export/import functions ...
  function exportSave() {
    const saveData = { coffees,totalCoffeesBrewed,coffeePerClick,upgradeLevel,baristas,baristaCost,trucks,truckCost,espressoMachines,espressoCost,pourOverSetups,pourOverCost,filterSetups,filterCost,coldBrewSetups,coldBrewCost,upgradeCost,cafePoints,marketingLevel,marketingCost,achievements };
    return btoa(encodeURIComponent(JSON.stringify(saveData)));
  }
  function importSave(str) {
    try {
      const data = JSON.parse(decodeURIComponent(atob(str)));
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
      boostCooldown = baseBoostCooldown - marketingLevel * 15000;
      if (boostCooldown < 60000) boostCooldown = 60000;
      updateDisplay();
      alert('Save imported successfully!');
    } catch {
      alert('Invalid save data!');
    }
  }

  document.getElementById('exportBtn').onclick = () => {
    const clip = exportSave();
    const textarea = document.getElementById('importExportArea');
    textarea.value = clip;
    textarea.select();
    document.execCommand('copy');
    alert('Save exported and copied to clipboard.');
  };
  document.getElementById('importBtn').onclick = () => {
    const val = document.getElementById('importExportArea').value.trim();
    if(val.length) importSave(val);
    else alert("Paste your save data to import.");
  };

  updateDisplay();
});
