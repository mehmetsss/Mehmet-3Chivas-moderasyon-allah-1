const Command = require("../../../inventory/base/Command");
const Discord = require("discord.js");
const low = require('lowdb');
const banned = require('../../../../../MODELS/permabans');
const bans = require('../../../../../MODELS/tempbans');
const sicil = require('../../../../../MODELS/sicil');
const { sayi } = require("../../helpers/functionz");

class Banclass extends Command {

    constructor(client) {
        super(client, {
            name: "permaban",
            description: "Kullanıcıyı banlar",
            usage: "ban etiket/id sebep",
            examples: ["ban 674565119161794560 uyarılmasına rağmen şahsa hakaret"],
            aliases: ["banla", "infaz", "pban"],
            permLvl: ["cmd-banner", "cmd-rhode", "cmd-authority"],
            cooldown: 1000,
            enabled: true,
            adminOnly: false,
            ownerOnly: false,
            onTest: false,
            rootOnly: false,
            dmCmd: false
        });
    }

    async run(client, message, args, data) {

        const roller = low(this.client.adapterroles);
        const kanallar = low(this.client.adapterchannels);
        const utiller = low(this.client.adapterutil);
        const emojiler = await low(this.client.adapteremojis);
        const emojis = emojiler.value()
        const embed = new Discord.MessageEmbed().setColor('#2f3136');
        let sexiboy = message.mentions.members.first();
        if (!sexiboy) sexiboy = message.guild.members.cache.get(args[0]);
        if (!sexiboy) return message.channel.send(embed.setDescription(`${emojis.ocured} Kişi bulunamadı.`));
        const sebep = args.slice(1).join(" ");
        if (!sebep) return message.channel.send(embed.setDescription(`${emojis.question} Bir sebep girmelisin`));
        if (message.member.roles.highest.rawPosition <= sexiboy.roles.highest.rawPosition) return message.channel.send(embed.setDescription(`${emojis.warn} Bunu yapmak için yeterli yetkiye sahip değilsin`));
        if (!sexiboy.bannable) return message.channel.send(embed.setDescription(`${emojis.yetki} Bu kişiyi banlamak için yeterli yetkiye sahip değilim`));
        let system = await banned.findOne({ _id: sexiboy.user.id });
        if (!system) {
            try {
                let doggy = await banned({ _id: sexiboy.user.id, sebep: sebep, executor: message.member.user.id, created: new Date() });
                await doggy.save();
            } catch (error) {
                if (error.code !== 5904) {
                    throw error;
                }
            }
        };
        await message.channel.send(embed.setDescription(`${emojis.ban} ${sexiboy} başarıyla banlandı`).setImage('https://cdn.discordapp.com/attachments/790306515651002439/793099873699495936/tenor.gif'));
        const embedd = embed.setTitle(`Başarıyla Banlandı!`).setDescription(`${emojis.ban} ${sexiboy} kişisi ${message.member} tarafından banlandı`)
            .addField("Sebep:", sebep, true).addField("Süre", `**Perma**`, true).setThumbnail(sexiboy.user.displayAvatarURL({ dynamic: true }))
            .setAuthor(message.member.displayName, message.member.user.displayAvatarURL({ dynamic: true }))
            .setFooter(`Tantoony Bots`).setTimestamp();
        await message.guild.channels.cache.get((await kanallar).get("cmd-ban").value()).send(embedd);
        const obje = {
            date: new Date(),
            type: `PermaBan`,
            executor: message.member.user.id,
            reason: sebep
        }
        let invarray = [];
        let gg = invarray.push(obje);
        let systemm = await sicil.findOne({ _id: sexiboy.user.id });
        if (!systemm) {
            try {
                let doffy = await sicil({ _id: sexiboy.user.id, punishes: gg });
                await doffy.save();
            } catch (error) {
                if (error.code !== 5904) {
                    throw error;
                }
            }
        } else {
            await sicil.updateOne({ _id: sexiboy.user.id }, { $push: { punishes: obje } });
        }
        message.guild.members.ban(sexiboy.user.id);
        message.react(emojiler.get("okred").value().split(':')[2].replace('>', ''));
        this.client.cmdCooldown[message.author.id][this.help.name] = Date.now() + this.info.cooldown;
    }

}

module.exports = Banclass;