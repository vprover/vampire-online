import React, { Component } from 'react';
import { EditorSettingsContextProvider } from '../../contexts/EditorSettingsContext';
import Editor from './ProblemDisplay/Editor';
import { ExecutionContextProvider } from '../../contexts/ExecutionContext';
import ContentsDrawer, { drawerWidth } from './ContentsDrawer';
import DemoTutorial, { md as demoMd } from './DemoTutorial';
import ProblemDisplay from './ProblemDisplay/component';
import { withStyles } from '@material-ui/core/styles';
import Latex from 'react-latex';
import ReactMarkdown from 'react-markdown';

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
    }
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
                <ReactMarkdown
                  source={demoMd}
                  renderers={{ code: ProblemDisplay }} />
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