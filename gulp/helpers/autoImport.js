import fs from "fs";
import path from "path";

const autoImport = (options = {}) => {
  const {
    dir, // путь к папке с файлами
    ext, // формат файлов для поиска
    outputFile, // путь к файлу, в котором будут записаны импорты
    template, // шаблон для записи в файл
  } = options;

  const files = findFiles(dir, ext);

  let result = files.map((filePath) => {
    let relativePath = path.relative(dir, filePath);
    return template(relativePath);
  });

  fs.writeFileSync(outputFile, result.join(""));
};

function findFiles(dir, ext) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results.push(...findFiles(filePath, ext));
    } else if (path.extname(file) === `.${ext}`) {
      results.push(filePath);
    }
  });

  return results;
}

export default autoImport;
