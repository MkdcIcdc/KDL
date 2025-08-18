import React, { useState } from "react";
import './glossary/glossary.css';
import { NavLink } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout({ children }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className='body'>
            <Sidebar />

            <main className='main-container'>
                <div className='head'></div>
                <div className='table-div'>
                    <NavLink
                        to="/base_knowledge/glossaries"
                        className={({ isActive }) => "tables" + (isActive ? " active" : "")}
                    >
                        Глоссарии
                    </NavLink>
                    <NavLink
                        to="/base_knowledge/states"
                        className={({ isActive }) => "tables" + (isActive ? " active" : "")}
                    >
                        Справочник состояний
                    </NavLink>
                </div>

                {children}
            </main>
        </div>
    );
}

export default Layout;