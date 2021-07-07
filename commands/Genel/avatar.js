const Discord = require('discord.js');
const ayarlar = require('../../../inventory/helpers/config');
const Command = require("../../../inventory/base/Command");
class Call extends Command {

    constructor(client) {
        super(client, {
            name: "avatar",
            description: "Etiketlenen kişinin avatarını gösterir",
            usage: "avatar @etiket/id",
            examples: ["avatar", "avatar 674565119161794560"],
            aliases: [],
            permLvl: [],
            cooldown: 300000,
            enabled: true,
            adminOnly: false,
            ownerOnly: false,
            //cmdChannel: "bot-komutları",
            onTest: false,
            rootOnly: false,
            dmCmd: false
        });
    }

    async run(client, message, args, data) {

        let sexiboy;
        var sexiboyzz = message.mentions.members.first();
        if (sexiboyzz) {
            sexiboy = sexiboyzz;
        } else {
            sexiboy = message.guild.members.cache.get(args[0]);
        }
        if (!sexiboy) sexiboy = message.member;
        const embed = new Discord.MessageEmbed();
        message.channel.send(embed.setImage(sexiboy.user.displayAvatarURL({ dynamic: true, size: 4096 })));
    }
}

module.exports = Call;