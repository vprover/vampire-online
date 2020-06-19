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
        <Typography variant="h3" style={{ margin: "1.2rem" }}>
          {this.props.name}
        </Typography>
        {
          this.props.options.map((option, index) => {
            return (
              <Option
                key={index}
                name={option.name}
                shortName={option.shortName}
                description={option.description}
                defaultVal={option.default}
                values={option.values} />
            );
          })
        }
      </React.Fragment>
    )
  }
}