const emojiByChoice = {
  камень: "✊",
  ножницы: "✌️",
  бумага: "✋",
};

// Кого бьёт каждый ход
const beats = {
  камень: "ножницы",
  ножницы: "бумага",
  бумага: "камень",
};

// Объяснение по ходу победителя
const explanations = {
  камень: "Камень бьёт ножницы.",
  ножницы: "Ножницы режут бумагу.",
  бумага: "Бумага накрывает камень.",
};

const phrases = {
  win: ["Есть очко!", "Отлично!", "Красиво!", "Так держать!"],
  lose: ["Ой!", "Не повезло!", "Компьютер в ударе!", "Почти!"],
  draw: [
    "Ничья! Мысли сходятся.",
    "Ничья! Ещё раз?",
    "Ничья! Компьютер читает мысли?",
  ],
};

// Каждая нота: [частота в герцах, через сколько секунд начать, длительность]
const sounds = {
  tick: [
    [660, 0, 0.06],
    [660, 0.25, 0.06],
  ],
  win: [
    [523, 0, 0.12],
    [659, 0.1, 0.12],
    [784, 0.2, 0.2],
  ],
  lose: [
    [392, 0, 0.15],
    [311, 0.15, 0.3],
  ],
  draw: [
    [440, 0, 0.1],
    [440, 0.15, 0.1],
  ],
  victory: [
    [523, 0, 0.15],
    [659, 0.15, 0.15],
    [784, 0.3, 0.15],
    [1047, 0.45, 0.5],
  ],
  defeat: [
    [392, 0, 0.2],
    [370, 0.2, 0.2],
    [349, 0.4, 0.2],
    [330, 0.6, 0.6],
  ],
};

const confettiColors = ["#34d399", "#fbbf24", "#fb7185", "#60a5fa", "#a78bfa", "#ffffff"];

