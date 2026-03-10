import { src, dest, watch, series } from "gulp";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import cached from "gulp-cached";
import gulpIf from "gulp-if";
import imagemin, {gifsicle, mozjpeg, optipng, svgo} from "gulp-imagemin";
import { serverReload } from "./server.js";
import config from "../config.js";

const imagesBuild = () =>
  src(config.images.src, {encoding: false})
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => ({
          title: "Images",
          message: error.message,
        })),
      }),
    )
    .pipe(cached("Images"))
    .pipe(gulpIf(config.isBuild, imagemin([
      gifsicle({interlaced: true}),
      mozjpeg({quality: 75, progressive: true}),
      optipng({optimizationLevel: 5}),
      svgo({
        plugins: [
          {
            name: 'removeViewBox',
            active: true
          },
          {
           	name: 'cleanupIDs',
            active: false
          }
        ]
      })
    ])))
    .pipe(dest(config.images.dest));

const imagesWatch = () =>
  watch(config.images.watch, series(imagesBuild, serverReload));

export { imagesBuild, imagesWatch };
