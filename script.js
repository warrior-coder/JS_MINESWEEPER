// SELECT
const canv = document.querySelector('#mainCanvas');
const scorBrd = document.querySelector('#scoreBoard');

const ctx = canv.getContext('2d');
let canv_d, canv_x0, canv_y0;

canv_d = Math.round(0.9 * window.innerWidth);

canv_x0 = Math.round(0.05 * window.innerWidth);
canv_y0 = Math.round(0.05 * window.innerWidth);

canv.width = canv.height = canv_d;

canv.style.left = canv_x0 + 'px';
canv.style.top = canv_y0 + 'px';

scorBrd.style.left = canv_x0 + 'px';
scorBrd.style.top = canv_y0 - 3 + 'px';

// CELL
let cell = new Object();
cell.n = 20;
cell.d = canv_d / cell.n;
cell.open = [];
// BOMB
let bomb = new Object();
// GAME-TIME
let gameTime, gameTimeI, game, win; 
let flagMode;
// MOUSE CLICK
let windowUpdate;
let m = new Object();

let boardMatrix = [];

for (let i = 0; i < cell.n; i++) {
    boardMatrix[i] = [];
    cell.open[i] = [];
}

// DOM
canv.style.marginTop = cell.d * 2 + 'px';
canv.style.marginBottom = canv_y0 + 'px';

scorBrd.style.width = canv_d + 'px';
scorBrd.style.height = cell.d * 2 + 'px';

for (let i = 0; i < 2; i++) {
    document.querySelectorAll('.scoreBoardFont')[i].style.fontSize = cell.d * 10 / 8 + 'px';
    document.querySelectorAll('.scoreBoardFont')[i].style.borderRadius = cell.d / 8 + 'px';
}

const smile = document.querySelector('.scoreBoardSmile');
smile.style.height = cell.d * 2 / 10 * 7 + 'px';
smile.style.width = cell.d * 2 / 10 * 7 + 'px';
smile.style.borderRadius = cell.d * 2 / 10 * 7 / 2 + 'px';

const sml1 = document.querySelector('#smile01');
sml1.style.height = sml1.style.width = cell.d / 10 * 9 + 'px';

const sml2 = document.querySelector('#smile02');
sml2.style.height = sml2.style.width = cell.d / 10 * 9 + 'px';

let flag_d;
// HORIZONTAL
if(window.innerWidth > window.innerHeight) {
    flag_d = window.innerHeight / 7.5;
}
// VERTICAL
else {
    flag_d = window.innerHeight / 12.5;
}

const flgBrd = document.querySelector('.flagBoard');
flgBrd.style.height = flag_d + 'px';
flgBrd.style.width = flag_d / 4 * 5 + 'px';
flgBrd.style.borderRadius = '0 ' + flag_d / 3 + 'px ' + flag_d / 3 + 'px ' + '  0';
flgBrd.style.top = (window.innerHeight - flag_d) / 2 + 'px';

const flgCrc = document.querySelector('.flagCircle');
flgCrc.style.height = flgCrc.style.width = flag_d / 10 * 8 + 'px';
flgCrc.style.marginRight = flag_d / 10 * 1 + 'px';
flgCrc.style.borderRadius = flag_d / 10 * 8 / 2 + 'px';

const flg3 = document.querySelector('.flag3');
flg3.style.borderWidth = flag_d / 5 + 'px';
flg3.style.borderLeftWidth = flag_d / 10 * 3 + 'px';

const wnBrd = document.querySelector('#winBoard');
wnBrd.style.top = canv_y0 + canv_d / 2 - cell.d * 2 + 'px';
wnBrd.style.height = cell.d * 4 + 'px';
wnBrd.style.fontSize = cell.d * 3 + 'px';

const copRgtBx = document.querySelector('.CR_box');
copRgtBx.style.top = canv_y0 + canv_d + cell.d * 5 + 10 + 'px';
copRgtBx.style.height = canv_d / 2 + 'px';

const copRgt = document.querySelector('#CR');
copRgt.style.height = cell.d + 'px';
copRgt.style.width = cell.d * 6 + 'px';
copRgt.style.borderRadius = cell.d / 2 + 'px';
copRgt.style.fontSize = cell.d / 2 + 'px';

