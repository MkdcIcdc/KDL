import React from "react";
import { useNavigate } from "react-router-dom";

function PatientForm() {
    const navigate = useNavigate();

    const patient = {
        id: 1,
        name: "Иванов Иван Иванович",
        birthDate: "01.01.1970",
        gender: "Мужской",
        passport: "9999 999999"
    };

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
                        <td className="pl-body-data">{patient.id}</td>
                        <td
                            className="pl-body-data"
                            onClick={() => navigate(`/patients/${patient.id}`)}
                            style={{ cursor: "pointer" }}
                        >
                            {patient.name}
                        </td>
                        <td className="pl-body-data">{patient.birthDate}</td>
                        <td className="pl-body-data">{patient.gender}</td>
                        <td className="pl-body-data">{patient.passport}</td>
                    </tr>
                </tbody>
            </table>
        </main>
    );
}

export default PatientForm;