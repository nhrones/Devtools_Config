import type { Config } from "./types.ts";

/** 
 * unpack and assign any cli-args to default config properties 
 */
export function parseArgs(args: string[], defaultConfig: any): Config {
   // loop thru args and asign by type
   args.forEach((arg) => {
      // fix number strings
      let thisArg = (parseInt(arg) > 0) ? parseInt(arg) : arg
      if (typeof thisArg === 'string') {
         if (thisArg === 'root') thisArg = ''
         defaultConfig.Serve = thisArg
      }
      if (typeof thisArg === 'number') defaultConfig.Port = thisArg
      if (typeof arg === 'boolean') defaultConfig.DEV = thisArg
   })
   return defaultConfig
}