import Action from '@atlas.js/action'

/**
 * This action allows you to programmatically execute migrations using the Umzug migrator.
 *
 * ## Usage:
 *
 * First, add this action to your Atlas instance, and then:
 *
 * `await atlas.actions.migration.up()`
 * `await atlas.actions.migration.down()`
 *
 * You can also execute the action's methods from the Atlas CLI:
 *
 * `npx atlas exec migration up`
 *
 * @see https://www.npmjs.com/package/umzug
 */
declare class Migration extends Action {
  /**
   * Migrate upwards/apply
   *
   * @see https://www.npmjs.com/package/umzug#executing-pending-migrations
   */
  up(options: { from?: string, to?: string, migrations?: string[] }): Promise<string[]>
  up(migration: string): Promise<string[]>
  up(migrations: string[]): Promise<string[]>

  /**
   * Migrate downwards/revert
   *
   * @see https://www.npmjs.com/package/umzug#reverting-executed-migration
   */
  down(options: { to?: string | 0, migration?: string[] }): Promise<string[]>
  down(migration: string): Promise<string[]>
  down(migrations: string[]): Promise<string[]>

  /** Get a list of all pending migrations */
  pending(): Promise<string[]>
}

declare namespace Migration {
  type Config = {
    /**
     * Module location, relative to `atlas.root`, from which to load migration files
     * @default   migration
     */
    module: string
  }
}

export default Migration
