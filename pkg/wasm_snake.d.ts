/* tslint:disable */
/* eslint-disable */
/**
*/
export enum GameStates {
  Ok,
  Eaten,
  Over,
  Win,
}
/**
*/
export enum Block {
  Empty,
  Snake,
  Food,
}
/**
*/
export enum Direction {
  Left,
  Right,
  Up,
  Down,
}
/**
*/
export class Food {
  free(): void;
}
/**
*/
export class Game {
  free(): void;
/**
* @param {number} width
* @param {number} height
* @returns {Game}
*/
  static init(width: number, height: number): Game;
/**
* @param {number} row
* @param {number} col
* @returns {number}
*/
  get_index(row: number, col: number): number;
/**
* @returns {number}
*/
  tick(): number;
/**
* @returns {number}
*/
  get_blocks(): number;
/**
* @returns {number}
*/
  width(): number;
/**
* @returns {number}
*/
  height(): number;
/**
* @param {number} new_direction
*/
  change_snake_direction(new_direction: number): void;
}
/**
*/
export class Pos {
  free(): void;
}
/**
*/
export class Snake {
  free(): void;
/**
* @param {number} new_direction
*/
  change_direction(new_direction: number): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_game_free: (a: number) => void;
  readonly game_init: (a: number, b: number) => number;
  readonly game_get_index: (a: number, b: number, c: number) => number;
  readonly game_tick: (a: number) => number;
  readonly game_get_blocks: (a: number) => number;
  readonly game_width: (a: number) => number;
  readonly game_height: (a: number) => number;
  readonly game_change_snake_direction: (a: number, b: number) => void;
  readonly __wbg_snake_free: (a: number) => void;
  readonly snake_change_direction: (a: number, b: number) => void;
  readonly __wbg_food_free: (a: number) => void;
  readonly __wbg_pos_free: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