const infBrd = document.querySelector('.infoBoard');
infBrd.style.height = cell.d * 2 + 'px';
infBrd.style.width = cell.d * 10 + 'px';
infBrd.style.borderRadius = '0 0 ' + cell.d + 'px ' + cell.d + 'px';
infBrd.style.fontSize = cell.d / 4 * 3 + 'px';
infBrd.style.top = canv_y0 + canv_d + cell.d * 2 + 8 + 'px';
infBrd.style.left = (window.innerWidth) / 2 - cell.d * 5 + 'px';

function setUp() {
    // SET-UP
    bomb.n = 0;
    bomb.deathI = bomb.deathJ = 0;

    gameTime = 0;
    gameTimeI = 100;

    flagModeFalse();

    windowUpdate = true;

    game = true;
    win = false;

    m.x = -999;
    m.y = -999;

    sml1.style.display = '';
    sml2.style.display = 'none';

    wnBrd.style.zIndex = -999;
    wnBrd.style.opacity = 0;

    for (let i = 0; i < cell.n; i++) {
        for (let j = 0; j < cell.n; j++) {
            cell.open[i][j] = false;
            boardMatrix[i][j] = 0;
        }
    }

    // TO 80
    const bombsNumber = 40;
    while(bomb.n < bombsNumber) {
        for (let i = 0; i < cell.n; i++) {
            for (let j = 0; j < cell.n; j++) {
                if(Math.random() < 0.1 && bomb.n < bombsNumber && boardMatrix[i][j] == 0) {
                    boardMatrix[i][j] = 9;
                    bomb.n++;
                }
            }
        }
    }
    
    for (let i = 0; i < cell.n; i++) {
        for (let j = 0; j < cell.n; j++) {
            if(boardMatrix[i][j] == 9) {
                for (let l = i-1; l < i+2; l++) {
                    for (let m = j-1; m < j+2; m++) {
                        if(l >= 0 && m >= 0 && l < cell.n && m < cell.n && boardMatrix[l][m] != 9) {
                            boardMatrix[l][m]++;
                        }
                    }
                }
            }
            
        }
    }
}

function bombsOutPut(bn) {
    if(bn < 1000) {
        let bs = '';
        for (let i = 0; i < (3 - (bn+'').length); i++) {
            bs += '0';
        }
        document.querySelector('#bombs').innerHTML = '??' + bs + bn + '??';
    }
}

function timeOutPut(tn) {
    if(tn < 1000) {
        let ts = '';
        for (let i = 0; i < (3 - (tn+'').length); i++) {
            ts += '0';
        }
        document.querySelector('#time').innerHTML = '??' + ts + tn + '??';
    }
}

function BoardProccess() {
    for (let i = 0; i < cell.n; i++) {
        for (let j = 0; j < cell.n; j++) {
            // CKICK-ON
            if(!cell.open[i][j] && m.x > j * cell.d && m.y > i * cell.d && m.x < (j+1) * cell.d && m.y < (i+1) * cell.d) {
                if(!flagMode && boardMatrix[i][j] < 100) {
                    if(boardMatrix[i][j] == 9) {
                        game = false;
                        bomb.deathI = i;
                        bomb.deathJ = j;
                    } else {
                        openCell(i,j,boardMatrix[i][j],cell.open[i][j]);
                    }
                }
                if(flagMode && bomb.n > 0 && boardMatrix[i][j] < 100) {
                    setFlag(i,j);
                }
                else if(flagMode && boardMatrix[i][j] >= 100) {
                    deleteFlag(i,j);
                }
            }
            // CLOSED
            if(!cell.open[i][j]) {
                drawCellClose(j * cell.d, i * cell.d, cell.d);
            }
            // FLAGED
            if(boardMatrix[i][j] >= 100) {
                drawFlag(j * cell.d, i * cell.d, cell.d);
            }
        }
    }
}

