import React from 'react';
import arrow from "../../buttons/up_arrow.svg";

const LabResultsTable = ({labData}) => {
    return (
            <details className='cld-head'>
                <summary className='cld-body'>Биохимия БХ-1 <img className='cld-arrow' src={arrow} alt=''/></summary>
                <div className='cld-detail'>
                    <table className='labdata-pa'>
                        <thead>
                        <tr>
                            <th>Показатель</th>
                            <th>Ед. изм.</th>
                            <th>Норма</th>
                            <th>Значение</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Object.keys(labData).map((key) => {
                            const item = labData[key];
                            return (
                                <tr key={key}>
                                    <td>{key}</td>
                                    <td>{item.unit}</td>
                                    <td>{item.normal_range}</td>
                                    <td>{item.value}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </details>
    );
};

export default LabResultsTable;
