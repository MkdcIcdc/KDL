import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import arrow from '../../buttons/up_arrow.svg';
import LabResultsTable from './LabData';

function PatientDetailForm() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [patientData, setPatientData] = useState(null);
    const [researchData, setResearchData] = useState(null);
    const [groupedResearchData, setGroupedResearchData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [results, setResults] = useState({});
    const [loadingResearch, setLoadingResearch] = useState(null);
    const [conclusionStatus, setConclusionStatus] = useState({});

    const transformResearchData = (apiData) => {
        return apiData.map(research => ({
            id: research.id,
            research_name: research.research_name,
            date: research.date,
            data: Object.values(research.data_parsed || {}).map(item => ({
                name: item.name,
                value: item.value,
                unit: item.unit
            }))
        }));
    };

    const groupResearchByDate = (researchArray) => {
        const grouped = {};

        researchArray.forEach(research => {
            const date = research.date || "Дата не указана";

            if (!grouped[date]) {
                grouped[date] = [];
            }

            grouped[date].push(research);
        });

        return grouped;
    };

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
        const fetchAllData = async () => {
            try {
                setLoading(true);
                console.log("Загружаем данные пациента с ID:", id);

                const [patientResponse, researchResponse] = await Promise.all([
                    fetch(`/api/patient/${id}/`),
                    fetch(`/api/research/?patient=${+id}`)
                ]);

                if (!patientResponse.ok) {
                    throw new Error(`HTTP error! status: ${patientResponse.status}`);
                }
                if (!researchResponse.ok) {
                    throw new Error(`HTTP error! status: ${researchResponse.status}`);
                }

                const [patientResult, researchResult] = await Promise.all([
                    patientResponse.json(),
                    researchResponse.json()
                ]);

                console.log("Полученные данные пациента:", patientResult);
                console.log("Полученные данные исследований:", researchResult);

                setPatientData(patientResult);

                const transformedData = transformResearchData(researchResult);
                setResearchData(transformedData);
                setGroupedResearchData(groupResearchByDate(transformedData));

            } catch (err) {
                console.error("Ошибка при загрузке:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchAllData();
        }
    }, [id]);

    useEffect(() => {
        if (researchData) {
            setGroupedResearchData(groupResearchByDate(researchData));
        }
    }, [researchData]);

    // ✅ Загружаем статусы заключений один раз при изменении researchData
    useEffect(() => {
        const loadAllConclusionStatuses = async () => {
            if (!researchData) return;

            const statuses = {};
            for (const research of researchData) {
                try {
                    const response = await fetch(`/api/conclusion/check_conclusion/?research_id=${research.id}`);
                    const result = await response.json();
                    statuses[research.id] = result;
                } catch (error) {
                    console.error('Ошибка при проверке заключения:', error);
                    statuses[research.id] = { exists: false };
                }
            }
            setConclusionStatus(statuses);
        };

        if (researchData && researchData.length > 0) {
            loadAllConclusionStatuses();
        }
    }, [researchData]);

    if (loading) return <div className="loading">Загрузка данных пациента...</div>;
    if (error) return <div className="error">Ошибка: {error}</div>;
    if (!patientData) return <div>Данные пациента не найдены</div>;

    const getConclusion = async (researchId) => {
        setLoadingResearch(researchId);
        try {
            console.log("Отправляем research ID:", researchId);

            const response = await fetch('/api/conclusion/run_function/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    param: researchId,
                })
            });

            console.log("Статус ответа:", response.status);

            if (!response.ok) {
                throw new Error('Ошибка запроса');
            }

            const data = await response.json();
            console.log("Полученные данные:", data);

            setResults(prevResults => ({
                ...prevResults,
                [researchId]: {
                    message: data.result.message,
                    downloadUrl: data.result.download_url,
                    conclusionId: data.result.conclusion_id
                }
            }));

            setConclusionStatus(prev => ({
                ...prev,
                [researchId]: {
                    exists: true,
                    download_url: data.result.download_url
                }
            }));

        } catch (error) {
            console.error('Ошибка:', error);
            setResults(prevResults => ({
                ...prevResults,
                [researchId]: {
                    error: 'Произошла ошибка: ' + error.message
                }
            }));
        } finally {
            setLoadingResearch(null);
        }
    };

    const downloadConclusion = async (dUrl, filename) => {
        try{
            const response = await fetch(`${dUrl}`);
            if (!response.ok) {
                throw new Error('Ошибка скачивания файла')
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error){
            console.log('Ошибка скачивания:', error);
            alert('Ошибка при скачивании файла');
        }
    };

    const renderConclusionButtons = (researchId) => {
        const status = conclusionStatus[researchId];

        if (status === undefined) {
            return (
                <button className='conclusion-btn' disabled>
                    Проверка...
                </button>
            );
        }

        if (status.exists === true) {
            return (
                <button
                    className='conclusion-btn download-btn'
                    onClick={() => downloadConclusion(status.download_url, `заключение_${researchId}.docx`)}
                >
                    Скачать заключение
                </button>
            );
        }

        return (
            <button
                className='conclusion-btn'
                onClick={() => getConclusion(researchId)}
                disabled={loadingResearch === researchId}
            >
                {loadingResearch === researchId ? 'Формируем...' : 'Сформировать заключение'}
            </button>
        );
    };

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
                            <td className='pdd-head-item'>№ {patientData.id}</td>
                            <td className='pdd-head-item'>{patientData.s_name} {patientData.name} {patientData.surname}</td>
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
                        <td>{patientData.gender}</td>
                        <td>{patientData.date_birth}</td>
                        <td>{patientData.p_series} {patientData.p_number}</td>
                        <td>{patientData.snils || "999-999-999 99"}</td>
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

                    {Object.keys(groupedResearchData).length > 0 ? (
                        Object.entries(groupedResearchData).map(([date, researches]) => {
                            // ✅ Берем ID первого исследования для текущей даты
                            const firstResearchId = researches.length > 0 ? researches[0].id : null;

                            return (
                                <details key={date} className='dates'>
                                    <summary className='ld-body'>
                                        {date}
                                        <div>
                                            {firstResearchId && renderConclusionButtons(firstResearchId)}
                                            <img className='dates-arrow' src={arrow} alt=''/>
                                        </div>
                                    </summary>
                                    <div className='detail-lab-data'>
                                        {researches.map((research, index) => (
                                            <div key={research.id || index} className='research-item'>
                                                <LabResultsTable research={research}/>
                                            </div>
                                        ))}
                                    </div>
                                </details>
                            );
                        })
                    ) : (
                        <div>Нет данных исследований</div>
                    )}
                </details>
            </div>
        </main>
    );
}

export default PatientDetailForm;