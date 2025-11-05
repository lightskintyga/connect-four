import { useState } from 'react';
import { X } from 'lucide-react';

interface Props {
    settings: any;
    onClose: () => void;
    onSave: (settings: any) => void;
}

export const SettingsModal = ({ settings: initial, onClose, onSave }: Props) => {
    const [settings, setSettings] = useState(initial);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-white dark:bg-gray-800 dark:text-gray-100 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl pointer-events-auto transition-colors">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Настройки</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded dark:hover:bg-gray-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <label className="flex items-center justify-between dark:text-gray-300">
                        <span>Игра против ИИ</span>
                        <input
                            type="checkbox"
                            checked={settings.vsAI}
                            onChange={e => setSettings({ ...settings, vsAI: e.target.checked })}
                            className="w-5 h-5"
                        />
                    </label>

                    {settings.vsAI && (
                        <div>
                            <label>Сложность</label>
                            <select
                                value={settings.difficulty}
                                onChange={e => setSettings({ ...settings, difficulty: e.target.value })}
                                className="w-full mt-1 p-2 border rounded dark:bg-gray-800"
                            >
                                <option value="easy">Легко</option>
                                <option value="hard">Сложно</option>
                            </select>
                        </div>
                    )}

                    <div>
                        <label>Строк: {settings.rows}</label>
                        <input
                            type="range"
                            min="4" max="8"
                            value={settings.rows}
                            onChange={e => setSettings({ ...settings, rows: +e.target.value })}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label>Столбцов: {settings.cols}</label>
                        <input
                            type="range"
                            min="4" max="10"
                            value={settings.cols}
                            onChange={e => setSettings({ ...settings, cols: +e.target.value })}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label>Фишек для победы: {settings.win}</label>
                        <input
                            type="range"
                            min="3" max={Math.min(settings.rows, settings.cols)}
                            value={settings.win}
                            onChange={e => setSettings({ ...settings, win: +e.target.value })}
                            className="w-full"
                        />
                    </div>
                </div>

                <button
                    onClick={() => onSave(settings)}
                    className="w-full mt-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    Сохранить
                </button>
            </div>
        </div>
    );
};