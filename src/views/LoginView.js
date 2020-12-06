import React from 'react';
import apiService from '@/apiService';

export default class LoginView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nickname: '',
            password: '',
            result: null,
            error: null
        };
    }

    handleSubmit(e) {
        this.setState({
            result: null,
            error: null
        });
        apiService.auth
            .login({
                nickname: this.state.nickname,
                password: this.state.password
            })
            .then(() => {
                this.setState({ result: 'Пользователь успешно залогинился' });
                setTimeout(() => this.redirectAfterLogin(), 2000);
            })
            .catch(error => this.setState({ error: 'Ошибка' + error.response.data.error }));
        e.preventDefault();
    }

    redirectAfterLogin() {
        const redirectUrl = this.props.location.state
            ? this.props.location.state.from.pathname
            : '/profile';
        this.props.updateAuthHandler().then(() => this.props.history.push(redirectUrl));
    }

    render() {
        const { error, result } = this.state;

        return (
            <div className="login-view">
                <h1>Логин</h1>
                {error}
                {result && <div className="result">{result}</div>}
                <form onSubmit={e => this.handleSubmit(e)}>
                    <div>
                        <label>
                            Никнейм:&nbsp;
                            <input
                                type="text"
                                name="nickname"
                                value={this.state.nickname}
                                onChange={e => this.setState({ nickname: e.target.value })}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Пароль:&nbsp;
                            <input
                                type="password"
                                name="password"
                                value={this.state.password}
                                onChange={e => this.setState({ password: e.target.value })}
                            />
                        </label>
                    </div>
                    <button type="submit">Войти</button>
                </form>
            </div>
        );
    }
}
