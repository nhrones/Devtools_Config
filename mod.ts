
import { fetchConfigurations, persistConfig } from "./devJSON.ts";
import type { Config}  from "./types.ts";
import { parseArgs } from "./shared.ts" 
import { setTask } from "./tasksJSON.ts";

/** 
 *  retrieve or build and return a configuration
 *  @param {string} name - the name of the configuration object
 *  @param {string[]} cliArgs - any passed in cli args
 *  @param {ConfigOptions} defaultConfiguration - a default configuration 
 *  @returns Config
 */
export function getConfig(
   name: string,
   semver: string,
   cliArgs: string[],
   defaultConfiguration: Config
): Config {
   // get any existing named configuration from ./.vscode/dev.json
   const persistedConfigurations = fetchConfigurations()

   // find any existing configuration
   const namedConfiguration = (name in persistedConfigurations)
      ? persistedConfigurations[name]
      : defaultConfiguration // use passed in defaultConfiguration

   // adjust this configuration with any cliArgs - cliArgs take priority
   const newConfig = (cliArgs.length)
      ? parseArgs(cliArgs, namedConfiguration) // mutate with cliArgs
      : namedConfiguration  // no args, just use as is

   // persist new config
   persistConfig(name, newConfig)

   // set up a vscode task
   setTask(name, semver)
   
   // return it
   return newConfig
}

export type { Config }