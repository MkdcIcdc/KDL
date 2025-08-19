import React from "react";
import PatientDetailForm from "./PatientDetailForm";
import '../glossary/glossary.css';
import PatientLayout from "../PatientLayout";


function PatientDetailPage() {
    return (
        <PatientLayout>
            <PatientDetailForm />
        </PatientLayout>
    );
}

export default PatientDetailPage;