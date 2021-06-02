import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

import './Registration.scss';

export const RegistrationPage = () => {

    const history = useHistory();

    const [selected, setSelected] = useState(false);
    const [isPasswordError, setIsPasswordError] = useState(false);
    const [isFormValid, setIsFormValid] = useState(true);
    const [nameLoginExists, setNameLoginExists] = useState(false);
    const [adminList, setAdminList] = useState([]);
    const [registrationForm, setRegistrationForm] = useState({ name: '', login: '', password: '', role: '', adminId: '' });
    const [checkPasswordValue, setCheckPasswordValue] = useState('');

    useEffect(() => {

        axios.get('http://localhost:8080/admins')
            .then(res => {
                if (res.status === 200) {
                    setAdminList(res.data);
                    if (!res.data.length) {
                        changeFormValue('admin', 'role');
                    }
                }
            })
            .catch(err => {
                console.error(err);
            })

    }, []);

    const changeFormValue = (value, fieldName) => {
        const registrationFormCopy = { ...registrationForm };
        registrationFormCopy[fieldName] = value;
        if (fieldName === 'name') {
            setNameLoginExists(false);
        }
        if (fieldName === 'role') {
            if (value === 'admin') {
                setSelected(false);
                registrationFormCopy['adminId'] = '';
            } else {
                setSelected(true);
            }
        }
        setRegistrationForm(registrationFormCopy);
    }

    const checkPasswordsMatch = (value) => {
        setCheckPasswordValue(value);
    }

    const checkFormValid = () => {
        if (isPasswordError || nameLoginExists) {
            setIsFormValid(false);
            return false;
        }
        const registrationFormValues = Object.values(registrationForm);
        if (registrationForm.role === 'admin') {
            registrationFormValues.pop();
        }
        const validValues = registrationFormValues.every(value => value !== '');
        setIsFormValid(validValues);
        return validValues;
    }

    const registrateUser = (event) => {
        event.preventDefault();
        if (checkFormValid()) {
            registrateRequest(`http://localhost:8080/registration/${registrationForm.role}`)
        }
    }

    const registrateRequest = (url) => {
        const registrationFormCopy = { ...registrationForm };
        if (registrationForm.role === 'admin') {
            delete registrationFormCopy.adminId;
        }
        delete registrationFormCopy.role;
        axios.post(url, registrationFormCopy)
            .then(res => {
                if (res.status === 201) {
                    history.push('/login');
                }
            })
            .catch(err => {
                console.error(err);
                if (err.response.status === 409) {
                    setNameLoginExists(true);
                }
            })
    }

    return (
        <form className='form' onSubmit={registrateUser}>
            <Link to='/login' className='form-back'>
                Back
                </Link>

            <h2 className='form-title'>Registration</h2>


            {nameLoginExists && <span style={{ color: 'red' }}>User with this login is already exist</span>}
            <span>Name:</span>
            <input
                type='text'
                className='form-name'
                value={registrationForm.name}
                onChange={(event) => changeFormValue(event.target.value, 'name')}
                placeholder='Name'
            ></input>


            <span>Login:</span>
            <input
                type='text'
                className='form-login'
                value={registrationForm.login}
                onChange={(event) => changeFormValue(event.target.value, 'login')}
                placeholder='Enter your login'
            ></input>

            <span>Password:</span>
            <input
                type='password'
                className='form-password'
                value={registrationForm.password}
                onChange={(event) => changeFormValue(event.target.value, 'password')}
                placeholder='Enter your password'
            ></input>

            <span>Repeat password:</span>
            <input
                type='password'
                className='form-password'
                disabled={!registrationForm.password}
                value={checkPasswordValue}
                onChange={(event) => checkPasswordsMatch(event.target.value)}
                onBlur={() => setIsPasswordError(checkPasswordValue !== registrationForm.password)}
                placeholder='Repeat password'
            ></input>
            {isPasswordError && <span style={{ color: 'red' }}>Passwords is not the same</span>}

            <span>Роль:</span>
            <select
                name='select-enter'
                className='form-select-enter'
                onChange={(event) => changeFormValue(event.target.value, 'role')}
            >
                {adminList.length && <option value='user'>User</option>}
                <option value='admin'>Admin</option>
            </select>

            {selected && Boolean(adminList.length) && (
                <>
                    <span>Admin:</span>

                    <select
                        name='select-admins'
                        className='form-select-admins'
                        onChange={(event) => changeFormValue(event.target.value, 'adminId')}
                    >
                        {adminList.map((admin, i) =>
                            <option key={i} value={admin._id}>{admin.name + ', ' + admin.login}</option>
                        )}
                    </select>
                </>
            )}


            {!isFormValid && <span style={{ color: 'red' }}>Not all the fields are correct</span>}

            <button type='submit' className='form-btn-submit'>
                Registrate
                </button>
        </form>
    );
};