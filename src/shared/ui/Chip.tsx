import { motion } from 'framer-motion';
import { clsx } from 'clsx';

type Player = 1 | 2;

interface ChipProps {
    player: Player;
    isWinning?: boolean;
}

export const Chip = ({ player, isWinning = false }: ChipProps) => {
    return (
        <motion.div
            initial={{ scale: 0, y: -100 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={clsx(
                'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
                'w-14 h-14 max-sm:w-9 max-sm:h-9 rounded-full shadow-lg',
                player === 1 ? 'bg-red-500' : 'bg-yellow-500',
                isWinning && 'ring-4 ring-white ring-offset-2 ring-offset-blue-900 dark:ring-offset-blue-950'
            )}
        />
    );
};