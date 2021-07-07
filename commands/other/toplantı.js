const Command = require("../../../inventory/base/Command");

class MoveClass extends Command {

    constructor(client) {
        super(client, {
            name: "toplantı",
            description: (language) => language.get(),
            usage: (language) => language.get(),
            examples: (language) => language.get(),
            category: "moderation",
            enabled: true,
            aliases: [],
            memberPermissions: [],
            botPermissions: [],
            ownerOnly: false,
            adminOnly: true,
            cooldown: 60000,
            permLvl: ["cmdmanager", "cmd-authority"]
        });
    }

    async run(client, message, args, data) {
        
        let kanal = message.member.voice.channel.id;

        let sex = message.guild.channels.cache.get(kanal);

        //console.log(sex);

        if (args[0] === "başlat") {
            await sex.members.forEach(mem => {
                if (mem.user.id === message.member.user.id) return;
                mem.voice.setMute(true);
            });
        } else if (args[0] === "bitir") {
            await sex.members.forEach(mem => {
                mem.voice.setMute(false);
                mem.roles.add('713344957930405948');
            });
        }

        


    }

}

module.exports = MoveClass;