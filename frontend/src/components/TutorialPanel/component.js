import React, { Component } from 'react';
import { Switch, Route, Link, Redirect } from "react-router-dom";
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
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
    splitLayoutPaneContent: {
      position: "inherit",
      width: "100%",
      '& > .layout-pane.layout-pane-primary': {
        flexGrow: 1,
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: 0,
      }
    },
    splitLayoutPaneContentShift: {
      position: "inherit",
      width: "100%",
      '& > .layout-pane.layout-pane-primary': {
        flexGrow: 1,
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: `${drawerWidth}rem`,
      }
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(0.2),
      top: theme.spacing(0.2),
      color: theme.palette.grey[500],
      '&:hover': {
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.error.main,
      }
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
          <div
            style={{ display: "flex", justifyContent: "space-between", overflow: "hidden", width: "100%", height: "95vh" }}
          >
            <ContentsDrawer
              open={this.state.drawerOpened}
              onOpen={() => this.setState({ drawerOpened: true })}
              onClose={() => this.setState({ drawerOpened: false })}
              toc={this.state.tutorial.toc}
            />

            <SplitterLayout
              customClassName={!this.state.drawerOpened ? classes.splitLayoutPaneContent : classes.splitLayoutPaneContentShift}
              primaryIndex={0}
              percentage
              primaryMinSize={45}
              secondaryMinSize={30}
              secondaryInitialSize={40}
            >
              <div style={{ padding: "1rem", minWidth: "min-content" }}>
                {/* <DemoTutorial /> */}
                <Switch>
                  {
                    this.state.tutorial.sections &&
                    this.state.tutorial.sections.map(section => {
                      return (
                        <Route
                          path={`/tutorial/${section.name}`}
                          key={section.name}
                          render={() =>
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
                    <Redirect to={`/tutorial/${this.state.tutorial.sections[0].name}`} />
                  }
                </Switch>
              </div>
              <div style={{ overflowY: "auto", padding: "1rem", height: "95%" }}>
                <Editor output />
              </div>
            </SplitterLayout>
          </div>
          <IconButton aria-label="close" className={classes.closeButton} component={Link} to="/">
            <CloseIcon />
          </IconButton>
        </ExecutionContextProvider>
      </EditorSettingsContextProvider >
    )
  }
}

export default withStyles(useStyles)(component);