const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const grid = 15; // 1 клетка
const platformHeight = grid * 5;
const maxPlatformY = canvas.height - grid - platformHeight;
const maxBallY = canvas.height - grid - grid;
let platfotmSpeed = 6;
let ballSpeed = 5;

const leftPlatform = {
  x: grid * 2,
  y: canvas.height / 2 - platformHeight / 2,
  width: grid,
  height: platformHeight,
  dy: 0 // обнулить скорость на старте
};

const rightPlatform = {
  // задаём координаты, вместо 2 -> 3, т.к. отрисовка слева направо.
  x: canvas.width - grid * 3,
  y: canvas.height / 2 - platformHeight / 2,
  width: grid,
  height: platformHeight,
  dy: 0
};

const ball = {
  // координаты центра
  x: ~~ (canvas.width / 2),
  y: ~~ (canvas.height / 2),
  width: grid,
  height: grid,
  // флаг для мяча: забит или нет
  resetting: false,
  // начальный вектор - в правый верхний угол
  dx: ballSpeed,
  dy: -ballSpeed
};

// функция проверки столкновения
// Подробнее тут: https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
function collides (obj1, obj2) {
  return obj1.x < (obj2.x + obj2.width) && // если левая граница obj1 левее правой границы obj2 
         (obj1.x + obj1.width) > obj2.x && // если правая граница obj1 правее левой границы obj2
         obj1.y < (obj2.y + obj2.height) && //аналогично для второй координаты
         (obj1.y + obj1.height) > obj2.y;
}

function loop() {
  requestAnimationFrame(loop);
  context.clearRect(0, 0, canvas.width, canvas.height); // очистить игровое поле

  // перемещаем предмет
  leftPlatform.y += leftPlatform.dy;
  rightPlatform.y += rightPlatform.dy;
  
  // проверка, что платформа в игровом поле
  // ширина в 1 grid учитывается, т.к. у нас есть границы толщиной в 1 grid
  if (leftPlatform.y < grid) {leftPlatform.y = grid;} //сверху. 
  if (leftPlatform.y > maxPlatformY) {leftPlatform.y = maxPlatformY}; // снизу

  //аналогично для правой платформы
  if (rightPlatform.y < grid) {rightPlatform.y = grid;} //сверху. 
  if (rightPlatform.y > maxPlatformY) {rightPlatform.y = maxPlatformY}; // снизу

  //отрисуем платформы
  context.fillStyle = 'white';
  context.fillRect(leftPlatform.x, leftPlatform.y, leftPlatform.width, leftPlatform.height);
  context.fillRect(rightPlatform.x, rightPlatform.y, rightPlatform.width, rightPlatform.height);

  //перемещаем мяч
  ball.x += ball.dx;
  ball.y += ball.dy;

  // если мяч коснулся стены сверху
  if (ball.y < grid) {
    ball.y = grid; 
    ball.dy *= -1; //меняем направление по y
  }
  // аналогично для касания снизу
  if (ball.y > maxBallY) {
    ball.y = maxBallY;
    ball.dy *= -1;
  }

  // если мяч пересек левую или правую границы
  // возможно ресеттинг бесполезен
  if ((ball.x < 0 || ball.x > canvas.width) && !ball.resetting) {
    ball.resetting = true;
    setTimeout(() => {
      ball.resetting = false;
      ball.x = ~~ (canvas.width / 2);
      ball.y = ~~ (canvas.heigh / 2);
    }, 1000);
  }

  // если мяч отбили
  if (collides(ball, leftPlatform)) {
    ball.dx *= -1;
    // отрисовать мяч от границы платформы
    ball.x = leftPlatform.x + leftPlatform.width;
  }

  if (collides(ball, rightPlatform)) {
    ball.dx *= -1;
    ball.x = rightPlatform.x - ball.width;
  }

  // рисуем мяч
  context.fillRect (ball.x, ball.y, ball.width, ball.height);
  // рисуем стены
  context.fillStyle = 'lightgrey';
  context.fillRect(0, 0, canvas.width, grid);
  context.fillRect(0, (canvas.height - grid), canvas.width, grid);
  // рисуем сетку посередине
  for (let i = grid; i < canvas.height - grid; i += grid * 2) {
    context.fillRect(canvas.width / 2 - grid / 2, i, grid, grid);
  }
}

// вешаем листенеры
document.addEventListener('keydown', ev => {
  // если это стрелочка вверх
  if (ev.code === 'ArrowUp') {rightPlatform.dy = -platfotmSpeed;}
  //стрелка вниз
  else if (ev.code === 'ArrowDown') {rightPlatform.dy = platfotmSpeed;}
  // нажата W
  else if (ev.code === 'KeyW') {leftPlatform.dy = -platfotmSpeed;}
  // нажата S 
  else if (ev.code === 'KeyS') {leftPlatform.dy = platfotmSpeed;};
});

document.addEventListener('keyup', ev => {
  if (ev.code === 'ArrowUp' || ev.code === 'ArrowDown') {rightPlatform.dy = 0;}
  else if (ev.code === 'KeyW' || ev.code === 'KeyS') {leftPlatform.dy = 0;};
});

//Запуск игры
requestAnimationFrame(loop)

