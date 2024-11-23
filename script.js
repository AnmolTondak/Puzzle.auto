const imageUpload = document.getElementById("imageUpload");
const puzzleContainer = document.getElementById("puzzleContainer");
const scatterButton = document.getElementById("scatterButton");
const previewImage = document.getElementById("previewImage");
const solveMessage = document.getElementById("solveMessage");

let originalOrder = [];
let pieces = [];
let imageURL = "";

// Handle image upload
imageUpload.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();

    // On file load, set the image URL and create the puzzle
    reader.onload = function (e) {
      imageURL = e.target.result;
      previewImage.src = imageURL; // Set the correct image preview
      createPuzzle();
    };
    reader.readAsDataURL(file);
  }
});

// Handle scatter button click
scatterButton.addEventListener("click", () => {
  scatterPuzzle();
});

// Create the puzzle pieces (2x2 grid)
function createPuzzle() {
  puzzleContainer.innerHTML = "";
  pieces = [];
  originalOrder = [];
  solveMessage.style.display = "none"; // Hide solved message
  const gridSize = 2;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const piece = document.createElement("div");
      piece.classList.add("puzzle-piece");
      piece.style.backgroundImage = `url(${imageURL})`;
      piece.style.backgroundPosition = `${-col * 150}px ${-row * 150}px`;
      piece.dataset.position = `${row}-${col}`;
      originalOrder.push(piece.dataset.position);
      pieces.push(piece);
      puzzleContainer.appendChild(piece);
    }
  }

  scatterPuzzle(); // Initial scatter
  enableDragAndDrop();
}

// Enable drag-and-drop functionality
function enableDragAndDrop() {
  pieces.forEach((piece) => {
    piece.draggable = true;

    piece.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", e.target.dataset.position);
    });

    piece.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    piece.addEventListener("drop", (e) => {
      e.preventDefault();
      const draggedPosition = e.dataTransfer.getData("text/plain");
      const targetPosition = e.target.dataset.position;

      const draggedPiece = pieces.find((p) => p.dataset.position === draggedPosition);
      const targetPiece = pieces.find((p) => p.dataset.position === targetPosition);

      swapPieces(draggedPiece, targetPiece);
      checkPuzzleSolved();
    });
  });
}

// Swap pieces
function swapPieces(piece1, piece2) {
  const tempPosition = piece1.dataset.position;
  piece1.dataset.position = piece2.dataset.position;
  piece2.dataset.position = tempPosition;

  const tempStyle = piece1.style.cssText;
  piece1.style.cssText = piece2.style.cssText;
  piece2.style.cssText = tempStyle;
}

// Check if the puzzle is solved
function checkPuzzleSolved() {
  const currentOrder = pieces.map((p) => p.dataset.position);
  if (JSON.stringify(currentOrder) === JSON.stringify(originalOrder)) {
    solveMessage.style.display = "block"; // Show solved message

    // Scatter puzzle after 2 seconds
    setTimeout(() => {
      solveMessage.style.display = "none"; // Hide the solved message
      scatterPuzzle();
    }, 2000); // Adjust delay as needed
  }
}

// Scatter the puzzle pieces randomly
function scatterPuzzle() {
  pieces.forEach((piece) => {
    const randomIndex = Math.floor(Math.random() * pieces.length);
    const randomPiece = pieces[randomIndex];
    swapPieces(piece, randomPiece);
  });
}
