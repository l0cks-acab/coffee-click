(() => {
  // Quest definitions pool
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

  // Active quests and completed quests stored locally
  let activeQuests = [];
  let completedQuests = {};

  const questsContainer = document.getElementById('quests-container');

  function initializeDailyQuests() {
    const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem('questDate');
    if (storedDate !== today) {
      // New day: pick 5 random unique quests
      activeQuests = [];
      completedQuests = {};
      const shuffled = QUEST_POOL.sort(() => 0.5 - Math.random());
      activeQuests = shuffled.slice(0, 5).map(q => ({ ...q, progress: 0, accepted: false, claimed: false }));
      localStorage.setItem('activeQuests', JSON.stringify(activeQuests));
      localStorage.setItem('completedQuests', JSON.stringify(completedQuests));
      localStorage.setItem('questDate', today);
    } else {
      // Load stored quests
      const saved = localStorage.getItem('activeQuests');
      const completed = localStorage.getItem('completedQuests');
      activeQuests = saved ? JSON.parse(saved) : [];
      completedQuests = completed ? JSON.parse(completed) : {};
    }
    renderQuests();
  }

  function saveQuests() {
    localStorage.setItem('activeQuests', JSON.stringify(activeQuests));
    localStorage.setItem('completedQuests', JSON.stringify(completedQuests));
  }

  function updateQuestProgress(type, amount) {
    let updated = false;
    activeQuests.forEach(q => {
      if (q.accepted && !q.claimed) {
        switch (q.type) {
          case 'prestige':
            if (type === 'prestige' && amount >= q.target) {
              q.progress = q.target;
              updated = true;
            }
            break;
          case 'hire':
            if (type === 'hire') {
              q.progress = Math.min(q.progress + amount, q.target);
              updated = true;
            }
            break;
          case 'brew':
            if (type === 'brew') {
              q.progress = Math.min(q.progress + amount, q.target);
              updated = true;
            }
            break;
          case 'buyTrucks':
            if (type === 'buyTrucks') {
              q.progress = Math.min(q.progress + amount, q.target);
              updated = true;
            }
            break;
          case 'buyEspresso':
            if (type === 'buyEspresso') {
              q.progress = Math.min(q.progress + amount, q.target);
              updated = true;
            }
            break;
          case 'upgradeLevel':
            if (type === 'upgradeLevel' && amount >= q.target) {
              q.progress = q.target;
              updated = true;
            }
            break;
          case 'buyAllBrewing':
            if (type === 'buyAllBrewing') {
              q.progress = amount >= q.target ? q.target : q.progress;
              updated = true;
            }
            break;
          default:
            break;
        }
      }
    });
    if (updated) {
      saveQuests();
      renderQuests();
    }
  }

  function acceptQuest(id) {
    const quest = activeQuests.find(q => q.id === id);
    if (quest && !quest.accepted) {
      quest.accepted = true;
      saveQuests();
      renderQuests();
    }
  }

  function claimQuest(id) {
    const quest = activeQuests.find(q => q.id === id);
    if (quest && quest.accepted && !quest.claimed && quest.progress >= quest.target) {
      quest.claimed = true;
      completedQuests[quest.id] = true;
      window.cafePoints = (window.cafePoints || 0) + quest.reward;
      saveQuests();
      if (typeof window.updateDisplay === 'function') window.updateDisplay();
      renderQuests();
      alert(`Quest "${quest.description}" completed! You earned ${quest.reward} Cafe Points.`);
    }
  }

  function renderQuests() {
    if (!questsContainer) return;

    questsContainer.innerHTML = '';
    activeQuests.forEach(quest => {
      if (completedQuests[quest.id]) return; // skip claimed quests

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

      const progress = document.createElement('div');
      progress.textContent = `Progress: ${quest.progress} / ${quest.target}`;
      questDiv.appendChild(progress);

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

  // Expose the quest progress updater
  window.updateQuestProgress = updateQuestProgress;

  // Initialize quests on page load
  initializeDailyQuests();
})();
