import React from "react";
import PatientForm from "./PatientForm";
import '../glossary/glossary.css';
import Layout from "../Layout";

function PatientPage() {
    return (
        <Layout>
            <PatientForm />
        </Layout>
    );
}

export default PatientPage;