import React from 'react';
import { Switch, Route, Redirect /*Link*/ } from 'react-router-dom';
import LoginView from '@/views/LoginView';
import RegistrationView from '@/views/RegistrationView';
import ChatView from '@/views/ProfileView';
import ProfileView from '@/views/ProfileView';
import apiService from '@/apiService';
import ChatSearchView from '@/views/ChatSearchView';
import UserSearchView from '@/views/UserSearchView';
import ChangePasswordView from './views/ChangeProfileView';
import ViewHeader from '@/views/ViewHeader';
// import { Drawer, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
// import List from '@material-ui/core/List';
// import { AccountCircle, GroupAdd, PersonAdd, Search } from '@material-ui/icons';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from '@/styling/theme';

class PrivateRoute extends React.Component {
    render() {
        const { user, children, ...rest } = this.props;
        return (
            <Route
                {...rest}
                render={routeProps =>
                    user ? (
                        React.cloneElement(children, { ...routeProps, user })
                    ) : (
                        <Redirect
                            to={{
                                pathname: '/login',
                                state: { from: routeProps.location }
                            }}
                        />
                    )
                }
            />
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            initDone: false,
            isDrawerOpen: false
        };
        this.updateAuthState = this.updateAuthState.bind(this);
    }

    componentDidMount() {
        this.updateAuthState();
    }

    updateAuthState() {
        return apiService.user
            .getCurrent()
            .then(response => response.data)
            .then(user => this.setState({ user, initDone: true }))
            .catch(() => this.setState({ user: null, initDone: true }));
    }

    logoutHandler() {
        apiService.auth.logout().then(() => {
            this.setState({ user: null });
        });
    }

    drawerHandler(isDrawerOpen) {
        this.setState({ isDrawerOpen });
    }

    render() {
        const { user, initDone } = this.state;

        if (!initDone) {
            return <>Loading...</>;
        }

        return (
            <>
                <ThemeProvider theme={theme}></ThemeProvider>
                <Switch>
                    <Route
                        path="/login"
                        render={routeProps => (
                            <ViewHeader
                                logoutHandler={() => this.logoutHandler()}
                                title="Логин"
                                user={user}
                                {...routeProps}
                            >
                                <LoginView updateAuthHandler={this.updateAuthState} />
                            </ViewHeader>
                        )}
                    />
                    <Route
                        path="/change"
                        render={routeProps => (
                            <ChangePasswordView
                                updateAuthHandler={this.updateAuthState}
                                {...routeProps}
                            />
                        )}
                    />
                    <Route
                        path="/registration"
                        render={routeProps => (
                            <ViewHeader
                                logoutHandler={() => this.logoutHandler()}
                                title="Регистрация"
                                user={user}
                                {...routeProps}
                            >
                                <RegistrationView />
                            </ViewHeader>
                        )}
                    />
                    <PrivateRoute path="/chat/:id" user={user}>
                        <ViewHeader
                            logoutHandler={() => this.logoutHandler()}
                            title="Чат"
                            user={user}
                        >
                            <ChatView />
                        </ViewHeader>
                    </PrivateRoute>
                    <PrivateRoute path="/profile" user={user}>
                        <ViewHeader
                            logoutHandler={() => this.logoutHandler()}
                            title="Профиль"
                            user={user}
                        >
                            <ProfileView />
                        </ViewHeader>
                    </PrivateRoute>
                    <PrivateRoute path="/chatSearch" user={user}>
                        <ViewHeader
                            logoutHandler={() => this.logoutHandler()}
                            title="Поиск чатов"
                            user={user}
                        >
                            <ChatSearchView />
                        </ViewHeader>
                    </PrivateRoute>
                    <PrivateRoute path="/userSearch" user={user}>
                        <ViewHeader
                            logoutHandler={() => this.logoutHandler()}
                            title="Поиск пользователей"
                            user={user}
                        >
                            <UserSearchView />
                        </ViewHeader>
                    </PrivateRoute>
                    <Redirect exact from="/" to="/profile" />
                </Switch>
            </>
        );
    }
}

export default App;