function getComputerChoice() {
  const randomNumber = Math.floor(Math.random() * 3);
  if (randomNumber === 0) {
    return "бумага";
  } else if (randomNumber === 1) {
    return "ножницы";
  } else {
    return "камень";
  }
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function completeGame(humanScore, computerScore) {
  if (humanScore > computerScore) {
    return "Ты победил компьютер!";
  } else {
    return "Компьютер тебя обыграл, не расстраивайся, такова сила рандома!";
  }
}

function restartAnimation(element, className) {
  element.classList.remove(className);
  // Чтение offsetWidth заставляет браузер применить удаление класса,
  // иначе при повторном добавлении анимация не начнётся заново
  void element.offsetWidth;
  element.classList.add(className);
}

function launchConfetti() {
  const container = document.createElement("div");
  container.className = "confetti";

  for (let i = 0; i < 80; i++) {
    const piece = document.createElement("span");
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = pickRandom(confettiColors);
    piece.style.animationDelay = `${Math.random() * 0.6}s`;
    piece.style.animationDuration = `${2 + Math.random() * 1.5}s`;
    piece.style.setProperty("--drift", `${Math.random() * 200 - 100}px`);
    container.appendChild(piece);
  }

  document.body.appendChild(container);
  setTimeout(function () {
    container.remove();
  }, 4500);
}

function playGame() {
  const winningScore = 5;
  const revealDelay = 500;

  let humanScore = 0;
  let computerScore = 0;
  let winStreak = 0;
  // Пока руки трясутся или открыто окно конца игры, новые ходы не принимаются
  let isLocked = false;
  let soundOn = true;
  let audioContext = null;

  const card = document.querySelector("#card");
  const humanScoreSpan = document.querySelector("#human-score");
  const computerScoreSpan = document.querySelector("#computer-score");
  const humanProgress = document.querySelector("#human-progress");
  const computerProgress = document.querySelector("#computer-progress");
  const humanHand = document.querySelector("#human-hand");
  const computerHand = document.querySelector("#computer-hand");
  const resultText = document.querySelector("#result");
  const streakText = document.querySelector("#streak");
  const gameOver = document.querySelector("#game-over");
  const finalEmoji = document.querySelector("#final-emoji");
  const finalTitle = document.querySelector("#final-title");
  const finalMessage = document.querySelector("#final-message");
  const finalScore = document.querySelector("#final-score");
  const playAgainButton = document.querySelector("#play-again");
  const soundToggle = document.querySelector("#sound-toggle");

  // Звуки создаются прямо в браузере, без аудиофайлов
  function playNote(frequency, startTime, duration) {
    const oscillator = audioContext.createOscillator();
    const volume = audioContext.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.value = frequency;
    volume.gain.setValueAtTime(0.15, startTime);
    volume.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    oscillator.connect(volume);
    volume.connect(audioContext.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }

  function playSound(name) {
    if (!soundOn || !window.AudioContext) {
      return;
    }
    if (audioContext === null) {
      audioContext = new AudioContext();
    }

    const now = audioContext.currentTime;
    const notes = sounds[name];
    for (let i = 0; i < notes.length; i++) {
      playNote(notes[i][0], now + notes[i][1], notes[i][2]);
    }
  }

  function playRound(humanSelection, computerSelection) {
    if (humanSelection === computerSelection) {
      return "draw";
    } else if (beats[humanSelection] === computerSelection) {
      humanScore++;
      return "win";
    } else {
      computerScore++;
      return "lose";
    }
  }

  function renderProgress(score) {
    return "●".repeat(score) + "○".repeat(winningScore - score);
  }

  function updateScoreboard() {
    humanScoreSpan.textContent = humanScore;
    computerScoreSpan.textContent = computerScore;
    humanProgress.textContent = renderProgress(humanScore);
    computerProgress.textContent = renderProgress(computerScore);
  }

  function setHands(humanSymbol, computerSymbol, humanAnimation, computerAnimation) {
    humanHand.textContent = humanSymbol;
    computerHand.textContent = computerSymbol;
    humanHand.className = `hand ${humanAnimation}`;
    computerHand.className = `hand ${computerAnimation}`;
  }

  function setResult(text, outcome) {
    resultText.textContent = text;
    resultText.className = `result ${outcome}`;
    restartAnimation(resultText, "pop-in");
  }

  function describeRound(outcome, humanChoice, computerChoice) {
    const phrase = pickRandom(phrases[outcome]);
    if (outcome === "win") {
      return `${phrase} ${explanations[humanChoice]}`;
    } else if (outcome === "lose") {
      return `${phrase} ${explanations[computerChoice]}`;
    } else {
      return phrase;
    }
  }

  function updateStreak(outcome) {
    if (outcome === "win") {
      winStreak++;
    } else if (outcome === "lose") {
      winStreak = 0;
    }

    if (winStreak >= 2) {
      streakText.textContent = `🔥 Серия побед: ${winStreak}`;
    } else {
      streakText.textContent = "";
    }
  }

  function celebrateRound(outcome, humanChoice, computerChoice) {
    const humanSymbol = emojiByChoice[humanChoice];
    const computerSymbol = emojiByChoice[computerChoice];
    card.classList.remove("card-win", "card-lose");

    if (outcome === "win") {
      setHands(humanSymbol, computerSymbol, "winner", "loser");
      restartAnimation(humanScoreSpan, "bump");
      restartAnimation(card, "card-win");
    } else if (outcome === "lose") {
      setHands(humanSymbol, computerSymbol, "loser", "winner");
      restartAnimation(computerScoreSpan, "bump");
      restartAnimation(card, "card-lose");
    } else {
      setHands(humanSymbol, computerSymbol, "pop", "pop");
    }

    playSound(outcome);
  }

  function handleChoice(humanChoice) {
    if (isLocked) {
      return;
    }
    isLocked = true;

    setHands("✊", "✊", "shaking", "shaking");
    setResult("Камень… ножницы… бумага!", "");
    playSound("tick");

    setTimeout(function () {
      revealRound(humanChoice, getComputerChoice());
    }, revealDelay);
  }

  function revealRound(humanChoice, computerChoice) {
    const outcome = playRound(humanChoice, computerChoice);

    updateScoreboard();
    celebrateRound(outcome, humanChoice, computerChoice);
    setResult(describeRound(outcome, humanChoice, computerChoice), outcome);
    updateStreak(outcome);

    if (humanScore === winningScore || computerScore === winningScore) {
      setTimeout(showGameOver, 800);
    } else {
      isLocked = false;
    }
  }

  function showGameOver() {
    if (humanScore > computerScore) {
      finalEmoji.textContent = "🏆";
      finalTitle.textContent = "Победа!";
      launchConfetti();
      playSound("victory");
    } else {
      finalEmoji.textContent = "🤖";
      finalTitle.textContent = "Поражение";
      playSound("defeat");
    }
    finalMessage.textContent = completeGame(humanScore, computerScore);
    finalScore.textContent = `${humanScore} : ${computerScore}`;
    gameOver.classList.remove("hidden");
    playAgainButton.focus();
  }

  function resetGame() {
    humanScore = 0;
    computerScore = 0;
    winStreak = 0;
    updateScoreboard();
    streakText.textContent = "";
    setHands("✊", "✊", "", "");
    setResult("Сделай свой ход!", "");
    gameOver.classList.add("hidden");
    isLocked = false;
  }

  const rockButton = document.querySelector("#rock");
  rockButton.addEventListener("click", function () {
    handleChoice("камень");
  });

  const scissorsButton = document.querySelector("#scissors");
  scissorsButton.addEventListener("click", function () {
    handleChoice("ножницы");
  });

  const paperButton = document.querySelector("#paper");
  paperButton.addEventListener("click", function () {
    handleChoice("бумага");
  });

  playAgainButton.addEventListener("click", resetGame);

  soundToggle.addEventListener("click", function () {
    soundOn = !soundOn;
    if (soundOn) {
      soundToggle.textContent = "🔊";
    } else {
      soundToggle.textContent = "🔇";
    }
    soundToggle.setAttribute("aria-pressed", soundOn);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "1") {
      handleChoice("камень");
    } else if (event.key === "2") {
      handleChoice("ножницы");
    } else if (event.key === "3") {
      handleChoice("бумага");
    }
  });

  resetGame();
}
playGame();
