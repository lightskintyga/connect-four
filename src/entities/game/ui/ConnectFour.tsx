import { useState, useEffect } from 'react';
import { Board } from './Board';
import { useGameLogic } from '../model/useGameLogic';
import { useAI } from '../model/useAI';
import { storage } from '@/shared/lib/storage';
import { SettingsModal } from './SettingsModal';
import { GameHistory } from '@/features/game-history/ui/GameHistory';
import { RotateCcw, Settings, Timer, Trophy } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/shared/lib/useTheme";

interface GameSettings {
    rows: number;
    cols: number;
    win: number;
    vsAI: boolean;
    difficulty: 'easy' | 'hard';
}

const DEFAULT_SETTINGS: GameSettings = { rows: 6, cols: 7, win: 4, vsAI: false, difficulty: 'easy' };

export default function ConnectFour() {
    const [settings, setSettings] = useState<GameSettings>(() =>
        storage.load('connect4_settings', DEFAULT_SETTINGS)
    );
    const [showSettings, setShowSettings] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const [pvpScores, setPvpScores] = useState(() =>
        storage.load('connect4_pvp_scores', { red: 0, yellow: 0 })
    );
    const [aiEasyScores, setAiEasyScores] = useState(() =>
        storage.load('connect4_ai_easy_scores', { red: 0, yellow: 0 })
    );
    const [aiHardScores, setAiHardScores] = useState(() =>
        storage.load('connect4_ai_hard_scores', { red: 0, yellow: 0 })
    );

    const game = useGameLogic(settings);
    const { state, makeMove, reset, undo, redo, canUndo, canRedo, setHoveredCol } = game;

    useAI(
        state.board,
        state.currentPlayer,
        makeMove,
        settings.vsAI && state.currentPlayer === 2 && !state.winner && !state.isDraw && !state.isDeadlocked,
        settings.difficulty
    );

    useEffect(() => {
        if (isTimerRunning && !state.winner && !state.isDraw) {
            const id = setInterval(() => setTimer(t => t + 1), 1000);
            return () => clearInterval(id);
        }
    }, [isTimerRunning, state.winner, state.isDraw]);

    useEffect(() => {
        if (state.currentPlayer && !state.winner && !state.isDraw) {
            setIsTimerRunning(true);
        }
    }, [state.currentPlayer]);

    useEffect(() => {
        storage.save('connect4_settings', settings);
    }, [settings]);

    useEffect(() => {
        storage.save('connect4_pvp_scores', pvpScores);
    }, [pvpScores]);

    useEffect(() => {
        storage.save('connect4_ai_easy_scores', aiEasyScores);
    }, [aiEasyScores]);

    useEffect(() => {
        storage.save('connect4_ai_hard_scores', aiHardScores);
    }, [aiHardScores]);

    useEffect(() => {
        if (state.winner) {
            if (settings.vsAI) {
                const setScore = settings.difficulty === 'easy' ? setAiEasyScores : setAiHardScores;

                if (state.winner === 1) {
                    setScore(prev => ({ ...prev, red: prev.red + 1 }));
                } else if (state.winner === 2) {
                    setScore(prev => ({ ...prev, yellow: prev.yellow + 1 }));
                }
            } else {
                // PvP
                const winnerKey = state.winner === 1 ? 'red' : 'yellow';
                setPvpScores(prev => ({ ...prev, [winnerKey]: prev[winnerKey] + 1 }));
            }
            setIsTimerRunning(false);
        } else if (state.isDraw) {
            setIsTimerRunning(false);
        }
    }, [state.winner, state.isDraw, settings.vsAI, settings.difficulty]);

    const handleReset = () => {
        reset();
        setTimer(0);
        setIsTimerRunning(true);
    };

    const currentScores = settings.vsAI
        ? (settings.difficulty === 'easy' ? aiEasyScores : aiHardScores)
        : pvpScores;

    const playerName = (p: 1 | 2) =>
        p === 1
            ? 'Красный'
            : settings.vsAI
                ? `Жёлтый (бот${settings.difficulty === 'hard' ? ' hard' : ''})`
                : 'Жёлтый';

    const playerColor = (p: 1 | 2) => (p === 1 ? 'bg-red-500' : 'bg-yellow-500');

    return (
        <>
            <div className="bg-white dark:bg-gray-900 dark:text-gray-100 rounded-2xl shadow-2xl p-8 max-w-4xl w-full mx-auto relative transition-colors">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">4 в ряд</h1>
                    <div className="flex gap-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                        >
                            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <button
                            onClick={() => setShowSettings(true)}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                        >
                            <Settings className="w-5 h-5" />
                        </button>

                        <button onClick={handleReset} className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
                            <RotateCcw className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex justify-center gap-8 mb-4">
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Красный</p>
                        <p className="text-2xl font-bold text-red-600 ">{currentScores.red}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {settings.vsAI ? `Жёлтый (бот${settings.difficulty === 'hard' ? ' hard' : ''})` : 'Жёлтый'}
                        </p>
                        <p className="text-2xl font-bold text-yellow-600">{currentScores.yellow}</p>
                    </div>
                    <div className="text-center flex items-center gap-1">
                        <Timer className="w-5 h-5 text-gray-600" />
                        <p className="text-lg font-mono">
                            {String(Math.floor(timer / 60)).padStart(2, '0')}:{String(timer % 60).padStart(2, '0')}
                        </p>
                    </div>
                </div>

                {!state.winner && !state.isDraw && (
                    <p className="text-center mb-4 font-semibold flex items-center justify-center gap-2">
                        <span className={clsx('w-6 h-6 rounded-full', playerColor(state.currentPlayer))} />
                        Ход: {state.currentPlayer ? playerName(state.currentPlayer) : ""}
                    </p>
                )}

                <AnimatePresence mode="wait">
                    {state.winner && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="p-4 bg-green-100 border-2 border-green-300 rounded-lg text-center mb-4"
                        >
                            <p className="font-bold text-green-800 flex items-center justify-center gap-2">
                                <Trophy className="w-6 h-6" />
                                Победил: <span className={clsx('w-6 h-6 rounded-full inline-block', playerColor(state.winner))} /> {playerName(state.winner)}!
                            </p>
                        </motion.div>
                    )}
                    {state.isDraw && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="p-4 bg-amber-100 border-2 border-amber-300 rounded-lg text-center mb-4"
                        >
                            <p className="font-bold text-amber-800">Ничья!</p>
                        </motion.div>
                    )}
                    {state.isDeadlocked && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="p-4 bg-red-100 border-2 border-red-300 rounded-lg text-center mb-4"
                        >
                            <p className="font-bold text-red-800">
                                Игра окончена! Нельзя собрать {settings.win} в ряд.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!settings.vsAI && (
                    <GameHistory canUndo={canUndo} canRedo={canRedo} onUndo={undo} onRedo={redo} />
                )}

                <Board
                    board={state.board}
                    currentPlayer={state.currentPlayer}
                    winner={state.winner}
                    isDraw={state.isDraw}
                    isDeadlocked={state.isDeadlocked}
                    winningCells={state.winningCells}
                    makeMove={makeMove}
                    dropRow={game.dropRow}
                    hoveredCol={state.hoveredCol}
                    onHover={setHoveredCol}
                    disabled={settings.vsAI && state.currentPlayer === 2}
                />
            </div>

            {showSettings && (
                <SettingsModal
                    settings={settings}
                    onClose={() => setShowSettings(false)}
                    onSave={(newSettings) => {
                        setSettings(newSettings);
                        handleReset();
                        setShowSettings(false);
                    }}
                />
            )}
        </>
    );
}