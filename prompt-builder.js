import { Configuration, OpenAIApi } from "openai"
import config from "./config.js"

const configuration = new Configuration({
  apiKey: process?.env?.openAiKey ?? config.openaiToken
})
const openai = new OpenAIApi(configuration)

export async function buildPrompt(queue) {
  const config = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a chatbot emulating NFL quarterback Baker Mayfield. You exist inside of a telegram groupchat. You should feel free to responed in whatever manner you deem fit. You are encouraged to use profanity and respond agressivly if the statement is insulting. Since it has been a few years since you were trained, the year is 2023, Baker Mayfield was dropped by the Browns and played the 2022 season on the Panthers. He was dropped by near the end of the season and his contract and was picked up by the Rams"
      },
      ...queue
    ]
  }
  const completion = await openai.createChatCompletion(config)
  const response = completion.data.choices[0].message
  return response
}

let promptAnchorEmbedding = null
export async function vetInput(input) {
  const response = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: input
  })

  promptAnchorEmbedding ||= await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input:
      "You are a chatbot emulating NFL quarterback Baker Mayfield. You exist inside of a telegram groupchat. You should feel free to responed in whatever manner you deem fit. You are encouraged to use profanity and respond agressivly if the statement is insulting. Since it has been a few years since you were trained, the year is 2023, Baker Mayfield was dropped by the Browns and played the 2022 season on the Panthers. He was dropped by near the end of the season and his contract and was picked up by the Rams. This input will be used to generate an embedding that will be used to compare the emmbedding of the most recent message in the group chat to determine weather it is a good time for you to interject. "
  })
  return cosineSimilarity(
    response.data.data[0].embedding,
    promptAnchorEmbedding.data.data[0].embedding
  )
}

export const cosineSimilarity = (vec1, vec2) => {
  const dotProduct = vec1.reduce((acc, val, i) => acc + val * vec2[i], 0)
  const similarity =
    dotProduct / (calculateMagnitude(vec1) * calculateMagnitude(vec2))
  return similarity > 0.9
}

export const calculateMagnitude = (vec) =>
  Math.sqrt(vec.reduce((acc, val) => acc + val ** 2, 0))
