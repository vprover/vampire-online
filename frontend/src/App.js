import React from 'react';
import { Container } from '@material-ui/core';
import ExecutionPanel from './components/ExecutionPanel';
import OptionsExplorer from './components/OptionsExplorer'
import { createMuiTheme, ThemeProvider, responsiveFontSizes } from '@material-ui/core/styles';
import { blue, red } from '@material-ui/core/colors';
import './App.css';

const theme = responsiveFontSizes(
  createMuiTheme({
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
  })
);

export default class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Container flex p="0.5em">
          {/* <ExecutionPanel /> */}
          <OptionsExplorer />
        </Container>
      </ThemeProvider>
    );
  }
}
