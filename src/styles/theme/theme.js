import { createTheme } from '@material-ui/core';

export const theme = createTheme({
  palette: {
    primary: { main: '#969FA8' },
    secondary: { main: '#0080FF' },
    white: { main: '#ffffff' },
    green: { main: '#29a04d' },
    orange: { main: '#F27E4C' }
  },

  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: '14px',
        color: 'white',
      },
      popper: {
        color: 'red',
      },
    },
  },
});
