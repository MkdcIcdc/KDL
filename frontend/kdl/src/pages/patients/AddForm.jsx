import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export default function AddForm({isOpen, onClose, children}) {
    const [error, setError] = useState('');
    const [patients, setPatients] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedPatientNumber, setSelectedPatientNumber] = useState(null);
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
        setSelectedPatientNumber(null);
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
        setSelectedPatientNumber(null);
        setFormData({
            s_name: '',
            name: '',
            surname: '',
            date_birth: ''
        });
    };

    const handleRowClick = (rowId, patient) => {
        setSelectedRow(rowId);
        setSelectedPatientNumber(patient.PATIENTNUMBER);
    };

    const getRowClassName = (rowId) => {
        return `table-row ${selectedRow === rowId ? 'selected' : ''}`;
    };

    const addPatient = async () => {
        if (!selectedPatientNumber) {
            setError('Выберите пациента из таблицы');
            return;
        }

        try{
            const response = await fetch('/api/db2_worker/add_patient/' ,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    PATIENTNUMBER: selectedPatientNumber
                })
            });
            if (response.ok){
                console.log('Пациент добавлен');
            } else{
                setError('Ошибка при добавлении пациента');
            }

        } catch (err){
            setError('Ошибка соединения с сервером');
        }
    }

    useEffect(() => {
        if (!isOpen) {
            setPatients([]);
            setSelectedPatientNumber(null);
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
            <div className={patients.length > 0 ? 'add-window-searched' : 'add-window-main'}
                 onClick={(e) => e.stopPropagation()}>
                {error && <div className="error-message">{error}</div>}
                {patients.length === 0 ? (
                    // Показываем поля для поиска
                    <div className='main-add-container'>
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
                        </div>

                    </div>
                ) : (
                    // Показываем таблицу с результатами
                    <div className="patients-table-container">
                        <table className="searched-patients-table">
                            <thead>
                            <tr>
                                <th style={{width: "50%"}}>ФИО пациента</th>
                                <th style={{width: "25%"}}>Дата рождения</th>
                                <th style={{width: "25%"}}>Серия и номер паспорта</th>
                            </tr>
                            </thead>
                            <tbody>
                            {patients.map((patient, index) => (
                                <tr key={index}
                                    onClick={() => handleRowClick(index, patient)}
                                    className={getRowClassName(index)}
                                >
                                    <td>{patient.LASTNAME} {patient.FIRSTNAME} {patient.MIDDLENAME}</td>
                                    <td>{patient.BDAY}</td>
                                    <td>{patient.full_passport_data}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div className='btns-container-searched'>
                            <button className='add-ptn-btn'
                                    onClick={addPatient}
                                    disabled={!selectedPatientNumber}
                            >
                                Добавить пациента
                            </button>
                            <button className='back-to-search-btn' onClick={backToSearch}>
                                Новый поиск
                            </button>
                            {/*<button className='modal-close' onClick={onClose}>
                                Закрыть
                            </button>*/}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}