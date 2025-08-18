import React from "react";
import { NavLink } from "react-router-dom";
import { glossaries } from './GlossariesData';  // <-- новый импорт

function GlossariesForm() {
  return (
    <div className="glossary-list">
      <ul className="glossary-items">
        {glossaries.map((glossary) => (
          <li key={glossary.id} className="glossary-item">
            <NavLink to={`/base_knowledge/glossaries/${glossary.id}`} className="glossary-link">
              {glossary.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GlossariesForm;