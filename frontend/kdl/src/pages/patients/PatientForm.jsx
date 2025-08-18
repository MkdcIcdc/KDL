import React from "react";
import {NavLink, useNavigate} from "react-router-dom";
import Sidebar from "../Sidebar";

function PatientForm() {
    return (
        <table className='patient-list'>
            <thead>
            <tr>
                <th className='table-data-head'>ФИО пациента</th>
                <th className='table-data-head'>Дата рождения</th>
                <th className='table-data-head'>Пол</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td className='pl-body-data'>Бутаков Никита Сергеевич</td>
                <td className='pl-body-data'>26.08.1998</td>
                <td className='pl-body-data'>Мужской</td>
            </tr>

            </tbody>
        </table>
    );
}

export default PatientForm;