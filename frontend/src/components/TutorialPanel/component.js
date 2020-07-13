import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { EditorSettingsContextProvider } from '../../contexts/EditorSettingsContext';
import Editor from './ProblemDisplay/Editor';
import { ExecutionContextProvider } from '../../contexts/ExecutionContext';
import ContentsDrawer, { drawerWidth } from './ContentsDrawer';
import DemoTutorial, { md as demoMd } from './DemoTutorial';
import ProblemDisplay from './ProblemDisplay/component';
import { withStyles } from '@material-ui/core/styles';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
// import toc from 'markdown-toc';

const useStyles = theme => {
  return ({
    content: {
      flexGrow: 1,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: `-${drawerWidth}rem`,
    },
    contentShift: {
      flexGrow: 1,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  })
}

class component extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpened: false,
      sections: [],
    }
  }
  componentDidMount() {
    axios.get(`${process.env.REACT_APP_API_HOST}/tutorial`)
      .then(res => {
        this.setState({ sections: res.data });
      })
      .catch(error => {
        console.log(`Could not fetch the tutorial ${error.message}`);
      })
  }

  render() {
    const { classes } = this.props;
    return (
      <EditorSettingsContextProvider>
        <ExecutionContextProvider>
          <div
            style={{ display: "flex", justifyContent: "space-between", overflow: "hidden", height: "95vh" }}
          >
            <div style={{ width: "60%", overflowY: "auto", padding: "1rem", display: "flex" }}>
              <ContentsDrawer
                open={this.state.drawerOpened}
                onOpen={() => this.setState({ drawerOpened: true })}
                onClose={() => this.setState({ drawerOpened: false })}
                contents={
                  [
                    { id: "sec1", name: "Basic code with text" },
                    { id: "sec2", name: "Learning TPTP syntax" },
                    { id: "sec3", name: "A large input example" },
                  ]
                }
              />
              <div className={!this.state.drawerOpened ? classes.content : classes.contentShift}>
                {/* <DemoTutorial /> */}
                <BrowserRouter>
                  <Switch>
                    {
                      this.state.sections &&
                      this.state.sections.map(section => {
                        return (
                          <Route
                            path={`/tutorial/${section.name}`}
                            key={section.name}
                            component={() => <ReactMarkdown source={section.content} renderers={{ code: ProblemDisplay }} />}
                          />
                        )
                      })
                    }
                    {
                      this.state.sections && this.state.sections.length > 0 &&
                      <Route
                        component={() => <ReactMarkdown source={this.state.sections[0].content} renderers={{ code: ProblemDisplay }} />}
                      />
                    }
                  </Switch>
                </BrowserRouter>
              </div>
            </div>

            <div style={{ width: "35%", overflowY: "auto", padding: "1rem" }}>
              <Editor output />
            </div>
          </div>
        </ExecutionContextProvider>
      </EditorSettingsContextProvider >
    )
  }
}

export default withStyles(useStyles)(component);