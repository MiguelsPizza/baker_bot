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
        model: 'text-davinci-002', prompt, temperature, max_tokens: 1000
    }

    const completion = await openai.createCompletion(config);
    console.log(completion.data.choices);
}
reader.question('Enter a prompt:\n', async (prompt) => {
    await buildPrompt('What would Baker Mayfield say after a loss?', 0.5);
})
// const prompt = prompt("What would Baker do?");
// await buildPrompt(prompt, 0.5);
