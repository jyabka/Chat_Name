import React from 'react';
import Form from './components/Form';
import MessagesList from './components/MessagesList';
const URL = 'http://localhost:3000';

class App extends React.Component {

    constructor() {
        super();
        this.state = {
            nick: '',
            message: '',
            serverMessages:[]
        };
        setInterval(this.getMessages.bind(this), 1000);
    }

    postMessage(newMessage) {
        // метод отправки сообщения
        let xhr = new XMLHttpRequest();
        xhr.open('POST', URL);
        xhr.send(JSON.stringify(newMessage));

        xhr.onload = () => {
            if (xhr.status !== 200) {
                console.error('Ошибка!');
            } else {
                this.drawMessages(xhr.response);
            }
        };

        xhr.onerror = function() {
            console.log('Запрос не удался');
        };
    };

    getMessages() {
        // метод получения сообщений
        let xhr = new XMLHttpRequest();
        xhr.open('GET', URL);
        xhr.send();
        xhr.onload = () => {
            if (xhr.status != 200) {
                console.error('Ошибка!');
            } else {
                this.drawMessages(xhr.response);
            }
        };
    };

    drawMessages(response) {
        // метод отрисовки сообщений
        const newServerMessages = JSON.parse(response);
        this.setState({
            serverMessages: newServerMessages
    });
    };

    render(){
        return<form>
    <h1>Hello world</h1>
            <Form postMessage = {(newMessage) => this.postMessage(newMessage)}/>
            <MessagesList messages={this.state.serverMessages}/>
        </form>
    }
}

export default App;