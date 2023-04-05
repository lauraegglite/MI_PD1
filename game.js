let firstMove; //glabā informāciju par to, kurš uzsāka spēli
let currentNumber; //glabā spēles skaitli (sākumā 111)

//elementi grafiskajā vidē
const form = document.querySelector('form');
const input = document.querySelector('input');
const playAgainBtn = document.getElementById('play-again');
const compStartBtn = document.getElementById('comp-start');
const userStartBtn = document.getElementById('user-start');
const descr = document.getElementById('move-descr');

//spēles beigu nosacījumu pārbaude un paziņojums par spēles beigām
function isGameOver() {
  if (getAvailableMoves(currentNumber).length === 0) {
      alert(`Spēle beigusies. ${getWinner(currentNumber)===1 ? 'Dators uzvar!': 'Tu uzvari!'}`);
      playAgainBtn.style.display = 'block';
    return true;
  }
}

// nomaina spēles skaitli grafiskajā vidē
function updateCurrentNumber() {
  const currentNumberElement = document.getElementById('number');
  currentNumberElement.textContent = currentNumber;
}

// Nosaka uzvarētāju
function getWinner(number) {
  if (number >= 2){
    if (firstMove === 'Player')
      return -1;
    else
      return 1;
  } else {
    if (firstMove ==='Player')
      return 1;
    else
      return -1;
  }
}

// Pārbauda vai ievadītais skaitlis ir derīgs
function isValidMove(move) {
  const square = parseInt(move, 10);
  return square > 1 && Math.sqrt(square) % 1 === 0 && square <= currentNumber;
}

// Atrod visus derīgos gājienus (kvadrāti, kas nepārsniedz spēles skaitli)
function getAvailableMoves(currentNumber) {
  const availableMoves = [];
  for (let i = 2; i <= Math.sqrt(currentNumber); i++) {
    availableMoves.push(i * i);
  }
  return availableMoves;
}

// derīgo gājienu meklēšana
function generateGameTree(number, isMaximizing) {

  const availableMoves = getAvailableMoves(number);
  
  // pārbauda vai sasniegta strupceļa virsotne
  if (availableMoves.length === 0) {
    return { move: null, score: getWinner(number) };
  }

  // ģenerē spēles koku
  const children = [];
  for (const move of availableMoves) {
    const childNumber = number - move;
    const childNode = generateGameTree(childNumber, !isMaximizing);
    children.push({ move: move, score: childNode.score });
  }

  // Nosaka virsotnes vērtību
  let bestScore;
  let bestMove;
  if (isMaximizing) {
    bestScore = -Infinity;
    for (const child of children) {
      if (child.score > bestScore) {
        bestScore = child.score;
        bestMove = child.move;
      }
    }
  } else {
    bestScore = Infinity;
    for (const child of children) {
      if (child.score < bestScore) {
        bestScore = child.score;
        bestMove = child.move;
      }
    }
  }

  // Atgriež virsotnes vērtību un labāko gājienu
  return { move: bestMove, score: bestScore };
}

// datora gājiens
function computerMove(){
  setTimeout(() => { //laiks apskatīt savu gājienu
    const gameTreeNode = generateGameTree(currentNumber, true); //izveido koku
    let computerMove = gameTreeNode.move;
    descr.innerHTML = 
      `Dators no skaitļa atņēma ${computerMove}. Tavs gājiens.`;
    
    // atņem datora gājienu no spēles skaitļa
    if (computerMove) {
      currentNumber -= computerMove;
      updateCurrentNumber();
      if (isGameOver()) return; //pārbauda vai spēle beigusies
    }
  }, 1000);
}

// cilvēka gājiens, kas beidzas ar gājiena nodošanu datoram
function playMove(move) {
  // validē ievadīto gājienu
  if (!isValidMove(move)) {
    alert('Nekorekts gājiens! Lūdzu ievadi skaitļa kvadrātu, kas ir mazāks vai vienāds ar esošo spēles skaitli.');
    return;
  }

  //atņem ievadīto skaitli no spēles skaitļa
  const square = parseInt(move, 10);
  currentNumber -= square;
  updateCurrentNumber();

  if (isGameOver()) return; //pārbauda vai spēle nav beigusies
  computerMove(); //tālāk iet dators
}

// viss tiek sakārtots (atkārotai) spēles sākšanai
function resetGame() {
  descr.innerHTML = "Sākam spēli!";
  form.style.display = 'none';
  playAgainBtn.style.display = 'none';
  compStartBtn.style.display = 'block';
  userStartBtn.style.display = 'block';
  currentNumber = 111;
  updateCurrentNumber(); 
}

// spēle tiek 'palaista'
  resetGame();

  // ja spēli sāk dators:
  compStartBtn.addEventListener('click', () => {
    firstMove="Computer";
    compStartBtn.style.display = 'none';
    userStartBtn.style.display = 'none';
    form.style.display = 'block';
    computerMove();
  })

  // ja spēli sāk cilvēks:
  userStartBtn.addEventListener('click', () =>{
    firstMove='Player';
    userStartBtn.style.display = 'none';
    compStartBtn.style.display = 'none';
    form.style.display = 'block';
  })

  // cilvēka gājienu nolasīšana
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    playMove(input.value);
    input.value = '';
  });

  // spēles atkārtošana
  playAgainBtn.addEventListener('click', () => {
    resetGame();
  });
