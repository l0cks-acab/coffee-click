(() => {
  let dailyMissionTarget = 1000;
  let dailyMissionProgress = 0;
  const dailyMissionReward = 5;

  let miniChallengeActive = false;
  let miniChallengeTarget = 500;
  let miniChallengeTimeLimit = 60000;
  let miniChallengeProgress = 0;
  let miniChallengeTimer = null;
  const miniChallengeReward = 10;

  const dailyMissionText = document.getElementById('dailyMissionText');
  const miniChallengeText = document.getElementById('miniChallengeText');
  const startMiniChallengeBtn = document.getElementById('startMiniChallengeBtn');

  if (dailyMissionText) {
    dailyMissionText.textContent = `Daily Mission: Brew ${dailyMissionTarget} coffees. Progress: 0`;
  }
  if (miniChallengeText) {
    miniChallengeText.textContent = `Mini Challenge: Brew ${miniChallengeTarget} coffees in ${miniChallengeTimeLimit/1000} seconds. Not started.`;
  }

  function updateDailyMissionProgress(amount) {
    dailyMissionProgress += amount;
    if (dailyMissionText) {
      dailyMissionText.textContent = `Daily Mission: Brew ${dailyMissionTarget} coffees. Progress: ${Math.min(dailyMissionProgress, dailyMissionTarget)}`;
    }
    if (dailyMissionProgress >= dailyMissionTarget) {
      alert(`Daily Mission complete! You earned ${dailyMissionReward} Cafe Points!`);
      window.cafePoints = (window.cafePoints || 0) + dailyMissionReward;
      dailyMissionProgress = 0;
      if (dailyMissionText) {
        dailyMissionText.textContent = `Daily Mission: Brew ${dailyMissionTarget} coffees. Progress: 0`;
      }
      if (typeof window.updateDisplay === 'function') window.updateDisplay();
    }
  }

  function startMiniChallenge() {
    if (miniChallengeActive) return;
    miniChallengeActive = true;
    miniChallengeProgress = 0;
    if (miniChallengeText) miniChallengeText.textContent = `Mini Challenge: Brew ${miniChallengeTarget} coffees in ${miniChallengeTimeLimit/1000} seconds. Progress: 0`;
    if (startMiniChallengeBtn) startMiniChallengeBtn.disabled = true;

    miniChallengeTimer = setTimeout(() => {
      miniChallengeActive = false;
      if (miniChallengeProgress >= miniChallengeTarget) {
        alert('Mini Challenge Success! You earned ' + miniChallengeReward + ' Cafe Points!');
        window.cafePoints = (window.cafePoints || 0) + miniChallengeReward;
      } else {
        alert('Mini Challenge Failed! Try again tomorrow.');
      }
      if (typeof window.updateDisplay === 'function') window.updateDisplay();
      if (miniChallengeText) miniChallengeText.textContent = `Mini Challenge: Brew ${miniChallengeTarget} coffees in ${miniChallengeTimeLimit/1000} seconds. Not started.`;
      if (startMiniChallengeBtn) startMiniChallengeBtn.disabled = false;
    }, miniChallengeTimeLimit);
  }

  const originalBrewCoffeeClick = window.brewCoffeeClick || function(amount){};
  window.brewCoffeeClick = function(amount) {
    updateDailyMissionProgress(amount);
    if (miniChallengeActive) {
      miniChallengeProgress += amount;
      if (miniChallengeText) miniChallengeText.textContent = `Mini Challenge: Brew ${miniChallengeTarget} coffees in ${miniChallengeTimeLimit/1000} seconds. Progress: ${Math.min(miniChallengeProgress, miniChallengeTarget)}`;
      if (miniChallengeProgress >= miniChallengeTarget) {
        clearTimeout(miniChallengeTimer);
        miniChallengeTimer = null;
        miniChallengeActive = false;
        alert('Mini Challenge Success! You earned ' + miniChallengeReward + ' Cafe Points!');
        window.cafePoints = (window.cafePoints || 0) + miniChallengeReward;
        if (typeof window.updateDisplay === 'function') window.updateDisplay();
        if (miniChallengeText) miniChallengeText.textContent = `Mini Challenge: Brew ${miniChallengeTarget} coffees in ${miniChallengeTimeLimit/1000} seconds. Not started.`;
        if (startMiniChallengeBtn) startMiniChallengeBtn.disabled = false;
      }
    }
    originalBrewCoffeeClick(amount);
  };

  if (startMiniChallengeBtn) {
    startMiniChallengeBtn.onclick = () => { startMiniChallenge(); };
  }
})();
