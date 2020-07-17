import React, { Component } from 'react';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { Drawer, List, ListItem, IconButton, Typography, Divider, Link } from '@material-ui/core';
import { HashLink } from 'react-router-hash-link';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';

export const drawerWidth = 16;
const useStyles = (theme) => {
  return ({
    drawer: {
      width: `${drawerWidth}rem`,
      flexShrink: 0,
    },
    drawerPaper: {
      marginLeft: "1rem",
      width: `${drawerWidth}rem`,
    },
    drawerOpener: {
      position: "fixed",
      left: 0,
      top: 0,
      height: "100%",
      width: "1rem",
      borderRadius: 0,
      padding: "0.1rem",
      backgroundColor: fade(theme.palette.secondary.main, 0.8),
      zIndex: 2000,
      color: theme.palette.secondary.contrastText,
      '&:hover': {
        backgroundColor: theme.palette.secondary.main,
      }
    },
  }
  )
}

class ContentsDrawer extends Component {
  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        {
          // !this.state.opened &&
          <IconButton
            className={classes.drawerOpener}
            onClick={() => { if (this.props.open) { this.props.onClose() } else { this.props.onOpen() } }}
          >
            {
              this.props.open ? <ChevronLeftIcon /> : <ChevronRightIcon />
            }
            {/* <ChevronRightIcon /> */}
          </IconButton>
        }

        <Drawer
          variant="persistent"
          className={classes.drawer}
          classes={{
            paper: classes.drawerPaper
          }}
          onClose={this.props.onClose}
          open={this.props.open}
        >
          <Typography variant="h4" style={{ padding: "1rem" }}>
            Contents
          </Typography>
          <Divider />
          <List disablePadding>
            {
              this.props.toc &&
              this.props.toc.map((s, idx) => {
                const path = `/tutorial/${s.name}`;
                return (
                  <ListItem key={idx} disableGutters>
                    <List disablePadding>
                      {
                        s.headings.map((h, idx) => {
                          const indent = `${(h.lvl - 1) * 0.6}rem`;
                          return (
                            <ListItem key={idx}>
                              <Link color="inherit" to={`${path}#${h.slug}`} component={HashLink}>
                                <Typography variant={`h${h.lvl + 5}`} style={{ marginLeft: indent }}>{h.content}</Typography>
                              </Link>
                            </ListItem>
                          )
                        })
                      }
                    </List>
                  </ListItem>
                )
              }
              )
            }
          </List>
        </Drawer>
      </React.Fragment >
    )
  }
}

export const Heading = (props) => {
  const slug = props.children[0].props.value.replace(/\s+/g, "-").toLowerCase();
  return (
    <Typography variant={`h${props.level + 3}`} id={slug} style={{ marginTop: "0.8rem" }}>
      {props.children}
    </Typography>
  )
}

export default withStyles(useStyles)(ContentsDrawer);