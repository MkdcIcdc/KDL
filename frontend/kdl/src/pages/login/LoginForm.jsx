import React from 'react';
import './login.css';

function LoginForm({ login, password, error, submitted, onChange, onSubmit }) {
  return (
    <div className="main-login-container">
      <p className="main-text">Система интерпретации лабораторных данных</p>
      <div className="login-container">
        <form onSubmit={onSubmit} className="login-form">
          <input
            type="text"
            placeholder="Логин"
            value={login}
            onChange={(e) => onChange('login', e.target.value)}
            className={`login-input ${submitted && !login ? 'input-error' : ''}`}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => onChange('password', e.target.value)}
            className={`login-input ${submitted && !password ? 'input-error' : ''}`}
          />
          <button type="submit" className="login-button">Войти</button>
          {error && <p className="login-error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default LoginForm;