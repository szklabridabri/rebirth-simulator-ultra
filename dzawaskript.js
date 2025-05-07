      let state = {
      points: 0,
      baseEarning: 1,
      earningMultiplier: 1,
      rebirthLevel: 0,
      pets: [],
      baseRebirthCost: 10,
      baseEgg1Cost: 10,
      baseEgg2Cost: 20
    };

    const difficultyFactor = 1.3; // jak mocno rosną koszty

    const petData = {
      egg1: [
        { name: "Pies", chance: 0.6, multiplier: 1.3 },
        { name: "Kot", chance: 0.9, multiplier: 1.4 },
        { name: "Smok", chance: 1.0, multiplier: 1.6 }
      ],
      egg2: [
        { name: "Ryba", chance: 0.5, multiplier: 1.5 },
        { name: "Wąż", chance: 0.85, multiplier: 1.7 },
        { name: "Krokodyl", chance: 0.95, multiplier: 2.0 },
        { name: "Żółw", chance: 1.0, multiplier: 2.5 }
      ]
    };

    // Elementy
    const pointsEl = document.getElementById("points");
    const earningEl = document.getElementById("earning");
    const rebirthLevelEl = document.getElementById("rebirthLevel");
    const rebirthBtn = document.getElementById("rebirthBtn");
    const rebirthCostEl = document.getElementById("rebirthCost");
    const egg1Btn = document.getElementById("egg1Btn");
    const egg2Btn = document.getElementById("egg2Btn");
    const egg1CostEl = document.getElementById("egg1Cost");
    const egg2CostEl = document.getElementById("egg2Cost");
    const eggResult = document.getElementById("eggResult");

    // Oblicz aktualne mnożenie zarobków
    function getTotalEarning() {
      return state.baseEarning + state.earningMultiplier;
    }

    function getScaledCost(baseCost) {
      return Math.floor(baseCost * Math.pow(getTotalEarning() * 1.1, difficultyFactor));
    }

    // Aktualizacja UI
    function updateUI() {
      pointsEl.textContent = Math.floor(state.points);
      earningEl.textContent = getTotalEarning().toFixed(2);
      rebirthLevelEl.textContent = state.rebirthLevel;
      rebirthCostEl.textContent = getScaledCost(state.baseRebirthCost);
      egg1CostEl.textContent = getScaledCost(state.baseEgg1Cost);
      egg2CostEl.textContent = getScaledCost(state.baseEgg2Cost);
    }

    // Zapis i odczyt
    function save() {
      localStorage.setItem("rebirthGameSave", JSON.stringify(state));
    }

    function remove() {
        localStorage.removeItem("rebirthGameSave")
    }

    function load() {
      const saved = localStorage.getItem("rebirthGameSave");
      if (saved) {
        state = JSON.parse(saved);
        updateUI();
      }
    }

    // Klikanie
    document.getElementById("clickBtn").onclick = () => {
      state.points += getTotalEarning();
      updateUI();
      save();
    };

    // Rebirth
    rebirthBtn.onclick = () => {
      const cost = getScaledCost(state.baseRebirthCost);
      if (state.points >= cost) {
        state.points -= cost;
        state.rebirthLevel++;
        state.baseEarning++;
        updateUI();
        save();
      }
    };

    // Funkcja losowania zwierzaka
    function hatchEgg(petList, eggBaseCost) {
      const cost = getScaledCost(eggBaseCost);
      if (state.points < cost) {
        eggResult.textContent = "Za mało punktów!";
        return;
      }

      state.points -= cost;

      const roll = Math.random();
      const pet = petList.find(p => roll <= p.chance);
      state.earningMultiplier += pet.multiplier;
      state.pets.push(pet.name);
      eggResult.textContent = `Zdobyto: ${pet.name}`; //(x${pet.multiplier})

      updateUI();
      save();
    }

    egg1Btn.onclick = () => hatchEgg(petData.egg1, state.baseEgg1Cost);
    egg2Btn.onclick = () => hatchEgg(petData.egg2, state.baseEgg2Cost);

    // Start
    load();
    updateUI();