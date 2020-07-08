import { fade } from '@material-ui/core/styles/colorManipulator';
const useStyles = theme => {
  return ({
    resizable: {
      alignItems: "center",
      justifyContent: "center",
      padding: "0.1rem"
    },
    borderLightTheme: {
      border: [["0.12rem", "solid", "black"]]
    },
    borderDarkTheme: {
      border: [["0.12rem", "solid", `${theme.palette.primary.main}`]]
    },
    expandButton: {
      position: "absolute",
      right: "25px",
      top: "10px",
      color: "white",
      zIndex: 4,
      backgroundColor: fade(theme.palette.secondary.main, 0.7),
      "&:hover": {
        backgroundColor: theme.palette.secondary.main,
      }
    }
  });
}

export default useStyles;