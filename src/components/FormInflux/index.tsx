import React from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import { Button, Grid, Theme } from '@material-ui/core';
import { Form, Field } from 'react-final-form';
import get from 'lodash/get';

import { composeValidators, isRequired } from '../../helpers/validators';
import { renderField } from '../../helpers/form';
import { isElectron } from 'apollo/helpers/isElectron';

const styles = (theme: Theme): any => ({
  footer: {
    textAlign: 'right',
  },
  submit: {
    display: 'inline-block',
    minWidth: 200,
    '&$disabled': {
      color: theme.palette.common.black,
    },
  },
  disabled: {},
  downloading: {
    marginRight: 12,
    verticalAlign: 'middle',
  },
});

type Props = {
  classes: any;
  onSubmit: (values: {}) => Promise<void>;
};
const FormInflux = ({ classes, onSubmit }: Props) => {
  const { loading: fetching, data } = useQuery(GET_INITIAL);
  const [saveConnection, { loading: sending }] = useMutation(SAVE_CONNECTION);

  return (
    <Form onSubmit={onSubmit} initialValues={get(data, 'form', {})}>
      {({ handleSubmit, form, submitting, values }: any) => (
        <form onSubmit={handleSubmit} className={classes.form}>
          {/* It is here to prevent Chrome from autofilling user and password form fields */}
          <input type="password" style={{ display: 'none' }} />

          <Grid container spacing={16}>
            <Grid item xs={6}>
              <Field
                id="influx-url"
                disabled={submitting || fetching}
                name="url"
                component={renderField}
                label="Database URL"
                placeholder="https://myinfluxdb.test:8086"
                validate={composeValidators(isRequired)}
              />
            </Grid>
            <Grid item xs={6}>
              <Field
                id="influx-u"
                disabled={submitting || fetching}
                name="u"
                component={renderField}
                label="User"
              />
            </Grid>

            <Grid item xs={6}>
              <Field
                id="influx-p"
                disabled={submitting || fetching}
                name="p"
                component={renderField}
                label="Password"
                type="password"
              />
            </Grid>
            <Grid item xs={6}>
              <Field
                id="influx-db"
                disabled={submitting || fetching}
                name="db"
                component={renderField}
                label="Database"
              />
            </Grid>
            <Grid item xs={6}>
              <Field
                id="influx-unsafeSsl"
                disabled={!isElectron() || submitting || fetching}
                helperText={
                  !isElectron() && 'Available only in Electron Application'
                }
                name="unsafeSsl"
                component={renderField}
                label="Ignore SSL errors"
                type="checkbox"
              />
            </Grid>

            <Grid
              item
              xs={6}
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
              }}
            >
              <Button
                disabled={sending}
                type="button"
                variant="outlined"
                color="primary"
                style={{ float: 'right' }}
                onClick={() => {
                  saveConnection({ variables: values });
                }}
              >
                {sending ? 'Saving...' : 'Save connection data'}
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Field
                id="influx-q"
                disabled={submitting || fetching}
                name="q"
                component={renderField}
                label="Query"
                validate={composeValidators(isRequired)}
                multiline
                rows={10}
                helperText="Use CTRL/CMD+ENTER to submit"
                onKeyDown={(event: {
                  keyCode: number;
                  metaKey: any;
                  ctrlKey: any;
                }) => {
                  if (
                    event.keyCode === 13 &&
                    (event.metaKey || event.ctrlKey)
                  ) {
                    form.submit();
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} className={classes.footer}>
              <Button
                disabled={submitting || fetching}
                type="submit"
                variant="contained"
                color="secondary"
                className={classes.submit}
                classes={{
                  root: classes.submit,
                  disabled: classes.disabled,
                }}
              >
                {submitting
                  ? 'Executing query...'
                  : fetching
                  ? 'Loading data...'
                  : 'Run query'}
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Form>
  );
};

export const GET_INITIAL = gql`
  {
    form @client {
      url
      u
      p
      db
      q
      unsafeSsl
    }
  }
`;

export const SAVE_CONNECTION = gql`
  mutation(
    $url: String!
    $u: String
    $p: String
    $db: String
    $unsafeSsl: Boolean
  ) {
    saveConnection(url: $url, u: $u, p: $p, db: $db, unsafeSsl: $unsafeSsl)
      @client
  }
`;

export default withStyles(styles)(FormInflux);
