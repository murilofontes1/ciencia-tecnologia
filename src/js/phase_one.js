// ===================================  GENERAL  =================================== //
import data from "./data.json" assert { type: "json" };

const overlay = document.querySelector("[data-js=overlay]");
const userName = document.querySelector("input[for=nameUser]");
const timerRef = document.querySelector(".timerDisplay");
const endPosition = document.querySelector('span[class="final-position"]');
const halfPosition = document.querySelector('span[class="initial-position"]');
const halfTimeText = document.querySelector(".half-time-text");
const foxConstVelocityText = document.querySelector(
  'span[class="fox-const-velocity-text"]'
);
const label = document.querySelectorAll(".form-check label");
const progressiveBar = document.querySelector(".progress-bar");

let progress = 0;

// ===================================  OBJECTS  =================================== //
const armadillo = document.getElementById("object");
const fox = document.getElementById("object2");

// ===================================  BUTTONS  =================================== //
const intoGameButton = document.getElementById("start-button");
const confirmAnswertButton = document.querySelector("[data-js=confirmAnswert]");
const resetButton = document.getElementById("reset");
const restartButton = document.getElementById("restart");
const radioButtons = document.querySelectorAll(
  'input[type="radio"][name="velocity"]'
);

// ===================================  DATA  =================================== //
let index = 0;
endPosition.innerHTML = data[index].finalPosition;
halfPosition.innerHTML = data[index].halfPosition;
foxConstVelocityText.innerHTML = data[index].foxVelocity;
halfTimeText.innerHTML = data[index].halfTime;

let armadilloVelocity = data[index].armadilloVelocity;
let armadilloInitialPosition = data[index].armadilloInitialPosition;

let foxVelocity = data[index].foxVelocity;
let foxInitialPosition = data[index].foxInitialPosition;

let difference = 0;
let position = 0;

let time = 0;
// ===================================  STOPWATCH  =================================== //
let [milliseconds, seconds, minutes] = [0, 0, 0];
let stopwatch = null;

// ===================================  GAME  =================================== //
class Game {
  constructor(armadillo, fox) {
    this.armadillo = armadillo;
    this.fox = fox;
  }

  displayGameContainer() {
    document
      .getElementById("initial-screen")
      .classList.replace("d-flex", "d-none");
    document
      .querySelector("[data-js=game-screen]")
      .classList.replace("d-none", "d-flex");
  }

  displayGameContainerStart() {
    document
      .getElementById("initial-screen")
      .classList.replace("d-none", "d-flex");
    document
      .getElementById("start-button")
      .classList.replace("d-none", "d-flex");
    document
      .querySelector("[data-js=game-screen]")
      .classList.replace("d-flex", "d-none");
  }

  startGame() {
    label.forEach((lbl, i) => {
      lbl.textContent = data[index].options[i];
    });

    armadillo.classList.add("isMove");

    const mru = setInterval(() => {
      position = armadilloInitialPosition + armadilloVelocity * time;
      // se a posição for menor que a diferença
      /*       if (position < difference) {
        difference -= position;
        difference += armadilloVelocity;
      } */

      if (difference > position) {
        position = difference + armadilloVelocity;
      }

      this.armadillo.style.left = `${position}px`;
      this.fox.style.left = `${foxInitialPosition + foxVelocity * time}px`;

      // se o tempo igual a metade do tempo final
      if (time == data[index].halfTime) {
        clearInterval(mru);
        stopwatch = setInterval(this.stopwatch.bind(this), 10);
        setTimeout(() => {
          overlay.classList.replace("d-none", "d-block");
          armadillo.classList.remove("isMove");
        }, 800);
      }

      // se a posição da raposa for maior que a posição do tatu
      if (parseInt(this.fox.style.left) > parseInt(this.armadillo.style.left)) {
        this.fox.style.left = `${parseInt(this.fox.style.left) - 50}px`;
        clearInterval(mru);
        resetButton.disabled = false;
        setTimeout(() => {
          armadillo.classList.remove("isMove");
        }, 800);
      }

      // se o tempo for igual a 40
      if (time == data[index].finalTime) {
        clearInterval(mru);
        this.armadillo.style.left = "1080px";
        this.fox.style.left = "980px";

        resetButton.disabled = false;
      }

      time++;
    }, 1000 / 60);
  }

