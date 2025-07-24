import fs from "fs";
import path from "path";

export const loadJson = (filePath: string): any => {
  try {
    const fullPath = path.resolve(filePath);
    const fileContents = fs.readFileSync(fullPath, "utf-8");

    return JSON.parse(fileContents);

  } catch (err: any) {
    console.error(`Error reading file: ${filePath}`, err.message);
    process.exit(1);
  }
}