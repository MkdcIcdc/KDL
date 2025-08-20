import React from "react";
import './glossary/glossary.css';
import Sidebar from "./Sidebar";

function PatientLayout({ children }) {
    return (
        <div className='body'>
            <Sidebar/>
            <main className='main-container'>
                <div className='head'></div>
                {children}
            </main>
        </div>
    );
}

export default PatientLayout;