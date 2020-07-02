import React from 'react';
import { Card, CardContent, Typography, Chip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const useStyles = theme => ({
  valueChip: {
    margin: "0.3rem"
  },
  shortNameText: {
    marginLeft: "1.2rem"
  },
  optionCard: {
    width: "100%",
    margin: "0.2rem"
  }
});

class Option extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { classes } = this.props;
    const { name, shortName, description, values, restriction } = this.props.option;
    const defaultVal = this.props.option.default;
    return (
      <Card className={classes.optionCard}>
        <CardContent>
          <div style={{ display: "flex", alignItems: 'center', marginBottom: "1rem" }}>
            <Typography variant="h5">
              {name}
            </Typography>
            {
              shortName
              && <Typography variant="h6" className={classes.shortNameText}>({shortName})</Typography>
            }
          </div>
          <Typography>
            {description.split("\n").map((p, index) => (<React.Fragment key={index}>{p}<br /></React.Fragment>))}
          </Typography>
          {
            defaultVal &&
            <div>
              Default value: <Chip label={defaultVal} color="primary" size="small" variant="outlined" className={classes.valueChip} />
            </div>
          }
          {
            values &&
            <div>
              Possible values:
              {
                values.map((value, index) => {
                  return (
                    <Chip key={index} label={value} color="secondary" size="small" variant="outlined" className={classes.valueChip} />
                  );
                })
              }
            </div>
          }
          {
            restriction &&
            <Typography color="error">
              This option is not available online.
            </Typography>
          }
        </CardContent>
      </Card>
    )
  }
}

export default withStyles(useStyles)(Option);