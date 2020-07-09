import * as appRoot from "app-root-path";
import * as rimraf from "rimraf";
import { Keys } from "../constants/keys";

const tmpResultsFolder = `${appRoot}/floodTests/tmp`;
const applicationLogResultsFile = `${appRoot}/logs/${Keys.system_applicationLogFileName}`;
const systemLogResultsFile = `${appRoot}/logs/${Keys.system_systemLogFileName}`;

export default function fileCleanup() {
  rimraf.sync(tmpResultsFolder);
  rimraf.sync(applicationLogResultsFile);
  rimraf.sync(systemLogResultsFile);
}
