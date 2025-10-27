import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export default function AddForm({isOpen, onClose, children}) {
    const [error, setError] = useState('');
    const [patients, setPatients] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [formData, setFormData] = useState({
        s_name: '',
        name: '',
        surname: '',
        date_birth: ''
    });

    const handleInputChange = (e) => {
        const {id, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const searchPatient = async () => {
        if (!formData.s_name || !formData.name || !formData.surname || !formData.date_birth) {
            setError('Заполните все поля');
            return;
        }
        setPatients([]);
        setError('');
        try {
            const response = await fetch('/api/db2_worker/get_patient/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    s_name: formData.s_name,
                    name: formData.name,
                    surname: formData.surname,
                    date_birth: formData.date_birth
                }),
            });
            const data = await response.json();

            if (data && data.patients && Array.isArray(data.patients)) {
                setPatients(data.patients);
            } else {
                setError('Пациенты не найдены');
            }

        } catch (err) {
            setError('Ошибка соединения с сервером');
        }
    };

    // Функция для возврата к поиску
    const backToSearch = () => {
        setPatients([]);
        setFormData({
            s_name: '',
            name: '',
            surname: '',
            date_birth: ''
        });
    };

    const handleRowClick = (rowId) => {
        setSelectedRow(rowId);
    };

    const getRowClassName = (rowId) => {
        return `table-row ${selectedRow === rowId ? 'selected' : ''}`;
    };

    useEffect(() => {
        if (!isOpen) {
            setPatients([]);
            setError('');
            setFormData({
                s_name: '',
                name: '',
                surname: '',
                date_birth: ''
            });
            setSelectedRow('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className='add-window-background' onClick={onClose}>
            <div className='add-window' onClick={(e) => e.stopPropagation()}>
                {error && <div className="error-message">{error}</div>}

                {patients.length === 0 ? (
                    // Показываем поля для поиска
                    <>
                        <div className='input-container'>
                            <input
                                className='search-item'
                                type='text'
                                id='s_name'
                                placeholder=" "
                                value={formData.s_name}
                                onChange={handleInputChange}
                            />
                            <label className="search-item-label">Фамилия</label>
                        </div>
                        <div className='input-container'>
                            <input
                                className='search-item'
                                type='text'
                                id='name'
                                placeholder=" "
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                            <label className="search-item-label">Имя</label>
                        </div>
                        <div className='input-container'>
                            <input
                                className='search-item'
                                type='text'
                                id='surname'
                                placeholder=" "
                                value={formData.surname}
                                onChange={handleInputChange}
                            />
                            <label className="search-item-label">Отчество</label>
                        </div>
                        <div className='input-container'>
                            <input
                                className='search-item'
                                type='date'
                                id='date_birth'
                                placeholder=" "
                                value={formData.date_birth}
                                onChange={handleInputChange}
                            />
                            <label className="search-item-label">Дата рождения</label>
                        </div>
                        <div className='btns-container'>
                            <button className='search-ptn-btn' onClick={searchPatient}>
                                Найти пациента
                            </button>
                            <button className='modal-close' onClick={onClose}>
                                Закрыть
                            </button>
                        </div>

                    </>
                ) : (
                    // Показываем таблицу с результатами
                    <div className="patients-table-container">
                        <h3>Найденные пациенты:</h3>
                        <table className="searched-patients-table">
                            <thead>
                            <tr>
                                <th>ФИО пациента</th>
                                <th>Дата рождения</th>
                                <th>Серия и номер паспорта</th>
                            </tr>
                            </thead>
                            <tbody>
                            {patients.map((patient, index) => (
                                <tr key={index}
                                    onClick={() => handleRowClick(index)}
                                    className={getRowClassName(index)}
                                >
                                    <td>{patient.s_name} {patient.name} {patient.surname}</td>
                                    <td>{patient.date_birth}</td>
                                    <td>{patient.full_passport_data}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div className='btns-container'>
                            <button className='back-to-search-btn' onClick={backToSearch}>
                                Новый поиск
                            </button>
                            <button className='add-ptn-btn'>
                                Добавить пациента
                            </button>
                            <button className='modal-close' onClick={onClose}>
                                Закрыть
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}