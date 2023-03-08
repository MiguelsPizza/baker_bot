import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey:
    process?.env?.openAiKey ??
    "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"
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
