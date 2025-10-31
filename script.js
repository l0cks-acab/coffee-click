let coffees = 0;
let coffeePerClick = 1;
let upgradeLevel = 1;

let baristas = 0;
let baristaCost = 50;

let trucks = 0;
let truckCost = 500;

let espressoMachines = 0;
let espressoCost = 750;

let upgradeCost = 100;

let achievements = {
  brew100: false,
  barista5: false,
  truck3: false,
  espresso2: false,
};

function updateDisplay() {
  document.getElementById('coffees').textContent = coffees;
  document.getElementById('coffeePerClick').textContent = coffeePerClick;
  document.getElementById('baristas').textContent = baristas;
  document.getElementById('baristasOwned').textContent = `${baristas} owned`;
  document.getElementById('baristaCost').textContent = baristaCost;

  document.getElementById('trucks').textContent = trucks;
  document.getElementById('trucksOwned').textContent = `${trucks} owned`;
  document.getElementById('truckCost').textContent = truckCost;

  document.getElementById('espressoOwned').textContent = `${espressoMachines} owned`;
  document.getElementById('espressoCost').textContent = espressoCost;

  document.getElementById('upgradeCost').textContent = upgradeCost;
  document.getElementById('upgradeLevel').textContent = `Level ${upgradeLevel}`;

  // Achievements unlock
  if (coffees >= 100 && !achievements.brew100) {
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

  // Disable upgrade buttons if not affordable
  document.getElementById('buyBaristaBtn').disabled = coffees < baristaCost;
  document.getElementById('buyTruckBtn').disabled = coffees < truckCost;
  document.getElementById('buyEspressoMachineBtn').disabled = coffees < espressoCost;
  document.getElementById('buyUpgradeBtn').disabled = coffees < upgradeCost;
}

document.getElementById('coffee-btn').onclick = function () {
  coffees += coffeePerClick;
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

document.getElementById('buyEspressoMachineBtn').onclick = function () {
  if (coffees >= espressoCost) {
    coffees -= espressoCost;
    espressoMachines += 1;
    espressoCost = Math.floor(espressoCost * 1.75);
    updateDisplay();
  }
};

document.getElementById('buyUpgradeBtn').onclick = function () {
  if (coffees >= upgradeCost) {
    coffees -= upgradeCost;
    upgradeLevel += 1;
    coffeePerClick += upgradeLevel * espressoMachines; // espresso machines multiply clicks
    upgradeCost = Math.floor(upgradeCost * 2.2);
    updateDisplay();
  }
};

// Automations:
// Baristas generate coffees per second automatically
// Trucks generate twice as many coffees per second automatically

setInterval(function () {
  coffees += baristas + trucks * 2;
  updateDisplay();
}, 1000);

updateDisplay();
