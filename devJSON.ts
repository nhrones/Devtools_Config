import { join } from "./deps.ts";
import type { ConfigValue, ConfigObject } from "./types.ts"
import { fileExists } from "./io.ts";

/** The full path for the dev.json configuration file */
export const ConfigFilePath = "./.vscode/dev.json"

/** 
 * Inserts a named configuration and persists all configurations to dev.json
 * */
export function persistConfig(
   name: string,
   thisNamedCfg: Record<string, ConfigValue>
): void {

   // get all
   const configs: Record<string, ConfigObject> = fetchConfigurations()

   // add or modify this named config
   configs[name] = thisNamedCfg

   // insure the folder exists
   Deno.mkdirSync(join(".", ".vscode"), { recursive: true });

   // write all configurations as a JSON string
   Deno.writeTextFileSync(ConfigFilePath, JSON.stringify(configs, null, 3));
}


/** 
 * Returns all named configuration objects from '.vscode/dev.json' 
 */
export function fetchConfigurations(): Record<string, ConfigObject> {

   // start as empty object
   let rawCfg: Record<string, ConfigObject> = {}

   // get the existing dev.json object
   if (fileExists(ConfigFilePath)) {

      // Unpack dev.json file
      rawCfg = JSON.parse(Deno.readTextFileSync(ConfigFilePath));
   }

   // return it
   return rawCfg
}