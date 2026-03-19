const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({ 
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] 
});

client.once('ready', async () => {
  console.log('Bot is online');

  const guild = await client.guilds.fetch(process.env.GUILD_ID);
  const channel = await client.channels.fetch(process.env.VOICE_CHANNEL_ID);

  joinVoiceChannel({
    channelId: channel.id,
    guildId: guild.id,
    adapterCreator: guild.voiceAdapterCreator,
  });
});

client.login(process.env.TOKEN);