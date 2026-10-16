import * as migration_20261007_223159 from './20261007_223159';
import * as migration_20261009_190000_search from './20261009_190000_search';
import * as migration_20261009_220000_search_relevance from './20261009_220000_search_relevance';
import * as migration_20261010_230000_search_resource_types from './20261010_230000_search_resource_types';
import * as migration_20261011_000000_careers from './20261011_000000_careers';
import * as migration_20261011_213811_calls from './20261011_213811_calls';
import * as migration_20261012_180000_public_search_limits from './20261012_180000_public_search_limits';
import * as migration_20261015_224313_projects from './20261015_224313_projects';
import * as migration_20261015_230525_project_summaries_and_notes from './20261015_230525_project_summaries_and_notes';

export const migrations = [
  {
    up: migration_20261007_223159.up,
    down: migration_20261007_223159.down,
    name: '20261007_223159',
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
  {
    up: migration_20261011_000000_careers.up,
    down: migration_20261011_000000_careers.down,
    name: '20261011_000000_careers',
  },
  {
    up: migration_20261011_213811_calls.up,
    down: migration_20261011_213811_calls.down,
    name: '20261011_213811_calls',
  },
  {
    up: migration_20261012_180000_public_search_limits.up,
    down: migration_20261012_180000_public_search_limits.down,
    name: '20261012_180000_public_search_limits',
  },
  {
    up: migration_20261015_224313_projects.up,
    down: migration_20261015_224313_projects.down,
    name: '20261015_224313_projects',
  },
  {
    up: migration_20261015_230525_project_summaries_and_notes.up,
    down: migration_20261015_230525_project_summaries_and_notes.down,
    name: '20261015_230525_project_summaries_and_notes'
  },
];
