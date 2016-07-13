// Canvas
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// Canvas size
var W = canvas.width = window.innerWidth;
var H = canvas.height = window.innerHeight;

// Ball
var ballImg = document.getElementById('ballImg');
var ballX = W / 2 - ballImg.width / 2;
var ballY = H - ballImg.height - 30;

// Audio
var throwSound = new Audio("sounds/throw.wav");
var failSound = new Audio("sounds/fail.wav");
var winSound = new Audio("sounds/win.wav");

// current ball throw
var upThrow = 0;
var leftThrow = 0;
var rightThrow = 0;

// Rim
var rimImg = document.getElementById('rimImg');
var rimX = W / 2 - rimImg.width / 2;
var rimY = H / 2 - rimImg.height - 90;
var higherThanRim = 0;

// Rim mouvement
var xAxis = 0;
var direction = "Right";

// Game score
var highScore = 0;
var oldScore = 0;
var score = 0;

// Velocity
var vUp = -37;
var vRight = -5;
var vLeft = 5;

// Gravity
var gravity = 1;

// Debug mode
var debug = 0;

function drawField(){
	// Floor
	ctx.fillStyle = "#F4F4F4";
	ctx.fillRect(0, H - 80, W, 80);

	// Rim
	ctx.drawImage(rimImg, rimX + xAxis, rimY);

	// Ball
	ctx.drawImage(ballImg, ballX, ballY);

	// Fake rim bar
	if ((upThrow || leftThrow || rightThrow) && higherThanRim) {
		ctx.fillStyle = "#FE250F";
		if (debug == 1)
			ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(rimX + 105 + xAxis, rimY + 199, 162, 9);
	}

	if (debug == 1) {
		ctx.textAlign = "start";
		ctx.fillStyle = "Black";
		ctx.font = "20px Arial";
		
		ctx.fillText("Ball x: " + ballX, 10, 20);
		ctx.fillText("Ball y: " + ballY, 10, 40);

		ctx.fillText("Rim x: " + (rimX + xAxis), 10, 80);
		ctx.fillText("Rim y: " + rimY, 10, 100);
	}
}

function drawScores(){
	// HighScore
	ctx.textAlign = "end";
	ctx.fillStyle = "Black";
	ctx.font = "20px Arial";
	ctx.fillText("High Score", W - 20, 30);
	ctx.fillText(highScore, W - 20, 60);

	// Score
	ctx.textAlign = "start";
	ctx.fillStyle = "#6F6F6F";
	ctx.font = "lighter 150px Arial";
	if (score > 0)
		ctx.fillText(score, W / 2 - (score.toString().length * 42), H / 2 + 110);
}

(function game(){
	function resetGravity() {
		vUp = -37;
		ballX = W / 2 - ballImg.width / 2;
		ballY = H - ballImg.height - 30;
	}

	function resetThrows() {
		upThrow = 0;
		leftThrow = 0;
		rightThrow = 0;
	}

	function resetGame() {
		if (score > highScore)
			highScore = score;
		score = 0;
		xAxis = 0;
		direction = "Right";
		failSound.play();
	}

	requestAnimationFrame(game);
	ctx.clearRect(0, 0, W, H);

	// keyDown managing
	$(document).keydown(function(event) {
		if (!leftThrow && !rightThrow && !upThrow) {
			oldScore = score;
			throwSound.play();

			if (event.which == 38)
				upThrow = 1;
			else if (event.which == 39)
				leftThrow = 1;
			else if (event.which == 37) 
				rightThrow = 1;
		}
	});

	// Throw mouvement managing
	if (upThrow || rightThrow || leftThrow) {
		vUp += gravity;
		ballY += vUp;
		
		if (rightThrow) 
			ballX += vRight;
		if (leftThrow) 
			ballX += vLeft;
	}

	if (ballY < rimY)
		higherThanRim = 1;

	// Rim mouvement
	if (score >= 0) {
		if (xAxis + rimX <= W - rimImg.width + 6 && direction == "Right") {
			if (score >= 10 && score < 20)
				xAxis++;
			else if (score >= 20)
				xAxis += 2;
		}
		else if (xAxis + rimX - 6 > W - rimImg.width)
			direction = "Left";

		if (xAxis + rimX > -5 && direction == "Left") {
			if (score >= 10 && score < 20)
				xAxis--;
			else if (score >= 20)
				xAxis -= 2;
		}
		else if (xAxis + rimX < -4)
			direction = "Right";
	}

	if (higherThanRim && (ballY > rimY + 220 && ballY < rimY + 250) && 
		ballX > rimX + xAxis + 50 && ballX < rimX + xAxis + 200) {
			winSound.play();
			score++;
		}

	if (ballY > H + 1000) {
		if (oldScore == score) 
			resetGame();
		resetThrows();
		resetGravity();
		higherThanRim = 0;
	}

	drawScores();
	drawField();
})();