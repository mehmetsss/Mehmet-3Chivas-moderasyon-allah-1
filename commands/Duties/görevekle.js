const Command = require("../../../inventory/base/Command");
const Discord = require("discord.js");
const functionz = require("../../helpers/functionz");
const dutyinv = require("../../../../../MODELS/duty_davet");
const dutyreg = require("../../../../../MODELS/duty_registry");
const low = require('lowdb');
const { sayi } = require("../../helpers/functionz");

class Jail extends Command {

    constructor(client) {
        super(client, {
            name: "görevekle",
            description: "Etiketlenen kişiye görev verir",
            usage: "görevekle etiket/id tür sayı gün",
            examples: ["görevekle 789036882175983647 davet 50 1"],
            aliases: [],
            permLvl: [],
            cooldown: 60000,
            enabled: true,
            adminOnly: false,
            ownerOnly: false,
            onTest: true,
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
        const embed = new Discord.MessageEmbed().setColor('#2f3136');

        let sexiboy;
        var sexiboyzz = message.mentions.members.first();
        if (sexiboyzz) {
            sexiboy = sexiboyzz;
        } else {
            sexiboy = message.guild.members.cache.get(args[0]);
        }
        if (!sexiboy) return message.channel.send("Kullanıcı Bulunamadı.");

        if (args[1] === 'davet') {

            const system = await dutyinv.findOne({ _id: sexiboy.user.id });
            if (system) return message.channel.send(embed.setDescription(`${emojis.error} Bu kişinin zaten bir davet görevi bulunmaktadır!`));
            if (!sayi(args[2])) return message.channel.send(embed.setDescription(`${emojis.error} Davet sayısı bir **sayı** olmalı`));
            if (!sayi(args[3])) return message.channel.send(embed.setDescription(`${emojis.error} Geçerlilik günü bir **sayı** olmalı`));
            let gonnasave = dutyinv({ _id: sexiboy.user.id, count: args[2], created: new Date(), expiresIn: args[3], processx: 0 });
            await gonnasave.save();
            return message.channel.send(embed.setDescription(`${emojis.okgreen} Görev başarıyla kaydedildi!`));

        } else if (args[1] === 'kayıt') {

            const system = await dutyreg.findOne({ _id: sexiboy.user.id });
            if (system) return message.channel.send(embed.setDescription(`${emojis.error} Bu kişinin zaten bir kayıt görevi bulunmaktadır!`));
            if (!sayi(args[2])) return message.channel.send(embed.setDescription(`${emojis.error} Kayıt sayısı bir **sayı** olmalı`));
            if (!sayi(args[3])) return message.channel.send(embed.setDescription(`${emojis.error} Geçerlilik günü bir **sayı** olmalı`));
            let gonnasave = dutyreg({ _id: sexiboy.user.id, count: args[2], created: new Date(), expiresIn: args[3], processx: 0 });
            await gonnasave.save();
            return message.channel.send(embed.setDescription(`${emojis.okgreen} Görev başarıyla kaydedildi!`));

        } else return message.channel.send(embed.setDescription(`${emojis.error} Doğru kullanım: ${this.help.usage}`));


    }

}

module.exports = Jail;