import React from "react";
import { Box, TextField, InputAdornment } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';

const useStyles = theme => {
  const c = theme.palette.primary.contrastText;
  const e = theme.palette.error.main;
  return ({
    root: {
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
        '& fieldset': {
          borderColor: c,
        },
        '&:hover fieldset': {
          borderColor: c,
        },
        '&.Mui-focused fieldset': {
          borderColor: c,
        },
      },
    },
  })
}

class TimeLimitInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      valid: true
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <Box m="0.2em" width="6em" display="inline-flex"  >
        <TextField
          error={!this.state.valid}
          label="Time limit"
          className={classes.root}
          size="small"
          defaultValue="60"
          helperText={!this.state.valid ? "Number: 1 - 60" : ""}
          onChange={e => {
            const v = Number(e.target.value);
            if (v && v > 0 && v <= 60) {
              this.setState({ valid: true });
              this.props.updateArg("--time_limit", v);
            }
            else {
              this.setState({ valid: false });
            }
          }}
          InputProps={{
            style: { color: "white" }
            // endAdornment: <InputAdornment position="end">Seconds</InputAdornment>,
          }}
        />
      </Box>
    )
  }
}

export default withStyles(useStyles)(TimeLimitInput)