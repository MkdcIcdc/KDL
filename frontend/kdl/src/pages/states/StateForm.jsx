import React, {useState, useRef, useEffect} from "react";
import "../glossary/glossary.css";
import Pagination from "../glossary/Pagination";
import filter from "../../buttons/filter.svg";
import pencil from "../../buttons/blue-pencil.svg";
import DynamicDropdown from "../Dropdown";
import {glossaries_shared} from "../glossaries/GlossariesData";

const dropdownFields = [
    'system', 'organ', 'state', 'potc', 'parameter', 'priority', 'weight',
    'gender', 'tod', 'deviation', 'rec', 'pos_dyn', 'neg_dyn'
];

const numberFields = [
    "age_min", "age_max", "norm_max", "norm_min",
    "mod_dev_min", "mod_dev_max", "exp_dev_min", "exp_dev_max",
    "crit_dev_min", "crit_dev_max"
];

const dropdownApiEndpoints = {
    system: "system",
    organ: "organ",
    state: "state",
    potc: "potc",
    parameter: "parameter",
    priority: "priority",
    weight: "weight",
    gender: "gender",
    tod: "tod",
    deviation: "deviation",
    rec: "rec",
    pos_dyn: "dynamics",
    neg_dyn: "dynamics",
};

export default function TableWithDragAndColumnSelector() {
    const containerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [visibleCols, setVisibleCols] = useState(glossaries_shared.map(col => col.id));
    const [menuOpen, setMenuOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedType, setSelectedType] = useState("");
    const [selectedOrgan, setSelectedOrgan] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [editIndex, setEditIndex] = useState(null);
    const [entries, setEntries] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 5;
    const [dropdownOptions, setDropdownOptions] = useState({});

    // Загружаем все справочники
    useEffect(() => {
        dropdownFields.forEach(field => {
            fetch(`/api/${dropdownApiEndpoints[field]}/`)
                .then(res => res.json())
                .then(data => setDropdownOptions(prev => ({...prev, [field]: data})))
                .catch(err => console.error(`Ошибка загрузки ${field}:`, err));
        });
    }, []);

    // Загружаем записи
    useEffect(() => {
        const fetchEntries = async () => {
            try {
                // Загружаем записи DOS
                const res = await fetch("/api/dos/");
                const data = await res.json();

                // Преобразуем текстовые значения в id по справочникам
                const mappedData = data.map(entry => {
                    const newEntry = {...entry};

                    dropdownFields.forEach(field => {
                        const options = dropdownOptions[field] || [];
                        const found = options.find(opt => opt.name === entry[field]);
                        if (found) newEntry[field] = found.id;
                    });

                    return newEntry;
                });

                setEntries(mappedData);
            } catch (err) {
                console.error("Ошибка загрузки записей:", err);
            }
        };

        // Ждем, пока загрузятся справочники
        if (Object.keys(dropdownOptions).length > 0) {
            fetchEntries();
        }
    }, [dropdownOptions]);

    // Drag-scroll
    const onMouseDown = e => {
        setIsDragging(true);
        setStartX(e.pageX - containerRef.current.offsetLeft);
        setScrollLeft(containerRef.current.scrollLeft);
    };
    const onMouseLeave = () => setIsDragging(false);
    const onMouseUp = () => setIsDragging(false);
    const onMouseMove = e => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - containerRef.current.offsetLeft;
        const walk = x - startX;
        containerRef.current.scrollLeft = scrollLeft - walk;
    };

    // Переключение колонок
    const toggleColumn = (id) => {
        setVisibleCols(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
    };

    // Фильтрация
    const filteredEntries = entries.filter(entry => (
        (selectedType === "" || entry.system === selectedType) &&
        (selectedOrgan === "" || entry.organ === selectedOrgan) &&
        (selectedState === "" || entry.state === selectedState)
    ));

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = filteredEntries.slice(indexOfFirstEntry, indexOfLastEntry);
    const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);

    // Добавить запись
    const handleAddEntry = () => {
        const newEntry = {id: `temp_${Date.now()}`};
        glossaries_shared.forEach(col => {
            newEntry[col.id] = "";
        });
        const newEntries = [...entries, newEntry];
        setEntries(newEntries);
        setEditIndex(newEntries.length - 1);
        setCurrentPage(Math.ceil(newEntries.length / entriesPerPage));
    };

    // Сохранение записи
    const handleSave = async (index) => {
        const entry = entries[index];
        const isNew = String(entry.id).startsWith("temp_");

        const url = isNew
            ? "/api/dos/"
            : `/api/dos/${entry.id}/`;

        const method = isNew ? "POST" : "PUT";

        const payload = {};
        glossaries_shared.forEach(col => {
            const val = entry[col.id];

            if (numberFields.includes(col.id)) {
                payload[col.id] = val !== "" && val != null ? Number(val) : null;
            } else {
                // для dropdown и текстовых полей просто передаём строку или null
                payload[col.id] = val || null;
            }
        });

        console.log("Отправляем данные:", payload);

        try {
            const response = await fetch(url, {
                method,
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const text = await response.text();
                console.error("Ошибка от сервера:", response.status, text);
                alert("Ошибка при сохранении. Проверьте поля или соединение.");
                return;
            }

            const saved = await response.json();
            const updatedEntries = [...entries];
            updatedEntries[index] = {...entry, ...saved, id: saved.id || entry.id};
            setEntries(updatedEntries);
            setEditIndex(null);

        } catch (err) {
            console.error("Ошибка при сохранении записи:", err);
            alert("Ошибка при сохранении. Проверьте данные.");
        }
    };

    // Рендер строки
    const renderRow = (entry, globalIndex) => {
        const isEditing = editIndex === globalIndex;

        return (
            <tr key={entry.id || globalIndex}>
                {glossaries_shared.map(col => {
                    if (!visibleCols.includes(col.id)) return null;

                    const value = entry[col.id] ?? "";
                    const isDropdown = dropdownFields.includes(col.id);
                    const options = dropdownOptions[col.id] || [];

                    return (
                        <td key={col.id} className="table-data-body">
                            {isEditing ? (
                                isDropdown ? (
                                    <DynamicDropdown
                                        apiUrl={`/api/${dropdownApiEndpoints[col.id]}/`}
                                        fieldName={col.id === "weight" ? "value" : "name"}
                                        label=""
                                        value={entry[col.id] || ""} // <-- передаем только id
                                        onChange={(selectedId) => {
                                            const updated = [...entries];
                                            updated[globalIndex][col.id] = selectedId; // сохраняем id
                                            setEntries(updated);
                                        }}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        className="table-input"
                                        value={value}
                                        onChange={(e) => {
                                            const updated = [...entries];
                                            updated[globalIndex][col.id] = e.target.value;
                                            setEntries(updated);
                                        }}
                                    />
                                )
                            ) : (
                                // Показываем текстовое значение
                                options.find(opt => opt.id === value)?.name || value || "(пусто)"
                            )}
                        </td>
                    );
                })}

                <td>
                    <button onClick={() => {
                        if (isEditing) {
                            handleSave(globalIndex);
                        } else {
                            setEditIndex(globalIndex);
                        }
                    }}>
                        {isEditing ? "Сохранить" : "Редактировать"}
                    </button>
                </td>
            </tr>
        );
    };

    return (
        <div style={{position: "relative", userSelect: isDragging ? "none" : "auto"}}>
            <div className="table-selector">
                <p className="p-column-toggle-btn">Поля для отображения</p>
                <button className="column-toggle-btn" onClick={() => setMenuOpen(prev => !prev)}>
                    Выбрать
                </button>
                <button className="filter-btn" onClick={() => setFilterOpen(prev => !prev)}>
                    Фильтр <img className="filter-icon" src={filter} alt="filter-icon"/>
                </button>
                <button className='state-add-btn' onClick={handleAddEntry}>
                    Добавить запись <img className='state-pencil-icon' src={pencil} alt="pencil-icon"/>
                </button>
            </div>

            {menuOpen && (
                <div className="column-menu" tabIndex={0} onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) setMenuOpen(false);
                }}>
                    {glossaries_shared.map(col => (
                        <label key={col.id} className="column-menu-item">
                            {col.title}
                            <input
                                type="checkbox"
                                checked={visibleCols.includes(col.id)}
                                onChange={() => toggleColumn(col.id)}
                            />
                            <span className="checkbox-wrapper"/>
                        </label>
                    ))}
                </div>
            )}

            {filterOpen && (
                <div className='filter' tabIndex={0} onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) setFilterOpen(false);
                }}>
                    <DynamicDropdown apiUrl="/api/system/" fieldName="name" label="Системы"
                                     value={selectedType} onChange={setSelectedType}/>
                    <DynamicDropdown apiUrl="/api/organ/" fieldName="name" label="Орган"
                                     value={selectedOrgan} onChange={setSelectedOrgan}/>
                    <DynamicDropdown apiUrl="/api/state/" fieldName="name" label="Состояние"
                                     value={selectedState} onChange={setSelectedState}/>
                </div>
            )}

            <div
                ref={containerRef}
                className="scroll-container"
                onMouseDown={onMouseDown}
                onMouseLeave={onMouseLeave}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
                style={{cursor: isDragging ? "grabbing" : "grab"}}
            >
                <table className="data-table">
                    <thead>
                    <tr>
                        {glossaries_shared.map(col =>
                                visibleCols.includes(col.id) && (
                                    <th className="table-data-head" key={col.id}>{col.title}</th>
                                )
                        )}
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentEntries.map((entry, idx) => renderRow(entry, indexOfFirstEntry + idx))}
                    </tbody>
                </table>
            </div>

            {entries.length > entriesPerPage && (
                <div className='pagination-container-state'>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}/>
                </div>
            )}
        </div>
    );
}