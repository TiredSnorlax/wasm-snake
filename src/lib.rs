mod random;

use random::random_range;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub enum GameStates {
    Ok,
    Eaten,
    Over,
    Win,
}

#[wasm_bindgen]
#[derive(Clone, PartialEq)]
pub enum Block {
    Empty,
    Snake,
    Food,
}
#[wasm_bindgen]
pub struct Game {
    width: i32,
    height: i32,
    grid: Vec<Block>,
    snake: Snake,
    food: Food,
}

#[wasm_bindgen]
impl Game {
    pub fn init(width: i32, height: i32) -> Self {
        let grid = vec![Block::Empty; (width * height) as usize];
        Game {
            width,
            height,
            grid,
            snake: Snake::new(width as i32 / 2, height as i32 / 2),
            food: Food::new(
                random_range(0, width as usize) as i32,
                random_range(0, height as usize) as i32,
            ),
        }
    }

    pub fn get_index(&self, row: i32, col: i32) -> i32 {
        row * self.width + col
    }

    pub fn tick(&mut self) -> GameStates {
        let game_state = self
            .snake
            .update(self.width, self.height, &self.food.position);

        for col in 0..self.width as usize {
            for row in 0..self.height as usize {
                let index = self.get_index(row as i32, col as i32);
                self.grid[index as usize] = Block::Empty;
            }
        }

        let food_index = self.get_index(self.food.position.y, self.food.position.x);

        self.grid[food_index as usize] = Block::Food;

        for pos in &self.snake.body {
            let index = self.get_index(pos.y, pos.x);
            self.grid[index as usize] = Block::Snake;
        }

        match game_state {
            GameStates::Eaten => {
                self.food.reset(self.grid.clone(), self.width, self.height);
            }
            GameStates::Ok => (),
            state => return state,
        }

        game_state
    }

    pub fn get_blocks(&self) -> *const Block {
        self.grid.as_ptr()
    }

    pub fn width(&self) -> i32 {
        self.width
    }

    pub fn height(&self) -> i32 {
        self.height
    }

    pub fn change_snake_direction(&mut self, new_direction: Direction) {
        self.snake.change_direction(new_direction);
    }
}

#[wasm_bindgen]
#[derive(Clone, PartialEq)]
pub struct Pos {
    x: i32,
    y: i32,
}

#[wasm_bindgen]
#[derive(Clone, Copy)]
pub enum Direction {
    Left,
    Right,
    Up,
    Down,
}

#[wasm_bindgen]
pub struct Snake {
    body: Vec<Pos>,
    direction: Direction,
    prev_direction: Direction,
}

#[wasm_bindgen]
impl Snake {
    fn new(x: i32, y: i32) -> Self {
        Snake {
            body: vec![Pos { x, y }],
            direction: Direction::Right,
            prev_direction: Direction::Right,
        }
    }

    pub fn change_direction(&mut self, new_direction: Direction) {
        let valid = match (&self.direction, &new_direction) {
            (Direction::Left, Direction::Right) => false,
            (Direction::Right, Direction::Left) => false,
            (Direction::Up, Direction::Down) => false,
            (Direction::Down, Direction::Up) => false,
            _ => true,
        };

        if valid {
            self.direction = new_direction;
        }
    }

    fn check_crash(&self, new_position: &Pos) -> bool {
        self.body.contains(new_position)
    }

    fn update(&mut self, width: i32, height: i32, food_pos: &Pos) -> GameStates {
        // self.prev_direction = self.direction;

        let mut status = GameStates::Ok;
        let prev_pos = &self.body[0];
        let mut new_pos = Pos {
            x: prev_pos.x,
            y: prev_pos.y,
        };
        // TODO - Use the technique in the wasm game of life game to wrap around grid
        match self.direction {
            Direction::Left => new_pos.x -= 1,
            Direction::Right => new_pos.x += 1,
            Direction::Up => new_pos.y -= 1,
            Direction::Down => new_pos.y += 1,
        }

        if new_pos.x < 0 as i32 {
            new_pos.x = width - 1;
        } else if new_pos.x >= width {
            new_pos.x = 0;
        }

        if new_pos.y < 0 as i32 {
            new_pos.y = height - 1;
        } else if new_pos.y >= height {
            new_pos.y = 0;
        }

        if food_pos == &new_pos {
            if self.body.len() == (width * height) as usize {
                return GameStates::Win;
            }
            status = GameStates::Eaten;
        } else {
            self.body.pop();
        }

        if !self.check_crash(&new_pos) {
            self.body.insert(0, new_pos);
        } else {
            status = GameStates::Over;
        }

        status
    }
}

#[wasm_bindgen]
pub struct Food {
    position: Pos,
}

impl Food {
    fn new(x: i32, y: i32) -> Self {
        Food {
            position: Pos { x, y },
        }
    }

    fn reset(&mut self, blocks: Vec<Block>, width: i32, height: i32) {
        let empty_indexes: Vec<(usize, Block)> = blocks
            .into_iter()
            .enumerate()
            .filter(|(_, block)| *block == Block::Empty)
            .collect();

        if empty_indexes.len() == 0 {
            return;
        }
        let rand_index = random_range(0, empty_indexes.len());
        let index = empty_indexes[rand_index].0 as i32;

        self.position.x = index % width;
        self.position.y = index / width;
    }
}
