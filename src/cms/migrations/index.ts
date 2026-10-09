import * as migration_20261007_223159 from './20261007_223159';
import * as migration_20261009_190000_search from './20261009_190000_search';

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
];
