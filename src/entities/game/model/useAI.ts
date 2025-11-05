import { useEffect } from 'react';

export const useAI = (
    board: any[][],
    currentPlayer: 1 | 2,
    onMove: (col: number) => void,
    enabled: boolean,
    difficulty: 'easy' | 'hard'
) => {
    useEffect(() => {
        if (!enabled || currentPlayer !== 2) return;

        const think = () => {
            const validCols = board[0].map((_: any, c: number) => c).filter(c => board[0][c] === null);
            if (validCols.length === 0) return;

            if (difficulty === 'easy') {
                const col = validCols[Math.floor(Math.random() * validCols.length)];
                setTimeout(() => onMove(col), 500);
            } else {
                const col = smartMove(board, validCols);
                setTimeout(() => onMove(col), 600);
            }
        };

        think();
    }, [board, currentPlayer, enabled, difficulty]);
};

const smartMove = (board: any[][], validCols: number[]): number => {
    for (const col of validCols) {
        const test = drop(board, col, 2);
        if (checkWin(test, 2)) return col;
    }

    for (const col of validCols) {
        const test = drop(board, col, 1);
        if (checkWin(test, 1)) return col;
    }
    return validCols[Math.floor(Math.random() * validCols.length)];
};

const drop = (board: any[][], col: number, player: 1 | 2): any[][] => {
    const b = board.map(r => [...r]);
    for (let r = b.length - 1; r >= 0; r--) {
        if (b[r][col] === null) {
            b[r][col] = player;
            break;
        }
    }
    return b;
};

const checkWin = (board: any[][], player: 1 | 2): boolean => {
    const R = board.length, C = board[0].length;
    for (let r = 0; r < R; r++) {
        for (let c = 0; c < C; c++) {
            if (board[r][c] !== player) continue;
            if (c + 3 < C && board[r][c+1] === player && board[r][c+2] === player && board[r][c+3] === player) return true;
            if (r + 3 < R && board[r+1][c] === player && board[r+2][c] === player && board[r+3][c] === player) return true;
        }
    }
    return false;
};