import React, {useEffect} from "react";
import arrow from '../../buttons/up_arrow.svg'
import {useNavigate} from "react-router-dom";

function PatientDetailForm() {
    const navigate = useNavigate();

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

    return (
        <main className='main-p-df'>
            <div className='patient-card'>
                <div className='patient-detail-data'>
                    <table className='pdd-head'>
                        <tbody>
                        <tr>
                            <td className='pdd-head-arrow'
                                onClick={() => navigate(`/patients/`)}
                                style={{ cursor: "pointer" }}
                            >
                                <img className='patient-arrow' src={arrow} alt=''/>
                            </td>
                            <td className='pdd-head-item'>№ 1</td>
                            <td className='pdd-head-item'>Иванов Иван Иванович</td>
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
                        <td>Мужской</td>
                        <td>01.01.1970</td>
                        <td>9999 999999</td>
                        <td>999-999-999 99</td>
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
                        <summary className='ld-body'>20.01.2020 <img className='dates-arrow' src={arrow} alt=''/></summary>
                        <div className='detail-lab-data'>
                            <p>Данные</p>
                            <p>Данные</p>
                            <p>Данные</p>
                            <p>Данные</p>
                            <p>Данные</p>
                            <p>Данные</p>
                        </div>
                    </details>
                    <details className='dates'>
                        <summary className='ld-body'>23.01.2020 <img className='dates-arrow' src={arrow} alt=''/></summary>
                        <div className='detail-lab-data'>
                            <p>Данные</p>
                            <p>Данные</p>
                            <p>Данные</p>
                            <p>Данные</p>
                            <p>Данные</p>
                            <p>Данные</p>
                        </div>
                    </details>
                    <details className='dates'>
                        <summary className='ld-body'>25.01.2020 <img className='dates-arrow' src={arrow} alt=''/></summary>
                        <div className='detail-lab-data'>
                            <p>Данные</p>
                            <p>Данные</p>
                            <p>Данные</p>
                            <p>Данные</p>
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