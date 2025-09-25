import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import arrow from '../../buttons/up_arrow.svg';
import LabResultsTable from './LabData';

function PatientDetailForm() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [patientData, setPatientData] = useState(null);
    const [researchData, setResearchData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [results, setResults] = useState({}); // ✅ Объект для хранения результатов по researchId
    const [loadingResearch, setLoadingResearch] = useState(null); // ✅ ID исследования в процессе загрузки
    const [conclusions, setConclusions] = useState({}); // ✅ Храним данные о заключениях

    const transformResearchData = (apiData) => {
        return apiData.map(research => ({
            id: research.id,
            research_name: research.research_name,
            date: research.date,
            // Преобразуем data_parsed объект в массив
            data: Object.values(research.data_parsed || {}).map(item => ({
                name: item.name,
                value: item.value,
                unit: item.unit
            }))
        }));
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

                // Параллельная загрузка данных
                const [patientResponse, researchResponse] = await Promise.all([
                    fetch(`/api/patient/${id}/`),
                    fetch(`/api/research/?patient=${+id}`)
                ]);

                // Проверка ответов
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
                // ПРИМЕНЯЕМ ТРАНСФОРМАЦИЮ К ДАННЫМ
                setResearchData(transformResearchData(researchResult));
                // ✅ Проверяем наличие заключений для каждого исследования
                await checkExistingConclusions(transformedResearch);
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

    if (loading) return <div className="loading">Загрузка данных пациента...</div>;
    if (error) return <div className="error">Ошибка: {error}</div>;
    if (!patientData) return <div>Данные пациента не найдены</div>;


    const checkExistingConclusions = async (researchList) => {
        const conclusionsData = {};

        for (const research of researchList) {
            try {
                const response = await fetch(`/api/conclusion/check_conclusion/?research_id=${research.id}`);
                const data = await response.json();

                if (data.status === 'success' && data.exists) {
                    conclusionsData[research.id] = {
                        exists: true,
                        conclusionId: data.conclusion_id,
                        downloadUrl: data.download_url,
                        message: data.message
                    };
                } else {
                    conclusionsData[research.id] = {
                        exists: false,
                        message: data.message
                    };
                }
            } catch (error) {
                console.error(`Ошибка при проверке заключения для research ${research.id}:`, error);
                conclusionsData[research.id] = {
                    exists: false,
                    error: 'Ошибка проверки'
                };
            }
        }

        setConclusions(conclusionsData);
    };

    const createConclusion = async (researchId) => {
        setLoadingResearch(researchId);
        try {
            console.log("Создаем заключение для research ID:", researchId);

            const response = await fetch('/api/conclusion/run_function/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    param: researchId,
                })
            });

            if (!response.ok) {
                throw new Error('Ошибка создания заключения');
            }

            const data = await response.json();
            console.log("Заключение создано:", data);

            // ✅ Обновляем состояние для этого researchId
            setConclusions(prev => ({
                ...prev,
                [researchId]: {
                    exists: true,
                    conclusionId: data.result.conclusion_id,
                    downloadUrl: data.result.download_url,
                    message: data.result.message
                }
            }));

        } catch (error) {
            console.error('Ошибка создания заключения:', error);
            setConclusions(prev => ({
                ...prev,
                [researchId]: {
                    exists: false,
                    error: 'Ошибка создания: ' + error.message
                }
            }));
        } finally {
            setLoadingResearch(null);
        }
    };

    const downloadConclusion = async (conclusionId, filename = 'заключение.docx') => {
        try {
            const response = await fetch(`/api/conclusion/${conclusionId}/download/`);

            if (!response.ok) {
                throw new Error('Ошибка скачивания файла');
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

        } catch (error) {
            console.error('Ошибка скачивания:', error);
            alert('Ошибка при скачивании файла');
        }
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

                    {researchData && researchData.length > 0 ? (
                        researchData.map((research, index) => {
                            const conclusion = conclusions[research.id];

                            return (
                                <details key={research.id || index} className='dates'>
                                    <summary className='ld-body'>
                                        {research.date || "Дата не указана"}
                                        <img className='dates-arrow' src={arrow} alt=''/>
                                    </summary>
                                    <div className='detail-lab-data'>
                                        <LabResultsTable research={research}/>

                                        {/* ✅ Умное отображение кнопок */}
                                        {conclusion?.exists ? (
                                            // Если заключение существует - показываем кнопку скачивания
                                            <button
                                                onClick={() => downloadConclusion(conclusion.conclusionId, `заключение_${research.id}.docx`)}
                                                className='conclusion-btn download-btn'
                                                style={{backgroundColor: '#28a745'}}
                                            >
                                                📥 Скачать заключение
                                            </button>
                                        ) : (
                                            // Если заключения нет - показываем кнопку создания
                                            <button
                                                className='conclusion-btn'
                                                onClick={() => createConclusion(research.id)}
                                                disabled={loadingResearch === research.id}
                                            >
                                                {loadingResearch === research.id ? '⏳ Формируем...' : '✨ Сформировать заключение'}
                                            </button>
                                        )}

                                        {/* Сообщения об ошибках */}
                                        {conclusion?.error && (
                                            <div style={{color: 'red', marginTop: '10px'}}>
                                                {conclusion.error}
                                            </div>
                                        )}
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