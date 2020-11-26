import React from 'react';
import apiService from '../apiService';

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
                this.setState({ result: 'User log in successfully' });
                setTimeout(() => this.props.history.push('/profile'), 2000);
            })
            .catch(error => this.setState({ error: 'Error' + error.response.data.error }));
        e.preventDefault();
    }

    render() {
        return (
            <>
                <h1>Логин</h1>
                {this.state.error}
                {this.state.result}
                <form onSubmit={e => this.handleSubmit(e)}>
                    <div>
                        <label>
                            Nickname:&nbsp;
                            <input
                                type="text"
                                value={this.state.nickname}
                                onChange={e => this.setState({ nickname: e.target.value })}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Password:&nbsp;
                            <input
                                type="password"
                                value={this.state.password}
                                onChange={e => this.setState({ password: e.target.value })}
                            />
                        </label>
                    </div>
                    <button type="submit">Войти</button>
                </form>
            </>
        );
    }
}
