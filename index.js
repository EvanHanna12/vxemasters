const fs = require("fs");
const superagent = "superagent";
const Discord = require("discord.js");
const moment = require("moment");
const Eco = require("quick.eco");
const quickdb = require("quick.db");
const snekfetch = require("snekfetch");
const fetch = require("node-fetch");
const client = new Discord.Client({
  fetchAllMembers: true //???
});

const msParse = require('parse-ms');
const ms = require('ms');
const { GiveawaysManager } = require('discord-giveaways');

// fixed

const manager = new GiveawaysManager(client, {
    storage: './giveaways.json',
    updateCountdownEvery: 10000,
    default: {
        botsCanWin: false,
        exemptPermissions: [ "MANAGE_MESSAGES", "ADMINISTRATOR" ],
        embedColor: "RANDOM",
        reaction: "🎉"
    }
});


client.commands = new Discord.Collection();

const ytdl = require("ytdl-core");
const prefixes = require("./prefixes.json");

const config = require("./config.json");
const ownerIDs = [
  "511709669803294746"
];

client.on("ready", async () => {
  console.log(`${client.user.tag} is ready!`);
  client.user.setPresence({
    activity: { name: `with ${client.users.cache.size} users and ${client.guilds.cache.size} guilds`, type: "PLAYING" },
    status: "dnd"
  });

  let readyEmbed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setAuthor(`${client.user.tag} is ready for action!`)
    .setThumbnail(
      client.user.displayAvatarURL({
        dynamic: true,
        size: 1024,
        format: "png"
      })
    )
    .setDescription(
      `<a:Loading:708107557553569853> I'm ready to serve ${client.guilds.cache.size} guilds and ${client.users.cache.size} users!`
    )
    .setTimestamp();
  client.channels.cache.get("698589852819783721").send(readyEmbed);
});

client.on("guildMemberAdd", async gnMember => {
  let channelGetwl = quickdb.fetch(`wlcchannel_${gnMember.guild.id}`);
  if (channelGetwl === null || channelGetwl === "off") {
    return;
  } else {
    let welcomeEmbed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setAuthor(`${gnMember.user.username} has joined ${gnMember.guild.name}!`)
      .setTitle("**Welcome!**")
      .setThumbnail(
        gnMember.user.displayAvatarURL({
          dynamic: true,
          size: 1024,
          format: "png"
        })
      )
      .setDescription(
        `Hey ${gnMember}, Welcome to ${gnMember.guild.name}!\nHave fun!`
      )
      .setTimestamp();
    gnMember.guild.channels.cache.get(channelGetwl.id).send(welcomeEmbed);
  }
});

client.on("guildMemberRemove", async ggMember => {
  let channelGetgb = quickdb.fetch(`gbechannel_${ggMember.guild.id}`);
  if (channelGetgb === null || channelGetgb === "off") {
    return;
  } else {
    let goodbyeEmbed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setAuthor(`${ggMember.user.username} left the server...`)
      .setTitle("**Goodbye...**")
      .setThumbnail(
        ggMember.user.displayAvatarURL({
          dynamic: true,
          size: 1024,
          format: "png"
        })
      )
      .setDescription(
        `Woah ${ggMember}, had left us but they might change there mind a come back...\nWe'll miss you`
      )
      .setTimestamp();

    ggMember.guild.channels.cache.get(channelGetgb.id).send(goodbyeEmbed);
  }
});

