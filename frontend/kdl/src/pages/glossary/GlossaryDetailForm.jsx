import React, {useState, useRef, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import Pagination from "./Pagination";
import triangle_table from '../../buttons/table-name-tringle.svg';
import pencil from '../../buttons/pencil.svg';
import {glossaries} from '../glossaries/GlossariesData';

function GlossaryDetailForm() {
    const {id} = useParams();
    const navigate = useNavigate();

    const glossaryTitle = glossaries.find(item => item.id === id)?.title || 'Словарь';

    const [entries, setEntries] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 5;

    const inputRef = useRef(null);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/${id}/`)
            .then(res => res.json())
            .then(data => {
                const processedEntries = data.map((item, idx) => ({
                    ...item,
                    num: item.num || idx + 1,
                    // Преобразуем value в строку для инпута, если weight
                    name: id === "weight" ? String(item.value ?? '') : item.name ?? ''
                }));
                setEntries(processedEntries);
                setCurrentPage(1);
                setEditIndex(null);
                setEditValue('');
            }).catch(err => console.error("Ошибка загрузки данных:", err));
    }, [id]);

    useEffect(() => {
        if (editIndex !== null && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editIndex]);

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = entries.slice(indexOfFirstEntry, indexOfLastEntry);
    const totalPages = Math.ceil(entries.length / entriesPerPage);

    const handleBackClick = () => {
        navigate('/base_knowledge/glossaries');
    };

    const handleEditClick = (globalIndex, currentValue) => {
        setEditIndex(globalIndex);
        setEditValue(currentValue);
    };

    const handleSave = () => {
        const entry = entries[editIndex];
        const isNew = String(entry.id).startsWith('1'); // временный id

        const payload = id === "weight"
            ? { value: Number(editValue), num: entry.num }
            : { name: editValue, num: entry.num };

        const url = isNew
            ? `http://127.0.0.1:8000/api/${id}/`
            : `http://127.0.0.1:8000/api/${id}/${entry.id}/`;

        const method = isNew ? 'POST' : 'PATCH';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) throw new Error(data);
                return data;
            })
            .then(serverEntry => {
                const updatedEntry = {
                    ...serverEntry,
                    name: id === "weight" ? String(serverEntry.value) : serverEntry.name
                };
                const updatedEntries = entries.map((e, idx) => idx === editIndex ? updatedEntry : e);
                setEntries(updatedEntries);
                setEditIndex(null);
                setEditValue('');
            })
            .catch(err => console.error('Ошибка при сохранении записи:', err));
    };

    const handleCancel = () => {
        const entry = entries[editIndex];
        let updatedEntries = [...entries];
        if (String(entry.id).startsWith('temp') || String(entry.id).startsWith('1')) {
            updatedEntries = entries.filter((_, idx) => idx !== editIndex);
            const totalAfterRemoval = updatedEntries.length;
            const maxPage = Math.ceil(totalAfterRemoval / entriesPerPage);
            if (currentPage > maxPage) setCurrentPage(maxPage);
            setEntries(updatedEntries);
        }
        setEditIndex(null);
        setEditValue('');
    };

    const handleAddEntry = () => {
        const newEntry = {
            id: Date.now(),
            name: '',
            num: entries.length + 1
        };
        setEntries([...entries, newEntry]);
        setEditIndex(entries.length);
        setEditValue('');
        const newPage = Math.ceil((entries.length + 1) / entriesPerPage);
        setCurrentPage(newPage);
    };

    return (
        <>
            <div className='table-name'>
                <button className='table-name-btn' onClick={handleBackClick}>
                    <img src={triangle_table} alt="Toggle" className="tbl-btn"/>
                </button>
                <p className='table-name-text'>{glossaryTitle}</p>
            </div>

            <table className='main-table'>
                <thead>
                <tr>
                    <td className='col-1-head'>№</td>
                    <td className='col-2-head'>Значение</td>
                </tr>
                </thead>
                <tbody>
                {currentEntries.map((entry, index) => {
                    const globalIndex = indexOfFirstEntry + index;
                    return (
                        <tr key={entry.id}>
                            <td className='col-1'>{entry.num}</td>
                            <td className='col-2'>
                                {editIndex === globalIndex ? (
                                    <input
                                        type={id === "weight" ? "number" : "text"}
                                        step={id === "weight" ? "1" : undefined}
                                        value={editValue}
                                        onChange={(e) => {
                                            if (id === "weight") {
                                                const val = e.target.value;
                                                if (val === '' || (/^-?\d+$/.test(val))) {
                                                    setEditValue(val);
                                                }
                                            } else {
                                                setEditValue(e.target.value);
                                            }
                                        }}
                                        className="edit-input"
                                        ref={inputRef}
                                    />
                                ) : (
                                    <span>{entry.name}</span>
                                )}
                                {editIndex !== globalIndex && (
                                    <button
                                        type='button'
                                        className='edit-btn'
                                        onClick={() => handleEditClick(globalIndex, entry.name)}
                                    >
                                        <img src={pencil} alt='Edit' className='edit-btn-icon'/>
                                    </button>
                                )}
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>

            {entries.length > entriesPerPage && (
                <div className='pagination-container'>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {editIndex !== null ? (
                <div className="edit-controls">
                    <button className='save-btn' onClick={handleSave}>Сохранить изменения</button>
                    <button className='cancel-btn' onClick={handleCancel}>Отмена</button>
                </div>
            ) : (
                <button className="add-btn" onClick={handleAddEntry}>Добавить запись</button>
            )}
        </>
    );
}

export default GlossaryDetailForm;
