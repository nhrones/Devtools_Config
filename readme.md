# config utility

This little utility allows the addition a of dev.json configuration file in the .vscode folder.
 
The lib reads configuration data from `/.vscode/dev.json`.

If a dev.json file is not found, a default file will be created.

If the dev.json does not include a named Config object for the name given, one will be created.

Each client application (tool) will supply their own default configuration.   
If an app is started with command line args, these will replace members in any existing cfg or will modify the default cfg before creating a new entry in the dev.json file.   

A Config type has the following optional members:
```ts
export type Config = {

   /** file name for the esBuild bundle - default = bundle.js */
   BundleName?: string

   /** current working directory - will overide deno.cwd*/
   CWD?: string

   /** a boolean flag used to enable developer mode logging - default = false*/
   DEV?: boolean

   /** an array of entry files to start esBuild from - defaults to ["./src/main.ts"] */
   Entry?: string[]

   /** minify the esbuild bundle? - defaults to false*/
   Minify?: boolean

   /** a port number for the server or a service */
   Port?: number

   /** the folder to serve index.html from */
   Serve?: string

   /** Array of folders to 'watch' for changes in. (to trigger a build) */
   Watch?: string[]
}
```
As each of the members in this type are optional, each named-config (app) may use any.

For example, a "simple" config (SimpleServer), uses only 'TargetFolder, and 'Port'.   
The `dev.json` in `./.vscode` will look like:
```ts
{
   "simple": {
      "TargetFolder": "root",
      "Port": 80
   }
}
```
Typing `serve` at the command line, will then serve ./index.html from localhost:80.
     
Typing `serve dist 8080` at the command line, will first change the values in the dev.json file, then serve ./dist/index.html from localhost:8080.
 
Typing `serve` again will use the new cfg values to serve ./dist/index.html from localhost:8080.