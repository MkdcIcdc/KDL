import './App.css';

import React from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import GlossariesPage from "./pages/glossaries/GlossariesPage";
import GlossaryDetailPage from "./pages/glossary/GlossaryDetailPage";
import StatePage from "./pages/states/StatePage";
import PatientPage from "./pages/patients/PatientPage";
import PatientDetailPage from "./pages/patients/PatientDetailPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<LoginPage />} />
                <Route path='patients' element={<PatientPage />} />
                <Route path='patients/:id' element={<PatientDetailPage />} />
                <Route path='base_knowledge/glossaries' element={<GlossariesPage />} />
                <Route path="base_knowledge/glossaries/:id" element={<GlossaryDetailPage />} />
                <Route path='base_knowledge/states' element={<StatePage />} />
            </Routes>
        </Router>
    );
}

export default App;
