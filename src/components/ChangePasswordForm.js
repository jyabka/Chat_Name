import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export default class ChangePasswordForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nickname: '',
            newPassword: '',
            error: ''
        };
    }

    validate() {
        const formErrors = {};
        let noErrors = true;
        if (this.state.nickname.length === 0) {
            formErrors.nickname = 'Введите ник';
            noErrors = false;
        }

        if (this.state.newPassword.length === 0) {
            formErrors.newPassword = 'Введите пароль';
            noErrors = false;
        }

        this.setState({ formErrors });
        return noErrors;
    }

    handleSubmit(event) {
        event.preventDefault();

        if (this.validate()) {
            this.props.handleSubmit({
                login: this.state.login,
                newPassword: this.state.newPassword
            });
            this.setState({ login: '', newPassword: '' });
        }
    }

    render() {
        const { nickname, password, formErrors } = this.state;

        return (
            <form className="change-form" onSubmit={e => this.handleSubmit(e)}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField>
                            error={formErrors.nickname}
                            helperText={formErrors.nickname}
                            fullWidth name="nickname" label="Логин" value={nickname}
                            onChange={e => this.setState({ nickname: e.target.value })}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            error={formErrors.newPassword}
                            helperText={formErrors.newPassword}
                            fullWidth
                            type="password"
                            name="newPassword"
                            label="Новый пароль"
                            value={password}
                            onChange={e => this.setState({ newPassword: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button fullWidth type="submit" variant="contained" color="primary">
                            Сохранить
                        </Button>
                    </Grid>
                </Grid>
            </form>
        );
    }
}

ChangePasswordForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired
};
