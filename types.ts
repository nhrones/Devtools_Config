/** Configuration options */
export type Config = {

   /** file name for the esBuild bundle */
   BundleName?: string

   /** a boolean flag used to enable developer mode logging or ?? */
   DEV?: boolean

   /** an array of entry files to start esBuild from */
   Entry?: string[]

   /** minify the esbuild bundle? */
   Minify?: boolean

   /** esbuild bundle? */
   Bundle?: boolean
   
   /** esbuild outfile */
   OutPath?: string

   /** a port number for the server or a service */
   Port?: number

   /** the folder to serve index.html from */
   Serve?: string

   /** the name of the html file to serve */
   HtmlName?: string

   /** Array of folders to watch for changes in. (to trigger a build) */
   Watch?: string[]

   /** Semver `1.0.16` */
   Semver?: string
}

/** Task options */
export type Task = {

   /** name for the task */
   label: string

   /** the type of task one of 'shell' or 'deno'*/
   type: "shell" | "deno"

   /** the command to run or execute */
   command: string

   /** args (optional) cli args to be passed */
   args?: string[]

   /** minify the esbuild bundle? */
   problemMatcher?: [] | ["$deno"]

   /** the command group */
   group?: { kind: string, isDefault: boolean }
}

/**
 * Allowed value types for a property in a Config object
 */
export type ConfigValue = number | string | string[] | boolean

/**
 * The type of a single configuration object
 */
export type ConfigObject = Record<string, ConfigValue>
