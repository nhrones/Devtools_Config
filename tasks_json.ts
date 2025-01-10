import { fileExists } from "./mod.ts";
import { Task } from "./types.ts";

/** The full path for the dev.json configuration file */
export const TaskFilePath = "./.vscode/tasks.json"

type TaskName = "BUILD" | "RUN" | "HOT"

/** 
 * set a task 
 */
export function setTask(name: TaskName): void {

   let thisTask: Task | null = null

   switch (name) {

      case "BUILD": {
         thisTask = {
            label: "BUILD",
            type: "shell",
            command: `build`
         };
         break;
      }

      case "RUN": {
         thisTask = {
            label: "RUN",
            type: "shell",
            command: `serve`
         };
         break;
      }

      case "HOT": {
         thisTask = {
            label: "HOT",
            type: "shell",
            command: `hot`,
            problemMatcher: [],
            group: {
               kind: "build",
               isDefault: true
            }
         }
         break;
      }
      default:
   }

   // if we had a valid task type, save it
   if (thisTask !== null) persistTask(thisTask)
}

/** 
 * Inserts or updates a task and persists all to tasks.json
 * */
export function persistTask(task: Task): void {

   // get all tasks as object
   const tasks = fetchTasks()

   // insure the folder exists
   Deno.mkdirSync(".vscode", { recursive: true });

   // if task does not exist, add it
   if (!taskExists(task.label, tasks)) {
      tasks.push(task)


      // write all configurations as a JSON string
      Deno.writeTextFileSync( TaskFilePath,
         `{
   // See https://go.microsoft.com/fwlink/?LinkId=733558
   // for the documentation about the tasks.json format
   "version": "2.0.0",
   "tasks": ${JSON.stringify(tasks, null, 3)}}`
      );
   }
}

/** find the index of an existing task */
function taskExists(taskName: string, Tasks: Task[]): boolean {
   let found = false
   Tasks.forEach((task) => {
      if (task.label === taskName) found = true
   })
   return found
}

/** 
 * Returns all task objects from '.vscode/tasks.json' 
 */
export function fetchTasks(): Task[] {

   // start as empty object
   let rawCfg = []

   // get the existing tasks.json object
   if (fileExists(TaskFilePath)) {
      const raw = Deno.readTextFileSync(TaskFilePath)
      const t = raw.substring(raw.indexOf('['), raw.lastIndexOf("]") + 1)
      // Unpack tasks.json file
      rawCfg = JSON.parse(t);
   }

   // return it
   return rawCfg
}
