const useStyles = theme => {
  const c = theme.palette.primary.contrastText;
  const e = theme.palette.error.main;
  return ({
    textField: {
      '& label': {
        color: c,
        fontSize: "1.3em"
      },
      '& label.Mui-focused': {
        color: c,
      },
      '& label.Mui-focused.Mui-error': {
        color: e,
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: c,
      },
      '& .MuiFormHelperText-root': {
        color: c
      },
      '& .MuiInput-underline.Mui-error:after': {
        borderBottomColor: e
      },
      '& .MuiOutlinedInput-root': {
        color: c,
        '&.Mui-focused fieldset': {
          borderColor: c,
        },
      },
    },
  })
};

export default useStyles;