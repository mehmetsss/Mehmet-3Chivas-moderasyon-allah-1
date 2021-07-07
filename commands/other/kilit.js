const Command = require("../../../inventory/base/Command");
const low = require('lowdb');
class Banclass extends Command {

    constructor(client) {
        super(client, {
            name: "kilit",
            description: (language) => language.get(),
            usage: (language) => language.get(),
            examples: (language) => language.get(),
            category: "moderation",
            enabled: false,
            aliases: [],
            memberPermissions: [],
            botPermissions: [],
            ownerOnly: false,
            adminOnly: true,
            permLvl: [],
            cooldown: 60000
        });
    }

    async run(client, message, args, data) {

        const roller = low(this.client.adapterroles);
        const kanallar = low(this.client.adapterchannels);

        client = this.client;

        message.channel.edit()


    }

}

module.exports = Banclass;