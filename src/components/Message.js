import React from 'react';
import { shallow } from 'enzyme';

 class Message extends React.Component {
    render() {
        const { nick, message } = this.props;
        return <li>
            <b>{nick}:</b>
            {message}
        </li>;
    }
}
export default Message;