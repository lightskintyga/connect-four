import { Undo2, Redo2 } from 'lucide-react';

interface Props {
    canUndo: boolean;
    canRedo: boolean;
    onUndo: () => void;
    onRedo: () => void;
}

export const GameHistory = ({ canUndo, canRedo, onUndo, onRedo }: Props) => {
    return (
        <div className="flex justify-center gap-4 mb-4">
            <button
                onClick={onUndo}
                disabled={!canUndo}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            >
                <Undo2 className="w-4 h-4" />
                Отменить
            </button>
            <button
                onClick={onRedo}
                disabled={!canRedo}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            >
                <Redo2 className="w-4 h-4" />
                Повторить
            </button>
        </div>
    );
};