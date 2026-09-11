import * as migration_20260831_173459 from './20260831_173459';
import * as migration_20260831_190209_projects_services from './20260831_190209_projects_services';
import * as migration_20260901_000410_globals from './20260901_000410_globals';
import * as migration_20260901_005036_about from './20260901_005036_about';
import * as migration_20260901_010706_what_we_do from './20260901_010706_what_we_do';
import * as migration_20260901_012655_creators_page from './20260901_012655_creators_page';
import * as migration_20260901_015925_contact_page from './20260901_015925_contact_page';
import * as migration_20260901_062621_insights from './20260901_062621_insights';
import * as migration_20260901_080656_home_page from './20260901_080656_home_page';
import * as migration_20260901_100158_portfolio_graph from './20260901_100158_portfolio_graph';
import * as migration_20260901_120000_service_publish_backfill from './20260901_120000_service_publish_backfill';
import * as migration_20260901_221942_gold_standard_fields from './20260901_221942_gold_standard_fields';

export const migrations = [
  {
    up: migration_20260831_173459.up,
    down: migration_20260831_173459.down,
    name: '20260831_173459',
  },
  {
    up: migration_20260831_190209_projects_services.up,
    down: migration_20260831_190209_projects_services.down,
    name: '20260831_190209_projects_services',
  },
  {
    up: migration_20260901_000410_globals.up,
    down: migration_20260901_000410_globals.down,
    name: '20260901_000410_globals',
  },
  {
    up: migration_20260901_005036_about.up,
    down: migration_20260901_005036_about.down,
    name: '20260901_005036_about',
  },
  {
    up: migration_20260901_010706_what_we_do.up,
    down: migration_20260901_010706_what_we_do.down,
    name: '20260901_010706_what_we_do',
  },
  {
    up: migration_20260901_012655_creators_page.up,
    down: migration_20260901_012655_creators_page.down,
    name: '20260901_012655_creators_page',
  },
  {
    up: migration_20260901_015925_contact_page.up,
    down: migration_20260901_015925_contact_page.down,
    name: '20260901_015925_contact_page',
  },
  {
    up: migration_20260901_062621_insights.up,
    down: migration_20260901_062621_insights.down,
    name: '20260901_062621_insights',
  },
  {
    up: migration_20260901_080656_home_page.up,
    down: migration_20260901_080656_home_page.down,
    name: '20260901_080656_home_page',
  },
  {
    up: migration_20260901_100158_portfolio_graph.up,
    down: migration_20260901_100158_portfolio_graph.down,
    name: '20260901_100158_portfolio_graph',
  },
  {
    up: migration_20260901_120000_service_publish_backfill.up,
    down: migration_20260901_120000_service_publish_backfill.down,
    name: '20260901_120000_service_publish_backfill',
  },
  {
    up: migration_20260901_221942_gold_standard_fields.up,
    down: migration_20260901_221942_gold_standard_fields.down,
    name: '20260901_221942_gold_standard_fields'
  },
];
