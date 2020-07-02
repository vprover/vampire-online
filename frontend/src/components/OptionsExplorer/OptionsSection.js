import React from "react";
import { Typography } from "@material-ui/core";
import Option from './Option';

export default class OptionsSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <Typography variant="h4" style={{ margin: "1.2rem" }}>
          {this.props.name}
        </Typography>
        {
          this.props.options.map((option, index) => {
            return (
              <Option
                key={index}
                option={option}
              />
            );
          })
        }
      </React.Fragment>
    )
  }
}