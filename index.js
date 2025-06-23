    const gameButtons = document.querySelectorAll('.game-btn');
    const ticTacToeGame = document.getElementById('tic-tac-toe');
    const memoryGame = document.getElementById('memory');
    const tttInstructions = document.getElementById('ttt-instructions');
    const memoryInstructions = document.getElementById('memory-instructions');
    
    gameButtons.forEach(button => {
      button.addEventListener('click', () => {
        gameButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const game = button.dataset.game;
        if (game === 'tic-tac-toe') {
          ticTacToeGame.style.display = 'flex';
          memoryGame.style.display = 'none';
          tttInstructions.style.display = 'block';
          memoryInstructions.style.display = 'none';
        } else {
          ticTacToeGame.style.display = 'none';
          memoryGame.style.display = 'flex';
          tttInstructions.style.display = 'none';
          memoryInstructions.style.display = 'block';
          if (!memoryGameInitialized) {
            initMemoryGame();
            memoryGameInitialized = true;
          }
        }
      });
    });
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const status = document.querySelector('.status');
    const restartButton = document.getElementById('restart-ttt');
    
    let currentPlayer = 'X';
    let gameActive = true;
    let gameState = ['', '', '', '', '', '', '', '', ''];
    
    const winningConditions = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], 
      [0, 3, 6], [1, 4, 7], [2, 5, 8], 
      [0, 4, 8], [2, 4, 6]             
    ];
    
    function handleCellClick(clickedCellEvent) {
      const clickedCell = clickedCellEvent.target;
      const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));
      
      if (gameState[clickedCellIndex] !== '' || !gameActive) return;
      gameState[clickedCellIndex] = currentPlayer;
      clickedCell.textContent = currentPlayer;
      clickedCell.classList.add(currentPlayer.toLowerCase());
      checkResult();
    }
    
    function checkResult() {
      let roundWon = false;
      
      for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') continue;
        
        if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
          roundWon = true;
          break;
        }
      }
      
      if (roundWon) {
        status.textContent = `Player ${currentPlayer} wins!`;
        status.classList.add('highlight');
        gameActive = false;
        return;
      }
      if (!gameState.includes('')) {
        status.textContent = "Game ended in a draw!";
        gameActive = false;
        return;
      }
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      status.textContent = `Player ${currentPlayer}'s turn`;
    }
    
    function restartGame() {
      currentPlayer = 'X';
      gameActive = true;
      gameState = ['', '', '', '', '', '', '', '', ''];
      status.textContent = `Player ${currentPlayer}'s turn`;
      status.classList.remove('highlight');
      
      cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
      });
    }
    
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartButton.addEventListener('click', restartGame);
    const cardsGrid = document.getElementById('cards-grid');
    const movesElement = document.getElementById('moves');
    const timerElement = document.getElementById('timer');
    const matchesElement = document.getElementById('matches');
    const restartMemoryButton = document.getElementById('restart-memory');
    
    let memoryGameInitialized = false;
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let timer = 0;
    let timerInterval;
    
    const symbols = ['🍎', '🍌', '🍒', '🍇', '🍊', '🍓', '🍑', '🍍'];
    
    function initMemoryGame() {
      const gameSymbols = [...symbols, ...symbols];
      gameSymbols.sort(() => Math.random() - 0.5);
      cardsGrid.innerHTML = '';
      gameSymbols.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        
        card.innerHTML = `
          <div class="card-front">${symbol}</div>
          <div class="card-back">?</div>
        `;
        
        card.addEventListener('click', flipCard);
        cardsGrid.appendChild(card);
      });
      
      resetMemoryGame();
    }
    
    function flipCard() {
      if (flippedCards.length === 2 || this.classList.contains('flipped') || 
          this.classList.contains('matched')) return;
          
      this.classList.add('flipped');
      flippedCards.push(this);
      
      if (flippedCards.length === 2) {
        moves++;
        movesElement.textContent = moves;
        
        const [card1, card2] = flippedCards;
        if (card1.dataset.symbol === card2.dataset.symbol) {
          // Match found
          setTimeout(() => {
            card1.classList.add('matched');
            card2.classList.add('matched');
            flippedCards = [];
            matchedPairs++;
            matchesElement.textContent = `${matchedPairs}/8`;
            
            if (matchedPairs === 8) {
              clearInterval(timerInterval);
              setTimeout(() => {
                alert(`Congratulations! You won in ${moves} moves and ${timer} seconds!`);
              }, 500);
            }
          }, 500);
        } else {
          // No match
          setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
          }, 1000);
        }
      }
    }
    
    function startTimer() {
      timer = 0;
      timerElement.textContent = `${timer}s`;
      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        timer++;
        timerElement.textContent = `${timer}s`;
      }, 1000);
    }
    
    function resetMemoryGame() {
      // Reset game state
      flippedCards = [];
      matchedPairs = 0;
      moves = 0;
      
      // Update UI
      movesElement.textContent = moves;
      matchesElement.textContent = `${matchedPairs}/8`;
      timerElement.textContent = "0s";
      
      // Reset cards
      const allCards = document.querySelectorAll('.card');
      allCards.forEach(card => {
        card.classList.remove('flipped', 'matched');
      });
      
      // Start timer
      clearInterval(timerInterval);
      startTimer();
    }
    
    restartMemoryButton.addEventListener('click', resetMemoryGame);
    
    // Initialize the first game
    window.onload = () => {
      restartGame();
    };