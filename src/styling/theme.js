import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#474747',
            main: '#1f1f1f',
            dark: '#000000',
            contrastText: '#dec800'
        },
        secondary: {
            light: '#ffffff',
            main: '#e3e3e3',
            dark: '#c4c4c4',
            contrastText: '#000'
        },
        error: {
            light: '#bf5c00',
            main: '#bf0000',
            dark: '#900',
            contrastText: '#000000'
        },
        success: {
            light: '#00ffa1',
            main: '#00e878',
            dark: '#999',
            contrastText: '#000000'
        },
        info: {
            light: '#ffffff',
            main: '#e3e3e3',
            dark: '#c4c4c4',
            contrastText: '#000'
        }
    }
});
