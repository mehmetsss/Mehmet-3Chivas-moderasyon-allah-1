const Command = require("../../../inventory/base/Command");
const Discord = require("discord.js");
const low = require('lowdb');
const banned = require('../../../../../MODELS/tempbans');
const bans = require('../../../../../MODELS/permabans');
const sicil = require('../../../../../MODELS/sicil');
const { sayi } = require("../../helpers/functionz");

class Banclass extends Command {

    constructor(client) {
        super(client, {
            name: "tempban",
            description: "Kullanıcıyı süreli olarak banlar",
            usage: "ban etiket/id gün sebep",
            examples: ["ban 674565119161794560 5 uyarılmasına rağmen şahsa hakaret"],
            aliases: ["elimkaydı", "ban"],
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
        let gün = args[1];
        if (!gün) return message.channel.send(embed.setDescription(`${emojis.countdown} Geçerli bir gün girmelisin`));
        if (!sayi(gün)) return message.channel.send(embed.setDescription(`${emojis.countdown} Geçerli bir gün girmelisin`));
        var sebep = args.slice(2).join(" ");
        if (!sebep) return message.channel.send(embed.setDescription(`${emojis.question} Bir sebep girmelisin`));
        if (message.member.roles.highest.rawPosition <= sexiboy.roles.highest.rawPosition) return message.channel.send(embed.setDescription(`${emojis.warn} Bunu yapmak için yeterli yetkiye sahip değilsin`));
        if (!sexiboy.bannable) return message.channel.send(embed.setDescription(`${emojis.yetki} Bu kişiyi banlamak için yeterli yetkiye sahip değilim`));
        let system = await banned.findOne({ _id: sexiboy.user.id });
        if (!system) {
            try {
                let doggy = await banned({ _id: sexiboy.user.id, sebep: sebep, executor: message.member.user.id, created: new Date(), süre: gün });
                await doggy.save();
            } catch (error) {
                if (error.code !== 5904) {
                    throw error;
                }
            }
        };
        message.channel.send(embed.setDescription(`${emojis.ban} ${sexiboy} başarıyla banlandı`));
        const embedd = embed.setTitle(`Başarıyla Banlandı!`).setDescription(`${emojis.ban} ${sexiboy} kişisi ${message.member} tarafından banlandı`)
            .addField("Sebep:", sebep, true).addField("Süre", `${gün} Gün`, true).setThumbnail(sexiboy.user.displayAvatarURL({ dynamic: true }))
            .setAuthor(message.member.displayName, message.member.user.displayAvatarURL({ dynamic: true }))
            .setFooter(`Tantoony Bots`).setTimestamp();
        message.guild.channels.cache.get((await kanallar).get("cmd-ban").value()).send(embedd);
        message.guild.members.ban(sexiboy.user.id);
        const obje = {
            date: new Date(),
            type: `TempBan - ${gün} gün`,
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
        message.react(emojiler.get("okred").value().split(':')[2].replace('>', ''));
        this.client.cmdCooldown[message.author.id][this.help.name] = Date.now() + this.info.cooldown;
    }

}

module.exports = Banclass;