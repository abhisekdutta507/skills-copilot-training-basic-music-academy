import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import ClassesPage from './pages/ClassesPage.jsx';
import EnrollPage from './pages/EnrollPage.jsx';

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/classes" element={<ClassesPage />} />
                    <Route path="/enroll" element={<EnrollPage />} />
                </Routes>
            </main>
            <Footer />
        </BrowserRouter>
    );
}
