const Discord = require('discord.js');
const ayarlar = require('../../../inventory/helpers/config');
const Command = require("../../../inventory/base/Command");
class Call extends Command {

    constructor(client) {
        super(client, {
            name: "link",
            description: "sunucunun linkini gönderir",
            usage: "link",
            examples: ["link"],
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

        if (!message.guild.vanityURLCode) return;
        message.channel.send(`discord.gg/${message.guild.vanityURLCode}`);
    }
}

module.exports = Call;