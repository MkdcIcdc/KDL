import React, {useEffect, useState} from "react";
import arrow from '../../buttons/up_arrow.svg'
import {useNavigate} from "react-router-dom";
import {Patient} from "./PatientData";
import LabResultsTable from './LabData'

function PatientDetailForm() {
    const navigate = useNavigate();
    const [data, SetData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // выбираем элементы из Layout
        const bodyEl = document.querySelector(".body");
        const headEl = document.querySelector(".head");

        // задаём цвета
        if (bodyEl) bodyEl.style.backgroundColor = "#F5F5F5";
        if (headEl) headEl.style.backgroundColor = "#F5F5F5";

        // сброс при размонтировании (уход со страницы)
        return () => {
            if (bodyEl) bodyEl.style.backgroundColor = "";
            if (headEl) headEl.style.backgroundColor = "";
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`api/patients/${id}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                console.log(result)
                SetData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <main className='main-p-df'>
            {data && data.map(item => (
            <div className='patient-card'>
                <div className='patient-detail-data'>
                    <table className='pdd-head'>
                        <tbody>
                        <tr>
                            <td className='pdd-head-arrow'
                                onClick={() => navigate(`/patients/`)}
                                style={{cursor: "pointer"}}
                            >
                                <img className='patient-arrow' src={arrow} alt=''/>
                            </td>
                            <td className='pdd-head-item'>№ {item.id}</td>
                            <td className='pdd-head-item'>{item.s_name} {item.name} {item.surname}</td>
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
                        <td>{item.gender}</td>
                        <td>{item.date_birth}</td>
                        <td>{item.p_series} {item.p_number}</td>
                        <td>999-999-999 99</td>
                    </tr>
                    </tbody>
                </table>
            </div>
                        ))}
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