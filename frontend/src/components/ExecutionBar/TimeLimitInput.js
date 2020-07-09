import React from "react";
import { Box, TextField, InputAdornment } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import useStyles from './Style';
import { ExecutionContext } from "../../contexts/ExecutionContext";

class TimeLimitInput extends React.Component {
  static contextType = ExecutionContext;

  constructor(props, context) {
    super(props);
    this.state = {
      valid: true,
      currentVal: 60
    }
    if (!context.args["time_limit"]) {
      context.updateArg("time_limit", 60);
    }
  }

  render() {
    const { classes } = this.props;
    const timeLimit = this.context.args["time_limit"];
    return (
      <Box my="0.2rem" mx="0.6rem" width="5rem" display="inline-flex"  >
        <TextField
          error={!this.state.valid}
          label="Time limit"
          className={classes.textField}
          size="small"
          value={timeLimit && this.state.valid ? timeLimit : this.state.currentVal}
          helperText={!this.state.valid ? "Number: 1 - 60" : ""}
          onChange={e => {
            const v = Number(e.target.value);
            if (v && v > 0 && v <= 60) {
              this.setState({ valid: true, currentVal: v });
              this.context.updateArg("time_limit", v);
            }
            else {
              this.setState({ valid: false, currentVal: e.target.value });
            }
          }}
          InputProps={{
            style: { color: "white" },
            // endAdornment: <InputAdornment position="end">Seconds</InputAdornment>,
          }}
        />
      </Box>
    )
  }
}

export default withStyles(useStyles)(TimeLimitInput)