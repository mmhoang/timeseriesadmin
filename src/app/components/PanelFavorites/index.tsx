import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles, Theme } from '@material-ui/core/styles';
import QueryFavorites from '../QueryFavorites';

const styles = (theme: Theme): any => ({
  root: {
    paddingTop: theme.spacing(),
  },
  info: {
    padding: theme.spacing(2),
    paddingBottom: 0,
  },
});

type Props = {
  classes: any;
};
const PanelFavorites = ({ classes }: Props) => (
  <div>
    <Typography variant="body1" className={classes.info}>
      List of favorite queries.
    </Typography>
    <div className={classes.root}>
      <QueryFavorites />
    </div>
  </div>
);

export default withStyles(styles)(PanelFavorites);
