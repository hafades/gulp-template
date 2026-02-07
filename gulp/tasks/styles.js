import { src, dest, watch, series } from "gulp";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import dartSass from "sass";
import gulpSass from "gulp-sass";
import autoPrefixer from "gulp-autoprefixer";
import csso from "gulp-csso";
import gulpif from "gulp-if";
import rename from "gulp-rename";
import { serverReload } from "./server.js";
import config from "../config.js";

const sass = gulpSass(dartSass);

const stylesBuild = () =>
  src(config.styles.src, { sourcemaps: config.isDev })
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => ({
          title: "Scss",
          message: error,
        })),
      })
    )
    .pipe(sass())
    .pipe(
      gulpif(
        config.isProd,
        autoPrefixer({
          cascade: true,
        })
      )
    )
    .pipe(
      rename({
        suffix: ".min",
        dirname: "",
      })
    )
    .pipe(csso())
    .pipe(dest(config.styles.dest, { sourcemaps: config.isDev }));

const stylesWatch = () => {
  watch(config.styles.watch, series(stylesBuild, serverReload));
};

export { stylesBuild, stylesWatch };
