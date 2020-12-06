import React, { Component } from 'react';
import apiService from '@/apiService';

export default class UserSearchView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nickname: '',
            error: '',
            foundUsers: []
        };
    }

    validate() {
        this.setState({
            error: ''
        });
        if (this.state.nickname.length === 0) {
            this.setState({
                error: 'Введите ник пользователя'
            });
            return false;
        }
        return true;
    }

    handleSubmit(event) {
        event.preventDefault();

        if (this.validate()) {
            // поиск пользователей
            apiService.user
                .find(this.state.nickname)
                .then(response => response.data)
                .then(foundUsers => this.setState({ foundUsers, nickname: '' }))
                .catch(error => this.setState({ error: 'Ошибка: ' + error.response.data.error }));
        }
    }

    handleStartDialogue(userId) {
        apiService.chat
            .create({
                isDialogue: true,
                participants: [userId]
            })
            .then(response => response.data)
            .then(chat => this.props.history.push(`/chat/${chat.id}`));
    }

    render() {
        const { nickname, error, foundUsers } = this.state;

        return (
            <>
                <h1>Поиск пользователей</h1>
                <form className="chat-form" onSubmit={e => this.handleSubmit(e)}>
                    <div>{error && <span style={{ color: 'red' }}>{error}</span>}</div>
                    <div>
                        <label>
                            Ник:
                            <input
                                value={nickname}
                                type="text"
                                name="chat-title"
                                onChange={event => this.setState({ nickname: event.target.value })}
                            />
                        </label>
                    </div>
                    <button type="submit">Искать</button>
                </form>
                <ul>
                    {foundUsers.map(user => (
                        <li key={user.id}>
                            {user.nickname}&nbsp;
                            {user.id !== this.props.user.id && (
                                <button onClick={() => this.handleStartDialogue(user.id)}>
                                    диалог
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </>
        );
    }
}
