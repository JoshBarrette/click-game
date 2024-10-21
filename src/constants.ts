export const DEBUG_PLAYER = false;

export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 600;
export const CANVAS_SPAWN_RATE = 45;

export const OBSTACLE_WIDTH = 60;
export const OBSTACLE_SPEED = 6;
export const OBSTACLE_COLOR = "green";

export const PLAYER_RADIUS = 30;
export const PLAYER_SPEED = 5;
// export const PLAYER_SPEED = 0;

export type Rectangle = {
  x: number;
  y?: number;
  height?: number;
  color?: string;
};

export type GameState = {
  isRunning: boolean;
  tick: number;
  score: number;
  playerPos: number;
  isClicked: boolean;
  rects: Rectangle[];
  sin: (x: number) => number;
  playerColor?: string;
};
