import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './login.css';
import eye from '../../buttons/eye.svg';
import eye_closed from '../../buttons/eye_closed.svg';

function LoginForm() {
    const [formData, setFormData] = useState({
        login: '',
        password: ''
    });
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Сбрасываем ошибку при изменении поля
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        setLoading(true);

        // Базовая валидация на клиенте
        if (!formData.login || !formData.password) {
            setError('Заполните все поля');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/ad/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login: formData.login,
                    password: formData.password
                }),
                credentials: 'include' // Для работы с сессиями/cookies
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/base_knowledge/glossaries');
            } else {
                setError(data.message || 'Ошибка авторизации');
            }
        } catch (err) {
            setError('Ошибка соединения с сервером');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-login-container">
            <p className="main-text">Система интерпретации лабораторных данных</p>
            <div className="login-container">
                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="text"
                        placeholder="Логин"
                        value={formData.login}
                        onChange={(e) => handleChange('login', e.target.value)}
                        className={`login-input ${submitted && !formData.login ? 'input-error' : ''}`}
                        disabled={loading}
                    />
                    <div className='pwd-container'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Пароль"
                            value={formData.password}
                            onChange={(e) => handleChange('password', e.target.value)}
                            className={`pwd-input ${submitted && !formData.password ? 'input-error' : ''}`}
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className='toggle-eye-btn'
                        >
                            {showPassword ? <img src={eye_closed} alt='Eye-toggle'></img> :
                                <img src={eye} alt='Eye-toggle'></img>}
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                    {error && <p className="login-error">{error}</p>}
                </form>
            </div>
        </div>
    )
        ;
}

export default LoginForm;