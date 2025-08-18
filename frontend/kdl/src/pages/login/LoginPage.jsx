import React, { useState } from 'react';
import LoginForm from './LoginForm';

function LoginPage() {
  const [form, setForm] = useState({ login: '', password: '' });
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const { login, password } = form;

    if (!login || !password) {
      setError('Заполните все поля');
      return;
    }

    setError('');

    try {
      const isValid = await fakeAuth(login, password);
      if (!isValid) {
        setError('Неверный логин или пароль');
        return;
      }

      console.log('Авторизация успешна!');
      // TODO: переход, сохранение токена и т.д.
    } catch (err) {
      setError('Ошибка сервера. Попробуйте позже.');
    }
  };

  return (
    <LoginForm
      login={form.login}
      password={form.password}
      error={error}
      submitted={submitted}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}

function fakeAuth(login, password) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const success = login === 'admin' && password === '123456';
      resolve(success);
    }, 500);
  });
}

export default LoginPage;