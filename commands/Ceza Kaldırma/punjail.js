const Command = require("../../../inventory/base/Command");
const Discord = require("discord.js");
const jailed = require('../../../../../MODELS/permajails');
const sicil = require('../../../../../MODELS/sicil');
const low = require('lowdb');

class Jail extends Command {

    constructor(client) {
        super(client, {
            name: "punjail",
            description: "Varolan bir hapis cezasını kaldırır",
            usage: "unjail etiket/id",
            examples: ["unjail 674565119161794560"],
            aliases: ["pcun"],
            permLvl: ["cmd-jailor", "cmd-rhode", "cmd-authority"],
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
        let sexiboy = message.mentions.members.first();
        if (!sexiboy) sexiboy = message.guild.members.cache.get(args[0]);
        if (!sexiboy) return message.channel.send(embed.setDescription(`${emojis.ocured} Kişi bulunamadı.`));
        const doc = await jailed.findOne({ _id: sexiboy.user.id });
        if (!doc) return message.channel.send(embed.setDescription(`${emojis.docs1} Kayıt Bulunamadı..`));
        const exec = message.guild.members.cache.get(doc.executor);
        if (message.member.user.id !== exec.user.id) {
            if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription(`${emojis.staff} Bu kullanıcının susturulmasını sadece ${exec} ya da bir yönetici kaldırabilir!`));
        };
        let salakmısın = doc.rolz;
        let yaratık = [];
        await salakmısın.forEach(ele => {
            let anancı = message.guild.roles.cache.find(r => r.name === ele);
            if (anancı && anancı.editable) yaratık.push(anancı.id);
        });
        await sexiboy.roles.add(yaratık);
        await jailed.deleteOne({ _id: sexiboy.user.id });
        await sexiboy.roles.remove(roller.get("th-jail").value());
        message.channel.send(embed.setDescription(`${emojis.allowedmute} ${sexiboy} üyesinin metin kanallarındaki cezası ${message.member} tarafından kaldırıldı.`));
        const embedd = embed.setTitle(`Jail Kaldırıldı`).setDescription(`${emojis.vmuted} ${sexiboy} kişisi ${message.member} tarafından metin kanallarındaki susturulması kaldırıldı`)
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
        await sexiboy.roles.remove(roller.get("th-jail").value());
        message.react(emojiler.get("okgreen").value().split(':')[2].replace('>', ''));
        this.client.cmdCooldown[message.author.id][this.help.name] = Date.now() + this.info.cooldown;

    }

}

module.exports = Jail;