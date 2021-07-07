const Command = require("../../../inventory/base/Command");
const Discord = require("discord.js");
const functionz = require("../../helpers/functionz");
const low = require('lowdb');
const jailed = require('../../../../../MODELS/tempjails');
const { jailor } = require("../../helpers/embedmaker");
const { sayi } = require("../../helpers/functionz");
const sicil = require('../../../../../MODELS/sicil');

class Jail extends Command {

    constructor(client) {
        super(client, {
            name: "jail",
            description: "Kişiyi hapse atar",
            usage: "jail etiket/id süre birim sebep",
            examples: ["jail 674565119161794560 5 gün uyarılmasına rağmen bass açma"],
            aliases: ["hapis"],
            permLvl: ["cmd-jailor", "cmd-rhode", "cmd-authority"],
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
        if (message.member.roles.highest.rawPosition <= sexiboy.roles.highest.rawPosition) return message.channel.send(embed.setDescription(`${emojis.warn} Bunu yapmak için yeterli yetkiye sahip değilsin`));
        let sayı = args[1];
        if (!sayı) return message.channel.send(embed.setDescription(`${emojis.countdown} Geçerli bir sayı girmelisin`));
        if (!sayi(sayı)) return message.channel.send(embed.setDescription(`${emojis.countdown} Geçerli bir sayı girmelisin`));
        if (parseInt(sayı) >= 100 || parseInt(sayı) <= 0) return message.reply(`${emojis.warn} 5 ile 100 arasında bir sayı girmelisin`).catch(console.error);
        let aşkım = args[2];
        if (args[2] !== 'gün') {
            if (args[2] !== 'saat') {
                return message.channel.send(`Doğru Kullanım: \`.jail @etiket <süre> <gün/saat> <sebep>\``);
            };
        };
        const sebep = args.slice(3).join(' ');
        let rolz = [];
        let system = await jailed.findOne({ _id: sexiboy.user.id });
        await sexiboy.roles.cache.forEach(async (ele) => {
            if (ele.id !== roller.get("th-booster").value()) {
                rolz.push(ele.name);
            };
        });
        await sexiboy.roles.remove(sexiboy.roles.cache.filter(r => r.id !== roller.get("th-booster").value()));
        await sexiboy.roles.add(roller.get("th-jail").value());
        if (!system) {
            try {
                let doggy = await jailed({ _id: sexiboy.user.id, sebep: sebep, executor: message.member.user.id, rolz: rolz, created: new Date(), süre: sayı, birim: aşkım });
                await doggy.save();
            } catch (error) {
                if (error.code !== 5904) {
                    throw error;
                }
            }
        };
        if (message.guild.member(sexiboy).voice && message.guild.member(sexiboy).voice.channel) message.guild.member(sexiboy).voice.setChannel(null);
        message.channel.send(embed.setDescription(`${emojis.jailed} ${sexiboy} Başarıyla ${message.member} tarafından cezalıya atıldı!`));
        const embedd = embed.setTitle(`Jaile Gönderildi`).setDescription(`${emojis.jailed} ${sexiboy} kişisi ${message.member} tarafından cezalıya atıldı`)
            .addField("Sebep:", sebep, true).addField("Süre", `${sayı} ${aşkım}`, true).setThumbnail(sexiboy.user.displayAvatarURL({ dynamic: true }))
            .setAuthor(message.member.displayName, message.member.user.displayAvatarURL({ dynamic: true }))
            .setFooter(`Tantoony Bots`).setTimestamp();
        message.guild.channels.cache.get((await kanallar).get("cmd-jail").value()).send(embedd);
        const obje = {
            date: new Date(),
            type: `TempJail - ${sayı} ${aşkım}`,
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
        await sexiboy.roles.add(roller.get("th-jail").value());
        message.react(emojiler.get("okred").value().split(':')[2].replace('>', ''));
        this.client.cmdCooldown[message.author.id][this.help.name] = Date.now() + this.info.cooldown;

    }

}

module.exports = Jail;