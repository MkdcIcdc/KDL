import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

function PatientForm() {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /*const patient = {
        id: 1,
        name: "Иванов Иван Иванович",
        birthDate: "01.01.1970",
        gender: "Мужской",
        passport: "9999 999999"
    };*/

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log("Загружаем список пациентов");

                const response = await fetch(`/api/patients/`);

                console.log("Ответ сервера:", response);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                console.log("Полученные данные:", result);
                setData(result);
            } catch (err) {
                console.error("Ошибка при загрузке:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    if (loading) return <div className="loading">Загрузка списка пациентов...</div>;
    if (error) return <div className="error">Ошибка: {error}</div>;
    if (!data) return <div>Данные не найдены</div>;

    return (
        <main>
            <div className="patient-header"></div>
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
                <tr>
                    <td className="pl-body-data">{data.id}</td>
                    <td
                        className="pl-body-data"
                        onClick={() => navigate(`/patients/${patient.id}`)}
                        style={{cursor: "pointer"}}
                    >
                        {data.s_name} {data.name} {data.surname}
                    </td>
                    <td className="pl-body-data">{data.date_birth}</td>
                    <td className="pl-body-data">{data.gender}</td>
                    <td className="pl-body-data">{data.p_series} {data.p_number}</td>
                </tr>
                </tbody>
            </table>
        </main>
    );
}

export default PatientForm;