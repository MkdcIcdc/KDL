import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export default function AddForm({isOpen, onClose, children}) {
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        s_name: '',
        name: '',
        surname: '',
        date_birth: ''
    });

    // Обработчик изменения полей ввода
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

            console.log(data);
        } catch (err) {
            setError('Ошибка соединения с сервером');
        }
    };

    if (!isOpen) return null;

    return (
        <div className='add-window-background' onClick={onClose}>
            <div className='add-window' onClick={(e) => e.stopPropagation()}>
                {error && <div className="error-message">{error}</div>}

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
                <button className='search-ptn-btn' onClick={searchPatient}>
                    Найти пациента
                </button>
                <button className='modal-close' onClick={onClose}>
                    Закрыть
                </button>
            </div>
        </div>
    );
}