# Instruction

## Quick start

Create .env file in root folder.  
Add following information:

```js
DISCORD_TOKEN=[YOUR_BOT_TOKEN]
DISCORD_APPLICATION_ID=[YOUR_APPLICATION_ID]
DISCORD_BOT_ID=[BOT_ID]
```

For `Token` and `ApplicationID`, you can get it via [Discord Developer Portal](https://discord.com/developers/docs/intro). You can follow [this](https://discordjs.guide) guide for more information.

For `BotID`, you can right click to your bot -> `Copy User ID`.   

Then simply run this command:   
```bash
yarn start
```
or
```bash
npm start
```

## For Developer

.env file is a bit different:
```js
DISCORD_TOKEN=[YOUR_BOT_TOKEN]
DISCORD_APPLICATION_ID=[YOUR_APPLICATION_ID]
DISCORD_BOT_ID=[BOT_ID]

DISCORD_DEVELOPMENT_TOKEN=[YOUR_DEV_BOT_TOKEN]
DISCORD_DEVELOPMENT_APPLICATION_ID=[YOUR_DEV_APPLICATION_ID]
DISCORD_DEVELOPMENT_BOT_ID=[BOT_DEV_ID]
```

Then you could start development server by using following command:
```bash
yarn dev
```

or
```bash
npm run dev
```

This project use yarn as package manager from start, so I highly recommend using yarn.

## For who using pm2

```bash
pm2 start ./scripts/run.prod.sh --name yt-bot
```