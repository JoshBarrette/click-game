import { CANVAS_HEIGHT, CANVAS_SPAWN_RATE, CANVAS_WIDTH, DEBUG_PLAYER, OBSTACLE_COLOR, OBSTACLE_SPEED, OBSTACLE_WIDTH, PLAYER_RADIUS, PLAYER_SPEED, } from "./constants.js";
function get_view() {
    return document.getElementById("view");
}
function get_context() {
    var view = get_view();
    return view.getContext("2d");
}
function draw_rectangle(x, y, width, height, color) {
    const ctx = get_context();
    ctx.fillStyle = color !== null && color !== void 0 ? color : "black";
    ctx.fillRect(x !== null && x !== void 0 ? x : 0, y !== null && y !== void 0 ? y : 0, width !== null && width !== void 0 ? width : 200, height !== null && height !== void 0 ? height : 200);
}
function draw_circle(x, y, radius, color) {
    const ctx = get_context();
    ctx.fillStyle = color !== null && color !== void 0 ? color : "purple";
    ctx.beginPath();
    ctx.arc((x !== null && x !== void 0 ? x : 0) + (radius !== null && radius !== void 0 ? radius : 50), (y !== null && y !== void 0 ? y : 0) + (radius !== null && radius !== void 0 ? radius : 50), radius !== null && radius !== void 0 ? radius : 50, 0, 2 * Math.PI);
    ctx.fill();
}
function clear_canvas() {
    var ctx = get_context();
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_WIDTH);
}
function check_distance(top, bottom) {
    var _a, _b, _c, _d;
    if (!top || !bottom)
        return false;
    const center = { x: 50 + PLAYER_RADIUS, y: state.playerPos };
    let dx = center.x - top.x;
    let dy = center.y - ((_a = top.height) !== null && _a !== void 0 ? _a : 0);
    const distance1 = PLAYER_RADIUS >= Math.sqrt(dx * dx + dy * dy);
    dx = center.x - (top.x + 200);
    dy = center.y - ((_b = top.height) !== null && _b !== void 0 ? _b : 0);
    const distance2 = PLAYER_RADIUS >= Math.sqrt(dx * dx + dy * dy);
    dx = center.x - bottom.x;
    dy = center.y - ((_c = bottom.y) !== null && _c !== void 0 ? _c : CANVAS_HEIGHT);
    const distance3 = PLAYER_RADIUS >= Math.sqrt(dx * dx + dy * dy);
    dx = center.x - (bottom.x + 200);
    dy = center.y - ((_d = bottom.y) !== null && _d !== void 0 ? _d : CANVAS_HEIGHT);
    const distance4 = PLAYER_RADIUS >= Math.sqrt(dx * dx + dy * dy);
    return distance1 || distance2 || distance3 || distance4;
}
function draw_frame() {
    var _a, _b, _c;
    if (!state.isRunning && state.tick != 0) {
        document.getElementById("gameOverModal").style.display =
            "block";
        document.getElementById("gameOverScore").innerHTML = `SCORE: ${state.score}`;
        return;
    }
    // Update score
    state.score = Math.floor(state.tick / 5);
    document.getElementById("score").innerHTML =
        state.score.toString();
    // Spawn new obstacles
    if (state.tick % CANVAS_SPAWN_RATE == 0) {
        const sin = state.sin(state.tick);
        state.rects.push({
            x: CANVAS_WIDTH,
            height: sin + 200,
            color: OBSTACLE_COLOR,
        });
        state.rects.push({
            x: CANVAS_WIDTH,
            y: sin + 400,
            height: CANVAS_HEIGHT,
            color: OBSTACLE_COLOR,
        });
    }
    // Check player collision
    const playerCenterX = 50 + PLAYER_RADIUS;
    const topY = (_a = state.rects[0].height) !== null && _a !== void 0 ? _a : 0;
    const bottomY = (_b = state.rects[1].y) !== null && _b !== void 0 ? _b : CANVAS_HEIGHT;
    if (
    // Check to see if we can get away with not using radius check
    // and if not then just use rectangle collision detection
    ((state.playerPos < topY ||
        state.playerPos > bottomY ||
        (playerCenterX > state.rects[0].x &&
            playerCenterX < state.rects[0].x + 200)) &&
        // Check for collision without radius
        50 + OBSTACLE_WIDTH >= state.rects[0].x &&
        50 <= state.rects[0].x + OBSTACLE_WIDTH &&
        (state.playerPos - PLAYER_RADIUS <= topY ||
            state.playerPos + PLAYER_RADIUS >= bottomY)) ||
        // Check of collision with radius
        check_distance(state.rects[0], state.rects[1])) {
        state.isRunning = false;
        return;
    }
    // Clear the screen and redraw obstacles
    clear_canvas();
    document.getElementById("gameOverModal").style.display =
        "none";
    state.rects = state.rects.filter((rect) => {
        rect.x -= OBSTACLE_SPEED;
        draw_rectangle(rect.x, rect.y, OBSTACLE_WIDTH, rect.height, rect.color);
        return rect.x + OBSTACLE_WIDTH >= 0;
    });
    // Update player pos
    if (state.playerPos < CANVAS_HEIGHT - PLAYER_RADIUS &&
        state.playerPos > PLAYER_RADIUS) {
        state.playerPos += PLAYER_SPEED * (state.isClicked ? -1 : 1);
    }
    else if (state.playerPos == CANVAS_HEIGHT - PLAYER_RADIUS &&
        state.isClicked) {
        state.playerPos += PLAYER_SPEED * -1;
    }
    else if (state.playerPos == PLAYER_RADIUS && !state.isClicked) {
        state.playerPos += PLAYER_SPEED;
    }
    // Draw debug visuals around player
    if (DEBUG_PLAYER) {
        draw_rectangle(50, state.playerPos - PLAYER_RADIUS, 2 * PLAYER_RADIUS, 2 * PLAYER_RADIUS, "grey");
        draw_rectangle(50, state.playerPos - PLAYER_RADIUS, 4, 4, "blue");
        draw_rectangle(50 + 2 * PLAYER_RADIUS - 4, state.playerPos - PLAYER_RADIUS, 4, 4, "blue");
        draw_rectangle(50, state.playerPos + PLAYER_RADIUS - 4, 4, 4, "yellow");
        draw_rectangle(50 + 2 * PLAYER_RADIUS - 4, state.playerPos + PLAYER_RADIUS - 4, 4, 4, "yellow");
        draw_rectangle(0, state.playerPos, CANVAS_WIDTH, 1, "black");
        draw_rectangle(50 + PLAYER_RADIUS, 0, 1, CANVAS_HEIGHT, "black");
    }
    // Draw player
    draw_circle(50, state.playerPos - PLAYER_RADIUS, PLAYER_RADIUS, (_c = state.playerColor) !== null && _c !== void 0 ? _c : (state.isClicked ? "red" : "brown"));
}
function draw_sin() {
    const ctx = get_context();
    ctx.moveTo(0, 300);
    // const a = Math.random() * 10 + 40;
    // const b = Math.random() * OPENING_AMPLITUDE + 100;
    // for (let x = 0; x < CANVAS_WIDTH; x++) {
    //   const y = Math.sin(x * a) * b;
    //   ctx.lineTo(x, y + CANVAS_HEIGHT / 2);
    // }
    ctx.stroke();
}
const period = Math.random() * 0.02 + 0.05;
const amplitude = Math.random() * 100 + 50;
const state = {
    isRunning: false,
    tick: 0,
    score: 0,
    rects: [],
    isClicked: false,
    playerPos: 300,
    sin: (x) => {
        return Math.sin(x * period) * amplitude;
    },
};
function run_game() {
    setInterval(() => {
        draw_frame();
        state.tick++;
    }, 17);
}
function build_game() {
    const view = get_view();
    view.addEventListener("mousedown", () => {
        state.isClicked = true;
    });
    view.addEventListener("mouseup", () => {
        state.isClicked = false;
    });
    document.addEventListener("keydown", (e) => {
        if (e.key == " ") {
            state.isClicked = true;
        }
    });
    document.addEventListener("keyup", (e) => {
        if (e.key == " ") {
            state.isClicked = false;
        }
    });
    document.getElementById("restartButton").addEventListener("click", () => {
        state.rects = [];
        state.isRunning = true;
        state.playerPos = 300 - PLAYER_RADIUS;
        state.score = 0;
        state.tick = 0;
    });
    document.getElementById("startButton").addEventListener("click", () => {
        state.isRunning = true;
        document.getElementById("newGameModal").style.display =
            "none";
        run_game();
    });
}
build_game();
