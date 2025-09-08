import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import arrow from '../../buttons/up_arrow.svg';
import {Patient} from "./PatientData";
import LabResultsTable from './LabData';

function PatientDetailForm() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const bodyEl = document.querySelector(".body");
        const headEl = document.querySelector(".head");

        if (bodyEl) bodyEl.style.backgroundColor = "#F5F5F5";
        if (headEl) headEl.style.backgroundColor = "#F5F5F5";

        return () => {
            if (bodyEl) bodyEl.style.backgroundColor = "";
            if (headEl) headEl.style.backgroundColor = "";
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log("Загружаем данные пациента с ID:", id);

                const response = await fetch(`/api/patient/${id}/`);

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

        if (id) {
            fetchData();
        }
    }, [id]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log("Загружаем данные пациента с ID:", id);

                const response = await fetch(`/api/patient/?patinet=${id}/`);

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

        if (id) {
            fetchData();
        }
    }, [id]);


    if (loading) return <div className="loading">Загрузка данных пациента...</div>;
    if (error) return <div className="error">Ошибка: {error}</div>;
    if (!data) return <div>Данные не найдены</div>;

    return (
        <main className='main-p-df'>
            <div className='patient-card'>
                <div className='patient-detail-data'>
                    <table className='pdd-head'>
                        <tbody>
                        <tr>
                            <td className='pdd-head-arrow'
                                onClick={() => navigate(`/patients/`)}
                                style={{cursor: "pointer"}}
                            >
                                <img className='patient-arrow' src={arrow} alt='Назад'/>
                            </td>
                            <td className='pdd-head-item'>№ {data.id}</td>
                            <td className='pdd-head-item'>{data.s_name} {data.name} {data.surname}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <table className='pdd-body'>
                    <thead>
                    <tr>
                        <th>Пол</th>
                        <th>Дата рождения</th>
                        <th>Серия и номер паспорта</th>
                        <th>Снилс</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{data.gender}</td>
                        <td>{data.date_birth}</td>
                        <td>{data.p_series} {data.p_number}</td>
                        <td>{data.snils || "999-999-999 99"}</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <div className='patient-analiz'>
                <details className='lab-data-head'>
                    <summary className='ld-main'>
                        Лабораторные данные
                        <img className='arrow' src={arrow} alt=''/>
                    </summary>
                    <details className='dates'>
                        <summary className='ld-body'>20.01.2020 <img className='dates-arrow' src={arrow} alt=''/>
                        </summary>
                        <div className='detail-lab-data'>
                            <LabResultsTable labData={Patient.biochemistry}/>
                        </div>
                    </details>
                    <details className='dates'>
                        <summary className='ld-body'>23.01.2020 <img className='dates-arrow' src={arrow} alt=''/>
                        </summary>
                        <div className='detail-lab-data'>
                            <p>Данные</p>
                        </div>
                    </details>
                    <details className='dates'>
                        <summary className='ld-body'>25.01.2020 <img className='dates-arrow' src={arrow} alt=''/>
                        </summary>
                        <div className='detail-lab-data'>
                            <p>Данные</p>
                            <p>Данные</p>
                        </div>
                    </details>
                </details>

            </div>
        </main>
    );
}

export default PatientDetailForm;