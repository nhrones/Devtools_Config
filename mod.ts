// deno-lint-ignore-file no-explicit-any
import { join } from "jsr:@std/path";

/** Configuration options-bag type */
export type Config = {

   /** file name for the esBuild bundle */
   BundleName?: string

   /** current working directory */
   CWD?: string

   /** a boolean flag used to enable developer mode logging or ?? */
   DEV?: boolean

   /** an array of entry files to start esBuild from */
   Entry?: string[]

   /** minify the esbuild bundle? */
   Minify?: boolean

   /** esbuild outfile */
   Out?: string

   /** a port number for the server or a service */
   Port?: number

   /** the folder to serve index.html from */
   Serve?: string

   /** Array of folders to watch for changes in. (to trigger a build) */
   Watch?: string[]
}

/** The full path for the dev.json configuration file */
const ConfigFilePath = "./.vscode/dev.json"

// /** A default configuration file */
// export const DefaultCFG: Config = {
//    BundleName: "bundle.js",
//    CWD: "",
//    DEV: true,
//    Entry: ["./src/main.ts"],
//    Minify: false,
//    Out: "dist",
//    Port: 80,
//    Serve: "",
//    Watch: ["src"],
// } as Config

/** 
 *  retrieve or build and return a configuration
 *  @param {string} name - the name of the configuration object
 *  @param {string[]} args - any passed in cli args
 *  @param {Config} defaultConfiguration - a default configuration 
 *  @returns Config
 */
export function getConfig(
   name: string,
   args: string[],
   defaultConfiguration: Config
): Config {

   // get any existing named configuration from ./.vscode/dev.json
   const persistedConfigurations = getExistingConfigurations()

   // first find existing cfg, else use passed in defaultCfg
   const namedConfiguration = (name in persistedConfigurations)
      ? persistedConfigurations[name]
      : defaultConfiguration

   // adjust this configuration with any passed in args - args take priority
   const newConfig = (args.length)
      ? unpackArgs(args, namedConfiguration) // mutate defaults with any cli-args
      : namedConfiguration

   // persist it
   persistConfig(name, newConfig)
   // return it
   return newConfig
}

/** Does the ./.vscode/dev.json file exist */
function configFileExists() {
   try {
      const result = Deno.statSync(ConfigFilePath)
      return (result.isFile)
   } catch (e) {
      if (e instanceof Deno.errors.NotFound) {
         return false
      } else {
         throw e
      }
   }
}

/** unpack and assign any args to default config properties */
function unpackArgs(args: string[], defaultConfig: any): Config {
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

/** Get all named configuration objects from '.vscode/dev.json' */
function getExistingConfigurations() {
   // start as empty object
   let rawCfg: Record<string, any> = {}
   // get the existing dev.json object
   if (configFileExists()) {
      // Unpack dev.json file
      rawCfg = JSON.parse(Deno.readTextFileSync(ConfigFilePath));
   }
   // return it
   return rawCfg
}

/** Write a named configuration to the dev.json file */
async function persistConfig(name: string, thisNamedCfg: any) {
   // get all
   const config: Record<string, any> = getExistingConfigurations()
   // add or modify this named config
   config[name] = thisNamedCfg
   await Deno.mkdir(join(".", ".vscode"), { recursive: true });
   // write all
   Deno.writeTextFileSync(ConfigFilePath, JSON.stringify(config, null, 3));
}
