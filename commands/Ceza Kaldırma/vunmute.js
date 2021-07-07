const Command = require("../../../inventory/base/Command");
const Discord = require("discord.js");
const low = require('lowdb');
const vmutes = require("../../../../../MODELS/vmutes");
const sicil = require('../../../../../MODELS/sicil');

class Banclass extends Command {

    constructor(client) {
        super(client, {
            name: "vunmute",
            description: "Varolan ses kanalı engellemesini kaldırır",
            usage: "vunmute etiket/id",
            examples: ["vunmute 674565119161794560"],
            aliases: ["vun"],
            permLvl: ["cmd-vmuter", "cmd-rhode", "cmd-authority"],
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

        const roller = await low(this.client.adapterroles);
        const kanallar = low(this.client.adapterchannels);
        const utiller = low(this.client.adapterutil);
        const emojiler = await low(this.client.adapteremojis);
        const emojis = emojiler.value()

        let sexiboy;
        var sexiboyzz = message.mentions.members.first();
        if (sexiboyzz) {
            sexiboy = sexiboyzz;
        } else {
            sexiboy = message.guild.members.cache.get(args[0]);
        }
        if (!sexiboy) return message.channel.send("Kullanıcı Bulunamadı.");
        const doc = await vmutes.findOne({ _id: sexiboy.user.id });
        if (!doc) return message.channel.send("Kayıt Bulunamadı..");

        const embed = new Discord.MessageEmbed().setColor('#2f3136');
        const exec = message.guild.members.cache.get(doc.muter);
        if (message.member.user.id !== exec.user.id) {
            if (!message.member.roles.cache.has(roller.get("cmd-rhode").value())) {
                return message.channel.send(embed.setDescription(`${emojis.staff} Bu kullanıcının susturulmasını sadece ${exec} ya da bir yönetici kaldırabilir!`));
            };
        };
        await vmutes.deleteOne({ _id: sexiboy.user.id });
        message.channel.send(`Mute süren doldu ${sexiboy}`);
        try {
            await sexiboy.voice.setMute(false);            
        } catch (error) {
            console.log(error);
        };
        message.channel.send(embed.setDescription(`${emojis.allowedmute} ${sexiboy} üyesinin ses kanallarındaki susturulması ${message.member} tarafından kaldırıldı.`));
        const embedd = embed.setTitle(`Ses Mute Alındı`).setDescription(`${emojis.vmuted} ${sexiboy} kişisi ${message.member} tarafından ses kanallarındaki susturulması kaldırıldı`)
            .setAuthor(message.member.displayName, message.member.user.displayAvatarURL({ dynamic: true }))
            .setFooter(`Tantoony Bots`).setTimestamp();
        message.guild.channels.cache.get((await kanallar).get("cmdvmute").value()).send(embedd);
        const obje = {
            date: new Date(),
            type: `TempVoiceMute - KALDIRILDI`,
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