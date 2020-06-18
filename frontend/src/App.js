import React from 'react';
import './App.css';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import ExecutionPanel from './components/ExecutionPanel';
import { blue, red } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: blue[500],
      contrastText: "#fff"
    },
    secondary: {
      main: '#ef6c00',
      contrastText: "#fff"
    },
    error: {
      main: red["A200"]
    }
  }
});

export default class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <ExecutionPanel />
      </ThemeProvider>
    );
  }
}
