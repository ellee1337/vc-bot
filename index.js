const { Client, GatewayIntentBits } = require('discord.js');
const { 
  joinVoiceChannel, 
  getVoiceConnection, 
  VoiceConnectionStatus 
} = require('@discordjs/voice');

const client = new Client({ 
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] 
});

// 🔊 Connect to Voice Channel
async function connectVC() {
  try {
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    const channel = await client.channels.fetch(process.env.VOICE_CHANNEL_ID);

    if (!guild || !channel) {
      console.log("❌ Missing guild/channel");
      return;
    }

    const existing = getVoiceConnection(guild.id);
    if (existing) {
      console.log("⚠️ Already connected");
      return;
    }

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: false
    });

    // 🔁 Detect disconnect instantly
    connection.on(VoiceConnectionStatus.Disconnected, async () => {
      console.log("❌ Disconnected! Reconnecting...");
      setTimeout(connectVC, 5000);
    });

    console.log("✅ Joined VC");
  } catch (err) {
    console.log("❌ Error:", err);
  }
}

// 🚀 Bot Ready
client.once('ready', async () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);

  await connectVC();

  // 🔁 Backup reconnect every 30s
  setInterval(() => {
    const connection = getVoiceConnection(process.env.GUILD_ID);

    if (!connection) {
      console.log("🔄 Reconnecting (interval)...");
      connectVC();
    }
  }, 30000);
});

// ⚠️ Error handling
client.on('error', console.error);
process.on('unhandledRejection', console.error);

// 🔑 Login
client.login(process.env.TOKEN);