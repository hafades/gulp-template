import { series, parallel } from "gulp";
import { clean } from "./gulp/tasks/clean.js";
import { serverStart } from "./gulp/tasks/server.js";
import { copyBuild, copyWatch } from "./gulp/tasks/copy.js";
import { emailsBuild, emailsWatch } from "./gulp/tasks/emails.js";
import { imagesBuild, imagesWatch } from "./gulp/tasks/images.js";
import { pugBuild, pugWatch } from "./gulp/tasks/pug.js";
import { stylesBuild, stylesWatch } from "./gulp/tasks/styles.js";
import { scriptsBuild, scriptsWatch } from "./gulp/tasks/scripts.js";
import config from "./gulp/config.js";

config.setEnv();

export const build = series(
  clean,
  parallel(
    copyBuild,
    emailsBuild,
    imagesBuild,
    pugBuild,
    stylesBuild,
    scriptsBuild,
  ),
);

export const dev = series(
	build,
  serverStart,
  parallel(
    copyWatch,
    emailsWatch,
    imagesWatch,
    pugWatch,
    stylesWatch,
    scriptsWatch,
  ),
);
