import React, {useEffect, useState} from 'react';
import arrow from "../../buttons/up_arrow.svg";

const LabResultsTable = ({research}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState({});
    const [conclusionStatus, setConclusionStatus] = useState({});
    const [loadingResearch, setLoadingResearch] = useState(null);

    const toggleDetails = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    // ✅ Исправлено: проверяем статус для конкретного research.id
    useEffect(() => {
        const checkConclusionStatus = async () => {
            if (!research || !research.id) return;

            try {
                const status = await checkConclusion(research.id);
                setConclusionStatus(prev => ({
                    ...prev,
                    [research.id]: status
                }));
            } catch (error) {
                console.error('Ошибка при проверке заключения:', error);
                setConclusionStatus(prev => ({
                    ...prev,
                    [research.id]: { exists: false, error: error.message }
                }));
            }
        };

        checkConclusionStatus();
    }, [research]); // ✅ Зависимость от research

    const checkConclusion = async (researchID) => {
        try {
            const response = await fetch(`/api/conclusion/check_conclusion/?research_id=${researchID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Ошибка при проверке заключения:', error);
            return { exists: false, error: error.message };
        }
    }

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

        // ✅ Если статус еще не загружен
        if (status === undefined) {
            return (
                <button className='conclusion-btn' disabled>
                    Проверка...
                </button>
            );
        }

        // ✅ Если произошла ошибка при проверке
        if (status.error) {
            return (
                <button className='conclusion-btn error-btn' disabled>
                    Ошибка проверки
                </button>
            );
        }

        // ✅ Если заключение существует
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

        // ✅ Если заключения нет - показываем кнопку для создания
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

    if (!research || !research.data || research.data.length === 0) {
        return (
            <details className='cld-head' open={isOpen}>
                <summary className='cld-body' style={{ pointerEvents: 'none' }}>
                    <img className='cld-arrow' src={arrow} alt=''/>
                    <button onClick={toggleDetails} style={{ pointerEvents: 'auto' }}>
                        Результат исследования
                    </button>
                </summary>
                <div className='cld-detail'>
                    <p>Нет данных для отображения</p>
                </div>
            </details>
        );
    }

    return (
        <details className='cld-head' open={isOpen}>
            <summary className='cld-body'>
                {research.research_name}
                <div>
                    <button className='btn-view-result' onClick={toggleDetails}>
                        Результат исследования
                    </button>
                    {renderConclusionButtons(research.id)}
                </div>

                {/*<img className='cld-arrow' src={arrow} alt=''/>*/}
            </summary>
            <div className='cld-detail'>
                <table className='labdata-pa'>
                    <thead>
                    <tr>
                        <th>Показатель</th>
                        <th>Ед. изм.</th>
                        <th>Значение</th>
                    </tr>
                    </thead>
                    <tbody>
                    {research.data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.name || "Не указано"}</td>
                            <td>{item.unit || "-"}</td>
                            <td>{item.value || "Не указано"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </details>
    );
};

export default LabResultsTable;