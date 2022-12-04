import { Configuration, OpenAIApi } from "openai";
import { openAiKey } from './config.js'
import readline from 'readline';
const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const configuration = new Configuration({
  apiKey: openAiKey,
});
const openai = new OpenAIApi(configuration);

export async function buildPrompt(prompt, temperature) {
    const config = {
        model: 'text-davinci-002', prompt, temperature, max_tokens: 50
    }
    const completion = await openai.createCompletion(config);
    return completion.data.choices[0].text;
}
