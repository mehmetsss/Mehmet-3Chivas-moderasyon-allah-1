const Command = require("../../../inventory/base/Command");
const Discord = require("discord.js");
const low = require('lowdb');
const cmutes = require("../../../../../MODELS/cmutes");
const sicil = require('../../../../../MODELS/sicil');

class Banclass extends Command {

    constructor(client) {
        super(client, {
            name: "cunmute",
            description: "Varolan metin kanalı engellemesini kaldırır",
            usage: "cunmute etiket/id",
            examples: ["cunmute 674565119161794560"],
            aliases: ["cun"],
            permLvl: ["cmd-cmuter", "cmd-rhode", "cmd-authority"],
            cooldown: 3000,
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
        let sexiboy;
        var sexiboyzz = message.mentions.members.first();
        if (sexiboyzz) {
            sexiboy = sexiboyzz;
        } else {
            sexiboy = message.guild.members.cache.get(args[0]);
        }
        if (!sexiboy) return message.channel.send("Kullanıcı Bulunamadı.");
        const doc = await cmutes.findOne({ _id: sexiboy.user.id });
        if (!doc) return message.channel.send("Kayıt Bulunamadı..");
        const exec = message.guild.members.cache.get(doc.muter);
        if (message.member.user.id !== exec.user.id) {
            if (!message.member.hasPermission("ADMINISTRATOR")) {
                return message.channel.send(embed.setDescription(`${emojis.staff} Bu kullanıcının susturulmasını sadece ${exec} ya da bir yönetici kaldırabilir!`));
            };
        };
        await cmutes.deleteOne({ _id: sexiboy.user.id });
        sexiboy.roles.remove((await roller).get("mod-muted").value());
        message.channel.send(embed.setDescription(`${emojis.allowedmute} ${sexiboy} üyesinin metin kanallarındaki susturulması ${message.member} tarafından kaldırıldı.`));
        const embedd = embed.setTitle(`Ses Mute Atıldı`).setDescription(`${emojis.vmuted} ${sexiboy} kişisi ${message.member} tarafından metin kanallarındaki susturulması kaldırıldı`)
            .setAuthor(message.member.displayName, message.member.user.displayAvatarURL({ dynamic: true }))
            .setFooter(`Tantoony Bots`).setTimestamp();
        message.guild.channels.cache.get((await kanallar).get("cmdcmute").value()).send(embedd);
        const obje = {
            date: new Date(),
            type: `TempChatMute - KALDIRILDI`,
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