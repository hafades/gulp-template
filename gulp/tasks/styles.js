import { src, dest, watch, series } from "gulp";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import autoPrefixer from "gulp-autoprefixer";
import csso from "gulp-csso";
import gulpif from "gulp-if";
import rename from "gulp-rename";
import { serverReload } from "./server.js";
import config from "../config.js";
import autoImport from "../helpers/autoImport.js";

const sass = gulpSass(dartSass);

const stylesBuild = () =>
  src(config.styles.src, { sourcemaps: config.isDev })
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => ({
          title: "Scss",
          message: error,
        })),
      }),
    )
    .pipe(sass())
    .pipe(
      gulpif(
        config.isProd,
        autoPrefixer({
          cascade: true,
        }),
      ),
    )
    .pipe(
      rename({
        suffix: ".min",
        dirname: "",
      }),
    )
    .pipe(csso())
    .pipe(dest(config.styles.dest, { sourcemaps: config.isDev }));

const stylesUi = (callback) => {
  autoImport({
    dir: config.styles.ui.dir,
    ext: config.styles.ui.ext,
    outputFile: config.styles.ui.outputFile,
    template: config.styles.ui.template,
  });

  callback();
};

const stylesIcons = (callback) => {
  autoImport({
    dir: config.styles.icons.dir,
    ext: config.styles.icons.ext,
    outputFile: config.styles.icons.outputFile,
    template: config.styles.icons.template,
  });

  callback();
};

const stylesWatch = () => {
  watch(config.styles.watch, series(stylesBuild, serverReload));
  watch(
    `${config.styles.ui.dir}/**/*.${config.styles.ui.ext}`,
    { events: ["add", "addDir", "unlink", "unlinkDir"] },
    series(stylesUi),
  );
};

export { stylesBuild, stylesUi, stylesIcons, stylesWatch };
