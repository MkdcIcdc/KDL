import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import AddForm from "./AddForm";

function PatientForm() {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState(''); // состояние для поискового запроса


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log("Загружаем список пациентов");

                const response = await fetch(`/api/patient/`);

                console.log("Ответ сервера:", response);

                if (!response.ok) {
                    throw new Error(`Ошибка сервера! Статус: ${response.status}`);
                }

                const result = await response.json();
                console.log("Полученные данные:", result);
                setData(result);
            } catch (err) {
                console.error("Ошибка при загрузке:", err);
                setError(err.message);
                setData(null); // Сбрасываем данные при ошибке
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="loading">Загрузка списка пациентов...</div>;
    const toggleSearch = () => {
        setIsSearchVisible(!isSearchVisible);
        // Если скрываем поле поиска, очищаем поисковый запрос
        if (isSearchVisible) {
            setIsSearchVisible(!isSearchVisible);
        }
    };

    const filteredData = data ? data.filter(patient => {
        if (!searchTerm.trim()) return true;

        const fullName = `${patient.s_name} ${patient.name} ${patient.surname}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
    }) : [];

    return (
        <main>
            <div className="patient-header">
                <button className='patient-search-btn' onClick={toggleSearch}>
                    {isSearchVisible ? 'Скрыть поиск' : 'Найти пациента'}
                </button>
                <button className='patient-add-btn' onClick={() => setIsModalOpen(true)}>
                    Добавить пациента
                </button>
            </div>

            <AddForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            </AddForm>
            {isSearchVisible && (
                <div className='patient-search'>
                    <input
                        className='patient-search-input'
                        type="text"
                        placeholder="Введите ФИО для поиска..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus // автоматический фокус на поле при открытии
                    />
                </div>
            )}

            {/* Сообщение об ошибке, если backend недоступен */}
            {error && (
                <div className="error" style={{color: "red", marginBottom: "10px"}}>
                    Backend недоступен: {error}
                </div>
            )}

            <table className="patient-list">
                <thead>
                <tr>
                    <th className="table-data-head">№</th>
                    <th className="table-data-head">ФИО пациента</th>
                    <th className="table-data-head">Дата рождения</th>
                    <th className="table-data-head">Пол</th>
                    <th className="table-data-head">Серия и номер паспорта</th>
                </tr>
                </thead>
                <tbody>
                {filteredData && filteredData.length > 0 ? (
                    filteredData.map((patient) => (
                        <tr key={patient.id}>
                            <td className="pl-body-data">{patient.id}</td>
                            <td
                                className="pl-body-data"
                                onClick={() => navigate(`/patients/${patient.id}`)}
                                style={{cursor: "pointer"}}
                            >
                                {patient.s_name} {patient.name} {patient.surname}
                            </td>
                            <td className="pl-body-data">{patient.date_birth}</td>
                            <td className="pl-body-data">{patient.gender}</td>
                            <td className="pl-body-data">{patient.p_series} {patient.p_number}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" className="pl-body-data" style={{textAlign: "center"}}>
                            {error ? "Backend недоступен" :
                             searchTerm ? "Пациенты не найдены" : "Нет данных о пациентах"}
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </main>
    );
}

export default PatientForm;