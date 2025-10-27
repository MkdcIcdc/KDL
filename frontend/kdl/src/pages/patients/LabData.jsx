import React from 'react';
import arrow from "../../buttons/up_arrow.svg";

const LabResultsTable = ({ research }) => {
    if (!research || !research.data || research.data.length === 0) {
        return (
            <details className='cld-head'>
                <summary className='cld-body'>
                    <img className='cld-arrow' src={arrow} alt=''/>
                    <button>Результат исследования</button>
                </summary>
                <div className='cld-detail'>
                    <p>Нет данных для отображения</p>
                </div>
            </details>
        );
    }

    return (
        <details className='cld-head'>
            <summary className='cld-body'>
                {research.research_name}
                <img className='cld-arrow' src={arrow} alt=''/>
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