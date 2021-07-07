const Command = require("../../../inventory/base/Command");
const low = require('lowdb');
class Banclass extends Command {

    constructor(client) {
        super(client, {
            name: "rolsay",
            description: (language) => language.get(),
            usage: (language) => language.get(),
            examples: (language) => language.get(),
            category: "moderation",
            enabled: true,
            aliases: [],
            memberPermissions: [],
            botPermissions: [],
            ownerOnly: false,
            adminOnly: false,
            permLvl: ["cmd-rhode"],
            cooldown: 60000
        });
    }

    async run(client, message, args, data) {

        const roller = low(this.client.adapterroles);
        const kanallar = low(this.client.adapterchannels);

        client = this.client;

        const genelkanal = kanallar.get("genel").value();
        const logkanal = kanallar.get("kayıt").value();
        let sexiboy = message.guild.roles.cache.get(args[0]);
        if (!sexiboy) return message.channel.send("Rol Bulunamadı.");

        message.channel.send(`**${sexiboy.name}** rolüne sahip **${sexiboy.members.size}** kişi bulunmaktadır.`)


    }

}

module.exports = Banclass;