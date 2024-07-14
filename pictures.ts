import { readdir } from "fs/promises";

const dirSize = async (directory: string): Promise<number> => {
  const files = await readdir(directory);
  return files.length;
}

const getRandomId = async (): Promise<number> => {
  const range = await dirSize("./res");
  return Math.floor(Math.random() * range);
}

export { getRandomId };
