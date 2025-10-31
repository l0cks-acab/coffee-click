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

  let upgradeCost = 100;
  let cafePoints = 0;
  let cafePointMultiplier = 1;

  let boostActive = false;
  const boostDuration = 30000; // 30s
  const boostCooldown = 90000; // 90s
  let boostReady = true;

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

  // Calculation functions
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

  function updateDisplay() {
    // Guard to prevent errors if elements are missing
    const el = (id) => document.getElementById(id);
    try {
      el('coffees').textContent = Math.floor(coffees);
      if (el('coffeePerClick')) el('coffeePerClick').textContent = calculateCoffeePerClick().toFixed(1);
      if (el('autoClick')) el('autoClick').textContent = calculateAutoClick().toFixed(1);
      if (el('cafePoints')) el('cafePoints').textContent = cafePoints;

      // Owned counts
      if (el('baristasOwned')) el('baristasOwned').textContent = `${baristas} owned`;
      if (el('trucksOwned')) el('trucksOwned').textContent = `${trucks} owned`;
      if (el('espressoOwned')) el('espressoOwned').textContent = `${espressoMachines} owned`;
      if (el('espressoOwnedRight')) el('espressoOwnedRight').textContent = `${espressoMachines} owned`;
      if (el('pourOverOwned')) el('pourOverOwned').textContent = `${pourOverSetups} owned`;
      if (el('filterOwned')) el('filterOwned').textContent = `${filterSetups} owned`;
      if (el('coldBrewOwned')) el('coldBrewOwned').textContent = `${coldBrewSetups} owned`;

      // Rate updates for brewing methods
      if (el('espressoRate')) el('espressoRate').textContent = (espressoMachines * brewingPassiveRates.espresso * cafePointMultiplier * (boostActive ? 2 : 1)).toFixed(1);
      if (el('pourOverRate')) el('pourOverRate').textContent = (pourOverSetups * brewingPassiveRates.pourOver * cafePointMultiplier * (boostActive ? 2 : 1)).toFixed(1);
      if (el('filterRate')) el('filterRate').textContent = (filterSetups * brewingPassiveRates.filter * cafePointMultiplier * (boostActive ? 2 : 1)).toFixed(1);
      if (el('coldBrewRate')) el('coldBrewRate').textContent = (coldBrewSetups * brewingPassiveRates.coldBrew * cafePointMultiplier * (boostActive ? 2 : 1)).toFixed(1);

      // Update costs
      if (el('baristaCost')) el('baristaCost').textContent = baristaCost;
      if (el('truckCost')) el('truckCost').textContent = truckCost;
      if (el('espressoCost')) el('espressoCost').textContent = espressoCost;
      if (el('pourOverCost')) el('pourOverCost').textContent = pourOverCost;
      if (el('filterCost')) el('filterCost').textContent = filterCost;
      if (el('coldBrewCost')) el('coldBrewCost').textContent = coldBrewCost;
      if (el('upgradeCost')) el('upgradeCost').textContent = upgradeCost;

      // Upgrade level
      if (el('upgradeLevel')) el('upgradeLevel').textContent = `Level ${upgradeLevel}`;

      // Achievement updates
      if (totalCoffeesBrewed >= 100 && !achievements.brew100) {
        el('achievement1').innerHTML = 'Brew 100 Coffees: <span class="ach-unlocked">Unlocked!</span>';
        achievements.brew100 = true;
      }
      if (baristas >= 5 && !achievements.barista5) {
        el('achievement2').innerHTML = 'Hire 5 Baristas: <span class="ach-unlocked">Unlocked!</span>';
        achievements.barista5 = true;
      }
      if (trucks >= 3 && !achievements.truck3) {
        el('achievement3').innerHTML = 'Buy 3 Coffee Trucks: <span class="ach-unlocked">Unlocked!</span>';
        achievements.truck3 = true;
      }
      if (espressoMachines >= 2 && !achievements.espresso2) {
        el('achievement4').innerHTML = 'Buy 2 Espresso Machines: <span class="ach-unlocked">Unlocked!</span>';
        achievements.espresso2 = true;
      }
      if (totalCoffeesBrewed >= 10000 && !achievements.brew10000) {
        el('achievement6').innerHTML = 'Reach 10,000 Coffees: <span class="ach-unlocked">Unlocked!</span>';
        achievements.brew10000 = true;
        document.getElementById('prestigeBtn').disabled = false;
      }
      if (cafePoints > 0 && !achievements.prestige1) {
        el('achievement7').innerHTML = 'Prestige for the first time: <span class="ach-unlocked">Unlocked!</span>';
        achievements.prestige1 = true;
      }
    } catch(e) {
      // fail silently
    }
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
  document.getElementById('buyEspressoMachineBtn').onclick = () => {
    if (coffees >= espressoCost) {
      coffees -= espressoCost;
      espressoMachines++;
      espressoCost = Math.floor(espressoCost * 1.75);
      updateDisplay();
    }
  };
  document.getElementById('buyEspressoBtnRight').onclick = () => { // same as above
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
  document.getElementById('prestigeBtn').onclick = () => {
    if (totalCoffeesBrewed >= 10000) {
      const pointsGained = Math.floor(Math.sqrt(totalCoffeesBrewed/1000));
      cafePoints += pointsGained;
      cafePointMultiplier = 1 + cafePoints * 0.1;
      // reset
      coffees = 0;
      totalCoffeesBrewed = 0;
      coffeePerClick = 1;
      upgradeLevel = 1;
      baristas = 0;
      baristaCost = 50;
      trucks=0; truckCost=500;
      espressoMachines=0; espressoCost=1000;
      pourOverSetups=0; pourOverCost=2000;
      filterSetups=0; filterCost=3500;
      coldBrewSetups=0; coldBrewCost=5000;
      upgradeCost=100;
      updateDisplay();
    }
  };

  document.getElementById('boostBtn').onclick = () => {
    if (!boostReady) return;
    boostActive = true;
    boostReady = false;
    updateDisplay();
    setTimeout(() => {
      boostActive = false;
      updateDisplay();
    }, boostDuration);
    setTimeout(() => {
      boostReady = true;
      updateDisplay();
    }, boostCooldown);
  };

  setInterval(() => {
    let passive = 
      (baristas * 1) + 
      (trucks * 2) + 
      (espressoMachines * brewingPassiveRates.espresso) + 
      (pourOverSetups * brewingPassiveRates.pourOver) + 
      (filterSetups * brewingPassiveRates.filter) + 
      (coldBrewSetups * brewingPassiveRates.coldBrew);
    passive *= cafePointMultiplier * (boostActive?2:1);
    coffees += passive;
    totalCoffeesBrewed += passive;
    updateDisplay();
  }, 1000);

  // Export
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
      achievements,
    };
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
      achievements = data.achievements ?? achievements;

      cafePointMultiplier = 1 + cafePoints * 0.1;

      updateDisplay();
      alert('Save imported successfully!');
    } catch (e) {
      alert('Invalid save data!');
    }
  }

  document.getElementById('exportBtn').onclick = () => {
    const hash = exportSave();
    const textarea = document.getElementById('importExportArea');
    textarea.value = hash;
    textarea.focus();
    textarea.select();
    document.execCommand('copy');
  };
  document.getElementById('importBtn').onclick = () => {
    const val = document.getElementById('importExportArea').value.trim();
    if (val.length > 0) importSave(val);
  };

  // Load save
  // (You can implement localStorage auto-load if desired)
  updateDisplay();
});
