import React from "react";
import { Box, TextField, InputAdornment } from "@material-ui/core";

export default class TimeLimitInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      valid: true
    }
  }

  render() {
    return (
      <Box m="0.3em" width="9%">
        <TextField
          error={!this.state.valid}
          label="Time limit"
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
            endAdornment: <InputAdornment position="end">Seconds</InputAdornment>,
          }}
        />
      </Box>
    )
  }
}