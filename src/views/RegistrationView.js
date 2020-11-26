import React from 'react';
import apiService from '../apiService';
import { Formik } from 'formik';

export default class RegistrationView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: null,
            error: null
        };
    }
    handleSubmit(values) {
        apiService.user
            .create(values)
            .then(() => {
                this.setState({ result: 'User registered successfully' });
                setTimeout(() => this.props.history.push('/login'), 2000);
            })
            .catch(error => this.setState({ error: 'Ошибка' + error.response.data.error }));
    }

    render() {
        const { error, result } = this.state;
        return (
            <>
                <h1>Register</h1>
                <div>{error && <span style={{ color: 'darkred' }}>{error}</span>}</div>
                {result}
                <Formik
                    initialValues={{ nickname: '', password: '' }}
                    validate={values => {
                        const errors = {};
                        if (!values.nickname) {
                            errors.nickname = 'Enter nickname';
                        }
                        if (!values.password) {
                            errors.password = 'Enter password';
                        }
                        if (values.password.length < 6) {
                            errors.password = 'Password must be longer than 6 chars';
                        }
                        return errors;
                    }}
                    onSubmit={values => {
                        this.handleSubmit(values);
                    }}
                >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            {errors.nickname && touched.nickname && (
                                <div style={{ color: 'red' }}>{errors.nickname}</div>
                            )}
                            <div>
                                <label>
                                    Nickname:&nbsp;
                                    <input
                                        type="text"
                                        name="nickname"
                                        value={values.nickname}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </label>
                            </div>
                            {errors.password && touched.password && (
                                <div style={{ color: 'red' }}>{errors.password}</div>
                            )}
                            <div>
                                <label>
                                    Password:&nbsp;
                                    <input
                                        type="password"
                                        name="password"
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </label>
                            </div>
                            <button type="submit">Create profile</button>
                        </form>
                    )}
                </Formik>
            </>
        );
    }
}
