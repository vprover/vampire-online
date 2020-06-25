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
    const { name, shortName, description, defaultVal, values, classes } = this.props;
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
            {description}
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
        </CardContent>
      </Card>
    )
  }
}

export default withStyles(useStyles)(Option);