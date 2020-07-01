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

export default useStyles;