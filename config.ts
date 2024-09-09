import 'dotenv/config'

interface EnvConfig {
  telegrafKey: string;
  gcsId: string;
  gcsApiKey: string;
  openaiToken: string;
}

interface ProcessEnv {
  TELEGRAF_KEY: string;
  GCS_ID: string;
  GCS_API_KEY: string;
  OPENAI_TOKEN: string;
}

function getEnvVariable(key: keyof ProcessEnv): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

const config: EnvConfig = {
  telegrafKey: getEnvVariable('TELEGRAF_KEY'),
  gcsId: getEnvVariable('GCS_ID'),
  gcsApiKey: getEnvVariable('GCS_API_KEY'),
  openaiToken: getEnvVariable('OPENAI_TOKEN')
};

export default config;