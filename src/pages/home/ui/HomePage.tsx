import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100
                dark:from-gray-900 dark:to-gray-800">
            <div className="bg-white dark:bg-gray-900 dark:text-gray-100 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transition-colors">
                <div className="mb-6">
                    <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="grid grid-cols-2 gap-1">
                            <div className="w-8 h-8 bg-red-500 rounded-full" />
                            <div className="w-8 h-8 bg-yellow-500 rounded-full" />
                            <div className="w-8 h-8 bg-yellow-500 rounded-full" />
                            <div className="w-8 h-8 bg-red-500 rounded-full" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 dark:text-gray-100">4 в ряд</h1>
                    <p className="text-gray-600 dark:text-gray-400">Классическая игра для двух игроков</p>
                </div>

                <Link
                    to="/game"
                    className="block w-full py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
                >
                    Начать игру
                </Link>

                <div className="mt-6 pt-4 border-t text-left text-sm text-gray-600 space-y-1 dark:text-gray-400">
                    <p>• Игроки бросают фишки по очереди</p>
                    <p>• Побеждает тот, кто соберёт 4 подряд</p>
                    <p>• По горизонтали, вертикали или диагонали</p>
                </div>
            </div>
        </div>
    );
}