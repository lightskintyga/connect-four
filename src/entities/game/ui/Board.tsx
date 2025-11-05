import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import {Chip} from "@shared/ui/Chip.tsx";

interface BoardProps {
    board: (1 | 2 | null)[][];
    currentPlayer: 1 | 2 | null;
    winner: 1 | 2 | null;
    isDraw: boolean;
    makeMove: (col: number) => void;
    dropRow: (board: (1 | 2 | null)[][], col: number) => number | null;
    hoveredCol: number | null;
    onHover: (col: number | null) => void;
    disabled?: boolean;
    winningCells: { row: number; col: number }[];
}

export const Board = ({
                          board,
                          currentPlayer,
                          winner,
                          isDraw,
                          winningCells,
                          makeMove,
                          dropRow,
                          hoveredCol,
                          onHover,
                          disabled,
                      }: BoardProps) => {
    if (!Array.isArray(board) || !board[0] || !Array.isArray(board[0])) {
        return <div className="text-gray-500 text-sm text-center">Загрузка...</div>;
    }

    const cols = board[0].length;

    return (
        <div className="bg-blue-700 dark:bg-blue-950 p-4 rounded-xl shadow-inner max-w-full transition-colors">
            <div
                className="grid gap-2"
                style={{
                    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                }}
            >
                {Array(cols)
                    .fill(null)
                    .map((_, col) => (
                        <div
                            key={col}
                            className="relative"
                            onMouseEnter={() => !winner && !isDraw && !disabled && onHover(col)}
                            onMouseLeave={() => onHover(null)}
                        >
                            {/* Hover preview */}
                            <AnimatePresence>
                                {hoveredCol === col &&
                                    !winner &&
                                    !isDraw &&
                                    !disabled &&
                                    dropRow(board, col) !== null && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 0.5, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            className={clsx(
                                                'absolute left-1/2 -top-12 -translate-x-1/2 w-14 h-14 rounded-full',
                                                currentPlayer === 1 ? 'bg-red-500' : 'bg-yellow-500'
                                            )}
                                        />
                                    )}
                            </AnimatePresence>

                            <button
                                onClick={() => !disabled && makeMove(col)}
                                disabled={!!winner || isDraw || dropRow(board, col) === null || disabled}
                                className="space-y-2 w-full"
                            >
                                {board.map((row, rowIndex) => (
                                    <div key={rowIndex} className="relative w-full h-full">
                                        <div className="w-16 h-16 bg-blue-900 dark:bg-blue-800 rounded-full mx-auto shadow-inner" />
                                        {row[col] && (
                                            <Chip
                                                player={row[col]!}
                                                isWinning={winningCells.some(
                                                    (c) => c.row === rowIndex && c.col === col
                                                )}
                                            />
                                        )}
                                    </div>
                                ))}
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
};