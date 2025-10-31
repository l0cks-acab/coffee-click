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

// Update UI display
function updateDisplay() {
  document.getElementById('coffees').textContent = Math.floor(coffees);
  document.getElementById('coffeePerClick').textContent = coffeePerClick * cafePointMultiplier * (boostActive ? 2 : 1);
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

  // Passive rates display
  document.getElementById('espressoRate').textContent = (espressoMachines * 1.5 * cafePointMultiplier * (boostActive ? 2 : 1)).toFixed(1);
  document.getElementById('pourOverRate').textContent = (pourOverSetups * 2.5 * cafePointMultiplier * (boostActive ? 2 : 1)).toFixed(1);
  document.getElementById('filterRate').textContent = (filterSetups * 4 * cafePointMultiplier * (boostActive ? 2 : 1)).toFixed(1);
  document.getElementById('coldBrewRate').textContent = (coldBrewSetups * 6 * cafePointMultiplier * (boostActive ? 2 : 1)).toFixed(1);

  // Button enable/disable based on affordability
  document.getElementById('buyBaristaBtn').disabled = coffees < baristaCost;
  document.getElementById('buyTruckBtn').disabled = coffees < truckCost;
  document.getElementById('buyEspressoMachineBtn').disabled = coffees < espressoCost;
  document.getElementById('buyEspressoBtnRight').disabled = coffees < espressoCost;  
  document.getElementById('buyPourOverBtn').disabled = coffees < pourOverCost;
  document.getElementById('buyFilterBtn').disabled = coffees < filterCost;
  document.getElementById('buyColdBrewBtn').disabled = coffees < coldBrewCost;
  document.getElementById('buyUpgradeBtn').disabled = coffees < upgradeCost;
  document.getElementById('prestigeBtn').disabled = totalCoffeesBrewed < 10000;

  // Boost button cooldown
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

  // Achievements unlock
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

function calculateCoffeePerClick() {
  return coffeePerClick * (1 + espressoMachines * 0.5) * cafePointMultiplier * (boostActive ? 2 : 1);
}

// Brewing methods passive rates per unit (coffees per second)
const brewingPassiveRates = {
  espresso: 1.5,
  pourOver: 2.5,
  filter: 4,
  coldBrew: 6,
};

// Event handlers

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

// Espresso buy handlers for both buttons (main and right panel)
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

// Prestige/reset system
document.getElementById('prestigeBtn').onclick = function () {
  if (totalCoffeesBrewed >= 10000) {
    // Calculate cafe points gained on prestige: sqrt of total coffees / 1000 for balance:
    let pointsGained = Math.floor(Math.sqrt(totalCoffeesBrewed / 1000));
    cafePoints += pointsGained;
    cafePointMultiplier = 1 + cafePoints * 0.1;

    // Reset game state (except cafe points)
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

// Boost logic: Coffee Rush - times 2 production for 30 seconds, 90 seconds cooldown
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

// Periodic auto coffee generation - 1s interval
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

// Persistence
function saveGame() {
  const gameState = {
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
  localStorage.setItem('cafeClickerSave', JSON.stringify(gameState));
}

function loadGame() {
  const saved = localStorage.getItem('cafeClickerSave');
  if (saved) {
    const gameState = JSON.parse(saved);
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
  }
  updateDisplay();
}

setInterval(saveGame, 10000);
window.addEventListener('beforeunload', saveGame);

loadGame();
