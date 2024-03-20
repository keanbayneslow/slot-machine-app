const SYMBOLS_COUNT = {
    A: 6,
    B: 10,
    C: 14,
    D: 20,
  };
  
  const SYMBOL_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
  };
  
  const balanceDisplay = document.getElementById("balance");
  const betInput = document.getElementById("betInput");
  const linesInput = document.getElementById("linesInput");
  const reelsContainer = document.getElementById("reels");
  const resultDisplay = document.getElementById("resultDisplay");
  const spinButton = document.getElementById("spinButton");
  
  let balance = parseFloat(balanceDisplay.textContent);
  
  const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
      for (let i = 0; i < count; i++) {
        symbols.push(symbol);
      }
    }
  
    const reels = [];
    for (let i = 0; i < 3; i++) {
      reels.push([]);
      const reelSymbols = [...symbols];
      for (let j = 0; j < 3; j++) {
        const randomIndex = Math.floor(Math.random() * reelSymbols.length);
        const selectedSymbol = reelSymbols[randomIndex];
        reels[i].push(selectedSymbol);
        reelSymbols.splice(randomIndex, 1);
      }
    }
    return reels;
  };
  
  const printReels = (reels) => {
  reelsContainer.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    const reelContainer = document.createElement("div");
    reelContainer.classList.add("reel");
    for (let j = 0; j < 3; j++) {
      const reelElement = document.createElement("div");
      reelElement.textContent = reels[j][i];
      reelContainer.appendChild(reelElement);
    }
    reelsContainer.appendChild(reelContainer);
  }
};
  
  const getWinnings = (reels, bet, lines) => {
    let winnings = 0;
  
    for (let row = 0; row < lines; row++) {
      const symbols = reels[row];
      let allSame = true;
  
      for (const symbol of symbols) {
        if (symbol != symbols[0]) {
          allSame = false;
          break;
        }
      }
  
      if (allSame) {
        winnings += bet * SYMBOL_VALUES[symbols[0]];
      }
    }
  
    return winnings;
  };
  
  const animateResult = (reels, winnings) => {
    let counter = 0;
    const interval = setInterval(() => {
      const tempReels = spin();
      printReels(tempReels);
      counter++;
      if (counter === 10) {
        clearInterval(interval);
        printReels(reels);
        resultDisplay.textContent = "You won: $" + winnings.toFixed(2);
      }
    }, 100);
  };
  
  spinButton.addEventListener("click", () => {
    const bet = parseFloat(betInput.value);
    const lines = parseInt(linesInput.value);
    const totalBet = bet * lines;
  
    if (balance < totalBet) {
      resultDisplay.textContent = "Insufficient balance!";
      return;
    }
  
    balance -= totalBet;
  
    const reels = spin();
    const winnings = getWinnings(reels, bet, lines); // Calculate winnings
    balance += winnings; // Add winnings to the balance
    animateResult(reels, winnings);
  
    balanceDisplay.textContent = balance.toFixed(2);
  
    if (balance <= 0) {
      resultDisplay.textContent = "You ran out of money!";
      spinButton.disabled = true;
    }
  });
  
