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

  let upgradeCost = 100;

  let cafePoints = 0; // Prestige currency
  let cafePointMultiplier = 1; // Boost from prestige points

  let boostActive = false;
  let boostDuration = 30000; // 30 seconds
  let boostCooldown = 90000; // 90 seconds
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

  // Brewing methods passive coffee rates (coffees per second per unit)
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
    let passiveCoffee =
      (baristas * 1) +
      (trucks * 2) +
      (espressoMachines * brewingPassiveRates.espresso) +
      (pourOverSetups * brewingPassiveRates.pourOver) +
      (filterSetups * brewingPassiveRates.filter) +
      (coldBrewSetups * brewingPassiveRates.coldBrew);

    passiveCoffee *= cafePointMultiplier;
    if (boostActive) passiveCoffee *= 2;
    return passiveCoffee;
  }

  function updateDisplay() {
    console.log('Updating display with baristas:', baristas);

    document.getElementById('coffees').textContent = Math.floor(coffees);
    document.getElementById('coffeePerClick').textContent = calculateCoffeePerClick().toFixed(1);
    document.getElementById('autoClick').textContent = calculateAutoClick().toFixed(1);

    document.getElementById('baristas').textContent = baristas;
    document.getElementById('baristasOwned').textContent = `${baristas} owned`;
    document.getElementById('baristaCost').textContent = baristaCost;

    document.getElementById('trucks').textContent = trucks;
    document.getElementById('trucksOwned').textContent = `${trucks} owned`;
    document.getElementById('truckCost').textContent = truckCost;

    document.getElementById('espressoMachines').textContent = espressoMachines;
    document.getElementById('espressoOwned').textContent = `${espressoMachines} owned`;
    document.getElementById('espressoCost').textContent = espressoCost;
    document.getElementById('espressoOwnedRight').textContent = `${espressoMachines} owned`;
    document.getElementById('espressoCostRight').textContent = espressoCost;

    document.getElementById('pourOverOwned').textContent = `${pourOverSetups} owned`;
    document.getElementById('pourOverCost').textContent = pourOverCost;

    document.getElementById('filterOwned').textContent = `${filterSetups} owned`;
    document.getElementById('filterCost').textContent = filterCost;

    document.getElementById('coldBrewOwned').textContent = `${coldBrewSetups} owned`;
    document.getElementById('coldBrewCost').textContent = coldBrewCost;

    document.getElementById('upgradeCost').textContent = upgradeCost;
    document.getElementById('upgradeLevel').textContent = `Level ${upgradeLevel}`;

    document.getElementById('cafePoints').textContent = cafePoints;

    document.getElementById('espressoRate').textContent = (espressoMachines * brewingPassiveRates.espresso * cafePointMultiplier * (boostActive ? 2 : 1)).toFixed(1);
    document.getElementById('pourOverRate').textContent = (pourOverSetups * brewingPassiveRates.pourOver * cafePointMultiplier * (boostActive ? 2 : 1)).toFixed(1);
    document.getElementById('filterRate').textContent = (filterSetups * brewingPassiveRates.filter * cafePointMultiplier * (boostActive ? 2 : 1)).toFixed(1);
    document.getElementById('coldBrewRate').textContent = (coldBrewSetups * brewingPassiveRates.coldBrew * cafePointMultiplier * (boostActive ? 2 : 1)).toFixed(1);

    document.getElementById('buyBaristaBtn').disabled = coffees < baristaCost;
    document.getElementById('buyTruckBtn').disabled = coffees < truckCost;
    document.getElementById('buyEspressoMachineBtn').disabled = coffees < espressoCost;
    document.getElementById('buyEspressoBtnRight').disabled = coffees < espressoCost;
    document.getElementById('buyPourOverBtn').disabled = coffees < pourOverCost;
    document.getElementById('buyFilterBtn').disabled = coffees < filterCost;
    document.getElementById('buyColdBrewBtn').disabled = coffees < coldBrewCost;
    document.getElementById('buyUpgradeBtn').disabled = coffees < upgradeCost;
    document.getElementById('prestigeBtn').disabled = totalCoffeesBrewed < 10000;

    let boostBtn = document.getElementById('boostBtn');
    if (boostReady && !boostActive) {
      boostBtn.disabled = false;
      boostBtn.textContent = 'Activate Coffee Rush (Ready)';
    } else if (boostActive) {
      boostBtn.disabled = true;
      boostBtn.textContent = 'Coffee Rush Active!';
    } else {
      boostBtn.disabled = true;
      boostBtn.textContent = 'Coffee Rush (Cooldown)';
    }

    if (totalCoffeesBrewed >= 100 && !achievements.brew100) {
      document.getElementById('achievement1').innerHTML = 'Brew 100 Coffees: <span class="ach-unlocked">Unlocked!</span>';
      achievements.brew100 = true;
    }
    if (baristas >= 5 && !achievements.barista5) {
      document.getElementById('achievement2').innerHTML = 'Hire 5 Baristas: <span class="ach-unlocked">Unlocked!</span>';
      achievements.barista5 = true;
    }
    if (trucks >= 3 && !achievements.truck3) {
      document.getElementById('achievement3').innerHTML = 'Buy 3 Coffee Trucks: <span class="ach-unlocked">Unlocked!</span>';
      achievements.truck3 = true;
    }
    if (espressoMachines >= 2 && !achievements.espresso2) {
      document.getElementById('achievement4').innerHTML = 'Buy 2 Espresso Machines: <span class="ach-unlocked">Unlocked!</span>';
      achievements.espresso2 = true;
    }
    if (!achievements.boost1 && !boostReady) {
      document.getElementById('achievement5').innerHTML = 'Activate Coffee Rush Boost: <span class="ach-unlocked">Unlocked!</span>';
      achievements.boost1 = true;
    }
    if (totalCoffeesBrewed >= 10000 && !achievements.brew10000) {
      document.getElementById('achievement6').innerHTML = 'Reach 10,000 Total Coffees Brewed: <span class="ach-unlocked">Unlocked!</span>';
      achievements.brew10000 = true;
      document.getElementById('prestigeBtn').disabled = false;
    }
    if (cafePoints > 0 && !achievements.prestige1) {
      document.getElementById('achievement7').innerHTML = 'Prestige for the first time: <span class="ach-unlocked">Unlocked!</span>';
      achievements.prestige1 = true;
    }
    if (espressoMachines > 0 && pourOverSetups > 0 && filterSetups > 0 && coldBrewSetups > 0 && !achievements.allBrewingMethods) {
      document.getElementById('achievement8').innerHTML = 'Unlock all Brewing Methods: <span class="ach-unlocked">Unlocked!</span>';
      achievements.allBrewingMethods = true;
    }
  }

  document.getElementById('coffee-btn').onclick = function () {
    let earned = calculateCoffeePerClick();
    coffees += earned;
    totalCoffeesBrewed += earned;
    updateDisplay();
  };

  document.getElementById('buyBaristaBtn').onclick = function () {
    if (coffees >= baristaCost) {
      coffees -= baristaCost;
      baristas += 1;
      baristaCost = Math.floor(baristaCost * 1.55);
      updateDisplay();
    }
  };

  document.getElementById('buyTruckBtn').onclick = function () {
    if (coffees >= truckCost) {
      coffees -= truckCost;
      trucks += 1;
      truckCost = Math.floor(truckCost * 1.6);
      updateDisplay();
    }
  };

  function buyEspresso() {
    if (coffees >= espressoCost) {
      coffees -= espressoCost;
      espressoMachines += 1;
      espressoCost = Math.floor(espressoCost * 1.75);
      updateDisplay();
    }
  }

  document.getElementById('buyEspressoMachineBtn').onclick = buyEspresso;
  document.getElementById('buyEspressoBtnRight').onclick = buyEspresso;

  document.getElementById('buyPourOverBtn').onclick = function () {
    if (coffees >= pourOverCost) {
      coffees -= pourOverCost;
      pourOverSetups += 1;
      pourOverCost = Math.floor(pourOverCost * 1.75);
      updateDisplay();
    }
  };

  document.getElementById('buyFilterBtn').onclick = function () {
    if (coffees >= filterCost) {
      coffees -= filterCost;
      filterSetups += 1;
      filterCost = Math.floor(filterCost * 1.8);
      updateDisplay();
    }
  };

  document.getElementById('buyColdBrewBtn').onclick = function () {
    if (coffees >= coldBrewCost) {
      coffees -= coldBrewCost;
      coldBrewSetups += 1;
      coldBrewCost = Math.floor(coldBrewCost * 1.8);
      updateDisplay();
    }
  };

  document.getElementById('buyUpgradeBtn').onclick = function () {
    if (coffees >= upgradeCost) {
      coffees -= upgradeCost;
      upgradeLevel += 1;
      coffeePerClick += upgradeLevel;
      upgradeCost = Math.floor(upgradeCost * 2.2);
      updateDisplay();
    }
  };

  document.getElementById('prestigeBtn').onclick = function () {
    if (totalCoffeesBrewed >= 10000) {
      let pointsGained = Math.floor(Math.sqrt(totalCoffeesBrewed / 1000));
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

      espressoMachines = 0;
      espressoCost = 1000;

      pourOverSetups = 0;
      pourOverCost = 2000;

      filterSetups = 0;
      filterCost = 3500;

      coldBrewSetups = 0;
      coldBrewCost = 5000;

      upgradeCost = 100;

      updateDisplay();
    }
  };

  document.getElementById('boostBtn').onclick = function () {
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

  setInterval(function () {
    let passiveCoffee =
      (baristas * 1) +
      (trucks * 2) +
      (espressoMachines * brewingPassiveRates.espresso) +
      (pourOverSetups * brewingPassiveRates.pourOver) +
      (filterSetups * brewingPassiveRates.filter) +
      (coldBrewSetups * brewingPassiveRates.coldBrew);

    passiveCoffee *= cafePointMultiplier;
    if (boostActive) passiveCoffee *= 2;

    coffees += passiveCoffee;
    totalCoffeesBrewed += passiveCoffee;
    updateDisplay();
  }, 1000);

  // Export/Import save functions

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
    const jsonStr = JSON.stringify(saveData);
    return btoa(encodeURIComponent(jsonStr));
  }

  function importSave(encodedStr) {
    try {
      const jsonStr = decodeURIComponent(atob(encodedStr));
      const gameState = JSON.parse(jsonStr);

      coffees = gameState.coffees ?? coffees;
      totalCoffeesBrewed = gameState.totalCoffeesBrewed ?? totalCoffeesBrewed;
      coffeePerClick = gameState.coffeePerClick ?? coffeePerClick;
      upgradeLevel = gameState.upgradeLevel ?? upgradeLevel;
      baristas = gameState.baristas ?? baristas;
      baristaCost = gameState.baristaCost ?? baristaCost;
      trucks = gameState.trucks ?? trucks;
      truckCost = gameState.truckCost ?? truckCost;
      espressoMachines = gameState.espressoMachines ?? espressoMachines;
      espressoCost = gameState.espressoCost ?? espressoCost;
      pourOverSetups = gameState.pourOverSetups ?? pourOverSetups;
      pourOverCost = gameState.pourOverCost ?? pourOverCost;
      filterSetups = gameState.filterSetups ?? filterSetups;
      filterCost = gameState.filterCost ?? filterCost;
      coldBrewSetups = gameState.coldBrewSetups ?? coldBrewSetups;
      coldBrewCost = gameState.coldBrewCost ?? coldBrewCost;
      upgradeCost = gameState.upgradeCost ?? upgradeCost;
      cafePoints = gameState.cafePoints ?? cafePoints;
      achievements = gameState.achievements ?? achievements;

      cafePointMultiplier = 1 + cafePoints * 0.1;

      updateDisplay();
      alert('Save imported successfully!');
    } catch (e) {
      alert('Invalid save data! Please check your input.');
    }
  }

  document.getElementById('exportBtn').onclick = function () {
    const saveHash = exportSave();
    const textarea = document.getElementById('importExportArea');
    textarea.value = saveHash;
    textarea.select();
    document.execCommand('copy');
    alert('Save exported and copied to clipboard! You can paste and store it anywhere.');
  };

  document.getElementById('importBtn').onclick = function () {
    const textarea = document.getElementById('importExportArea');
    const saveString = textarea.value.trim();
    if (saveString.length > 0) {
      importSave(saveString);
    } else {
      alert('Please paste your save data in the textarea to import.');
    }
  };

  updateDisplay();
});
