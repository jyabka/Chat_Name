import React from 'react';
import apiService from '@/apiService';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Card, CardContent } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from '@/styling/theme';

export default class ChangePasswordView extends React.Component {
    constructor() {
        super();
        this.state = {
            nickname: '',
            newPassword: '',
            result: null,
            error: null,
            formErrors: {
                nickname: null,
                newPassword: null
            }
        };
    }

    validate() {
        const formErrors = {};
        let noErrors = true;
        if (this.state.nickname.length === 0) {
            formErrors.nickname = 'Введите никнейм';
            noErrors = false;
        }

        if (this.state.password.length === 0) {
            formErrors.newPassword = 'Введите новый пароль';
            noErrors = false;
        }

        this.setState({ formErrors });
        return noErrors;
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({
            result: null,
            error: null
        });

        if (!this.validate()) {
            return;
        }

        apiService.change
            .recreate({
                nickname: this.state.nickname,
                newPassword: this.state.newPassword
            })
            .then(() => {
                this.setState({ result: 'Пароль успешно изменен' });
                setTimeout(() => this.redirectAfterChangePassword(), 1500);
            })
            .catch(error => this.setState({ error: 'Ошибка: ' + error.response.data.error }));
    }

    redirectAfterChangePassword() {
        const redirectUrl = this.props.location.state
            ? this.props.location.state.from.pathname
            : '/auth';
        this.props.updateAuthHandler().then(() => this.props.history.push(redirectUrl));
    }

    render() {
        const { error, result, nickname, newPassword, formErrors } = this.state;

        return (
            <ThemeProvider theme={theme}>
                <div className="change-view">
                    <Grid
                        container
                        spacing={0}
                        direction="column"
                        alignItems="flex-start"
                        justify="end"
                        style={{ minHeight: '100vh', marginTop: '12%' }}
                    >
                        <Grid item lg={4} sm={12}>
                            <Card>
                                <CardContent>
                                    <form onSubmit={e => this.handleSubmit(e)}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                {error && <Alert severity="error">{error}</Alert>}
                                                {result && <Alert severity="info">{result}</Alert>}
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    error={formErrors.nickname}
                                                    helperText={formErrors.nickname}
                                                    fullWidth
                                                    name="nickname"
                                                    label="Никнейм"
                                                    value={nickname}
                                                    onChange={e =>
                                                        this.setState({ nickname: e.target.value })
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    error={formErrors.newPassword}
                                                    helperText={formErrors.newPassword}
                                                    fullWidth
                                                    name="newPassword"
                                                    label="Новый пароль"
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={e =>
                                                        this.setState({
                                                            newPassword: e.target.value
                                                        })
                                                    }
                                                />
                                            </Grid>
                                            <Grid
                                                container
                                                direction="row"
                                                justify="center"
                                                spacing={2}
                                                item
                                                xs={12}
                                            >
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    color="primary"
                                                >
                                                    Сменить
                                                </Button>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="body1">
                                                    Вспомнили пароль?{' '}
                                                    <Link to="/login">Войдите!</Link>
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </form>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </div>
            </ThemeProvider>
        );
    }
}
