import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

export async function buildPrompt(prompt, temperature) {
    const config = {
        model: 'text-davinci-002', prompt, temperature, max_tokens: 50
    }
    const completion = await openai.createCompletion(config);
    const response = completion.data.choices[0].text;
    return response;
}
