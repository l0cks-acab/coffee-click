let coffees = 0;
let coffeePerClick = 1;
let upgradeLevel = 1;
let baristas = 0;
let baristaCost = 50;
let upgradeCost = 100;
let achievements = { brew100: false, barista5: false };

function updateDisplay() {
  document.getElementById('coffees').textContent = coffees;
  document.getElementById('coffeePerClick').textContent = coffeePerClick;
  document.getElementById('baristas').textContent = baristas;
  document.getElementById('baristasOwned').textContent = `${baristas} owned`;
  document.getElementById('baristaCost').textContent = baristaCost;
  document.getElementById('upgradeCost').textContent = upgradeCost;
  document.getElementById('upgradeLevel').textContent = `Level ${upgradeLevel}`;
  if (coffees >= 100 && !achievements.brew100) {
    document.getElementById('achievement1').innerHTML = 'Brew 100 Coffees: <span class="ach-unlocked">Unlocked!</span>';
    achievements.brew100 = true;
  }
  if (baristas >= 5 && !achievements.barista5) {
    document.getElementById('achievement2').innerHTML = 'Hire 5 Baristas: <span class="ach-unlocked">Unlocked!</span>';
    achievements.barista5 = true;
  }
}

document.getElementById('coffee-btn').onclick = function() {
  coffees += coffeePerClick;
  updateDisplay();
};

document.getElementById('buyBaristaBtn').onclick = function() {
  if (coffees >= baristaCost) {
    coffees -= baristaCost;
    baristas += 1;
    baristaCost = Math.floor(baristaCost * 1.55);
    updateDisplay();
  }
};

document.getElementById('buyUpgradeBtn').onclick = function() {
  if (coffees >= upgradeCost) {
    coffees -= upgradeCost;
    upgradeLevel += 1;
    coffeePerClick += upgradeLevel;
    upgradeCost = Math.floor(upgradeCost * 2.2);
    updateDisplay();
  }
};

// Baristas auto-brew coffees
setInterval(function() {
  coffees += baristas;
  updateDisplay();
}, 1000);

updateDisplay();
