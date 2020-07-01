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
    }
  });
}

export default useStyles;