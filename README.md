# Instruction

## Quick start

Create .env file in root folder.  
Add following information:

```js
DISCORD_TOKEN=[YOUR_BOT_TOKEN]
DISCORD_APPLICATION_ID=[YOUR_APPLICATION_ID]
DISCORD_BOT_ID=[BOT_ID]
```

For `Token` and `ApplicationID`, you can get it via [Discord Developer Portal](https://discord.com/developers/docs/intro). Refer to [this guide](https://discordjs.guide) for more information.

For `BotID`, right click on your bot and select `Copy User ID`.   

Run the following command:  
```bash
yarn start
```
or
```bash
npm start
```

## Authentication for YouTube (Old, not recomend)
Use [this](#authentication-for-youtube-new) instead

If you want your bot to play videos with age restrictions, authenticate the YouTube service with the following command:

```bash
  yarn setup
```

Follow [this intruction](https://github.com/play-dl/play-dl/tree/main/instructions) to complete the process.
***Note:*** You are only able to authenticate with YouTube because I was too lazy to set up the other two services.

## Authentication for YouTube (New)

Add this line to your `.env` file:
```js
...
YOUTUBE_COOKIES=[Cookies]
...
```

Follow [this intruction](https://github.com/play-dl/play-dl/tree/main/instructions) to get your youtube cookies.
## For Developer

The `.env` file for development is a bit different:
```js
DISCORD_TOKEN=[YOUR_BOT_TOKEN]
DISCORD_APPLICATION_ID=[YOUR_APPLICATION_ID]
DISCORD_BOT_ID=[BOT_ID]

DISCORD_DEVELOPMENT_TOKEN=[YOUR_DEV_BOT_TOKEN]
DISCORD_DEVELOPMENT_APPLICATION_ID=[YOUR_DEV_APPLICATION_ID]
DISCORD_DEVELOPMENT_BOT_ID=[BOT_DEV_ID]
```

Start the development server with the following command:
```bash
yarn dev
```

or
```bash
npm run dev
```

Ensure all dependencies are installed:
```bash
yarn install
```

or
```bash
npm install
```

This project uses yarn as the package manager, so it is highly recommended to use yarn.

## For who using pm2

```bash
pm2 start ./scripts/run.prod.sh --name yt-bot
```