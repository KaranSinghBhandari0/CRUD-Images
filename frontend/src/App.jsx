import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import New from './components/New';
import Home from './components/Home';
import Update from './components/Update';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/new" element={<New />} />
                <Route path="/update/:id" element={<Update />} />
            </Routes>
        </Router>
    );
}

