import * as migration_20261007_223159 from './20261007_223159';
import * as migration_20261009_190000_search from './20261009_190000_search';
import * as migration_20261009_220000_search_relevance from './20261009_220000_search_relevance';

import * as migration_20261010_230000_search_resource_types from './20261010_230000_search_resource_types';

export const migrations = [
  {
    up: migration_20261007_223159.up,
    down: migration_20261007_223159.down,
    name: '20261007_223159'
  },
  {
    up: migration_20261009_190000_search.up,
    down: migration_20261009_190000_search.down,
    name: '20261009_190000_search',
  },
  {
    up: migration_20261009_220000_search_relevance.up,
    down: migration_20261009_220000_search_relevance.down,
    name: '20261009_220000_search_relevance',
  },
  {
    up: migration_20261010_230000_search_resource_types.up,
    down: migration_20261010_230000_search_resource_types.down,
    name: '20261010_230000_search_resource_types',
  },
];
