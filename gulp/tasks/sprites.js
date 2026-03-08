import { watch, series, src, dest } from "gulp";
import {
  writeFileSync,
  appendFileSync,
  readdirSync,
  unlinkSync,
  existsSync,
  readFileSync,
  mkdirSync,
} from "fs";
import svgSprite from "gulp-svg-sprite";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import { serverReload } from "./server.js";
import config from "../config.js";
import getDirectories from "../helpers/getDirectories.js";

const spriteShape = {
  mono: {
    transform: [
      {
        svgo: {
          plugins: [
            {
              name: "preset-default",
            },
            {
              name: "removeAttrs",
              params: {
                // attrs: "(class|data-name|fill.*|stroke.*)",
                attrs: "(class|data-name)",
              },
            },
          ],
        },
      },
    ],
  },
  multi: {
    transform: [
      {
        svgo: {
          plugins: [
            {
              name: "preset-default",
              params: {
                overrides: {
                  removeUselessStrokeAndFill: {
                    removeStroke: false,
                    removeFill: false,
                  },
                },
              },
            },
            {
              name: "removeAttrs",
              params: {
                attrs: "(class|data-name)",
              },
            },
          ],
        },
      },
    ],
  },
};

const getSpriteConfig = (name, type) => ({
  mode: {
    stack: {
      dest: ".",
      sprite: `sprite-${name}.svg`,
    },
  },
  shape: spriteShape[type],
});

const getSptireStyleTemplate = (spriteName, iconName, type) => {
  const templates = {
    mono:
      `.icon--${spriteName}-${iconName}::before {\n` +
      "  background-color: currentcolor;\n" +
      `  -webkit-mask-image: url('../images/sprite-${spriteName}.svg#${iconName}');\n` +
      `  mask-image: url('../images/sprite-${spriteName}.svg#${iconName}');\n` +
      "}\n",
    multi:
      `.icon--${spriteName}-${iconName}::before {\n` +
      "  background-color: transparent;\n" +
      `  background-image: url('../images/sprite-${spriteName}.svg#${iconName}');\n` +
      "}\n",
  };

  return templates[type];
};

const spriteBuild = (data) => {
  const spriteType = data.name.includes("mono") ? "mono" : "multi";
  const allIcons = `${data.path}/${data.name}/*.svg`;
  const spriteFilePath = `${config.svgSprites.spritesFolder}/${data.name}.scss`;

  if (data.event && data.event === "unlink") {
    if (
      !existsSync(`${data.path}/${data.name}`) ||
      readdirSync(`${data.path}/${data.name}`).length === 0
    ) {
      if (existsSync(spriteFilePath)) {
        unlinkSync(spriteFilePath);
        const result = readFileSync(config.svgSprites.icons, "utf-8")
          .split("\n")
          .filter((string) => !string.includes(data.name))
          .join("\n");
        writeFileSync(config.svgSprites.icons, result);
      }
      return;
    }
  }

  writeFileSync(spriteFilePath, "");

  src(allIcons)
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => ({
          title: "Pug",
          message: error.message,
        })),
      }),
    )
    .on("data", (file) => {
      appendFileSync(
        spriteFilePath,
        getSptireStyleTemplate(data.name, file.stem, spriteType),
      );
      return file;
    })
    .pipe(svgSprite(getSpriteConfig(data.name, spriteType)))
    .pipe(dest(config.svgSprites.dest));
};

const svgSpriteBuild = (done) => {
  const allIconDirectories = getDirectories(config.svgSprites.src);

  if (!existsSync(config.svgSprites.spritesFolder)) {
    mkdirSync(config.svgSprites.spritesFolder);
  } else {
    readdirSync(config.svgSprites.spritesFolder).forEach((file) => {
      unlinkSync(`${config.svgSprites.spritesFolder}/${file}`);
    });
  }

  allIconDirectories.forEach((directory) => {
    spriteBuild(directory);
  });

  done();
};

const svgSpriteWatch = () =>
  watch(config.svgSprites.watch, series(serverReload)).on(
    "all",
    (event, filePath) => {
      const array = filePath.split("/");
      array.pop();
      const name = array[array.length - 1];
      if (name !== "icons") {
        spriteBuild({
          event,
          name,
          path: config.svgSprites.src,
        });
      }
    },
  );

export { svgSpriteBuild, svgSpriteWatch };
