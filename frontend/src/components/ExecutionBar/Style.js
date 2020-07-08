const useStyles = theme => {
  const c = theme.palette.primary.contrastText;
  const e = theme.palette.error.main;
  return ({
    textField: {
      '& label': {
        color: c,
        fontSize: "0.9rem"
      },
      '& label.Mui-focused': {
        color: c,
      },
      '& label.MuiInputLabel-shrink': {
        transform: "translate(0, 2px)"
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
    formControlInputLang: {
      marginLeft: "0.6rem",
      marginRight: "0.6rem",
      minWidth: "8rem"
    },
    inputLabel: {
      color: c,
      fontSize: "0.9rem",
      '&.Mui-focused': {
        color: c,
        borderColor: c
      },
      '&.MuiInputLabel-shrink': {
        transform: "translate(0, 6px)"
      },
    },
    select: {
      '&.MuiInput-underline:after': {
        borderBottomColor: c,
      },
      '& .MuiInput-input': {
        color: c
      }
    },
    normalText: {
      textTransform: "none",
    },
    dialogTitle: {
      marginLeft: "2rem",
      marginBottom: "-1.4rem",
      paddingTop: "1rem",
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    paper: {
      height: '90%',
    },
    extraSmall: {
      padding: 0,
      margin: 0,
      '& input': {
        padding: [0, '!important'],
        margin: [0, '!important'],
      }
    }
  })
};

export default useStyles;