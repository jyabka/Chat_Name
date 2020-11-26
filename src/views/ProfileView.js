import React from 'react';
import apiService from '../apiService';

export default class ProfileView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null
        };
    }

    componentDidMount() {
        apiService.user
            .profile()
            .then(response => response.data)
            .then(user => this.setState({ user }));
    }

    render() {
        return (
            <>
                <h1>User's Profile</h1>
                {this.state.user && (
                    <>
                        <div>Никнейм: {this.state.user.nickname}</div>
                        <div>Создан: {new Date(this.state.user.createdAt).toLocaleString()}</div>
                    </>
                )}
            </>
        );
    }
}
