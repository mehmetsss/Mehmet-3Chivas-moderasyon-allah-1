const Command = require("../../../inventory/base/Command");
class Banclass extends Command {

    constructor(client) {
        super(client, {
            name: "sesçağır",
            description: "seste olmayan rolleri gösterir",
            usage: ".sesçağır rolID",
            examples: [".sesçağır 789208615193411604"],
            category: "moderation",
            enabled: true,
            aliases: ["sesçağır"],
            memberPermissions: [],
            botPermissions: [],
            ownerOnly: false,
            adminOnly: false,
            permLvl: ["cmd-rhode","cmd-manager"],
            cooldown: 3600000,
            onTest: false,
            rootOnly: false
        });
    }

    async run(client, message, args, data) {

        let yetkililer = [];
        let roll = message.guild.roles.cache.get(args[0]);

        roll.members.forEach(mem => {
            if (mem.user.presence.status !== 'offline') {
                if (!mem.voice.channel) {
                    yetkililer.push(mem);
                };
            };
        });

        if (yetkililer.length === 0) return message.channel.send("Harikasın Ailem!");

        message.channel.send(`Sese falan gelsenize çok iyi olur bence: ${yetkililer.join(" ")}`);


    }

}

module.exports = Banclass;