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
    const el = (id) => document.getElementById(id);
    try {
      el('coffees').textContent = Math.floor(coffees);
      if (el('coffeePerClick')) el('coffeePerClick').textContent = calculateCoffeePerClick().toFixed(1);
      if (el('passiveClick')) el('passiveClick').textContent = calculatePassiveClick().toFixed(1);
      if (el('cafePoints')) el('cafePoints').textContent = cafePoints;
      if (el('cafePoints2')) el('cafePoints2').textContent = cafePoints;

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
      if (el('marketingBtn')) {
        el('marketingBtn').textContent = `Marketing Material (${marketingLevel}/${marketingMaxLevel}) - ${marketingCost} coffees`;
        el('marketingLevel').textContent = marketingLevel;
        el('marketingCost').textContent = marketingCost;
      }

      // Achievements
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
        if (el('prestigeBtn')) el('prestigeBtn').disabled = false;
      }
      if (el('achievement7') && cafePoints > 0 && !achievements.prestige1) {
        el('achievement7').innerHTML = 'Prestige for the first time: <span class="ach-unlocked">Unlocked!</span>';
        achievements.prestige1 = true;
      }
      if (el('achievement8') && espressoMachines > 0 && pourOverSetups > 0 && filterSetups > 0 && coldBrewSetups > 0 && !achievements.allBrewingMethods) {
        el('achievement8').innerHTML = 'Unlock all Brewing Methods: <span class="ach-unlocked">Unlocked!</span>';
        achievements.allBrewingMethods = true;
      }

      // Enable/disable buttons
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

      // Boost buttons text
      const boostBtnEl = el('boostBtn');
      const boostTimerEl = el('boostTimer');
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

  // Button event handlers below (no change from previous versions)
  // ...

  // Providing essential ones here for brevity:
  document.getElementById('coffee-btn').onclick = () => {
    const earned = calculateCoffeePerClick();
    coffees += earned;
    totalCoffeesBrewed += earned;
    updateDisplay();
  };

  // (Add the rest of button handlers as in previous full script.js example.)

  // Boost and timer management
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

  // Start passive coffee generation interval
  setInterval(() => {
    let passive =
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

  updateDisplay();
});
