import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import triangle from '../buttons/tringle.svg';
import '../pages/glossary/glossary.css';

function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside className={`nav-panel ${collapsed ? 'collapsed' : ''}`}>
            <nav>
                <p className='nav-main-text'>
                    {collapsed ? '☰' : 'Система интерпретации лабораторных данных'}
                </p>
                <ul className={`nav-list ${collapsed ? 'collapsed' : 'expanded'}`}>
                    <li>
                        <NavLink
                            to='/patients'
                            className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
                        >
                            Список пациентов
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to='/base_knowledge/glossaries'
                            className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
                        >
                            База знаний
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <button
                className={`close-btn ${collapsed ? 'rotated' : ''}`}
                onClick={() => setCollapsed(!collapsed)}
                aria-label="Свернуть меню"
            >
                <img src={triangle} alt="Toggle" className="close-icon" />
            </button>
        </aside>
    );
}

export default Sidebar;