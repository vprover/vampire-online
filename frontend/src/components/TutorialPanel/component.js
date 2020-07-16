import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { EditorSettingsContextProvider } from '../../contexts/EditorSettingsContext';
import Editor from './ProblemDisplay/Editor';
import { ExecutionContextProvider } from '../../contexts/ExecutionContext';
import ContentsDrawer, { drawerWidth, Heading } from './ContentsDrawer';
import ProblemDisplay from './ProblemDisplay/component';
import { withStyles } from '@material-ui/core/styles';
import ReactMarkdown from 'react-markdown';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
import axios from 'axios';

const useStyles = theme => {
  return ({
    splitLayout: {
      position: "inherit",
      width: "auto",
    },
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
      drawerOpened: true,
      tutorial: {},
    }
  }
  componentDidMount() {
    axios.get(`${process.env.REACT_APP_API_HOST}/tutorial`)
      .then(res => {
        this.setState({
          tutorial: res.data,
        });
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
          <BrowserRouter>
            <div
              style={{ display: "flex", justifyContent: "space-between", overflow: "hidden", width: "100%", height: "95vh" }}
            >
              <SplitterLayout
                customClassName={classes.splitLayout}
                primaryIndex={0}
                percentage
                primaryMinSize={45}
                secondaryMinSize={30}
                secondaryInitialSize={40}
              >

                <div style={{ padding: "1rem", display: "flex" }}>
                  {
                    this.state.tutorial.sections &&
                    <ContentsDrawer
                      open={this.state.drawerOpened}
                      onOpen={() => this.setState({ drawerOpened: true })}
                      onClose={() => this.setState({ drawerOpened: false })}
                      toc={this.state.tutorial.toc}
                    />
                  }
                  <div className={!this.state.drawerOpened ? classes.content : classes.contentShift}>
                    {/* <DemoTutorial /> */}
                    <Switch>
                      {
                        this.state.tutorial.sections &&
                        this.state.tutorial.sections.map(section => {
                          return (
                            <Route
                              path={`/tutorial/${section.name}`}
                              key={section.name}
                              component={() =>
                                <ReactMarkdown
                                  source={section.content}
                                  renderers={{ code: ProblemDisplay, heading: Heading }}
                                />}
                            />
                          )
                        })
                      }
                      {
                        this.state.tutorial.sections && this.state.tutorial.sections.length > 0 &&
                        <Route
                          component={() => <ReactMarkdown
                            source={this.state.tutorial.sections[0].content}
                            renderers={{ code: ProblemDisplay, heading: Heading }} />}
                        />
                      }
                    </Switch>
                  </div>
                </div>
                <div style={{ overflowY: "auto", padding: "1rem", height: "95%" }}>
                  <Editor output />
                </div>
              </SplitterLayout>
            </div>
          </BrowserRouter>
        </ExecutionContextProvider>
      </EditorSettingsContextProvider >
    )
  }
}

export default withStyles(useStyles)(component);