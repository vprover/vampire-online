import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Box } from '@material-ui/core';
import OptionsSection from './OptionsSection';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';

const TabPanel = (props) => {
  const { children, openedTab, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={openedTab !== index}
      id={`options-section-tabpanel-${index}`}
      aria-labelledby={`options-section-tab-${index}`}
      {...other}
    >
      {openedTab === index && (
        <Box px="1rem" mx="1rem">
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const a11yProps = index => {
  return {
    id: `options-section-tab-${index}`,
    'aria-controls': `options-section-tabpanel-${index}`,
  };
}

const useStyles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    flexDirection: "row",
    height: "100%"
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    flexShrink: "0",
    marginTop: "1rem",
    width: "12rem"
  },
  tabpanel: {
    overflow: "auto",
    height: "inherit",
    flexGrow: 1
  }
});

class OptionsExplorer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sections: [],
      openedTab: 0
    }
    this.switchTab = this.switchTab.bind(this);
  }

  componentDidMount() {
    this.getVampireOptions();
  }

  getVampireOptions = () => {
    axios.get("http://localhost:8000/options", { params: { sections: true } })
      .then(res => this.setState({ sections: res.data }))
      .catch(error => console.log(`Could not fetch vampire options: ${error.message}`));
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
                  {...a11yProps(index)}
                />
              )
            })
          }
        </Tabs>

        {
          this.state.sections &&
          this.state.sections.map((section, index) => {
            return (
              <TabPanel className={classes.tabpanel} openedTab={this.state.openedTab} index={index}>
                <OptionsSection
                  name={section.name}
                  options={section.options}
                />
              </TabPanel>
            );
          })
        }

      </div>
    )
  }
}

export default withStyles(useStyles)(OptionsExplorer);