function drawCellClose(cx,cy,cd) {
    // LEFT-UP
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + cd, cy);
    ctx.lineTo(cx, cy + cd);
    ctx.closePath();
    ctx.fillStyle = 'white';
    ctx.fill();
    // RIGHT-DOWN
    ctx.beginPath();
    ctx.moveTo(cx + cd, cy + cd);
    ctx.lineTo(cx, cy + cd);
    ctx.lineTo(cx + cd, cy);
    ctx.closePath();
    ctx.fillStyle = 'gray';
    ctx.fill();
    // CAP
    ctx.fillStyle = 'silver';
    ctx.beginPath();
    ctx.fillRect(cx + cd / 10,cy + cd / 10,cd - 2 * cd / 10,cd - 2 * cd / 10);
    ctx.fill();
}

function drawBomb(bx,by,bd) {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(bx + bd / 2,by + bd / 10);
    ctx.lineTo(bx + bd / 2,by + bd / 10 * 9);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(bx + bd / 10,by + bd / 2);
    ctx.lineTo(bx + bd / 10 * 9,by + bd / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(bx + bd / 20 * 5,by + bd / 20 * 5);
    ctx.lineTo(bx + bd / 20 * 15,by + bd / 20 * 15);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(bx + bd / 20 * 15,by + bd / 20 * 5);
    ctx.lineTo(bx + bd / 20 * 5,by + bd / 20 * 15);
    ctx.stroke();

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(bx + bd / 2,by + bd / 2,bd / 4,0,Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(bx + bd / 10 * 4,by + bd / 10 * 4,bd / 15,0,Math.PI * 2);
    ctx.fill();
}

function drawCellOpen(cx,cy,cd,cc = 'silver') {
    // BACK
    ctx.fillStyle = cc;
    ctx.beginPath();
    ctx.fillRect(cx,cy,cd,cd);
    ctx.fill();
    // BORDER
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.strokeRect(cx,cy,cd,cd);
    ctx.stroke();
}

function drawFlag(fx,fy,fd) {
    // STICK
    ctx.beginPath();
    ctx.moveTo(fx + fd / 2, fy + fd / 10);
    ctx.lineTo(fx + fd / 2, fy + fd / 10 * 8);
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'red';
    ctx.stroke();
    // BASE
    ctx.beginPath();
    ctx.moveTo(fx + fd / 4 * 1, fy + fd / 10 * 8);
    ctx.lineTo(fx + fd / 4 * 3, fy + fd / 10 * 8);
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'red';
    ctx.stroke();
    // HAT
    ctx.beginPath();
    ctx.moveTo(fx + fd / 2, fy + fd / 10);
    ctx.lineTo(fx + fd / 10 * 9, fy + fd / 10 * 3);
    ctx.lineTo(fx + fd / 2, fy + fd / 10 * 5);
    ctx.closePath();
    ctx.fillStyle = 'red';
    ctx.fill();
}

function drawText(ts,tx,ty,td) {
    if(ts > 0) {
        switch (ts) {
        case 1:
            ctx.fillStyle = 'blue';
        break;
        case 2:
            ctx.fillStyle = 'green';
        break;
        case 3:
            ctx.fillStyle = 'red';
        break;
        case 4:
            ctx.fillStyle = 'navy';
        break;
        case 5:
            ctx.fillStyle = 'darkred';
        break;
        case 6:
            ctx.fillStyle = 'LightSeaGreen';
        break;
        case 7:
            ctx.fillStyle = 'black';
        break;
        case 8:
            ctx.fillStyle = 'gray';
        break;
        case 9:
            ctx.fillStyle = 'black';
        break;
        default:
            ctx.fillStyle = 'gray';
        break;
        }
        ctx.font = td / 10 *  9 + 'px PixelTimes, Arial, sans-serif';
        ctx.fillText(ts,tx + td / 10 * 3,ty + td / 20 * 17);
    }
}

function openCell(ci,cj,c_value,c_open) {
    if(!c_open && c_value == 0 && c_value < 100) {
        cell.open[ci][cj] = true;
        // +DRAW
        drawCellOpen(cj * cell.d, ci * cell.d, cell.d);
        drawText(boardMatrix[ci][cj], cj * cell.d, ci * cell.d, cell.d);
        for (let i = ci-1; i < ci+2; i++) {
            for (let j = cj-1; j < cj+2; j++) {
                if(i >= 0 && j >= 0 && i < cell.n && j < cell.n) {
                    openCell(i,j,boardMatrix[i][j],cell.open[i][j]);
                }
            }
        }
    }
    if(!c_open && c_value != 0 && c_value < 100) {
        cell.open[ci][cj] = true;
        // +DRAW
        drawCellOpen(cj * cell.d, ci * cell.d, cell.d);
        drawText(boardMatrix[ci][cj], cj * cell.d, ci * cell.d, cell.d);
    }
}

function gameOver(gi,gj) {
    for (let i = 0; i < cell.n; i++) {
        for (let j = 0; j < cell.n; j++) {
            if (boardMatrix[i][j] == 9) {
                drawCellOpen(j * cell.d, i * cell.d, cell.d);
                if(i == gi && j == gj) {
                    drawCellOpen(j * cell.d, i * cell.d, cell.d, 'red');
                }
                drawBomb(j * cell.d, i * cell.d, cell.d);
            }
            if (boardMatrix[i][j] == 109) {
                drawCellOpen(j * cell.d, i * cell.d, cell.d);
                drawBomb(j * cell.d, i * cell.d, cell.d);
                drawFlag(j * cell.d, i * cell.d, cell.d)
            }
        }
    }
    sml1.style.display = 'none';
    sml2.style.display = '';
}

function setFlag(fi,fj) {
    boardMatrix[fi][fj] += 100;
    bomb.n--;
}

function deleteFlag(fi,fj) {
    boardMatrix[fi][fj] -= 100;
    bomb.n++;
}

function flagModeFalse() {
    flgBrd.querySelector('.flag1').style.backgroundColor = '#646464';
    flgBrd.querySelector('.flag2').style.backgroundColor = '#646464';
    flgBrd.querySelector('.flag3').style.borderLeftColor = '#646464';
    flgCrc.style.backgroundColor = 'gray';

    flgCrc.style.transition = '1s'
    flgBrd.querySelector('.flag1').style.transition = '1s'
    flgBrd.querySelector('.flag2').style.transition = '1s'
    flgBrd.querySelector('.flag3').style.transition = '1s'

    flagMode = false;
}

function flagModeTrue() {
    flgBrd.querySelector('.flag1').style.backgroundColor = 'darkred';
    flgBrd.querySelector('.flag2').style.backgroundColor = 'darkred';
    flgBrd.querySelector('.flag3').style.borderLeftColor = 'darkred';
    flgCrc.style.backgroundColor = 'red';
    flgCrc.style.transition = '1s'

    flagMode = true;
}

function winCheck(bn) {
    if(bn == 0 && !win) {
        win = true;
        for (let i = 0; i < cell.n; i++) {
            for (let j = 0; j < cell.n; j++) {
                if(boardMatrix[i][j] == 9) {
                    win = false;
                    break;
                }
            }
        }
    }
}

setUp();
// ==========MAIN==========
const gameLoop = setInterval(() => {
    if(game && !win) {
        if(windowUpdate) {
            BoardProccess();
          
            bombsOutPut(bomb.n);
            winCheck(bomb.n);
            windowUpdate = false;
        }
        if(win) {
            console.log('---WIN---');
            wnBrd.style.zIndex = 999;
            wnBrd.style.opacity = .4;

        }
        flgBrd.style.top = window.innerHeight / 2 - cell.d + 'px';
        if(gameTimeI > 100) {
            
            timeOutPut(gameTime);
            gameTimeI = 0;
            gameTime++;
        }
        gameTimeI++;
    }
    if(!game) {
        gameOver(bomb.deathI,bomb.deathJ);
    }
}, 10);

// CLICKS-EVENT
canv.addEventListener('click', (e) => {
    if(game) {
        m.x = e.pageX - canv_x0 - 5;
        m.y = e.pageY - canv_y0 - cell.d * 2;

        windowUpdate = true;
    }
});

document.querySelector('.flagBoard').addEventListener('click', () => {
    if(flagMode) {
        flagModeFalse();
    } 
    else {
        flagModeTrue();
    }
});

document.querySelector('#smile').addEventListener('click', () => {
    console.log('smile');
    setUp();
});

// EXTRA
let CRdeg = 180;
document.querySelector('#CR').addEventListener('click', () => {
        document.querySelector('#CR').style.transform = 'rotate(' + CRdeg + 'deg)';
        document.querySelector('#CR').style.transition = '3s';
        CRdeg += 180;
});