import { src, dest, watch, series } from "gulp";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import pug from "gulp-pug";
import rename from "gulp-rename";
import { serverReload } from "./server.js";
import config from "../config.js";
import autoImport from "../helpers/autoImport.js";

const pugBuild = () =>
  src(config.pug.src)
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => ({
          title: "Pug",
          message: error.message,
        })),
      }),
    )
    .pipe(
      pug({
        pretty: true,
        venbose: true,
      }),
    )
    .pipe(
      rename({
        dirname: "",
      }),
    )
    .pipe(dest(config.pug.dest));

const pugComponents = (callback) => {
  autoImport({
    dir: config.pug.components.dir,
    ext: config.pug.components.ext,
    outputFile: config.pug.components.outputFile,
    template: config.pug.components.template,
  });

  callback();
};

const pugUi = (callback) => {
  autoImport({
    dir: config.pug.ui.dir,
    ext: config.pug.ui.ext,
    outputFile: config.pug.ui.outputFile,
    template: config.pug.ui.template,
  });

  callback();
};

const pugWatch = () => {
  watch(config.pug.watch, series(pugBuild, serverReload));
  watch(
    `${config.pug.components.dir}/**/*.${config.pug.components.ext}`,
    { events: ["add", "addDir", "unlink", "unlinkDir"] },
    series(pugComponents),
  );
  watch(
    `${config.pug.ui.dir}/**/*.${config.pug.ui.ext}`,
    { events: ["add", "addDir", "unlink", "unlinkDir"] },
    series(pugUi),
  );
};

export { pugBuild, pugComponents, pugUi, pugWatch };
