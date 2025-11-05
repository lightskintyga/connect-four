import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/home/ui/HomePage';
import GamePage from '@/pages/game/ui/GamePage';
import {useTheme} from "@shared/lib/useTheme.ts";

export default function App() {
    useTheme();
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/game" element={<GamePage />} />
            </Routes>
        </BrowserRouter>
    );
}