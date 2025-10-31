// combined_script_addons.js
document.addEventListener('DOMContentLoaded', () => {
  // Game variables
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

  // Quest system variables (merged)
  const QUEST_POOL = [
    { id: 'brew500', description: 'Brew 500 Coffees', type: 'brew', target: 500, reward: 5 },
    { id: 'brew1000', description: 'Brew 1000 Coffees', type: 'brew', target: 1000, reward: 10 },
    { id: 'hire10baristas', description: 'Hire 10 Baristas', type: 'hire', target: 10, reward: 10 },
    { id: 'hire20baristas', description: 'Hire 20 Baristas', type: 'hire', target: 20, reward: 20 },
    { id: 'prestigeOnce', description: 'Prestige Once', type: 'prestige', target: 1, reward: 15 },
    { id: 'buy5trucks', description: 'Buy 5 Coffee Trucks', type: 'buyTrucks', target: 5, reward: 12 },
    { id: 'buy3espresso', description: 'Buy 3 Espresso Machines', type: 'buyEspresso', target: 3, reward: 12 },
    { id: 'upgradeMachine', description: 'Upgrade Coffee Machine to Level 5', type: 'upgradeLevel', target: 5, reward: 8 },
    { id: 'brew10000', description: 'Brew 10,000 Coffees', type: 'brew', target: 10000, reward: 25 },
    { id: 'buyAllBrewing', description: 'Buy All Brewing Methods (1 each)', type: 'buyAllBrewing', target: 1, reward: 20 }
  ];

  let activeQuests = [];
  let completedQuests = [];
  let questDate = '';

  // Get quests container
  const questsContainer = document.getElementById('quests-container');

  // Utility to save everything
  function saveGame() {
    const data = {
      coffees, totalCoffeesBrewed, coffeePerClick, upgradeLevel,
      baristas, baristaCost, trucks, truckCost,
      espressoMachines, espressoCost,
      pourOverSetups, pourOverCost,
      filterSetups, filterCost,
      coldBrewSetups, coldBrewCost,
      upgradeCost, cafePoints,
      marketingLevel, marketingCost,
      achievements,
      prodBoostCount, prodBoostCost,
      costReduceCount, costReduceCost,
      automationUnlockCount, automationUnlockCost,
      automationEnabled,
      activeQuests,
      completedQuests,
      questDate,
    };
    try {
      const str = btoa(encodeURIComponent(JSON.stringify(data)));
      localStorage.setItem('cafeClickerSave', str);
      alert('Game saved successfully.');
    } catch (e) {
      alert('Failed to save game.');
      console.error(e);
    }
  }

  // Load save from localStorage
  function loadGame() {
    try {
      const str = localStorage.getItem('cafeClickerSave');
      if (!str) {
        alert('No save found.');
        return;
      }
      const data = JSON.parse(decodeURIComponent(atob(str)));
      // Assign data safely
      Object.assign(
        { coffees, totalCoffeesBrewed, coffeePerClick, upgradeLevel,
          baristas, baristaCost, trucks, truckCost,
          espressoMachines, espressoCost,
          pourOverSetups, pourOverCost,
          filterSetups, filterCost,
          coldBrewSetups, coldBrewCost,
          upgradeCost, cafePoints,
          marketingLevel, marketingCost,
          achievements,
          prodBoostCount, prodBoostCost,
          costReduceCount, costReduceCost,
          automationUnlockCount, automationUnlockCost,
          automationEnabled,
          activeQuests,
          completedQuests,
          questDate }
          , data
      );

      // assign back after Object.assign so variables update (workaround)
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
      prodBoostCount = data.prodBoostCount ?? prodBoostCount;
      prodBoostCost = data.prodBoostCost ?? prodBoostCost;
      costReduceCount = data.costReduceCount ?? costReduceCount;
      costReduceCost = data.costReduceCost ?? costReduceCost;
      automationUnlockCount = data.automationUnlockCount ?? automationUnlockCount;
      automationUnlockCost = data.automationUnlockCost ?? automationUnlockCost;
      automationEnabled = data.automationEnabled ?? automationEnabled;
      activeQuests = data.activeQuests ?? [];
      completedQuests = data.completedQuests ?? [];
      questDate = data.questDate ?? '';

      cafePointMultiplier = 1 + cafePoints * 0.1;

      updateDisplay();
      renderQuests();
      alert('Game loaded successfully.');
    } catch (e) {
      alert('Failed to load save.');
      console.error(e);
    }
  }

  // Calculate coffee per click with all multipliers
  function calculateCoffeePerClick() {
    return coffeePerClick * (1 + espressoMachines * 0.5) * cafePointMultiplier * (boostActive ? 2 : 1) * (1 + 0.01 * prodBoostCount);
  }

  // Calculate passive coffee per second
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

  // Update UI text safely
  function safeSetText(id, text) {
    const e = document.getElementById(id);
    if (e) e.textContent = text;
  }

  // Update all UI elements
  function updateDisplay() {
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

    // Update achievements...

    // Enable/Disable buttons depending on resources
  }

  function getReducedCost(baseCost) {
    const reduction = 0.02 * costReduceCount;
    return Math.ceil(baseCost * Math.max(0.5, 1 - reduction));
  }

  // Emoji explosion effect
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

      particle.addEventListener('animationend', () => particle.remove());
    }
  }

  // Game actions:
  // Wrapper for brewing coffee: integrates quest and UI update hooks
  window.brewCoffeeClick = (amount) => {
    coffees += amount;
    totalCoffeesBrewed += amount;
    window.coffees = coffees;
    window.totalCoffeesBrewed = totalCoffeesBrewed;
    updateDisplay();
    if (window.updateQuestProgress) window.updateQuestProgress('brew', amount);
  };

  // Hook brew button
  document.getElementById('coffee-btn').onclick = (e) => {
    createEmojiExplosion(e.clientX, e.clientY);
    const earned = calculateCoffeePerClick();
    window.brewCoffeeClick(earned);
  };

  // Purchase handlers with quest updates
  document.getElementById('buyBaristaBtn').onclick = () => {
    const cost = getReducedCost(baristaCost);
    if (coffees >= cost) {
      coffees -= cost;
      baristas++;
      baristaCost = Math.floor(baristaCost * 1.55);
      window.baristas = baristas;
      updateDisplay();
      if (window.updateQuestProgress) window.updateQuestProgress('hire', 1);
    }
  };

  // Similar purchase handlers for trucks, espresso, pour over, filter, cold brew ...

  // Automation toggles and interval for auto buying similar as before...

  // Save and load integration

  function exportSave() {
    const saveData = {
      coffees, totalCoffeesBrewed, coffeePerClick, upgradeLevel,
      baristas, baristaCost, trucks, truckCost,
      espressoMachines, espressoCost,
      pourOverSetups, pourOverCost,
      filterSetups, filterCost,
      coldBrewSetups, coldBrewCost,
      upgradeCost, cafePoints,
      marketingLevel, marketingCost,
      achievements,
      prodBoostCount, prodBoostCost,
      costReduceCount, costReduceCost,
      automationUnlockCount, automationUnlockCost,
      automationEnabled,
      activeQuests,
      completedQuests,
      questDate,
    };
    try {
      const str = btoa(encodeURIComponent(JSON.stringify(saveData)));
      return str;
    } catch {
      alert("Failed to export save.");
      return "";
    }
  }

  function importSave(encodedStr) {
    try {
      const data = JSON.parse(decodeURIComponent(atob(encodedStr)));
      Object.assign(window, data);
      coffees = data.coffees || 0;
      totalCoffeesBrewed = data.totalCoffeesBrewed || 0;
      coffeePerClick = data.coffeePerClick || 1;
      upgradeLevel = data.upgradeLevel || 1;
      baristas = data.baristas || 0;
      baristaCost = data.baristaCost || 50;
      trucks = data.trucks || 0;
      truckCost = data.truckCost || 500;
      espressoMachines = data.espressoMachines || 0;
      espressoCost = data.espressoCost || 1000;
      pourOverSetups = data.pourOverSetups || 0;
      pourOverCost = data.pourOverCost || 2000;
      filterSetups = data.filterSetups || 0;
      filterCost = data.filterCost || 3500;
      coldBrewSetups = data.coldBrewSetups || 0;
      coldBrewCost = data.coldBrewCost || 5000;
      upgradeCost = data.upgradeCost || 100;
      cafePoints = data.cafePoints || 0;
      marketingLevel = data.marketingLevel || 0;
      marketingCost = data.marketingCost || 500;
      achievements = data.achievements || {};
      prodBoostCount = data.prodBoostCount || 0;
      prodBoostCost = data.prodBoostCost || 1;
      costReduceCount = data.costReduceCount || 0;
      costReduceCost = data.costReduceCost || 1;
      automationUnlockCount = data.automationUnlockCount || 0;
      automationUnlockCost = data.automationUnlockCost || 3;
      automationEnabled = data.automationEnabled || automationEnabled;
      activeQuests = data.activeQuests || [];
      completedQuests = data.completedQuests || [];
      questDate = data.questDate || "";
      cafePointMultiplier = 1 + cafePoints * 0.1;

      updateDisplay();
      renderQuests();
      alert('Game loaded successfully!');
    } catch {
      alert('Failed to import save data.');
    }
  }

  // Export/import buttons handlers
  document.getElementById('exportBtn').onclick = () => {
    const saveStr = exportSave();
    const textarea = document.getElementById('importExportArea');
    if (saveStr) {
      textarea.value = saveStr;
      textarea.select();
      document.execCommand('copy');
      alert('Save exported and copied to clipboard.');
    }
  };

  document.getElementById('importBtn').onclick = () => {
    const val = document.getElementById('importExportArea').value.trim();
    if (val.length > 0) {
      importSave(val);
    } else {
      alert('Please paste save data into the text box to import.');
    }
  };

  // Quest functions (imported from addon merged here)

  // Initialize quests with daily reset
  function initializeDailyQuests() {
    const today = new Date().toISOString().split('T')[0];
    if (questDate !== today || activeQuests.length === 0) {
      completedQuests = {};
      const shuffled = QUEST_POOL.sort(() => 0.5 - Math.random());
      activeQuests = shuffled.slice(0,5).map(q => ({ ...q, progress: 0, accepted: false, claimed: false }));
      questDate = today;
    }
    renderQuests();
  }

  // Save quests in main save via global variables
  function saveQuestsData() {
    // called implicitly in saveGame or exportSave
  }

  // Update quest progress on relevant actions
  window.updateQuestProgress = (type, amount) => {
    let updated = false;
    activeQuests.forEach(q => {
      if (q.accepted && !q.claimed) {
        switch(q.type) {
          case 'prestige':
            if (type === 'prestige' && amount >= q.target) { q.progress = q.target; updated = true; }
            break;
          case 'hire':
            if (type === 'hire') { q.progress = Math.min(q.progress + amount, q.target); updated = true; }
            break;
          case 'brew':
            if (type === 'brew') { q.progress = Math.min(q.progress + amount, q.target); updated = true; }
            break;
          case 'buyTrucks':
            if (type === 'buyTrucks') { q.progress = Math.min(q.progress + amount, q.target); updated = true; }
            break;
          case 'buyEspresso':
            if (type === 'buyEspresso') { q.progress = Math.min(q.progress + amount, q.target); updated = true; }
            break;
          case 'upgradeLevel':
            if (type === 'upgradeLevel' && amount >= q.target) { q.progress = q.target; updated = true; }
            break;
          case 'buyAllBrewing':
            if (type === 'buyAllBrewing') {
              const haveAll = espressoMachines > 0 && pourOverSetups > 0 && filterSetups > 0 && coldBrewSetups > 0;
              if (haveAll) {
                q.progress = q.target;
                updated = true;
              }
            }
            break;
        }
      }
    });
    if (updated) {
      renderQuests();
    }
  };

  function acceptQuest(id) {
    const quest = activeQuests.find(q => q.id === id);
    if (quest && !quest.accepted) {
      quest.accepted = true;
      renderQuests();
    }
  }

  function claimQuest(id) {
    const quest = activeQuests.find(q => q.id === id);
    if (quest && quest.accepted && !quest.claimed && quest.progress >= quest.target) {
      quest.claimed = true;
      completedQuests[quest.id] = true;
      cafePoints += quest.reward;
      if (typeof updateDisplay === 'function') updateDisplay();
      renderQuests();
      alert(`Quest "${quest.description}" completed! You earned ${quest.reward} Cafe Points.`);
    }
  }

  function renderQuests() {
    const questsContainer = document.getElementById('quests-container');
    if (!questsContainer) return;
    questsContainer.innerHTML = '';
    activeQuests.forEach(quest => {
      if (completedQuests[quest.id]) return;
      const questDiv = document.createElement('div');
      questDiv.className = 'quest';
      questDiv.style.marginBottom = '10px';
      questDiv.style.border = '1px solid var(--surface1)';
      questDiv.style.padding = '8px';
      questDiv.style.borderRadius = '8px';
      questDiv.style.backgroundColor = quest.accepted ? 'var(--surface0)' : 'var(--surface1)';
      const desc = document.createElement('div');
      desc.textContent = quest.description;
      desc.style.fontWeight = '600';
      questDiv.appendChild(desc);
      const prog = document.createElement('div');
      prog.textContent = `Progress: ${quest.progress} / ${quest.target}`;
      questDiv.appendChild(prog);
      if (!quest.accepted) {
        const acceptBtn = document.createElement('button');
        acceptBtn.textContent = 'Accept Quest';
        acceptBtn.className = 'upgrade-btn';
        acceptBtn.style.marginTop = '6px';
        acceptBtn.onclick = () => acceptQuest(quest.id);
        questDiv.appendChild(acceptBtn);
      } else if (quest.progress >= quest.target && !quest.claimed) {
        const claimBtn = document.createElement('button');
        claimBtn.textContent = 'Claim Reward';
        claimBtn.className = 'upgrade-btn';
        claimBtn.style.marginTop = '6px';
        claimBtn.onclick = () => claimQuest(quest.id);
        questDiv.appendChild(claimBtn);
      }
      questsContainer.appendChild(questDiv);
    });
    if (questsContainer.innerHTML === '') {
      questsContainer.textContent = 'No quests available today. Check back tomorrow!';
    }
  }

  // Initialize quests and update display on start
  initializeDailyQuests();
  updateDisplay();

  // Passive coffee generation loop
  setInterval(() => {
    const passive =
      baristas * 1 +
      trucks * 2 +
      espressoMachines * brewingPassiveRates.espresso +
      pourOverSetups * brewingPassiveRates.pourOver +
      filterSetups * brewingPassiveRates.filter +
      coldBrewSetups * brewingPassiveRates.coldBrew;
    const finalPassive = passive * cafePointMultiplier * (boostActive ? 2 : 1) * (1 + 0.01 * prodBoostCount);
    coffees += finalPassive;
    totalCoffeesBrewed += finalPassive;
    updateDisplay();
  }, 1000);
});
