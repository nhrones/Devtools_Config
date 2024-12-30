
/** 
 * Check is the ./.vscode/dev.json file exists 
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