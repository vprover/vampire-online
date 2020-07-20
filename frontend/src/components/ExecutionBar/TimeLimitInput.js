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

  componentDidUpdate() {
    if (this.context.options.asArray.length !== 0 && this.restriction === undefined) {
      this.restriction = this.context.options.asArray.find(o => o.name === 'time_limit').restriction || null;
    }
  }

  isValid = (value) => {
    const res = this.restriction;
    let valid = true;
    if (res) {
      if (typeof res.maxValue !== 'undefined') valid = valid && value <= res.maxValue;
      if (typeof res.minValue !== 'undefined') valid = valid && value >= res.minValue;
    }
    return valid;
  }

  getErrorMessage = () => {
    const res = this.restriction;
    if (res) {
      if (typeof res.maxValue !== 'undefined' && typeof res.minValue !== 'undefined') return `${res.minValue} <= Number <= ${res.maxValue}`;
      if (typeof res.maxValue !== 'undefined') return `Number <= ${res.maxValue}`;
      if (typeof res.minValue !== 'undefined') return `${res.minValue} <= Number`;
    }
    return undefined;
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
          helperText={!this.state.valid ? this.getErrorMessage() : undefined}
          onChange={e => {
            const val = e.target.value;
            const valid = this.isValid(val !== '' ? val : "60");
            this.setState({ currentVal: val, valid: valid });
            if (valid) this.context.updateArg("time_limit", val);
          }}
          InputProps={{
            style: { color: "white" },
            // endAdornment: <InputAdornment position="end">Seconds</InputAdornment>,
          }}
          onBlur={() => { if (this.state.currentVal === '') this.setState({ currentVal: 60 }) }}
        />
      </Box>
    )
  }
}

export default withStyles(useStyles)(TimeLimitInput)