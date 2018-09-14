import storage from '../helpers/storage';

// In order to extract schema to separate .graphql file it will be required to alter
// webpack config which is not possible without ejecting or using rewired version of CRA
export const typeDefs = `
  type InfluxQuery {
    query: String
    error: String
  }
  type FormData {
    url: String
    u: String
    p: String
    db: String
    q: String
  }
  type Server {
    id: String!
    databases: [Database!]
  }
  type Database {
    id: String!
    name: String!
    measurements: [Measurement!]
  }
  type Series {
    id: String!
    name: String!
    tags: String!
    key: String!
  }
  type RetentionPolicy {
    id: String!
    name: String!
    duration: String!
    shardGroupDuration: String!
    replicaN: Number!
    default: Boolean!
  }
  type Measurement {
    id: String!
    name: String!
    fieldKeys: [FieldKey!]
    tagKeys: [TagKey!]
  }
  type FieldKey {
    id: String!
    name: String!
    type: String!
  }
  type TagKey {
    id: String!
    name: String!
  }
  type TagValue {
    id: String!
    name: String!
  }
  type Connection {
    id: String!
    url: String!
    u: String
    p: String
    db: String
  }
  type Mutation {
    executeQuery(url: String!, u: String, p: String, db: String, q: String!): Boolean
    updateForm(url: String, u: String, p: String, db: String, q: String): Boolean
		setOpenDrawer(isOpen: Boolean!): Boolean
    saveConnection(url: String, u: String, p: String, db: String): Boolean
    deleteConnection(id: String!): Boolean
  }
  type Query {
		isOpenDrawer: Boolean
    form: FormData
    queryHistory: [InfluxQuery!]
    server: Server
    connections: [Connection]!
  }
`;
// ensure connection fields existence
const connections = JSON.parse(storage.get('connections', '[]')).map(conn => ({
  url: '',
  u: '',
  p: '',
  db: '',
  ...conn,
}));
// TODO: prevent adding history with no query instead of filtering on init
// HERE filter invalid connection data
const queryHistory = JSON.parse(storage.get('queryHistory', '[]'))
  .filter(hist => hist.query)
  .map(hist => ({
    query: '',
    error: '',
    ...hist,
  }));
const form = { ...JSON.parse(storage.get('form')),
	url: '',
	u: '',
	p: '',
	db: '',
	q: '',
	__typename: 'FormData',
};
const isOpenDrawer = storage.get('isOpenDrawer', 'true') === 'true';
/*const server = {
  __typename: 'Server',
  id: 'test@test.com:8086',
  name: 'test@test.com:8086',
  databases: [
    {
      __typename: 'Database',
      id: 'testDB',
      name: 'testDB',
      measurements: [
        {
          __typename: 'Measurement',
          id: 'testMeas',
          name: 'testMeas',
          fieldKeys: [
            {
              __typename: 'FieldKey',
              id: 'testFK',
              name: 'testFK',
              type: 'float',
            }
          ],
          tagKeys: [
            {
              __typename: 'TagKey',
              id: 'testFT',
              name: 'testFT',
            }
          ],
        },
      ],
    },
  ],
};//JSON.parse(storage.get('explorer', null));
*/

export const defaults = {
	isOpenDrawer,
  queryHistory,
  connections,
  form,
  server: null,
};
