import React from "react";
import PatientForm from "./PatientForm";
import '../glossary/glossary.css';
import PatientLayout from "../PatientLayout";


function PatientPage() {
    return (
        <PatientLayout>
            <PatientForm />
        </PatientLayout>
    );
}

export default PatientPage;