  reset() {
    this.armadillo.style.left = `${armadilloInitialPosition}px`;
    this.fox.style.left = `${foxInitialPosition}px`;
    armadilloVelocity = data[index].armadilloVelocity;
    position = 0;
    difference = 0;
    time = 0;
    resetButton.disabled = true;
    radioButtons.forEach((radioButton) => {
      if (radioButton.checked) {
        radioButton.checked = false;
      }
    });
    confirmAnswertButton.disabled = true;
    [milliseconds, seconds, minutes] = [0, 0, 0];
    timerRef.innerText = "00:00";
    setTimeout(() => {
      game.startGame();
    }, 3000);
  }

  stopwatch() {
    milliseconds += 10;
    if (milliseconds == 1000) {
      milliseconds = 0;
      seconds++;
      if (seconds == 60) {
        seconds = 0;
        minutes++;
      }
    }
    let m = minutes < 10 ? "0" + minutes : minutes;
    let s = seconds < 10 ? "0" + seconds : seconds;

    timerRef.innerText = `${m}:${s}`;
  }
}

const game = new Game(armadillo, fox);

intoGameButton.addEventListener("click", () => {
  game.displayGameContainer();
  setTimeout(() => {
    game.startGame();
  }, 1000);
});

radioButtons.forEach((radioButton) => {
  radioButton.addEventListener("click", () => {
    confirmAnswertButton.disabled = false;
  });
});

confirmAnswertButton.addEventListener("click", () => {
  clearInterval(stopwatch); // Para o cronômetro
  overlay.classList.replace("d-block", "d-none");
  let num = 0;
  radioButtons.forEach((radioButton) => {
    if (radioButton.checked) {
      // Seleciona o elemento label associado ao botão selecionado
      const label = document.querySelector(`label[for="${radioButton.id}"]`);
      // Recupera o valor do texto do label selecionado
      const selectedValue = label.textContent;
      const str = selectedValue;
      num = parseInt(str);
    }
  });
  if (num != data[index].armadilloVelocity) {
    armadilloVelocity = num;
    difference = position;
    game.startGame();
    setTimeout(() => {
      var modalElement = document.getElementById("meuModal2");
      var modal = new bootstrap.Modal(modalElement);
      modal.show();
    }, 1500);
  } else {
    armadilloVelocity = num;
    difference = 0;
    game.startGame();
    setTimeout(() => {
      // se o index for menor que 2, mostre esse modal
      var modalElement = document.getElementById("meuModal");
      var modal = new bootstrap.Modal(modalElement);

      if (index < 2) {
        modal.show();
      }

      armadillo.classList.remove("isMove");

      progress += 33.33;
      progressiveBar.style.width = `${progress}%`;
    }, 1500);
  }
});

resetButton.addEventListener("click", () => {
  game.reset();
});

userName.addEventListener("input", (e) => {
  if (e.target.value != "") {
    intoGameButton.disabled = false;
  } else {
    intoGameButton.disabled = true;
  }
});

document.addEventListener("DOMContentLoaded", function () {
  var botaoReset = document.getElementById("btGo");
  botaoReset.addEventListener("click", nextGame);
});

restartButton.addEventListener("click", () => {
  game.reset();
});

function nextGame() {
  index++;

  endPosition.innerHTML = data[index].finalPosition;
  halfPosition.innerHTML = data[index].halfPosition;
  foxConstVelocityText.innerHTML = data[index].foxVelocity;
  foxVelocity = data[index].foxVelocity;
  armadilloVelocity = data[index].armadilloVelocity;
  halfTimeText.innerHTML = data[index].halfTime;

  game.reset();
}
