const path = require("path")
const { readdir } = require("fs/promises")

const dirSize = async (directory) => {
  const files = await readdir(directory)
  return files.length
}

const getRandomId = async () => {
  const range = await dirSize("./res")
  return Math.floor(Math.random() * range)
}

module.exports = { getRandomId }
