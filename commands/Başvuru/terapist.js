const Command = require("../../../inventory/base/Command");
const low = require('lowdb');

class MoveClass extends Command {

    constructor(client) {
        super(client, {
            name: "terapist",
            description: (language) => language.get(),
            usage: (language) => language.get(),
            examples: (language) => language.get(),
            category: "moderation",
            enabled: false,
            aliases: [],
            memberPermissions: [],
            botPermissions: [],
            ownerOnly: false,
            cooldown: 1000,
            permLvl: ["cterapist"]
        });
    }

    async run(client, message, args, data) {
        const roller = low(this.client.adapterroles);

        if (!message.member.roles.cache.has((await roller).get("cterapist").value())) return;

        let sexiboy;
        var sexiboyzz = message.mentions.members.first();
        if (sexiboyzz) {
            sexiboy = sexiboyzz;
        } else {
            sexiboy = message.guild.members.cache.get(args[0]);
            if (!sexiboy) return message.channel.send("Kullanıcı Bulunamadı.");
        }

        if (!sexiboy.roles.cache.has((await roller).get("sterapist").value())) {
            await sexiboy.roles.add((await roller).get("sterapist").value());
        } else {
            await sexiboy.roles.remove((await roller).get("sterapist").value());
            await sexiboy.roles.add((await roller).get("terapist").value())
        }


    }

}

module.exports = MoveClass;