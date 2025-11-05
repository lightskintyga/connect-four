type Player = 1 | 2 | null;
type Cell = [number, number]; // [row, col]
type Board = Player[][];

interface StepResult {
    player_1: Cell[];
    player_2: Cell[];
    board_state: 'waiting' | 'pending' | 'win' | 'draw';
    winner?: {
        who: 'player_1' | 'player_2';
        positions: Cell[];
    };
}

interface ValidatorOutput {
    [key: `step_${number}`]: StepResult;
}

const ROWS = 6;
const COLS = 7;
const WIN = 4;

export function validator(moves: number[]): ValidatorOutput {
    const result: ValidatorOutput = {
        step_0: {
            player_1: [],
            player_2: [],
            board_state: 'waiting',
        },
    };

    const board: Board = Array(ROWS)
        .fill(null)
        .map(() => Array(COLS).fill(null));

    const player1Positions: Cell[] = [];
    const player2Positions: Cell[] = [];

    // Проверка победы
    const checkWin = (row: number, col: number, player: Player): Cell[] | null => {
        const directions = [
            [0, 1],   // горизонталь
            [1, 0],   // вертикаль
            [1, 1],   // диагональ \
            [1, -1],  // диагональ /
        ];

        for (const [dr, dc] of directions) {
            const line: Cell[] = [];
            // Вперёд
            for (let i = 0; i < WIN; i++) {
                const r = row + dr * i;
                const c = col + dc * i;
                if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
                    line.push([r, c]);
                } else break;
            }
            // Назад
            for (let i = 1; i < WIN; i++) {
                const r = row - dr * i;
                const c = col - dc * i;
                if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
                    line.push([r, c]);
                } else break;
            }
            if (line.length >= WIN) {
                return line.slice(0, WIN);
            }
        }
        return null;
    };

    const isDraw = (): boolean => board[0].every(cell => cell !== null);

    const makeMove = (col: number, player: Player, step: number) => {
        if (col < 0 || col >= COLS) return; // неверный ход

        // Найти нижнюю свободную ячейку
        for (let row = ROWS - 1; row >= 0; row--) {
            if (board[row][col] === null) {
                board[row][col] = player;
                const pos: Cell = [row, col];

                if (player === 1) player1Positions.push(pos);
                else player2Positions.push(pos);

                const winLine = checkWin(row, col, player);

                const state: StepResult = {
                    player_1: [...player1Positions],
                    player_2: [...player2Positions],
                    board_state: winLine ? 'win' : isDraw() ? 'draw' : 'pending',
                };

                if (winLine) {
                    state.winner = {
                        who: player === 1 ? 'player_1' : 'player_2',
                        positions: winLine,
                    };
                }

                result[`step_${step}`] = state;
                return;
            }
        }
    };

    // Обработка ходов
    moves.forEach((col, index) => {
        const player = index % 2 === 0 ? 1 : 2; // 0,2,4... → player_1; 1,3,5... → player_2
        makeMove(col, player, index + 1);
    });

    return result;
}