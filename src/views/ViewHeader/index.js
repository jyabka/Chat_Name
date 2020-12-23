import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.css';
import { AppBar, Menu, MenuItem, Toolbar } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
//import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { AccountCircle } from '@material-ui/icons';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from '@/styling/theme';

export default class ViewHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuOpen: false,
            anchorEl: null
        };
    }

    handleMenu(event, isOpen) {
        if (isOpen) {
            this.setState({
                anchorEl: event.currentTarget,
                menuOpen: true
            });
        } else {
            this.setState({
                anchorEl: null,
                menuOpen: false
            });
        }
    }

    render() {
        const { user, logoutHandler, title, children, history } = this.props;
        const { menuOpen, anchorEl } = this.state;
        return (
            <ThemeProvider theme={theme}>
                <>
                    <div className={styles.root}>
                        <AppBar color="primary" position="fixed">
                            <Toolbar>
                                <Typography variant="h6" className={styles.title}>
                                    {title}
                                </Typography>
                                {user ? (
                                    <>
                                        <IconButton
                                            aria-label="account of current user"
                                            aria-controls="menu-appbar"
                                            aria-haspopup="true"
                                            onClick={e => this.handleMenu(e, true)}
                                            color="inherit"
                                        >
                                            <AccountCircle />
                                        </IconButton>
                                        <Menu
                                            id="menu-appbar"
                                            anchorEl={anchorEl}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left'
                                            }}
                                            keepMounted
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left'
                                            }}
                                            open={menuOpen}
                                            onClose={e => this.handleMenu(e, false)}
                                        >
                                            <MenuItem onClick={() => history.push('/profile')}>
                                                Профиль
                                            </MenuItem>
                                            <MenuItem onClick={logoutHandler}>Выйти</MenuItem>
                                        </Menu>
                                    </>
                                ) : (
                                    <Button color="inherit" onClick={() => history.push('/login')}>
                                        Логин
                                    </Button>
                                )}
                            </Toolbar>
                        </AppBar>
                        <div className={styles.children}>
                            {React.cloneElement(children, this.props)}
                        </div>
                    </div>
                </>
            </ThemeProvider>
        );
    }
}

ViewHeader.propTypes = {
    menuHandler: PropTypes.func.isRequired,
    logoutHandler: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    user: PropTypes.shape({
        id: PropTypes.string.isRequired
    })
};
