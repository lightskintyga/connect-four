import ConnectFour from '@/entities/game/ui/ConnectFour';

export default function GamePage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4
                bg-gradient-to-br from-blue-50 to-indigo-100
                dark:from-gray-900 dark:to-gray-800
                transition-colors">
            <ConnectFour />
        </div>
    );
}