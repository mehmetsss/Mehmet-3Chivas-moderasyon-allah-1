const Command = require("../../../inventory/base/Command");
const Discord = require("discord.js");
const sicil = require('../../../../../MODELS/sicil');
const banned = require('../../../../../MODELS/tempbans');
const bans = require('../../../../../MODELS/permabans');
const low = require('lowdb');


class Banclass extends Command {

    constructor(client) {
        super(client, {
            name: "unban",
            description: "Varolan bir yasağı geri alır",
            usage: "unban etiket/id",
            examples: ["unban 674565119161794560"],
            aliases: ["af"],
            permLvl: ["cmd-banner", "cmd-rhode", "cmd-authority"],
            cooldown: 120000,
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
        const emojis = emojiler.value();
        const banlid = args[0];
        const doc = await banned.findOne({ _id: banlid });
        const docc = await bans.findOne({ _id: banlid });
        const embed = new Discord.MessageEmbed().setColor('#2f3136');
        if (doc) {
            const exec = message.guild.members.cache.get(doc.executor);
            if (message.member.user.id !== exec.user.id) {
                if (!message.member.hasPermission("ADMINISTRATOR")) {
                    return message.channel.send(embed.setDescription(`${emojis.staff} Bu kullanıcının yasaklanması sadece ${exec} ya da bir yönetici kaldırabilir!`));
                };
            };
            await banned.deleteOne({ _id: banlid });
        };
        if (docc) {
            const execc = message.guild.members.cache.get(doc.executor);
            if (message.member.user.id !== execc.user.id) {
                if (!message.member.hasPermission("ADMINISTRATOR")) {
                    return message.channel.send(embed.setDescription(`${emojis.staff} Bu kullanıcının yasaklanması sadece ${execc} ya da bir yönetici kaldırabilir!`));
                };
            };
            await bans.deleteOne({ _id: banlid });
        };
        message.guild.members.unban(args[0]);
        message.channel.send(embed.setDescription(`${emojis.allowedmute} kullanıcının banı ${message.member} tarafından kaldırıldı.`));
        const embedd = embed.setTitle(`Ban Kaldırıldı`).setDescription(`${emojis.vmuted} ${args[0]} ID'li kullanıcının banı ${message.member} tarafından kaldırıldı.`)
            .setAuthor(message.member.displayName, message.member.user.displayAvatarURL({ dynamic: true }))
            .setFooter(`Tantoony Bots`).setTimestamp();
        message.guild.channels.cache.get((await kanallar).get("cmd-ban").value()).send(embedd);
        const obje = {
            date: new Date(),
            type: `Ban - KALDIRILDI`,
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
        message.react(emojiler.get("okgreen").value().split(':')[2].replace('>', ''));
        this.client.cmdCooldown[message.author.id][this.help.name] = Date.now() + this.info.cooldown;



    }

}

module.exports = Banclass;