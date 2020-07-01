import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Box } from '@material-ui/core';
import OptionsSection from './OptionsSection';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import useStyles from './Styles';

const TabPanel = (props) => {
  const { children, openedTab, index, name, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={openedTab !== index}
      id={`${name}-section-tabpanel-${index}`}
      aria-labelledby={`${name}-section-tab-${index}`}
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
  value: PropTypes.any,
};

const a11yProps = (name, index) => {
  return {
    id: `${name}-section-tab-${index}`,
    'aria-controls': `${name}-section-tabpanel-${index}`,
  };
}

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
    axios.get(`${process.env.REACT_APP_API_HOST}/options`, { params: { sections: true } })
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
                  {...a11yProps("options", index)}
                  key={index}
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
                name="options"
                className={classes.tabpanel}
                openedTab={this.state.openedTab}
                index={index}
                key={index}
              >
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
export { TabPanel, a11yProps };