client.on("message", async message => {
  let prefix;
  if (!prefixes[message.guild.id]) {
    prefix = config.prefix;
  } else if (prefixes[message.guild.id]) {
    prefix = prefixes[message.guild.id].prefixes;
  }

  if (message.channel.type === "dm") return;
  if (message.author.bot) return;

  const messageArray = message.content.split(" ");
  const command = messageArray[0].toLowerCase();
  const args = messageArray.slice(1);

  if (command === `${prefix}ping`) {
    let pingMsgEmbed = new Discord.MessageEmbed()
      .setColor("#0033ff")
      .setDescription("🏓 Pinging...");

    let pingMsg = await message.channel.send(pingMsgEmbed);
    let pingEmbed = new Discord.MessageEmbed()
      .setColor("#0033ff")
      .setTitle("🏓 **Pong!**")
      .addField(
        "**Results:**",
        `Bot Latency: \`${pingMsg.createdTimestamp -
          message.createdTimestamp}ms\`\nAPI Latency: \`${Math.floor(
          Math.round(client.ws.ping)
        )}ms\``,
        false
      )
      .setFooter(
        `Requested by ${message.author.tag}`,
        message.author.displayAvatarURL({
          dynamic: true,
          size: 1024,
          format: "png"
        })
      )
      .setTimestamp();

    pingMsg.edit(pingEmbed);
  }
  

  if (command === `${prefix}eval`) {
    if (!ownerIDs.includes(message.author.id))
      return message.reply(`That command is only for the bot owners.`);
    try {
      const code = args.join(" ");
      let evaled = eval(code);

      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

      message.channel.send(clean(evaled), { code: "xl" });
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
    function clean(text) {
      if (typeof text === "string")
        return text
          .replace(/`/g, "`" + String.fromCharCode(8203))
          .replace(/@/g, "@" + String.fromCharCode(8203));
      else return text;
    }
  }
  if (command === `${prefix}help`) {
    let helpEmbed = new Discord.MessageEmbed()
      .setTitle("Help Command - Total Commands [30] ")
      .setDescription(`[Support Server](https://invite.gg/vxemaster)`, `[Invite Me](https://discord.com/api/oauth2/authorize?client_id=708470996767735909&permissions=8&scope=bot)`)
      .addField(
        "<:VerifiedDeveloper:708105822655217695>》Owner Command [2]:",
        `\`${prefix}eval\`, \`${prefix}add-coins\``,
        true
      )
      .addField(
        "<a:Loading:708107557553569853>》Economy Commands [10] :",
        `\`${prefix}bal\`, \`${prefix}give\`, \`${prefix}deposit\`, \`${prefix}rob\`, \`${prefix}buy\`, \`${prefix}shop\`, \`${prefix}work\`, \`${prefix}daily\`, \`${prefix}weekly\`, \`${prefix}search\``,
        true
      )
      .addField(
        "<a:BlueGearsTurning:708828598525755453>》Moderation Commands [6] :",
        `\`${prefix}ban\`, \`${prefix}kick\`, \`${prefix}prefix\`, \`${prefix}poll\`, \`${prefix}setchannel\`, \`${prefix}purge\`, \`${prefix}start-giveaway\``,
        true
      )
      .addField(
        "<a:Loading:708107557553569853>》Fun Commands [12] :",
        `\`${prefix}8ball\`, \`${prefix}ping\`, \`${prefix}invite\`, \`${prefix}suggest\`, \`${prefix}report\`,\`${prefix}serverinfo\`, \`${prefix}userinfo\`, \`${prefix}about\`, \`${prefix}say\`, \`${prefix}botstats\`,\`${prefix}cat\`, \`${prefix}meme\``,
        false
      )
      .setColor("RANDOM")
      .setFooter(
        `Requested by ${message.author.tag}`,
        message.author.displayAvatarURL({
          dynamic: true,
          size: 1024,
          format: "png"
        })
      )
      .setTimestamp();
    message.channel.send(helpEmbed);
  }

  if (command === `${prefix}prefix`) {
    if (!message.member.hasPermission("MANAGE_GUILD" || "ADMINISTRATOR")) {
      return message.channel.send(
        "You don't have the `Manage Server` permission to be able to use this command..."
      );
    }

    if (!args[0]) {
      return message.channel.send(
        "Please provide a prefix to change the current prefix for this server..."
      );
    }
    if (prefix === args[0]) {
      return message.channel.send(
        `My prefix is already been set to \`${args[0]}\``
      );
    }

    if (args[0].length > 10) {
      return message.channel.send(
        "The prefix you provided is too long!\nPlease provide a prefix lower than 10 characters..."
      );
    }

    if (args[0]) {
      prefixes[message.guild.id] = {
        prefixes: args[0].toLowerCase()
      };
      //hope this one works, after it this workd, we have to do the "buy" command
      fs.writeFile("./prefixes.json", JSON.stringify(prefixes), err => {
        if (err) console.log(err);
      });

      return message.channel.send(
        `My prefix has successfully been changed to \`${args[0]}\``)
         {allowedMentions: {parse: []}}
    }
  } //hope this works
  if (message.content.startsWith(`<@${client.user.id}>`)) {
    let prefixRemind = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .addField(
        "**Hello there!**",
        `My prefix for this server is \`${prefix}\``,
        false
      )
      .setTimestamp();

    return message.channel.send(prefixRemind);
  }

  if (message.content.startsWith(`<@!${client.user.id}>`)) {
    let prefixRemind2 = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .addField(
        "**Hello there!**",
        `My prefix for this server is \`${prefix}\``,
        false
      )
      .setTimestamp();

    return message.channel.send(prefixRemind2);
  }

  if (command === `${prefix}balance` || command === `${prefix}bal`) {
    let mentionB = message.mentions.users.first();

    let BalEmbed;
    if (mentionB) {
      let mentionedDBD = quickdb.fetch(`money_${mentionB.id}`);
      if (mentionedDBD === null) mentionedDBD = 0;
      let mBankDB = quickdb.fetch(`bank_${message.guild.id}`);
      if (mBankDB === null) mBankDB = 0;

      BalEmbed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(`${mentionB.username}'s balance`)
        .addField(
          "**Balance:**",
          `💰 **${parseInt(mentionedDBD).toLocaleString()}** coins`,
          false
        )
        .addField(
          "**Bank:**",
          `🏦 **${parseInt(mBankDB).toLocaleString()}** coins`,
          false
        )
        .setFooter(
          `Requested by ${message.author.tag}`,
          message.author.displayAvatarURL({
            dynamic: true,
            size: 1024,
            format: "png"
          })
        )
        .setTimestamp();
    } else {
      let authors = client.users.cache.get(args[0]) || message.author;
      let UDBD = quickdb.fetch(`money_${authors.id}`);
      if (UDBD === null) UDBD = 0;
      let UbankDB = quickdb.fetch(`bank_${authors.id}`);
      if (UbankDB === null) UbankDB = 0;

      BalEmbed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(`${authors.username}'s balance`)
        .addField(
          "**Balance:**",
          `💰 **${parseInt(UDBD).toLocaleString()}** coins`,
          false
        )
        .addField(
          "**Bank:**",
          `🏦 **${parseInt(UbankDB).toLocaleString()}** coins`,
          false
        )
        .setFooter(
          `Requested by ${message.author.tag}`,
          message.author.displayAvatarURL({
            dynamic: true,
            size: 1024,
            format: "png"
          })
        )
        .setTimestamp();
    }
    return message.channel.send(BalEmbed);
  }

  if (command === `${prefix}leaderboard`) {
    let leaderboard = await client.eco.leaderboard({ limit: 15, raw: false });
    if (!leaderboard || leaderboard.length < 1)
      return message.channel.send("❌ | Empty Leaderboard!");
    const embed = new Discord.MessageEmbed()
      .setAuthor("Global LeaderBoard")
      .setColor("RANDOM")
      .setThumbnail(
        client.users.get(leaderboard[0].id)
          ? client.users.get(leaderboard[0].id).displayAvatarURL
          : "https://cdn.discordapp.com/embed/avatars/0.png"
      )
      .setTimestamp();
    leaderboard.forEach(u => {
      embed.addField(
        `${u.position}. ${
          client.users.get(u.id)
            ? client.users.get(u.id).tag
            : "Beat Me XD#0001"
        }`,
        `${u.money} 💸`
      );
    });
    return message.channel.send(embed);
  }

  if (command === `${prefix}work`) {
    let moneyAmt = quickdb.fetch(`money_${message.author.id}`);
    if (moneyAmt === null) moneyAmt = 0;

    let amount = Math.floor(Math.random() * 1500) + 1000;

    let workEmbed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setAuthor(`${message.author.username} worked, good job!`)
      .addField(
        "**Result:**",
        `You worked and earned **${parseInt(amount).toLocaleString()}** coins!`,
        false
      )
      .setFooter(
        `Requested by ${message.author.tag}`,
        message.author.displayAvatarURL({
          dynamic: true,
          size: 1024,
          format: "png"
        })
      )
      .setTimestamp();

    let worked = quickdb.fetch(`worked_${message.author.id}`);
    let timeout = 3600000;

    if (worked !== null && timeout - (Date.now() - worked) > 0) {
      let time = msParse(timeout - (Date.now() - worked));

      return message.channel.send(
        `You're currently tired... You can work again after **${time.minutes}m ${time.seconds}s**!`
      );
    } else {
      quickdb.add(`money_${message.author.id}`, amount);
      quickdb.set(`worked_${message.author.id}`, Date.now());

      return message.channel.send(workEmbed);
    }
  }

  if (command === `${prefix}daily`) {
    let moneyU = quickdb.fetch(`money_${message.author.id}`);
    if (moneyU === null) moneyU = 0;

    let dailyEmbed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setAuthor(`${message.author.username} has claimed their daily!`)
      .setDescription(
        `💰 **${parseInt(
          3000
        ).toLocaleString()}** coins have been added to your balance!\nDon't forget to claim another daily of yours tomorrow!`,
        false
      )
      .setFooter(
        `Requested by ${message.author.tag}`,
        message.author.displayAvatarURL({
          dynamic: true,
          size: 1024,
          format: "png"
        })
      )
      .setTimestamp();

    let daily = quickdb.fetch(`daily_${message.author.id}`);
    let timeout = 86400000;

    if (daily !== null && timeout - (Date.now() - daily) > 0) {
      let time = msParse(timeout - (Date.now() - daily));

      return message.channel.send(
        `You've already claimed your daily in the past 24 hours... You can claim another daily in **${time.hours}h ${time.minutes}m ${time.seconds}s**!`
      );
    } else {
      quickdb.add(`money_${message.author.id}`, 3000);
      quickdb.set(`daily_${message.author.id}`, Date.now());

      return message.channel.send(dailyEmbed);
    }
  }

  if (command === `${prefix}weekly`) {
    let moneyW = quickdb.fetch(`money_${message.author.id}`);
    if (moneyW === null) moneyW = 0;

    let weeklyEmbed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setAuthor(`${message.author.username} has claimed their weekly!`)
      .setDescription(
        `💰 **${parseInt(
          5000
        ).toLocaleString()}** coins have been added to your balance!\nDon't forget to claim another weekly of yours after a week!`,
        false
      )
      .setFooter(
        `Requested by ${message.author.tag}`,
        message.author.displayAvatarURL({
          dynamic: true,
          size: 1024,
          format: "png"
        })
      )
      .setTimestamp();

    let weekly = quickdb.fetch(`weekly_${message.author.id}`);
    let timeout = 604800000;

    if (weekly !== null && timeout - (Date.now() - weekly) > 0) {
      let time = msParse(timeout - (Date.now() - weekly));

      return message.channel.send(
        `You've already claimed your daily in the past 7 days... You can claim another weekly in **${time.days}d ${time.hours}h ${time.minutes}m ${time.seconds}s**!`
      );
    } else {
      quickdb.add(`money_${message.author.id}`, 5000);
      quickdb.set(`weekly_${message.author.id}`, Date.now());

      return message.channel.send(weeklyEmbed);
    }
  }

  if (command === `${prefix}search`) {
    let moneyS = quickdb.fetch(`money_${message.author.id}`);
    if (moneyS === null) moneyS = 0;
    let amount = Math.floor(Math.random() * 500) + 100;

    let searchEmbed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setAuthor(`${message.author.username} searched for coins!`)
      .setDescription(
        `💰 You searched some areas and found **${parseInt(
          amount
        ).toLocaleString()}** coins!`
      )
      .setFooter(
        `Requested by ${message.author.tag}`,
        message.author.displayAvatarURL({
          dynamic: true,
          size: 1024,
          format: "png"
        })
      )
      .setTimestamp();

    let search = quickdb.fetch(`search_${message.author.id}`);
    let timeout = 1200000;

    if (search !== null && timeout - (Date.now() - search)) {
      let time = msParse(timeout - (Date.now() - search));

      return message.channel.send(
        `Slow it down bud, Police are around so you can search for coins after **${time.minutes}m ${time.seconds}s**!`
      );
    } else {
      quickdb.add(`money_${message.author.id}`, amount);
      quickdb.set(`search_${message.author.id}`, Date.now());

      return message.channel.send(searchEmbed);
    }
  }

  if (command === `${prefix}botstats`) {
    let BotSembed = new Discord.MessageEmbed()
      .setColor("#0x7289DA")
      .addField("Vxe Master", "Show the bot's stats.", true)
      .addField(
        "--------------------------------------------------------------------------------",
        "------------------------------------------------------------------------------",
        false
      )
      .addField(
        "Total Servers",
        parseInt(client.guilds.cache.size).toLocaleString(),
        true
      )
      .addField(
        "Total Channels",
        parseInt(client.channels.cache.size).toLocaleString(),
        true
      )
      .addField("Global Prefix", config.prefix, true)
      .addField(
        "Total Users",
        parseInt(client.users.cache.size).toLocaleString(),
        true
      )
      .addField("Bot Version", "4.0.0", true)
      .addField("Library", `discord.js, v${Discord.version}`, true)
      .addField(
        "Developer",
        `${client.users.cache.get("459175543154147328").tag}\n<===>\n${
          client.users.cache.get("544676649510371328").tag
        }\n${client.users.cache.get("409859533691813889").tag}`,
        true
      )
      .setFooter(
        "Bot by The Team",
        message.author.displayAvatarURL({
          dynamic: true,
          size: 1024,
          format: "png"
        })
      )
      .setTimestamp();

    message.channel.send(BotSembed);
  }

  if (command === `${prefix}say`) {
    let text = args.join(" ");
    if (!message.member.hasPermission(["MANAGE_GUILD", "ADMINSTARTOR"])) {
      return message.channel.send(
        "You don't have the `Manage Server` permission to be able to use this command..."
      );
    }

    if (!text) {
      return message.channel.send("What am i gonna say?");
    }
    if (text.includes("@everyone")) {
      return message.channel.send("I'm not going to ping everyone...");
    }
    if (text.includes("@here")) {
      return message.channel.send("I'm not going to ping everyone...");
    }

    return message.channel.send(text);
  }
  if (command === `${prefix}serverinfo`) {
    const SIembed = new Discord.MessageEmbed()
      .setAuthor(
        message.guild.name,
        message.guild.iconURL
          ? message.guild.iconURL
          : client.user.displayAvatarURL
      )
      .setThumbnail(message.guild.iconURL)
      .setTimestamp()
      .addField("<a:Loading:708107557553569853> ID", message.guild.id, true)
      .addField(
        "<a:Loading:708107557553569853> Owner",
        `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`,
        true
      )
      .addField(
        "<a:Loading:708107557553569853> User Count",
        message.guild.memberCount,
        true
      )
      .addField(
        "<a:Loading:708107557553569853> Member Count",
        message.guild.members.cache.filter(m => !m.user.bot).size,
        true
      )
      .addField(
        "<a:Loading:708107557553569853> Bot Count",
        message.guild.members.cache.filter(m => m.user.bot).size,
        true
      )
      .addField(
        "<a:Loading:708107557553569853> AFK Timeout",
        message.guild.afkTimeout / 60 + " minutes",
        true
      )
      .addField(
        "<a:Loading:708107557553569853> Roles",
        message.guild.roles.cache.size,
        true
      )
      .addField(
        "<a:Loading:708107557553569853> Channels",
        message.guild.channels.cache.size,
        true
      )
      .setColor(Math.floor(Math.random() * 16777215))
      .setFooter(`Vxe Master`);

    message.channel.send(SIembed);
  }

  if (command === `${prefix}setchannel`) {
    if (!message.member.hasPermission("MANAGE_CHANNELS" || "ADMINISTRATOR")) {
      return message.channel.send(
        "You don't have the `Manage Channels` permissions to able to use this command..."
      );
    }

    if (!args[0]) {
      return message.channel.send(
        "You have to choose to set the channels of either `welcome` or `goodbye`..."
      );
    }

    if (args[0].toLowerCase() === "welcome") {
      if (!args[1]) {
        return message.channel.send(
          `You have to provide an ID of a channel to set the welcome messages!\nif you want to turn off the welcome messages for the channel that it was set to before... use:\n\`${prefix}setchannel welcome off\``
        );
      }
      let ifChannel = quickdb.fetch(`wlcchannel_${message.guild.id}`);
      let channelGet = message.guild.channels.cache.get(args[1]);

      if (args[1].toLowerCase() === "off") {
        if (ifChannel === null || ifChannel === "off") {
          return message.channel.send(
            "My welcoming system wasn't set to any channels in this server yet..."
          );
        } else {
          quickdb.set(`wlcchannel_${message.guild.id}`, "off");
          return message.channel.send(
            "Successfully set welcoming system to to `off`!"
          );
        }
      } else if (channelGet) {
        if (!channelGet) {
          return message.channel.send("Channel not found!");
        }
        if (ifChannel === channelGet.id) {
          return message.channel.send(
            `My welcoming system channel has already been set to \`${channelGet.name}\`...`
          );
        } else {
          quickdb.set(`wlcchannel_${message.guild.id}`, channelGet);
          return message.channel.send(
            `My welcoming system channel successfully been set to \`${channelGet.name}\`!`
          );
        }
      }
    } else if (args[0].toLowerCase() === "goodbye") {
      if (!args[1]) {
        return message.channel.send(
          `You have to provide an ID of the channel to set the goodbye messages!\nif you want to turn off the goodbye messages for the channel that it was set to... use:\n\`${prefix}setchannel goodbye off\``
        );
      }
      let ifChannel = quickdb.fetch(`gbechannel_${message.guild.id}`);
      let channelGet = message.guild.channels.cache.get(args[1]);

      if (args[1].toLowerCase() === "off") {
        if (ifChannel === null || ifChannel === "off") {
          return message.channel.send(
            "My goodbye system wasn't set to any channels in this server yet..."
          );
        } else {
          quickdb.set(`gbechannel_${message.guild.id}`, "off");
          return message.channel.send(
            "Successfully set goodbye system to `off`!"
          );
        }
      } else if (channelGet) {
        if (!channelGet) {
          return message.channel.send("Channel not found");
        }
        if (ifChannel === channelGet.id) {
          return message.channel.send(
            `My goodbye system channel has already been set to \`${channelGet.name}\`...`
          );
        } else {
          quickdb.set(`gbechannel_${message.guild.id}`, channelGet);
          return message.channel.send(
            `My goodbye system channel successfully been set to \`${channelGet.name}\`!`
          );
        }
      }
    }
  }
  if (command === `${prefix}kick`) {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit:
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if (!message.member.hasPermission(["KICK_MEMBERS", "ADMINISTRATOR"])) {
      return message.reply("Sorry, you don't have permissions to use this!");
    }
    if (
      !message.guild
        .member(client.user)
        .hasPermission(["KICK_MEMBERS"])
    ) {
      return message.channel.send(
        "I don't have the permission to kick members... sorry..."
      );
    }

    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    // We can also support getting the member by ID, which would be args[0]
    let member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!member)
      return message.reply("Please mention a valid member of this server");
    if (!member.kickable)
      return message.reply(
        "I cannot kick this user! Do they have a higher role? Do I have kick permissions?"
      );

    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason provided";

    // Now, time for a swift kick in the nuts!
    await member
      .kick(reason)
      .catch(error =>
        message.reply(
          `Sorry ${message.author} I couldn't kick because of : ${error}`
        )
      );
    message.reply(
      `${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`
    );
  }

  if (command === `${prefix}ban`) {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if (!message.member.hasPermission(["BAN_MEMBERS", "ADMINISTRATOR"])) {
      return message.reply("Sorry, you don't have permissions to use this!");
    }
    if (
      !message.guild
        .member(client.user)
        .hasPermission(["BAN_MEMBERS"])
    ) {
      return message.channel.send(
        "I don't have permission to ban members... sorry..."
      );
    }

    let member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!member)
      return message.reply("Please mention a valid member of this server");
    if (!member.bannable)
      return message.reply(
        "I cannot ban this user! Do they have a higher role? Do I have ban permissions?"
      );

    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason provided";

    await member
      .ban(reason)
      .catch(error =>
        message.reply(
          `Sorry ${message.author} I couldn't ban because of : ${error}`
        )
      );
    message.reply(
      `${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`
    );
  }

  if (command === `${prefix}purge`) {
    // This command removes all messages from all users in the channel, up to 100.

    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);

    // Ooooh nice, combined conditions. <3
    if (!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply(
        "Please provide a number between 2 and 100 for the number of messages to delete"
      );

    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.messages.fetch({
      limit: deleteCount
    });

    message.channel
      .bulkDelete(fetched)
      .catch(error =>
        message.reply(`Couldn't delete messages because of: ${error}`)
      );
  }

  if (command === `${prefix}userinfo`) {
    let user = message.mentions.users.first();
    let muser = message.guild.member(message.mentions.users.first());
    if (!muser) muser = message.member;
    if (!user) user = message.author;
    const userIembed = new Discord.MessageEmbed()
      .addField("Username", `${user.username}#${user.discriminator}`, true)
      .addField("ID", `${user.id}`, true)
      .setColor(3447003)
      .setThumbnail(`${await user.avatarURL()}`)
      .setTimestamp()
      .setURL(`${await user.avatarURL()}`)
      .addField("Currently", `${muser.presence.status.toUpperCase()}`, true)
      //.addField('Game', `${muser.presence.game === null ? "No Game" : muser.presence.game.name}`, true)
      .addField(
        "<a:LoadingDots:708828598756180028> Joined Discord",
        `${moment(user.createdAt)
          .toString()
          .substr(0, 15)}\n(${moment(user.createdAt).fromNow()})`,
        true
      )
      .addField(
        "<a:LoadingDots:708828598756180028> Joined Server",
        `${moment(muser.joinedAt)
          .toString()
          .substr(0, 15)}\n(${moment(muser.joinedAt).fromNow()})`,
        true
      )
      .addField(
        "<a:LoadingDots:708828598756180028> Roles",
        `${muser.roles.cache.array()}`,
        true
      )
      .addField(
        "<a:LoadingDots:708828598756180028> Is Bot",
        `${user.bot.toString().toUpperCase()}`,
        true
      )
      .setTimestamp();
    message.channel.send(userIembed);
  }

  if (command === `${prefix}invite`) {
    const embed = new Discord.MessageEmbed()
      .setColor(Math.floor(Math.random() * 16777215))
      .setTitle("Invites")
      .addField(
        "Inviting the Bot",
        "https://discord.com/api/oauth2/authorize?client_id=708470996767735909&permissions=8&scope=bot"
      )
      .setFooter(`Vxe Master`);

    message.author.send({ embed }).catch(e => {
      if (e) {
        message.channel.send(
          `Error. You seems to be locking your DMs so I'll send it here instead.`
        );
        message.channel.send({ embed });
      }
    });
    message.reply("Check your DMs!");
  }

  if (command === `${prefix}about`) {
    message.delete();
    const embed = new Discord.MessageEmbed()
      .setColor(0xffff00)
      .addField(
        "About The Bot",
        `Vxe Master is a bot created by The Team!, made for any discord server in need. It is written with Discord.js`
      )
      .setFooter(`Vxe Master`);
    message.channel.send({ embed });
  }

  if (command === "unlockdown") {
    if (!client.lockit) client.lockit = [];
    if (!message.member.hasPermission("MANAGE_CHANNELS"))
      return message.reply(
        "❌**Error:** You don't have the permission to do that!"
      );

    message.channel
      .permissionOverwrites(message.guild.id, {
        deny: [],
        allow: ["SEND_MESSAGES"]
      })
      .then(() => {
        message.channel.send(
          "Lockdown lifted <a:Loading:708107557553569853> WEEEEEEEEEEEEEEEEEEEEEE, enjoy talking while you still can:wink:"
        );
        delete client.lockit[message.channel.id];
      })
      .catch(error => {
        console.log(error);
      });
  }

  if (command === `${prefix}givbdseaway`) {
    if (!args[0]) return message.channel.send(`You did not specify your time!`);
    if (
      !args[0].endsWith("d") &&
      !args[0].endsWith("h") &&
      !args[0].endsWith("m")
    )
      return message.channel.send(
        `You did not use the correct formatting for the time!`
      );
    if (isNaN(args[0][0])) return message.channel.send(`That is not a number!`);
    let channel = message.mentions.channels.first();
    if (!channel)
      return message.channel.send(
        `I could not find that channel in the guild!`
      );
    let prize = args.slice(2).join(" ");
    if (!prize) return message.channel.send(`No prize specified!`);
    message.channel.send(`*Giveaway created in ${channel}*`);
    const embed = new Discord.MessageEmbed()
      .setTitle(`New giveaway!`)
      .setDescription(
        `The user ${message.author} is hosting a giveaway for the prize of **${prize}**`
      )
      .setTimestamp(Date.now() + ms(args[0]))
      .setColor(`BLUE`);
    const member = await message.channel.send(embed);
    member.react("🎉");
    setTimeout(() => {
      if (member.reactions.cache.get("🎉").count <= 1) {
        message.channel.send(
          `Reactions: ${member.reactions.cache.get("🎉").count}`
        );
        return message.channel.send(
          `Not enough people reacted for me to start draw a winner!`
        );
      }

      const winner = member.reactions.cache
        .get("🎉")
        .users.cache.filter(u => !u.bot)
        .random();
      message.channel.send(
        `The winner of the giveaway for **${prize}** is... ${winner}`
      );
    }, ms(args[0]));
  }

  if (command === `${prefix}suggest`) {
    const userAvatar = message.author.displayAvatarURL({
      dynamic: true,
      format: "png"
    });
    let argsresult;

    if (!args[0]) {
      return message.channel.send(`You did not send you're suggestion.`);
    }
    argsresult = args.join(" ");
    let bugChannel = client.guilds.cache
      .get("710212452951785533")
      .channels.cache.get("710214524648685649");
    const bugReport = new Discord.MessageEmbed()
      .setTitle(`${message.author.username} has a suggestion!`)
      .addFields(
        {
          name: "**User:**",
          value: `<@${message.author.id}>`,
          inline: true
        },
        {
          name: "**User ID:**",
          value: `\`\`${message.author.id}\`\``,
          inline: true
        },
        {
          name: "**Suggestion:**",
          value: `${argsresult}`
        }
      )
      .setColor("#ffa500")
      .setTimestamp()
      .setFooter(message.author.tag, userAvatar);

    let loading = await bugChannel.send(bugReport);
    await loading.react("👍");
    await loading.react("👎");
    await message.reply(
      `Thank you ${message.auther.username}, you're suggestion has been sent to the bot devs!`
    );
  }

  if (command === `${prefix}report`) {
    const userAvatar = message.author.displayAvatarURL({
      dynamic: true,
      format: "png"
    });

    let argsResult = args.join(" ");

    if (!argsResult) {
      return message.channel.send(`You did not describe the bug.`);
    }
    let bugChannel = client.guilds.cache
      .get("710212452951785533")
      .channels.cache.get("710214560736608266");
    const bugReport = new Discord.MessageEmbed()
      .setTitle(`${message.author.username} found a bug!`)
      .addFields(
        {
          name: "**User:**",
          value: `<@${message.author.id}>`,
          inline: true
        },
        {
          name: "**User ID:**",
          value: `\`\`${message.author.id}\`\``,
          inline: true
        },
        {
          name: "**Bug Report:**",
          value: `${argsResult}`
        }
      )
      .setColor("#FF0000")
      .setTimestamp()
      .setFooter(message.author.tag, userAvatar);

    bugChannel
      .send(bugReport)
      .then(
        message.reply(
          `Thank you ${message.author.username}, your bug report has been sent to the bot devs!`
        )
      );
  }
  // ummm why's the token invalid?
  //i removed it because it buggin with the prefix ima make beta Vxe Master until issueis fixed
  // umm ok...
  // thats the main bug right there, it responding to othe
  // it responds to every one character prefix
  // yeah, main bug..
  if (command === `${prefix}add-coins`) {
    if (!ownerIDs.includes(message.author.id)) {
      return message.channel.send("This command is for bot owners only.");
    }

    let mentionUser = message.mentions.users.first();
    if (!mentionUser) {
      return message.channel.send("Please mention a user...");
    }
    if (mentionUser.bot) {
      return message.channel.send("You can't give coins to bots...");
    }

    if (!args[1]) {
      return message.channel.send(
        "Please specify the amount of coins you want to give..."
      );
    }
    if (isNaN(args[1])) {
      return message.channel.send(
        "Provided amount of coins is not a number..."
      );
    }

    if (args[1].length > 10) {
      return message.channel.send(
        `You can only give up to 10 character limit of coins\nExample: \`${prefix}add-coins [mention] 1000000000\``
      );
    }
    let moneyW = await quickdb.fetch(`money_${mentionUser.id}`);
    if (moneyW === null) moneyW = 0;

    await quickdb.add(`money_${mentionUser.id}`, args[1]);
    return message.channel.send(
      `Successfully given ${mentionUser.tag} **${parseInt(
        args[1]
      ).toLocaleString()}** coins!`
    );
  }

  // next music commands, then we fix leaderboard, alr?
  // music commandhere

  if (command === "play") {
    let gQueue = await quickdb.fetch(`music_${message.guild.id}`);

    let voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.channel.send(
        "You have to be in a voice channel to use this command..."
      );
    }
    if (!args[0]) {
      return message.channel.send("Please provide a link");
    }

    if (
      !voiceChannel
        .permissionsFor(client.user)
        .toArray()
        .includes("CONNECT" || "SPEAK")
    ) {
      return message.channel.send(
        "I don't have permission to connect or speak in your voice channel..."
      );
    }
    let songinfo = await ytdl.getInfo(args[0]);
    let song = {
      title: songinfo.title,
      url: songinfo.video_url
    };
    if (gQueue === null || gQueue === "None") {
      let queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true
      };

      quickdb.set(`music_${message.guild.id}`, queueContruct);

      queueContruct.songs.push(song);

      try {
        let connection = await voiceChannel.join();
        queueContruct.connection = connection;
        play(message.guild, gQueue.songs[0]);
      } catch (err) {
        console.log(err);
        quickdb.set(`music_${message.guild.id}`, "None");
        return message.channel.send(err);
      }
    } else {
      gQueue.songs.push(song);
      return message.channel.send(`${song.title} has been added to the queue!`);
    }
  }

  function play(guild, song) {
    let gQueue = quickdb.fetch(`music_${guild.id}`);
    if (!song) {
      gQueue.voiceChannel.leave();
      quickdb.set(`music_${guild.id}`, "None");
      return;
    }

    let dispatcher = gQueue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        gQueue.songs.shift();
        play(guild, gQueue.songs[0]);
      })
      .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(gQueue.volume / 5);
    gQueue.textChannel.send(`Started Playing: **${song.title}**`);
  }

  if (command === `${prefix}mute`) {
    if (!message.member.hasPermission("KICK_MEMBERS" || "BAN_MEMBERS")){
      return message.channel.send("You don't have permissions to use that command.");
    } else {
      let mToM = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      
      if (!mToM) {
        return message.channel.send("Member not found!");
      } else if (mToM.hasPermission("KICK_MEMBERS" || "BAN_MEMBERS" || "ADMINISTRATOR")){
          return message.channel.send("You cannot mute that person!");
        } else {
          let mutedRole = message.guild.roles.cache.get("710601885266083961");
          if(!mutedRole){
            return message.channel.send("Mute role was not found")
          }
          if (mutedRole) {
            mToM.roles.add(mutedRole);
            return message.channel.send(`${mToM.user.usernamd} was muted.`);
          }
        }
    }
  }
  // im on pcsolemmeknow if you need smth delete
  if (command === `${prefix}shop`) {
    let item1 = quickdb.fetch(`item1_${message.guild.id}`)
    let item2 = quickdb.fetch(`item2_${message.guild.id}`)
    let item3 = quickdb.fetch(`item3_${message.guild.id}`)
    let item4 = quickdb.fetch(`item4_${message.guild.id}`)
    let item5 = quickdb.fetch(`item5_${message.guild.id}`)
    let item1Desc = quickdb.fetch(`item1Desc_${message.guild.id}`)
    let item2Desc = quickdb.fetch(`item2Desc_${message.guild.id}`)
    let item3Desc = quickdb.fetch(`item3Desc_${message.guild.id}`)
    let item4Desc = quickdb.fetch(`item4Desc_${message.guild.id}`)
    let item5Desc = quickdb.fetch(`item5Desc_${message.guild.id}`)
    let item1Cost = quickdb.fetch(`item1Cost_${message.guild.id}`)
    let item2Cost = quickdb.fetch(`item2Cost_${message.guild.id}`)
    let item3Cost = quickdb.fetch(`item3Cost_${message.guild.id}`)
    let item4Cost = quickdb.fetch(`item4Cost_${message.guild.id}`)
    let item5Cost = quickdb.fetch(`item5Cost_${message.guild.id}`)
    
    let ifItem1;
    if(item1 !== null){
      ifItem1 = `Item Name: ${item1}\nDescription: ${item1Desc}\nCost: ${item1Cost}`;
    } else {
      ifItem1 = "**No item 1 were set for this guild**";
    }
    let ifItem2;
    if(item2 !== null){
      ifItem2 = `Item Name: ${item2}\nDescription: ${item2Desc}\nCost: ${item2Cost}`;
    } else {
      ifItem2 = "**No item 2 were set for this guild**";
    }
    let ifItem3;
    if(item3 !== null){
      ifItem3 = `Item Name: ${item3}\nDescription: ${item3Desc}\nCost: ${item3Cost}`;
    } else {
      ifItem3 = "**No item 3 were set for this guild**";
    }
    let ifItem4;
    if(item4 !== null){
      ifItem4 = `Item Name: ${item4}\nDescription: ${item4Desc}\nCost: ${item4Cost}`;
    } else {
      ifItem4 = "**No item 4 were set for this guild**";
    }
     let ifItem5;
    if(item5 !== null){
      ifItem5 = `Item Name: ${item5}\nDescription: ${item5Desc}\nCost: ${item5Cost}`;
    } else {
      ifItem5 = "**No item 5 were set for this guild**";
    }
    
    let shopEmbed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setAuthor(`${message.author.username} here's the shop for you`)
      .setThumbnail(
        client.user.displayAvatarURL({
          dynamic: true,
          size: 1024,
          format: "png"
        })
      )
    .addField("**Item 1:**", ifItem1, false)
    .addField("\u200B", "\u200B")
    .addField("**Item 2:**", ifItem2, false)
    .addField("\u200B", "\u200B")
    .addField("**Item 3:**", ifItem3, false)
    .addField("\u200B", "\u200B")
    .addField("**Item 4:**", ifItem4, false)
    .addField("\u200B", "\u200B")
    .addField("**Item 5:**", ifItem5, false)
    
      .setFooter(
        `Requested by ${message.author.tag}`,
        message.author.displayAvatarURL({
          dynamic: true,
          size: 1024,
          format: "png"
        })
      )
      .setTimestamp();

    return message.channel.send(shopEmbed);
  }

  if(command === `${prefix}setshop`){
    if(!args[0]){
      return message.channel.send("Please choose the item number you want to set, (Between 1 to 5)");
    }
    if(isNaN(args[0])){
      return message.channel.send("Item number is not number");
    }
    
    if(args[0] > 5){
      return message.channel.send("The item number can only be between 1 to 5");
    }
    if(args[0] === "1"){
      if(!args[1]){
        return message.channel.send("Please provide the item name");
      }
      if(!args[2]){
        return message.channel.send("Please provide the cost of the item");
      }
      if(isNaN(args[2])){
        return message.channel.send("The provided cost of the item is not a number");
      }
      if(!args.slice(3).join(" ")){
        return message.channel.send("Please provide the description of this item");
      }
      console.log(args.slice(3).join(" "))
      await quickdb.set(`item1_${message.guild.id}`, args[1])
      await quickdb.set(`item1Cost_${message.guild.id}`, args[2])
      await quickdb.set(`item1Desc_${message.guild.id}`, args.slice(3).join(" "))
      return message.channel.send(`Item 1 is successfully set to:\nName: ${args[1]}\nDescription: ${args.slice(3).join(" ")}\nCost: ${args[2]}`);
  } else if(args[0] === "2"){
      if(!args[1]){
        return message.channel.send("Please provide the item name");
      }
      if(!args[2]){
        return message.channel.send("Please provide the cost of the item");
      }
      if(isNaN(args[2])){
        return message.channel.send("The provided cost of the item is not a number");
      }
      if(!args.slice(3).join(" ")){
        return message.channel.send("Please provide the description of this item");
      }
      await quickdb.set(`item2_${message.guild.id}`, args[1])
      await quickdb.set(`item2Cost_${message.guild.id}`, args[2])
      await quickdb.set(`item2Desc_${message.guild.id}`, args.slice(3).join(" "))
      return message.channel.send(`Item 2 is successfully set to:\nName: ${args[1]}\nDescription: ${args.slice(3).join(" ")}\nCost: ${args[2]}`);
    } else if(args[0] === "3"){
      if(!args[1]){
        return message.channel.send("Please provide the item name");
      }
      if(!args[2]){
        return message.channel.send("Please provide the cost of the item");
      }
      if(isNaN(args[2])){
        return message.channel.send("The provided cost of the item is not a number");
      }
      if(!args.slice(3).join(" ")){
        return message.channel.send("Please provide the description of this item");
      }
      
      await quickdb.set(`item3_${message.guild.id}`, args[1])
      await quickdb.set(`item3Cost_${message.guild.id}`, args[2])
      await quickdb.set(`item3Desc_${message.guild.id}`, args.slice(3).join(" "))
      return message.channel.send(`Item 3 is successfully set to:\nName: ${args[1]}\nDescription: ${args.slice(3).join(" ")}\nCost: ${args[2]}`);
    } else if(args[0] === "4"){
      if(!args[1]){
        return message.channel.send("Please provide the item name");
      }
      if(!args[2]){
        return message.channel.send("Please provide the cost of the item");
      }
      if(isNaN(args[2])){
        return message.channel.send("The provided cost of the item is not a number");
      }
      if(!args.slice(3).join(" ")){
        return message.channel.send("Please provide the description of this item");
      }
      
      await quickdb.set(`item4_${message.guild.id}`, args[1])
      await quickdb.set(`item4Cost_${message.guild.id}`, args[2])
      await quickdb.set(`item4Desc_${message.guild.id}`, args.slice(3).join(" "))
      return message.channel.send(`Item 4 is successfully set to:\nName: ${args[1]}\nDescription: ${args.slice(3).join(" ")}\nCost: ${args[2]}`);
    } else if(args[0] === "5"){
      if(!args[1]){
        return message.channel.send("Please provide the item name");
      }
      if(!args[2]){
        return message.channel.send("Please provide the cost of the item");
      }
      if(isNaN(args[2])){
        return message.channel.send("The provided cost of the item is not a number");
      }
      if(!args.slice(3).join(" ")){
        return message.channel.send("Please provide the description of this item");
      }
      
      await quickdb.set(`item5_${message.guild.id}`, args[1])
      await quickdb.set(`item5Cost_${message.guild.id}`, args[2])
      await quickdb.set(`item5Desc_${message.guild.id}`, args.slice(3).join(" "))
      return message.channel.send(`Item 5 is successfully set to:\nName: ${args[1]}\nDescription: ${args.slice(3).join(" ")}\nCost: ${args[2]}`);
    }
  }
  
  if(command === `${prefix}buyg`){
    let userCoins = quickdb.fetch(`money_${message.author.id}`);
    if (userCoins === null) userCoins = 0;

    if (!args[0]) {
      return message.channel.send("Hey slow it down, what are we buying?");
    }
    if (args[0].toLowerCase() === "fish") {
      if (userCoins < 10) {
        return message.channel.send(
          "You don't have enough coins to buy this item..."
        );
      } else {
        quickdb.subtract(`money_${message.author.id}`, 10);
        return message.channel.send("You successfully brought a fish!");
      }
    } else if (args[0].toLowerCase() === "crab") {
      if (userCoins < 20) {
        return message.channel.send(
          "You don't have enough coins to buy this item..."
        );
      } else {
        quickdb.subtract(`money_${message.author.id}`, 20);
        return message.channel.send("You successfully brought a crab!");
      }
    } else if (args[0].toLowerCase() === "fake-nitro") {
      if (userCoins < 100) {
        return message.channel.send(
          "You don't have enough coins to buy this item..."
        );
      } else {
        quickdb.subtract(`money_${message.author.id}`, 100);
        return message.channel.send("You successfully brought a fake nitro!");
      }
    } else if (args[0].toLowerCase() === "fake-verified-developer-badge") {
      if (userCoins < 500) {
        return message.channel.send(
          "You don't have enough coins to buy this item..."
        );
      } else {
        quickdb.subtract(`money_${message.author.id}`, 500);
        return message.channel.send(
          "You successfully brought a fake verified developer badge!"
        );
      }
    } else if (args[0].toLowerCase() === "fake-discord-partner-badge") {
      if (userCoins < 1000) {
        return message.channel.send(
          "You don't have enough coins to buy this item..."
        );
      } else {
        quickdb.subtract(`money_${message.author.id}`, 1000);
        return message.channel.send(
          "You successfully brought a fake discord partner badge!"
        );
      }
    } else if (args[0].toLowerCase() === "fake-discord-staff-badge") {
      if (userCoins < 2000) {
        return message.channel.send(
          "You don't have enough coins to buy this item..."
        );
      } else {
        quickdb.subtract(`money_${message.author.id}`, 2000);
        return message.channel.send(
          "You successfully brought a fake discord staff badge!"
        );
      }
    } else {
      return message.channel.send("That item doesn't exist in the shop...");
    }
  }

  if (command === `${prefix}giveaway`) {
    if (!message.guild) return;
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.channel.send(
        "You don't have enough permissions to use this command."
      );
    if (message.content.split(" ")[1] === "")
      return message.channel.send(
        "Please enter a duration for the giveaway (in hours)."
      );
    const stated_duration_hours = message.content.split(" ")[1];
    const actual_duration_hours = stated_duration_hours * 3600000;
    const prize = message.content
      .split(" ")
      .slice(2)
      .join(" ");
    if (isNaN(stated_duration_hours))
      return message.channel.send("The duration time has to be a number.");
    if (stated_duration_hours < 1)
      return message.channel.send("The duration time has to be atleast 1.");
    if (prize === "") return message.channel.send("You have to enter a price.");
    const embed = new Discord.MessageEmbed()
      .setTitle(`${prize}`)
      .setColor("36393F")
      .setDescription(
        `React with 🎉 to enter!\nTime duration: **${stated_duration_hours}** hours\nHosted by: ${message.author}`
      )
      .setTimestamp(Date.now() + stated_duration_hours * 60 * 60 * 1000)
      .setFooter("Ends at");
    let message = await message.channel.send(
      ":tada: **GIVEAWAY** :tada:",
      embed
    );
    await message.react("🎉");
    setTimeout(() => {
      message.reactions.cache.get("🎉").users.remove(client.user.id);
      setTimeout(() => {
        let winner = message.reactions.cache.get("🎉").users.cache.random();
        if (message.reactions.cache.get("🎉").users.cache.size < 1) {
          const winner_embed = new Discord.MessageEmbed()
            .setTitle(`${prize}`)
            .setColor("36393F")
            .setDescription(
              `Winner:\nNo one entered the giveaway.\nHosted by: ${message.author}`
            )
            .setTimestamp()
            .setFooter("Ended at");
          message.edit(":tada: **GIVEAWAY ENDED** :tada:", winner_embed);
        }
        if (!message.reactions.cache.get("🎉").users.cache.size < 1) {
          const winner_embed = new Discord.MessageEmbed()
            .setTitle(`${prize}`)
            .setColor("36393F")
            .setDescription(`Winner:\n${winner}\nHosted by: ${message.author}`)
            .setTimestamp()
            .setFooter("Ended at");
          message.edit(":tada: **GIVEAWAY ENDED** :tada:", winner_embed);
        }
      }, 1000);
    }, actual_duration_hours);
  }

  if (command === `${prefix}give`) {
    let userMention = message.mentions.members.first();

    if (!userMention) {
      return message.channel.send(
        "Please mention a member who you want to give your coins to..."
      );
    }
    if (userMention) {
      let coinAmount = args.slice(1).join(" ");
      if (!coinAmount) {
        return message.channel.send(
          "Please provide the amount of coins you want to give..."
        );
      }
      if (isNaN(coinAmount)) {
        return message.channel.send(
          "The provided amount of coins is not a number..."
        );
      }
      if (coinAmount.length > 10) {
        return message.channel.send(
          "Provided amount of coins is higher than 10 characters... it should be equal or below 10 characters..."
        );
      }
      let coinsAmountDB = quickdb.fetch(`money_${userMention.id}`);
      if (coinsAmountDB === null) coinsAmountDB = 0;

      let coinsAmountDBU = quickdb.fetch(`money_${message.author.id}`);
      if (coinsAmountDBU === null) coinsAmountDBU = 0;

      if (coinAmount > coinsAmountDBU) {
        return message.channel.send(
          `You don't have ${parseInt(
            coinAmount
          ).toLocaleString()} coins, you currently have ${parseInt(
            coinsAmountDBU
          ).toLocaleString()} coins...`
        );
      }
      await quickdb.add(`money_${userMention.id}`, coinAmount);
      await quickdb.subtract(`money_${message.author.id}`, coinAmount);

      return message.channel.send(
        `You gave ${parseInt(coinAmount).toLocaleString()} coins to ${
          userMention.displayName
        }!`
      );
    }
  }

  if (command === `${prefix}8ball`) {
    if (!args[2]) return message.channel.send("Please ask a full question");
    let replies = [
      "Maybe.",
      "Certainly not.",
      "I hope so.",
      "Not in your wildest dreams.",
      "There is a good chance.",
      "Quite likely.",
      "I think so.",
      "I hope not.",
      "I hope so.",
      "Never!",
      "Pfft.",
      "Sorry, bucko.",
      "Hell, yes.",
      "Hell to the no.",
      "The future is bleak.",
      "The future is uncertain.",
      "I would rather not say.",
      "Who cares?",
      "Possibly.",
      "Never, ever, ever.",
      "There is a small chance.",
      "Yes!",
      "lol no.",
      "There is a high probability.",
      "What difference does it makes?",
      "Not my problem.",
      "Ask someone else.",
      "Supercalifragilisticexpialidocious"
    ];

    let result = Math.floor(Math.random() * replies.length);
    let question = args.slice(0).join(" ");

    let embed = new Discord.MessageEmbed()
      .setTitle("Vxe Master 8ball")
      .setColor("#AA9900")
      .addField("Q:", question)
      .addField("A:", replies[result])
      .setFooter(`Vxe Master`);
    message.channel.send({ embed });
  }
  if (command === `${prefix}avatar`) {
    let avatar = message.mentions.users.size
      ? await message.mentions.users.first().avatarURL()
      : await message.author.avatarURL();
    if (message.mentions.users.size > 0) {
      const embed = new Discord.MessageEmbed()
        .setColor(0xffff00)
        .setTitle(`Avatar for ${message.mentions.users.first().username}:`)
        .setImage(`${avatar + "?size=1024"}`)
        .setFooter(`Vxe Master`);
      message.channel.send({ embed });
    } else {
      const embed = new Discord.MessageEmbed()
        .setColor(0xffff00)
        .setTitle(`Avatar for ${message.author.username}:`)
        .setImage(`${avatar + "?size=1024"}`)
        .setFooter(`Vxe Master`);
      message.channel.send({ embed });
    }
  }
  if (command === `${prefix}addrole2`) {
    if (
      !message.guild
        .member(client.user)
        .hasPermission("MANAGE_ROLES_OR_PERMISSIONS")
    )
      return message.reply(
        "❌**Error:** I don't have the **Manage Roles** permission!"
      );
    if (!message.member.hasPermission("MANAGE_ROLES_OR_PERMISSIONS"))
      return message.reply(
        "❌**Error:** You don't have the **Manage Roles** permission!"
      );
    if (message.mentions.users.size === 0)
      return message.reply(
        "❌Please mention a user to give the role to.\nExample: `addrole @user Members`"
      );
    let member = message.guild.member(message.mentions.users.first());
    if (!member)
      return message.reply(
        "<a:Loading:708107557553569853> **Error:** That user does not seem valid."
      );
    let name = message.content
      .split(" ")
      .splice(2)
      .join(" ");
    let role = message.guild.roles.find("name", name);
    if (!role)
      return message.reply(`❌**Error:** ${name} isn't a role on this server!`);
    let botRolePosition = message.guild.member(client.user).highestRole
      .position;
    let rolePosition = role.position;
    let userRolePossition = message.member.highestRole.position;
    if (userRolePossition <= rolePosition)
      return message.channel.send(
        "❌**Error:** Failed to add the role to the user because your role is lower than the specified role."
      );
    if (botRolePosition <= rolePosition)
      return message.channel.send(
        "❌**Error:** Failed to add the role to the user because my highest role is lower than the specified role."
      );
    member.addRole(role).catch(e => {
      return message.channel.send(`❌**Error:**\n${e}`);
    });
    message.channel.send(
      `<a:balancecheck:556017659419033653> **${
        message.author.username
      }**, I've added the **${name}** role from **${
        message.mentions.users.first().username
      }**.`
    );
  }

  if (command === `${prefix}meme`) {
    let subreddits = ["meme", "dankmemes"];
    let randomSubreddit =
      subreddits[Math.floor(Math.random() * subreddits.length)];

    let { body } = await snekfetch
      .get(`https://www.reddit.com/r/${randomSubreddit}.json?sort=top&t=week`)
      .query({ limit: 800 });
    let allowed = message.channel.nsfw
      ? body.data.children
      : body.data.children.filter(post => !post.data.over_18);
    if (!allowed.length) {
      return message.channel.send(
        "Looks like we're out of memes, Please try again later!"
      );
    }
    let randomPost = Math.floor(Math.random() * allowed.length);

    let MemeEmbed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setAuthor(`${message.author.username} here's a random meme for you!`)
      .setImage(allowed[randomPost].data.url)
      .setFooter(`VxeMaster`);
    return message.channel.send(MemeEmbed);
  }

  if (command === `${prefix}cat`) {
    const { body } = await snekfetch.get("http://aws.random.cat/meow");

    const embed = new Discord.MessageEmbed()
      .setColor("#ff9900")
      .setTitle("Here's Your Cat")
      .setImage(body.file)
      .setFooter(`Vxe Master`);
    message.channel.send({ embed });
  }
  if (command === `${prefix}spank`) {
    if (!message.mentions.users.first())
      return message.channel.send("You need to mention someone to spank");
    const { body } = await snekfetch.get("https://nekos.life/api/v2/img/spank");
    //ok?
    //fine well back to work :/
    const embed = new Discord.MessageEmbed()
      .setColor("#ff9900")
      .setTitle(
        `${message.author.username} Spanked ${
          message.mentions.users.first().username
        } xDD`
      )
      .setImage(body.neko)
      .setFooter(`VxeMaster`);
    message.channel.send({ embed });
  }
  if (command === `${prefix}poll`) {
    if (!message.member.hasPermission(["MANAGE_MESSAGES", "ADMINISTRATOR"]))
      return message.channel.send(
        "You don't have permission to use that command."
      );
    if (!args[0])
      return message.channel.send("You did not specify your poll question.");
    let pollArgsResult = args.join(" ");
    const pollEmbed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle("📊 **Poll**")
      .setDescription(pollArgsResult)
      .setTimestamp();
    const loading = await message.channel.send(pollEmbed);
    await loading.react("👍");
    await loading.react("👎");
  }

  if (command === `${prefix}deposit` || command === `${prefix}dep`) {
    if (!args[0]) {
      return message.channel.send(
        "Please specify the amount of coins you want to deposit to your bank"
      );
    }

    if (args[0].toLowerCase() === "all") {
      let UDB = quickdb.fetch(`money_${message.author.id}`);
      if (UDB === null) UDB = 0;

      await quickdb.add(`bank_${message.author.id}`, UDB);
      await quickdb.subtract(`money_${message.author.id}`, UDB);

      return message.channel.send(
        `${parseInt(UDB).toLocaleString()} coins was deposited to your bank!`
      );
    } else {
      if (isNaN(args[0])) {
        return message.channel.send("Provided amount is not a number");
      }
      let UDB = quickdb.fetch(`money_${message.author.id}`);
      if (UDB === null) UDB = 0;

      if (args[0] > UDB) {
        return message.channel.send(
          "You don't have that many coins in your balance to put in your bank"
        );
      } else {
        let Ubank = quickdb.fetch(`bank_${message.author.id}`);
        if (Ubank === null) Ubank = 0;

        await quickdb.subtract(`money_${message.author.id}`, args[0]);
        await quickdb.add(`bank_${message.author.id}`, args[0]);

        return message.channel.send(
          `${parseInt(
            args[0]
          ).toLocaleString()} coins have been deposited to your bank!`
        );
      }
    }
  }
  if (command === `${prefix}rob`) {
    let robMention = message.mentions.members.first();
    if (!robMention) {
      return message.channel.send(
        "Please mention a user you want to steal from..."
      );
    }
    if (robMention.id === message.author.id) {
      return message.channel.send("Why are you trying to steal from yourself?");
    }
    if (robMention.user.bot) {
      return message.channel.send("You can't steal from a bot");
    }
    let userC = quickdb.fetch(`money_${message.author.id}`);
    if (userC === null) userC = 0;

    let mentionC = quickdb.fetch(`money_${robMention.id}`);
    if (mentionC === null) mentionC = 0;

    if (userC < 250) {
      return message.channel.send(
        `You at least need 250 coins to rob someone...\nYour balance: **${parseInt(
          userC
        ).toLocaleString()}**`
      );
    }
    if (mentionC < 500) {
      return message.channel.send(
        `This user doesn't even have 500 coins, not worth it bro...\nThis user's balance: **${parseInt(
          mentionC
        ).toLocaleString()}**`
      );
    }
    let robCoolDownC = quickdb.fetch(`robCoolDown_${message.author.id}`);
    let timeout = 600000;

    if (robCoolDownC !== null && timeout - (Date.now() - robCoolDownC) > 0) {
      let time = ms(timeout - (Date.now() - robCoolDownC));

      return message.channel.send(
        `Slow it down bud, plan your another rob plan and then you can rob after **${time.minutes}m ${time.seconds}s**!`
      );
    }

    let robOutcome = ["Success", "Failure"];
    let randomRobOutcome =
      robOutcome[Math.floor(Math.random() * robOutcome.length)];

    if (`${randomRobOutcome}` === "Success") {
      let robAmount = Math.floor(Math.random() * `${mentionC}`) + 1;

      await quickdb.subtract(`money_${robMention.id}`, robAmount);
      await quickdb.add(`money_${message.author.id}`, robAmount);
      await quickdb.set(`robCoolDown_${message.author.id}`, Date.now());
      return message.channel.send(
        `You stole **${parseInt(robAmount).toLocaleString()}** coins from ${
          robMention.user.username
        }!`
      );
    } else if (`${randomRobOutcome}` === "Failure") {
      await quickdb.subtract(`money_${message.author.id}`, 250);
      await quickdb.add(`money_${robMention.id}`, 250);
      await quickdb.set(`robCoolDown_${message.author.id}`, Date.now());
      return message.channel.send(
        `You failed on robbing ${robMention.user.username} and paid 250 coins to stay out of jail`
      );
    }
  }
  //should we make shards?
  //im thinking of more commands,, hmm
  if(command === `${prefix}remove-coins`){
    if(!ownerIDs.includes(message.author.id)){
      return message.channel.send("This command is for owners only.");
    }
    let mentionR = message.mentions.members.first();
    if(!mentionR){
      return message.channel.send("Please mention a user that you want to remove coins from...");
    }
    if(mentionR){
      if(!args[1]){
        return message.channel.send("Please provide the amount of coins you want to remove...");
      }
      if(isNaN(args[1])){
        return message.channel.send("Provided amount of coins is not a number");
      }
      let mentionCoins = quickdb.fetch(`money_${mentionR.id}`)
      if(mentionCoins === null) mentionCoins = 0;
      
      if(mentionCoins < args[1]){
        return message.channel.send(`This user doesn't have that many coins\nThis user currently has: ${parseInt(mentionCoins).toLocaleString()} coins`);
      }
      await quickdb.subtract(`money_${mentionR.id}`, args[1])
      return message.channel.send(`Removed ${parseInt(args[1]).toLocaleString()} coins from ${mentionR.user.username}`);
    }
  }
  
  if(command === `${prefix}start-giveaway`){
    console.log("Fired");
    manager.start(message.channel, {
      time: ms(args[0]),
      prize: args.slice(2).join(" "),
      winnerCount: parseInt(args[1]),
      hostedBy: message.author.username,
      BotsCanWin: false,
      winners: "winner(s)"
    }).then(async gData => console.log(gData))
  }
  if(command === `${prefix}buy`){
    let item1 = await quickdb.fetch(`item1_${message.guild.id}`);
    let item1Cost = await quickdb.fetch(`item1Cost_${message.guild.id}`);
    let item2 = await quickdb.fetch(`item2_${message.guild.id}`);
    let item2Cost = await quickdb.fetch(`item2Cost_${message.guild.id}`);
    let item3 = await quickdb.fetch(`item3_${message.guild.id}`);
    let item3Cost = await quickdb.fetch(`item3Cost_${message.guild.id}`);
    let item4 = await quickdb.fetch(`item4_${message.guild.id}`);
    let item4Cost = await quickdb.fetch(`item4Cost_${message.guild.id}`);
    let item5 = await quickdb.fetch(`item5_${message.guild.id}`);
    let item5Cost = await quickdb.fetch(`item5Cost_${message.guild.id}`);
    let MoneyOfU = await quickdb.fetch(`money_${message.author.id}`);
    if(MoneyOfU === null) MoneyOfU = 0;
    
    if(item1 === null && item2 === null && item3 === null && item4 === null && item5 === null){
      return message.channel.send("There's no items in the shop yet");
    }
    //here - cedar
    if(args[0] === "1"){
      if(item1 === null){
        return message.channel.send("Item 1 wasn't set on the shop");
      } else {
        if(item1Cost > MoneyOfU){
          return message.channel.send(`You don't have enough coins to but this item!\nThis item's cost: ${item1Cost} coins\nYour balance: ${MoneyOfU} coins`);
        } else {
          await quickdb.subtract(`money_${message.author.id}`, item1Cost);
          return message.channel.send(`You brought a ${item1} for ${item1Cost} coins!`);
        }
      }
    } else if(args[0] === "2"){
      if(item2 === null){
        return message.channel.send("Item 2 wasn't set on the shop");
      } else {
        if(item2Cost > MoneyOfU){
          return message.channel.send(`You don't have enough coins to but this item!\nThis item's cost: ${item2Cost} coins\nYour balance: ${MoneyOfU} coins`);
        } else {
          await quickdb.subtract(`money_${message.author.id}`, item2Cost);
          return message.channel.send(`You brought a ${item2} for ${item2Cost} coins!`);
        }
      }
    } else if(args[0] === "3"){
      if(item3 === null){
        return message.channel.send("Item 3 wasn't set on the shop");
      } else {
        if(item3Cost > MoneyOfU){
          return message.channel.send(`You don't have enough coins to but this item!\nThis item's cost: ${item3Cost} coins\nYour balance: ${MoneyOfU} coins`);
        } else {
          await quickdb.subtract(`money_${message.author.id}`, item3Cost);
          return message.channel.send(`You brought a ${item3} for ${item3Cost} coins!`);
        }
      }
    } else if(args[0] === "4"){
      if(item4 === null){
        return message.channel.send("Item 4 wasn't set on the shop");
      } else {
        if(item4Cost > MoneyOfU){
          return message.channel.send(`You don't have enough coins to but this item!\nThis item's cost: ${item4Cost} coins\nYour balance: ${MoneyOfU} coins`);
        } else {
          await quickdb.subtract(`money_${message.author.id}`, item4Cost);
          return message.channel.send(`You brought a ${item4} for ${item4Cost} coins!`);
        }
      }
    } else if(args[0] === "5"){
      if(item5 === null){
        return message.channel.send("Item 5 wasn't set on the shop");
      } else {
        if(item5Cost > MoneyOfU){
          return message.channel.send(`You don't have enough coins to but this item!\nThis item's cost: ${item5Cost} coins\nYour balance: ${MoneyOfU} coins`);
        } else {
          await quickdb.subtract(`money_${message.author.id}`, item5Cost);
          return message.channel.send(`You brought a ${item5} for ${item5Cost} coins!`);
        }
      }
    }
  }
    
    
    //withdrawl command
  if(command === `${prefix}withdraw`){
   let bankOfU = await quickdb.fetch(`bank_${message.author.id}`);
    if(bankOfU === null) bankOfU = 0;
    
    if(!args[0]){
      return message.channel.send("Please provide the amount of coins you want to withdraw");
    }
    if(isNaN(args[0])){
      return message.channel.send("The amount of coins you provided is not a number");
    }
    if(args[0] > bankOfU){
      return message.channel.send(`You don't have that many coins to withdraw from your bank!\nYour balance: **${parseInt(bankOfU).toLocaleString()}**`);
    }
    if(args[0] === "0"){
      return message.channel.send("You at least have to withdraw 1 coin");
    }
    await quickdb.add(`money_${message.author.id}`, args[0]);
    await quickdb.subtract(`bank_${message.author.id}`, args[0]);
    return message.channel.send(`Withdrawn **${parseInt(args[0]).toLocaleString()}** coins!`);
  }
      if(command === `${prefix}uptime`) {
        var milliseconds = parseInt((client.uptime % 1000) / 100),
        seconds = parseInt((client.uptime / 1000) % 60),
        minutes = parseInt((client.uptime / (1000 * 60)) % 60),
        hours = parseInt((client.uptime / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        message.channel.send(":chart_with_upwards_trend: I've been running for** " + hours + " **hours, **" + minutes + "** minutes and **" + seconds + "." + milliseconds + "** seconds!");
}
  if(command === `${prefix}testwelcome`) {
    if(message.author.id !== '459175543154147328' && !message.member.hasPermission("ADMINISTRATOR")) return message.reply(`:facepalm: You can't do that BOIII! :facepalm:`);
  if(args[0] === 'clear'){
    await quickdb.set(`welcomer_${message.guild.id}`, 'none')
    await quickdb.set(`welcomerid_${message.guild.id}`, 'none')
        message.channel.send("Success, Cleared customised welcome message.")
        return
    }else{
        let input = args.join(' ').split('|')
        if(parseInt(input[1]) == NaN) return message.reply('Usage: welcomer `<message>|<channel id>` (no spaces around the "|")')
        //console.log(input[1])
        if(client.channels.get(input[1]) === undefined) return message.channel.send('Usage: welcomer `<message>|<channel id>` (no spaces around the "|")')
        let string = input[0]
        //console.log(input[0])
        await quickdb.set(`welcomer_${message.guild.id}`, string)
        await quickdb.set(`welcomerid_${message.guild.id}`, input[1])
        

        let embed = new Discord.MessageEmbed()
        .setColor("#ff8200")
        .setTitle("Welcome Message Changed")
        .setDescription(`Set to ${string}`)
        .setFooter(`Test`);

        message.channel.send({embed});
    } 
}

})

client.login(config.bot_token);
