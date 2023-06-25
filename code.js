const { Discord, Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log("Bot準備完了！");
});

client.on("messageCreate", async (message) => { 
  // 自動削除対象チェンネル指定
  const channelId = message.channel.id;
  // 対象チャンネル設定
  if (channelId == process.env.DISCORD_TARGET_CHANNEL_ID) {
    // 機能1. 滅びの呪文
    const dSpell = ["バルス！", "ばるす！", "balus!", "Balus!", "BALUS!"];
    if (dSpell.includes(message.content)) {
      // 1. ムスカ様のターン
      await message.channel.send({
        embeds: [
          {
            description:
              "ラピュタは滅びぬ。 何度でも蘇るさ。 ラピュタの力こそ人類の夢だからだ",
            footer: { text: "ムスカ様" },
            image: { url: "https://www.ghibli.jp/gallery/laputa021.jpg" },
          },
        ],
      });
      // 2. 夫婦のターン
      await message.channel.send({
        embeds: [
          {
            description: "バルス..!!",
            footer: { text: "後の夫婦" },
            image: { url: "https://www.ghibli.jp/gallery/laputa047.jpg" },
          },
        ],
      });
      message.channel.messages.fetch().then((msgCollection) => {
        setTimeout(() => {
          msgCollection.forEach((msg) => {
            msg.delete().catch((e) => {
              if (e.code !== 10008) {
                console.error("Failed to delete the message: ", e);
              }
            });
            
          });
        }, 10000);
      });
    } else {
      // 機能2. 指定時間でコメント削除
      const dTime = process.env.DISCORD_DELETE_TIME_SECONDS;
      setTimeout(() => {
        message.delete().catch((e) => {
          if (e.code !== 10008) {
            console.error("Failed to delete the message: ", e);
          }
        });
      }, dTime);
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
