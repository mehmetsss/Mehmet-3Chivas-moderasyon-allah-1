const Command = require("../../../inventory/base/Command");
const Discord = require("discord.js");
const functionz = require("../../helpers/functionz");
const dutyinv = require("../../../../../MODELS/duty_davet");
const dutyreg = require("../../../../../MODELS/duty_registry");
const low = require('lowdb');
const { sayi, checkHours } = require("../../helpers/functionz");

class Jail extends Command {

    constructor(client) {
        super(client, {
            name: "görevim",
            description: "Var olan görevi gösterir.",
            usage: "görevim tür etiket/id",
            examples: ["görevim davet 789036882175983647"],
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
        if (!sexiboy) sexiboy = message.member;

        if (args[0] === 'davet') {

            const system = await dutyinv.findOne({ _id: sexiboy.user.id });
            if (!system) return message.channel.send(embed.setDescription(`${emojis.error} Bu kişinin bir davet görevi bulunmamaktadır!`));
            return message.channel.send(embed.setDescription(`${emojis.okgreen} ${sexiboy} kişisinin ${checkHours(system.created)} saat önce verilen ${system.expiresIn} günlüğüne ${system.count} adet davet görevi bulunmaktadır.`));

        } else if (args[0] === 'kayıt') {

            const system = await dutyreg.findOne({ _id: sexiboy.user.id });
            if (!system) return message.channel.send(embed.setDescription(`${emojis.error} Bu kişinin bir kayıt görevi bulunmamaktadır!`));
            return message.channel.send(embed.setDescription(`${emojis.okgreen} ${sexiboy} kişisinin ${checkHours(system.created)} saat önce verilen ${system.expiresIn} günlüğüne ${system.count} adet kayıt görevi bulunmaktadır.`));

        } else return message.channel.send(embed.setDescription(`${emojis.error} Doğru kullanım: ${this.help.usage}`));


    }

}

module.exports = Jail;