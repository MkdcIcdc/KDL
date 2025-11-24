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
    const [isLoading, setIsLoading] = useState(false); // Новое состояние для загрузки

    const navigate = useNavigate();

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

    const getCurrentDateTime = () => {
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = String(now.getFullYear()).slice(-2);
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
        };

    const addPatient = async () => {
        if (!selectedPatientNumber) {
            setError('Выберите пациента из таблицы');
            return;
        }

        setIsLoading(true); // Блокируем интерфейс
        setError('');

        console.log(`[${getCurrentDateTime()}] Передаем пациента с номером:`, selectedPatientNumber);
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
                console.log(`[${getCurrentDateTime()}] Пациент добавлен`);

                // Закрываем модальное окно
                onClose();

                // Обновляем страницу
                window.location.reload();

                // Или альтернативный вариант - навигация (раскомментируйте если нужно)
                // navigate(0); // Перезагружает текущий маршрут

            } else{
                setError('Ошибка при добавлении пациента');
            }

        } catch (err){
            setError('Ошибка соединения с сервером');
        } finally {
            setIsLoading(false); // Разблокируем интерфейс в любом случае
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
            setIsLoading(false); // Сбрасываем состояние загрузки при закрытии
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={`add-window-background ${isLoading ? 'loading' : ''}`} onClick={isLoading ? undefined : onClose}>
            {/* Индикатор загрузки */}
            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                    <div className="loading-text">Добавление пациента...</div>
                </div>
            )}

            <div className={patients.length > 0 ? 'add-window-searched' : 'add-window-main'}
                 onClick={(e) => e.stopPropagation()}
                 style={{ pointerEvents: isLoading ? 'none' : 'auto', opacity: isLoading ? 0.7 : 1 }}>
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
                                disabled={isLoading}
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
                                disabled={isLoading}
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
                                disabled={isLoading}
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
                                disabled={isLoading}
                            />
                            <label className="search-item-label">Дата рождения</label>
                        </div>
                        <div className='btns-container'>
                            <button
                                className='search-ptn-btn'
                                onClick={searchPatient}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Поиск...' : 'Найти пациента'}
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
                                    onClick={() => !isLoading && handleRowClick(index, patient)}
                                    className={getRowClassName(index)}
                                    style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
                                >
                                    <td>{patient.LASTNAME} {patient.FIRSTNAME} {patient.MIDDLENAME}</td>
                                    <td>{patient.BDAY}</td>
                                    <td>{patient.full_passport_data}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div className='btns-container-searched'>
                            <button
                                className='add-ptn-btn'
                                onClick={addPatient}
                                disabled={!selectedPatientNumber || isLoading}
                            >
                                {isLoading ? 'Добавление...' : 'Добавить пациента'}
                            </button>
                            <button
                                className='back-to-search-btn'
                                onClick={backToSearch}
                                disabled={isLoading}
                            >
                                Новый поиск
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}