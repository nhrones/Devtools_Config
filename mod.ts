import type { Config, ConfigValue }  from "./types.ts";
import { fetchConfigurations, persistConfig } from "./dev_json.ts";
import { setTask } from "./tasks_json.ts";
   
// get any existing `named` configuration from ./.vscode/dev.json
export const persistedConfigurations = fetchConfigurations()

/** 
 *  retrieve or build and return a configuration
 *  @param {string} name - the name of the configuration object
 *  @param {string[]} cliArgs - any passed in cli args
 *  @param {ConfigOptions} defaultConfiguration - a default configuration 
 *  @returns Config
 */
export function getConfig(
   name: "BUILD" | "RUN" | "HOT",
   semver: string,
   cliArgs: string[],
   defaultConfiguration: Config
): Config {
   
   // get any existing `named` configuration from ./.vscode/dev.json
   //export const persistedConfigurations = fetchConfigurations()

   // find any existing configuration
   const namedConfiguration = (name in persistedConfigurations)
      ? persistedConfigurations[name]
      : defaultConfiguration // use passed in defaultConfiguration

   // adjust this configuration with any cliArgs - cliArgs take priority
   const newConfig = (cliArgs.length)
      ? parseArgs(cliArgs, namedConfiguration) // mutate with cliArgs
      : namedConfiguration  // no args, just use as is

   // persist new config //TODO Don't add if no change (Dirty)
   persistConfig(name, newConfig)

   // set up a vscode task
   setTask(name, semver)
   
   // return it
   return newConfig
}

/** 
 * unpack and assign any cli-args to default config properties 
 */
function parseArgs(args: string[], defaultConfig: Config): Config {
   // loop thru args and asign by type
   args.forEach((arg) => {
      // fix number strings
      let thisArg: ConfigValue = (parseInt(arg) > 0) ? parseInt(arg) : arg
      if (typeof thisArg === 'string') {
         if (thisArg === 'root') thisArg = ''
         defaultConfig.Serve = thisArg
      }
      if (typeof thisArg === 'number') defaultConfig.Port = thisArg
      if (typeof thisArg === 'boolean') defaultConfig.DEV = thisArg
   })
   return defaultConfig
}

/** 
 * Checks that the `fullPath` file exists 
 */
export function fileExists(fullPath: string): boolean {
   try {
      const result = Deno.statSync(fullPath)
      return (result.isFile)
   } catch (e) {
      if (e instanceof Deno.errors.NotFound) {
         return false
      } else {
         throw e
      }
   }
}

// re-export type
export type { Config }