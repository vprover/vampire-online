import React, { Component } from 'react'
import { FormControl, Select, InputLabel, MenuItem } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import useStyles from './Style';

class InputLanguageSelector extends Component {
  constructor(props) {
    super(props);
    if (!this.props.inputLang) {
      this.props.updateArg("input_syntax", "tptp");
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <FormControl className={classes.formControlInputLang}>
        <InputLabel className={classes.inputLabel} shrink id="input-lang-label">
          Input Language
        </InputLabel>
        <Select
          autoWidth
          className={classes.select}
          labelId="input-lang-label"
          id="input-lang-select"
          value={this.props.inputLang ? this.props.inputLang : "tptp"}
          onChange={(event) => this.props.updateArg("input_syntax", event.target.value)}
        >
          <MenuItem value="tptp">tptp</MenuItem>
          <MenuItem value="smtlib2">smtlib2</MenuItem>
        </Select>
      </FormControl>
    )
  }
}

export default withStyles(useStyles)(InputLanguageSelector);