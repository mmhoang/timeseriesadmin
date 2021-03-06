import { executeQuery } from './executeQuery';

import { queryBase } from 'app/apollo/helpers/queryBase';
jest.mock('app/apollo/helpers/queryBase');

describe('executeQuery()', () => {
  test('is handled by queryBase() helper', async () => {
    const queryArgs = {
      q: 'SELECT * FROM test',
      url: '',
      db: '',
      u: '',
      p: '',
    };

    executeQuery(null, queryArgs);

    expect(queryBase).toBeCalledTimes(1);
    expect(queryBase).toBeCalledWith(queryArgs);
  });
});
