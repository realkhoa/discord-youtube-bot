import dotenv from "dotenv";

dotenv.config();

export interface IEnvironmentData {
  token: string;
  applicationID: string;
  botID: string
}

export default function loadConfig(): IEnvironmentData {
  const token =
    process.env.ENVIRONMENT === "PROD"
      ? process.env.DISCORD_TOKEN!
      : process.env.DISCORD_DEVELOPMENT_TOKEN!;
      
  const applicationID =
    process.env.ENVIRONMENT! === "PROD"
      ? process.env.DISCORD_APPLICATION_ID!
      : process.env.DISCORD_DEVELOPMENT_APPLICATION_ID!

  const botID =
    process.env.ENVIRONMENT! === "PROD"
      ? process.env.DISCORD_BOT_ID!
      : process.env.DISCORD_DEVELOPMENT_BOT_ID!
      
  return {
    applicationID, token, botID
  }
}
