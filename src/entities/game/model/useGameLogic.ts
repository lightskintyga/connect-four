import { useState, useEffect, useCallback } from 'react';

type Player = 1 | 2;
type Winner = 1 | 2 | null;
type Board = (Player | null)[][];
type History = Board[];
type Cell = { row: number; col: number };

interface GameState {
    board: Board;
    currentPlayer: Player;
    winner: Winner;
    isDraw: boolean;
    isDeadlocked: boolean;
    hoveredCol: number | null;
    winningCells: Cell[];
}

interface GameSettings {
    rows: number;
    cols: number;
    win: number;
}

const canWin = (board: Board, win: number): boolean => {
    const rows = board.length;
    const cols = board[0].length;

    const directions = [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, -1],
    ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            for (const [dr, dc] of directions) {
                const cells: (Player | null)[] = [];

                for (let i = 0; i < win; i++) {
                    const nr = r + dr * i;
                    const nc = c + dc * i;
                    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) break;
                    cells.push(board[nr][nc]);
                }

                if (cells.length === win) {
                    const nonNull = cells.filter(x => x !== null);
                    const allSame = new Set(nonNull).size <= 1;
                    if (allSame) return true;
                }
            }
        }
    }

    return false;
};



export const useGameLogic = (settings: GameSettings) => {
    const safeRows = Math.max(4, Math.min(8, settings.rows));
    const safeCols = Math.max(4, Math.min(10, settings.cols));
    const safeWin = Math.max(3, Math.min(settings.win, settings.rows, settings.cols));

    const initBoard = (): Board => {
        return Array(safeRows).fill(null).map(() => Array(safeCols).fill(null));
    };

    const [state, setState] = useState<GameState>({
        board: initBoard(),
        currentPlayer: 1,
        winner: null,
        isDraw: false,
        isDeadlocked: false,
        hoveredCol: null,
        winningCells: [],
    });

    const [history, setHistory] = useState<History>([initBoard()]);
    const [historyIndex, setHistoryIndex] = useState(0);

    useEffect(() => {
        const newBoard = initBoard();
        setState({
            board: newBoard,
            currentPlayer: 1,
            winner: null,
            isDraw: false,
            isDeadlocked: false,
            hoveredCol: null,
            winningCells: [],
        });
        setHistory([newBoard]);
        setHistoryIndex(0);
    }, [safeRows, safeCols, safeWin]);

    const setHoveredCol = useCallback((col: number | null) => {
        setState(s => ({ ...s, hoveredCol: col }));
    }, []);

    const dropRow = (board: Board, col: number): number | null => {
        if (!board || board.length === 0) return null;
        if (col < 0 || col >= board[0].length) return null;

        for (let r = board.length -1; r >= 0; r--) {
            if (!board[r] || board[r][col] === undefined) continue;
            if (!board[r][col]) return r;
        }

        return null;
    };

    const findWinningCells = (board: Board, row: number, col: number, player: Player): Cell[] => {
        const directions = [[0,1],[1,0],[1,1],[1,-1]];
        for (const [dr, dc] of directions) {
            const cells: Cell[] = [];
            let count = 1;
            cells.push({ row, col });

            for (let i = 1; i < safeWin; i++) {
                const r = row + dr * i, c = col + dc * i;
                if (r >= 0 && r < safeRows && c >= 0 && c < safeCols && board[r][c] === player) {
                    count++;
                    cells.push({ row: r, col: c });
                } else break;
            }

            for (let i = 1; i < safeWin; i++) {
                const r = row - dr * i, c = col - dc * i;
                if (r >= 0 && r < safeRows && c >= 0 && c < safeCols && board[r][c] === player) {
                    count++;
                    cells.push({ row: r, col: c });
                } else break;
            }

            if (count >= safeWin) return cells;
        }
        return [];
    };

    const isFull = (board: Board): boolean => board.every(row => row.every(cell => cell !== null));

    const makeMove = useCallback((col: number) => {
        if (state.winner || state.isDraw || state.isDeadlocked) return;

        const row = dropRow(state.board, col);
        if (row === null) return;

        const newBoard = state.board.map((r, ri) =>
            r.map((cell, ci) => (ri === row && ci === col ? state.currentPlayer : cell))
        );

        const winningCells = findWinningCells(newBoard, row, col, state.currentPlayer);
        const won = winningCells.length >= safeWin;
        const full = isFull(newBoard);

        const stillPossible = !full && canWin(newBoard, safeWin);

        const newState = {
            board: newBoard,
            currentPlayer: (state.currentPlayer === 1 ? 2 : 1) as Player,
            winner: won ? state.currentPlayer : null,
            isDraw: !won && full,
            isDeadlocked: !won && !full && !stillPossible,
            hoveredCol: null,
            winningCells: won ? winningCells : [],
        };

        setState(newState);
        setHistory(prev => [...prev.slice(0, historyIndex + 1), newBoard]);
        setHistoryIndex(prev => prev + 1);
    }, [state, dropRow, findWinningCells, safeWin, historyIndex]);

    const undo = useCallback(() => {
        if (historyIndex <= 0) return;
        const prevIndex = historyIndex - 1;
        setState(s => ({
            ...s,
            board: history[prevIndex],
            currentPlayer: s.currentPlayer === 1 ? 2 : 1,
            winner: null,
            isDraw: false,
            isDeadlocked: false,
            winningCells: [],
        }));
        setHistoryIndex(prevIndex);
    }, [history, historyIndex]);

    const redo = useCallback(() => {
        if (historyIndex >= history.length - 1) return;
        const nextIndex = historyIndex + 1;
        setState(s => ({
            ...s,
            board: history[nextIndex],
            currentPlayer: s.currentPlayer === 1 ? 2 : 1,
            winner: null,
            isDraw: false,
            isDeadlocked: false,
            winningCells: [],
        }));
        setHistoryIndex(nextIndex);
    }, [history, historyIndex]);

    const reset = useCallback(() => {
        const newBoard = initBoard();
        setState({
            board: newBoard,
            currentPlayer: 1,
            winner: null,
            isDraw: false,
            isDeadlocked: false,
            hoveredCol: null,
            winningCells: [],
        });
        setHistory([newBoard]);
        setHistoryIndex(0);
    }, [safeRows, safeCols]);

    return {
        state,
        makeMove,
        reset,
        undo,
        redo,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1,
        dropRow: useCallback((board: Board, col: number) => dropRow(board, col), [safeRows]),
        setHoveredCol,
    };
};