import React, { useState } from "react";
import './glossary/glossary.css';
import { NavLink } from "react-router-dom";
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