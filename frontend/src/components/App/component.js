import React from 'react';
import { Container } from '@material-ui/core';
import ExecutionPanel from '../ExecutionPanel/component';
import TutorialPanel from '../TutorialPanel/component';
import { createMuiTheme, ThemeProvider, responsiveFontSizes, makeStyles } from '@material-ui/core/styles';
import { blue, red } from '@material-ui/core/colors';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

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
    },
  })
);

const useStyle = makeStyles(theme => {
  return (
    {
      topContainer: {
        padding: "1rem",
        paddingLeft: "4rem",
        paddingRight: "4rem",
      }
    })
})

const App = props => {
  const classes = useStyle();
  return (
    <ThemeProvider theme={theme}>
      <Container
        className={classes.topContainer}
        maxWidth="xl"
      >
        <BrowserRouter>
          <Switch>
            <Route path="/" exact component={ExecutionPanel} />
            <Route path="/tutorial" component={TutorialPanel} />
          </Switch>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );

}

export default App;