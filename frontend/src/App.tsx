import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Feed from './pages/Feed';
import AskQuestion from './pages/AskQuestion';
import QuestionDetail from './pages/QuestionDetail';
import Profile from './pages/Profile';
import Tribes from './pages/Tribes';
import TribeDetail from './pages/TribeDetail';
import Explorer from './pages/Explorer';

export default function App() {
    return (
        <WalletProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/feed" element={<Feed />} />
                    <Route path="/ask" element={<AskQuestion />} />
                    <Route path="/question/:id" element={<QuestionDetail />} />
                    <Route path="/profile/:username" element={<Profile />} />
                    <Route path="/profile/addr/:address" element={<Profile />} />
                    <Route path="/tribes" element={<Tribes />} />
                    <Route path="/tribe/:id" element={<TribeDetail />} />
                    <Route path="/explorer" element={<Explorer />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </WalletProvider>
    );
}
