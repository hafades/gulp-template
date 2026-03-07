const sourceFolder = "./source";
const buildFolder = "./build";

const config = {
  clean: {
    build: [buildFolder],
  },

  server: {
    baseDir: buildFolder,
  },

  copy: {
    base: `${sourceFolder}/assets`,
    src: [
      `${sourceFolder}/assets/favicon/*.{png,xml,ico,svg,webmanifest}`,
      `${sourceFolder}/assets/files/**/*.*`,
      `${sourceFolder}/assets/fonts/**/*.*`,
    ],
    dest: buildFolder,
    watch: [
      `${sourceFolder}/assets/favicon/*.{png,xml,ico,svg,webmanifest}`,
      `${sourceFolder}/assets/files/**/*.*`,
      `${sourceFolder}/assets/fonts/**/*.*`,
    ],
  },

  emails: {
    src: `${sourceFolder}/emails/**/*.html`,
    dest: `${buildFolder}/emails`,
    watch: `${sourceFolder}/emails/**/*.html`,
  },

  images: {
    src: `${sourceFolder}/assets/images/**/*.{jpg,jpeg,png,gif,svg,webp}`,
    dest: `${buildFolder}/images`,
    watch: `${sourceFolder}/assets/images/**/*.{jpg,jpeg,png,gif,svg,webp}`,
  },

  pug: {
    src: `${sourceFolder}/pages/**/*.pug`,
    dest: buildFolder,
    watch: [
      `${sourceFolder}/pages/**/*.pug`,
      `${sourceFolder}/components/**/*.pug`,
      `${sourceFolder}/blocks/**/*.pug`,
      `${sourceFolder}/data/**/*.pug`,
      `${sourceFolder}/config/pug/**/*.pug`,
    ],
    components: {
      dir: `${sourceFolder}/components`,
      ext: "pug",
      outputFile: `${sourceFolder}/config/pug/_components.pug`,
      template: (filePath) => `include ../../components/${filePath}\n`,
    },
  },

  styles: {
    src: `${sourceFolder}/pages/**/*.scss`,
    dest: `${buildFolder}/css`,
    watch: [
      `${sourceFolder}/pages/**/*.scss`,
      `${sourceFolder}/components/**/*.scss`,
      `${sourceFolder}/blocks/**/*.scss`,
      `${sourceFolder}/config/styles/**/*.scss`,
    ],
  },

  scripts: {
    src: `${sourceFolder}/pages/**/*.js`,
    dest: `${buildFolder}/js`,
    watch: `${sourceFolder}/**/*.js`,
  },

  setEnv() {
    this.isBuild = process.argv.includes("build");
    this.isDev = !this.isBuild;
  },
};

export default config;
