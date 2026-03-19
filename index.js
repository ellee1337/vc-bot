const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

const client = new Client({ 
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] 
});

async function connectVC() {
  try {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    const channel = await client.channels.fetch(process.env.VOICE_CHANNEL_ID);

    if (!guild || !channel) return console.log("❌ Missing guild/channel");

    joinVoiceChannel({
      channelId: channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
    });

    console.log("✅ Joined VC");
  } catch (err) {
    console.log("❌ Error:", err);
  }
}

client.once('clientReady', async () => {
  console.log('Bot is online');

  await connectVC();

  // 🔁 AUTO RECONNECT EVERY 30s
  setInterval(() => {
    const connection = getVoiceConnection(process.env.GUILD_ID);

    if (!connection) {
      console.log("🔄 Reconnecting...");
      connectVC();
    }
  }, 30000);
});

client.login(process.env.TOKEN);