import React, { useContext } from 'react';
import gql from 'graphql-tag';
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Theme,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { Mutation } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import { QueryFavoritesContext } from 'app/contexts/QueryFavoritesContext';
import { HistoryEntry } from 'types/HistoryEntry';

const styles = (theme: Theme): any => ({
  btnIcon: {
    color: theme.palette.error.main,
    marginRight: 0,
    fontSize: 18,
    textAlign: 'left',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  listIcon: {
    minWidth: 0,
  },
  listItemText: {
    paddingLeft: theme.spacing(),
    paddingRight: 0,
  },
  noList: {
    paddingTop: 8,
    paddingLeft: 16,
    paddingRight: 16,
    fontSize: 14,
  },
});

const SET_FORM_QUERY = gql`
  mutation updateForm($query: String!) {
    updateForm(q: $query) @client
  }
`;

type Props = {
  classes: any;
};
// TODO: display Error details somehow, not with a Tooltip because of performance issues when there are 100 Tooltips...
const QueryFavorites = ({ classes }: Props) => {
  const { queryFavorites } = useContext<QueryFavoritesContext>(QueryFavoritesContext);
  const { deleteFavoritesEntry } = useContext<QueryFavoritesContext>(QueryFavoritesContext);

const handleDelete = (queryToDelete: any) => () =>
  deleteFavoritesEntry({ query: queryToDelete });

  return (
    <Mutation mutation={SET_FORM_QUERY}>
      {(setFormQuery: (arg0: { variables: { query: string } }) => void) => {
        const handleQueryClick = (query: string) => () => {
          setFormQuery({ variables: { query } });
        };
        if (!queryFavorites || queryFavorites.length === 0) {
          return (
            <div className={classes.noList}>
              Query favorites is empty.
              <br />
              Execute your first query using <a href="#influx-q">Query form</a>
            </div>
          );
        }
        return (
          <List dense>
            {queryFavorites.map(
              (entry: HistoryEntry, index: string | number | undefined) => (
                <ListItem
                  button
                  disableGutters
                  className={classes.listItem}
                  key={index}
                  onClick={handleQueryClick(entry.query)}
                >
                  <ListItemText
                    primary={entry.query}
                    className={classes.listItemText}
                  />
                  <IconButton
                    onClick={handleDelete(entry.query)}
                    aria-label="Delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ),
            )}
          </List>
        );
      }}
    </Mutation>
  );
};

export default withStyles(styles)(QueryFavorites);
