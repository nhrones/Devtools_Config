// deno-lint-ignore-file no-explicit-any
import { join } from "jsr:@std/path";
export type Config = {
   /** file name for the build bundle */
   BundleName?: string
   /** current working directory */
   CWD?: string
   /** a boolean flag used to enable logging or ? */
   DEV?: boolean
   /** an array of entry files to start esBuild from */
   Entry?: string[]
   /** minify the esbuild bundle? */
   Minify?: boolean
   /** esbuild outfile */
   Out?: string
   /** a port number for the server or a service to use*/
   Port?: number
   /** the folder to serve index.html from */
   Serve?: string
   /** Array of folders to watch for changes in. (to trigger a build) */
   Watch?: string[]
}

/** The full path for the dev.json configuration file */
const CfgFilePath = "./.vscode/dev.json"

/** A default configuration file */
export const DefaultCFG: Config = {
   BundleName: "",
   CWD: "",
   DEV: true,
   Minify: false,
   Out: "dist",
   Port: 80,
   Serve: "",
   Watch: ["src"],
} as Config

/** getConfig async function
 *  @param {string} name - the name of the configuration object
 *  @param {string[]} args - any cli args
 *  @param {Config} defaultCfg - an optional default Config 
 *  @returns Promise\<ConfigYML\>
 */
export function getConfig(
   name: string,
   args: string[],
   defaultCfg: Config
): Config {

   // get any existing cfg from ./.vscode/dev.json
   const devCfg = getCfgObj()

   // first find existing cfg, else use passed in defaultCfg
   const thisNamedCfg = (name in devCfg)
      ? devCfg[name]
      : defaultCfg
   
   // adjust thisCfg with any passed in args - args take priority
   const thisNewCfg = (args.length)
      ? unpackArgs(args, thisNamedCfg) // mutate defaults with any cli-args
      : thisNamedCfg

   // save it
   persistCfg(name, thisNewCfg)

   // send it
   return thisNewCfg
}

/** Does dev.json file exist */
function cfgFileExists() {
   try {
      const result = Deno.statSync(CfgFilePath)
      return (result.isFile)
   } catch (e) {
      if (e instanceof Deno.errors.NotFound) {
         return false
      } else {
         throw e
      }
   }
}

/** Args are expected in defaultCfg-order where all are optional. */
function unpackArgs(args: string[], defaultCfg: any): Config {
   // marry args to cfg values
   const cfgKeys = Array.from(Object.keys(defaultCfg))
   cfgKeys.forEach((element, index) => {
      if (args[index]) {
         let arg = args[index]
         if (arg === 'root') arg = ''
         defaultCfg[element] = arg
      } else {
         if (defaultCfg[element] === 'root') defaultCfg[element] === ''
      }
   })
   return defaultCfg
}

/** Get raw configuration object from 'dev.json' */
function getCfgObj() {
   // start as empty object
   let rawCfg: Record<string, any> = {}
   // get the existing dev.json object
   if (cfgFileExists()) {
      // Unpack dev.json file
      rawCfg = JSON.parse(Deno.readTextFileSync(CfgFilePath));
   }
   // return it now
   return rawCfg
}

/** Write a named configuration to the dev.json file */
async function persistCfg(name: string, thisNamedCfg: any) {
   // get all
   const config: Record<string, any> = getCfgObj() 
   // add or modify this named config
   config[name] = thisNamedCfg
   await Deno.mkdir(join(".", ".vscode"), { recursive: true });
   // write all
   Deno.writeTextFileSync(CfgFilePath, JSON.stringify(config, null, 3));
}
