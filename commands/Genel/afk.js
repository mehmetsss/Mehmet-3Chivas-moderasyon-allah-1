const Discord = require('discord.js');
const Command = require("../../../inventory/base/Command");
const afkdata = require('../../../../../MODELS/afkuser');
const low = require('lowdb');
class Call extends Command {

    constructor(client) {
        super(client, {
            name: "afk",
            description: "Belirtilen sebepte sizi afk olarak veritabanına ekler",
            usage: "afk",
            examples: ["afk cumaya gittim geleceğim"],
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
        let sebep = args.join(' ');
        if (!sebep) return message.channel.send(embed.setDescription(`${emojis.warn} Geçerli bir sebep girmedin!`));

        let system = await afkdata.findOne({ _id: message.member.user.id });
        if (!system) {
            try {
                let sex = await afkdata({
                    _id: message.member.user.id,
                    sebep: sebep,
                    date: new Date()
                });
                await sex.save();                
            } catch (error) {
                console.log(error);
            }
            await message.channel.send(embed.setDescription(`${emojis.docs1} Başarıyla Ayarlandı!`));
        } else return;

    }
}

module.exports = Call;