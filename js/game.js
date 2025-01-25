class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 400;
        this.canvas.height = 400;
        this.gridSize = 20;
        this.snake = [{x: 5, y: 5}];
        this.food = this.generateFood();
        this.direction = 'right';
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.gameLoop = null;
        this.speed = 150;

        this.setupEventListeners();
        this.updateHighScore();
    }

    setupEventListeners() {
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        
        // 移动端控制
        document.getElementById('upBtn').addEventListener('click', () => this.setDirection('up'));
        document.getElementById('downBtn').addEventListener('click', () => this.setDirection('down'));
        document.getElementById('leftBtn').addEventListener('click', () => this.setDirection('left'));
        document.getElementById('rightBtn').addEventListener('click', () => this.setDirection('right'));
    }

    handleKeyPress(e) {
        const key = e.key;
        const directions = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right'
        };
        
        if (directions[key]) {
            this.setDirection(directions[key]);
        }
    }

    setDirection(newDirection) {
        const opposites = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };
        
        if (this.direction !== opposites[newDirection]) {
            this.direction = newDirection;
        }
    }

    generateFood() {
        const x = Math.floor(Math.random() * (this.canvas.width / this.gridSize));
        const y = Math.floor(Math.random() * (this.canvas.height / this.gridSize));
        return {x, y};
    }

    update() {
        const head = {...this.snake[0]};
        
        switch(this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        if (this.checkCollision(head)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            document.getElementById('score').textContent = this.score;
            this.food = this.generateFood();
            if (this.speed > 50) {
                this.speed -= 2;
                clearInterval(this.gameLoop);
                this.gameLoop = setInterval(() => this.update(), this.speed);
            }
        } else {
            this.snake.pop();
        }

        this.draw();
    }

    checkCollision(head) {
        if (head.x < 0 || head.x >= this.canvas.width / this.gridSize ||
            head.y < 0 || head.y >= this.canvas.height / this.gridSize) {
            return true;
        }
        return this.snake.some(segment => segment.x === head.x && segment.y === head.y);
    }

    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#0f0';
        this.snake.forEach(segment => {
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 2,
                this.gridSize - 2
            );
        });

        this.ctx.fillStyle = '#f00';
        this.ctx.fillRect(
            this.food.x * this.gridSize,
            this.food.y * this.gridSize,
            this.gridSize - 2,
            this.gridSize - 2
        );
    }

    startGame() {
        this.snake = [{x: 5, y: 5}];
        this.direction = 'right';
        this.score = 0;
        this.speed = 150;
        document.getElementById('score').textContent = '0';
        this.food = this.generateFood();
        
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
        
        this.gameLoop = setInterval(() => this.update(), this.speed);
    }

    gameOver() {
        clearInterval(this.gameLoop);
        this.updateHighScore();
        alert(`游戏结束！得分：${this.score}`);
    }

    updateHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
        }
        document.getElementById('highScore').textContent = this.highScore;
    }
}

// 初始化游戏
const game = new SnakeGame(); 