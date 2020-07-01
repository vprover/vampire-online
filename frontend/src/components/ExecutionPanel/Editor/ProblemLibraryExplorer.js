import React, { Component } from 'react';
import { Link, List, ListItem, Tabs, Tab, withStyles, Box } from '@material-ui/core';
import useStyles from '../../OptionsExplorer/Styles';
import { TabPanel, a11yProps } from '../../OptionsExplorer/component';
import axios from 'axios';


const ProblemSelectLink = props => {

  const loadProblem = () => {
    axios.get(`${process.env.REACT_APP_API_HOST}/problem-library/${props.section}/${props.name}`)
      .then(res => {
        props.updateInput(res.data);
      })
      .catch(error => console.log(`Could not fetch problem ${props.name}: ${error.message}`));
  }
  return (
    <Link href="#" onClick={() => { loadProblem(); props.closeDialog(); }}>
      {props.name}
    </Link>
  )

}

class ProblemLibraryExplorer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sections: [],
      openedTab: 0
    }
    this.switchTab = this.switchTab.bind(this);
  }

  componentDidMount() {
    axios.get(`${process.env.REACT_APP_API_HOST}/problem-library`)
      .then(res => this.setState({ sections: res.data }))
      .catch(error => console.log(`Could not fetch problem library content: ${error.message}`));
  }
  switchTab(event, tabIndex) {
    this.setState({
      openedTab: tabIndex
    });
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Tabs
          className={classes.tabs}
          orientation="vertical"
          variant="scrollable"
          scrollButtons="off"
          value={this.state.openedTab}
          onChange={this.switchTab}>
          {
            this.state.sections &&
            this.state.sections.map((section, index) => {
              return (
                <Tab
                  label={section.name}
                  index={index}
                  key={index}
                  {...a11yProps("problem-library", index)}
                />
              )
            })
          }
        </Tabs>

        {
          this.state.sections &&
          this.state.sections.map((section, index) => {
            return (
              <TabPanel
                name="problem-library"
                className={classes.tabpanel}
                openedTab={this.state.openedTab}
                index={index}
                key={index}
              >
                <Box my="1rem" />

                <List>
                  {
                    section.problems.map((pb, index) => {
                      return (
                        <ListItem key={index}>
                          <ProblemSelectLink
                            section={section.name}
                            name={pb}
                            updateInput={this.props.updateInput}
                            closeDialog={this.props.closeDialog}
                          />
                        </ListItem>
                      )
                    })
                  }

                </List>
              </TabPanel>
            );
          })
        }
      </div>
    )
  }
}

export default withStyles(useStyles)(ProblemLibraryExplorer);