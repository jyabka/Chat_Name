import React from 'react';
import MessageForm from '@/components/MessageForm';
import MessagesList from '@/components/MessagesList';
import apiService from '@/apiService';
import styles from './styles.module.css';

class Index extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            users: []
        };

        this.timer = null;
    }

    componentDidMount() {
        let firstTime = true;
        this.setState({ users: [], messages: [] });
        this.timer = setInterval(async () => {
            await this.getMessages();
            if (firstTime) {
                this.scrollToBottom();
            }
            firstTime = false;
        }, 500);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    postMessage({ content }) {
        apiService.message
            .create({ content, chatId: this.props.match.params.id })
            .then(async () => {
                await this.getMessages();
                this.scrollToBottom();
            });
    }

    scrollToBottom() {
        this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
    }

    getMessages() {
        apiService.message
            .getMessages(this.props.match.params.id)
            .then(response => response.data)
            .then(messages => this.setState({ messages }))
            .then(() => this.getUsers())
            .then(() => {
                const newMessages = this.state.messages.map(message => {
                    const user = this.state.users.find(user => user.id === message.userId);
                    message.nickname = user.nickname;
                    return message;
                });
                this.setState({ messages: newMessages });
            });
    }

    getUsers() {
        const oldUsers = this.state.users;
        const oldUsersIds = oldUsers.map(user => user.id);
        const newUsersIds = [...new Set(this.state.messages.map(message => message.userId))];
        const toLoad = newUsersIds.filter(id => !oldUsersIds.includes(id));

        if (!toLoad.length) return;

        return Promise.all(toLoad.map(id => apiService.user.getById(id)))
            .then(responses => responses.map(response => response.data))
            .then(newUsers => this.setState({ users: [...oldUsers, ...newUsers] }));
    }

    render() {
        const { messages } = this.state;
        return (
            <div className={styles.chatView}>
                <div className={styles.messages}>
                    <MessagesList messages={messages} />
                    <div
                        style={{ float: 'left', clear: 'both' }}
                        ref={el => {
                            this.messagesEnd = el;
                        }}
                    />
                </div>
                <div className={styles.form}>
                    <MessageForm postMessage={data => this.postMessage(data)} />
                </div>
            </div>
        );
    }
}

export default Index;
