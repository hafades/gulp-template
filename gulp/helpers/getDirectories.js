import { readdirSync } from "fs";

// path - путь к директории с папками
const getDirectories = (path) => {
  let result = [];

  try {
    result = readdirSync(path, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => ({
        name: dirent.name,
        path,
      }));
  } catch (error) {
    console.error("Not found", error);
  }

  return result;
};

export default getDirectories;
