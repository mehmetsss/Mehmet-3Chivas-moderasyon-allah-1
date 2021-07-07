const Discord = require('discord.js');
const Command = require("../../../inventory/base/Command");
const low = require('lowdb');
class Call extends Command {

    constructor(client) {
        super(client, {
            name: "nerede",
            description: "etiketlenen kişinin nerede olduğunu gösterir",
            usage: "nerede id/etiket",
            examples: ["nerede 674565119161794560"],
            aliases: [],
            permLvl: [],
            cooldown: 300000,
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
        if (!sexiboy) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.error} Kullanıcı bulunamadı!`));
        let desu = ``;
        if (!sexiboy.voice.channel) {
            desu = `Belirtilen kullanıcı hiçbir kanalda bulunmamaktadır.`;
        } else {
            let asd = await sexiboy.voice.channel.createInvite({maxUses: 1});
            desu = `${sexiboy.voice.channel.name}        [▶️](https://discord.gg/${asd.code}) \`${sexiboy.voice.channel.members.size}/${sexiboy.voice.channel.userLimit}\``;
        };
        //console.log(desu);
        let lmc = message.guild.channels.cache.get(sexiboy.lastMessageChannelID);
        if (!lmc) {
            lmc = `Bulunamadı`;
        };
        //console.log(lmc);
        const embedi = embed.setDescription(`${sexiboy} Anlık olarak\n\n**${desu}**\n\nEn son yazdığı kanal: ${lmc}`).setFooter("Sadece emojiye bas :)")
        message.channel.send(embedi);
        //console.log(message.guild.channels.cache.get('789208884190773278'));

    }
}

module.exports = Call;