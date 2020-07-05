import React, { Component } from 'react'
import { FormControl, Select, InputLabel, MenuItem } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import useStyles from './Style';
import { ExecutionContext } from '../../../contexts/ExecutionContext';

class InputLanguageSelector extends Component {
  static contextType = ExecutionContext;
  
  constructor(props, context) {
    super(props);
    if (!context.args["input_syntax"]) {
      context.updateArg("input_syntax", "tptp");
    }
  }

  render() {
    const { classes } = this.props;
    const inputLang = this.context.args["input_syntax"];
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
          value={inputLang ? inputLang : "tptp"}
          onChange={(event) => this.context.updateArg("input_syntax", event.target.value)}
        >
          <MenuItem value="tptp">tptp</MenuItem>
          <MenuItem value="smtlib2">smtlib2</MenuItem>
        </Select>
      </FormControl>
    )
  }
}

export default withStyles(useStyles)(InputLanguageSelector);