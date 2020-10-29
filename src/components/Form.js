import React from 'react';
import { shallow } from 'enzyme';

class Form extends React.Component {
    constructor() {
        super();
        this.state = {
            nick: '',
            message: ''
        };
    }

    handleSend() {
        this.props.postMessage({
            nick: this.state.nick,
            message: this.state.message
        });
        this.setState({
            nick: '',
            message: '',
        });
    }

    render() {
        const {nick, message} = this.state;
        return <form>
            <input value={nick}
                   type="text"
                   onChange={e => this.setState({nick: e.target.value})}
                   placeholder={"Введите никнейм"}
            />
            <br/>
            <textarea
                value={message}
                onChange={e => this.setState({message: e.target.value})}
                placeholder={"Введите сообщение"}
            >
            </textarea>
            <br/>
            <input type="button"
                   value="отправить"
                   onClick={() => this.handleSend()}
            />
        </form>;
    }
}
export default Form;