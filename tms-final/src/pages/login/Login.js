import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

import './Login.scss';

export const LoginPage = () => {

    const history = useHistory();

    const [loginForm, setLoginForm] = useState({ login: '', password: '' });
    const [isFormValid, setIsFormValid] = useState(true);

    const changeFormValue = (value, fieldName) => {
        const loginFormCopy = { ...loginForm };
        loginFormCopy[fieldName] = value;
        setLoginForm(loginFormCopy);
    }

    const loginUser = (event) => {
        event.preventDefault();
        console.log('loginUser ', loginForm);
        if (checkFormValid()) {
            console.log('form is valid');
            loginRequest();
        }
    }

    const loginRequest = () => {
        axios.post('http://localhost:8080/login', loginForm)
            .then(res => {
                if (res.status === 200) {
                    const { token, isAdmin } = res.data;
                    localStorage.setItem('token', token);
                    localStorage.setItem('isAdmin', isAdmin);
                    isAdmin ? history.push('/users') : history.push('/tasks');
                }
            })
            .catch(err => {
                console.error(err);
                if (err.response.status === 401) {
                    setIsFormValid(false);
                }
            })
    }

    const checkFormValid = () => {
        const loginFormValues = Object.values(loginForm);
        const validValues = loginFormValues.every(value => value !== '');
        setIsFormValid(validValues);
        return validValues;
    }

    return (
        <form className='form' onSubmit={loginUser}>
            <h2 className='form-title'>Log In</h2>

            <span>login:</span>
            <input
                type='text'
                className='form-login'
                value={loginForm.login}
                onChange={(event) => changeFormValue(event.target.value, 'login')}
                placeholder='Enter login'
            ></input>

            <span>Password:</span>
            <input
                type='password'
                className='form-password'
                value={loginForm.password}
                onChange={(event) => changeFormValue(event.target.value, 'password')}
                placeholder='Enter password'
            ></input>


            {!isFormValid && <span style={{ color: 'red' }}>Invalid login or password</span>}

            <button type='submit' className='form-btn-submit'>
                Log In
                </button>

            <Link to='/registration' className='form-btn-regist'>
                Registration{' '}
            </Link>
        </form>
    );
};