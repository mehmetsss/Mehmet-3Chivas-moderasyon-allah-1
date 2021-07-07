const Command = require("../../../inventory/base/Command");
const low = require('lowdb');

class Banclass extends Command {

    constructor(client) {
        super(client, {
            name: "temizle",
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
            cooldown: 60000,
            permLvl: ["cmd-manager"],
            onTest: false,
            rootOnly: false,
            dmCmd: false
        });
    }

    async run(client, message, args, data) {

        const kanallar = low(this.client.adapterchannels);


        function allah(anan) {
            var reg = new RegExp("^\\d+$");
            var valid = reg.test(anan);
            return valid;
        }

        if (!allah(args[0])) return message.channel.send('Böyle bir sayı yok!');


        const amount = args[0];

        if (!amount) return message.channel.send("Kaç mesaj sileceğimi yazmalısın!").then(msg => msg.delete({ timeout: 10000 })),
            message.delete({ timeout: 10000 });
        if (isNaN(amount)) return message.channel.send('Sayı yazmalısın!').then(msg => msg.delete({ timeout: 10000 })),
            message.delete({ timeout: 10000 });

        if (amount > 100) return message.channel.send('100 mesajdan fazla silemezsin!').then(msg => msg.delete({ timeout: 10000 })),
            message.delete({ timeout: 10000 });
        if (amount < 1) return message.channel.send('En az bir mesajı silebilirsin..').then(msg => msg.delete({ timeout: 10000 })),
            message.delete({ timeout: 10000 });

        await message.channel.messages.fetch(
            { limit: amount }).then(messages => {
                message.channel.bulkDelete(messages)
            }).then(
                message.channel.send(`${amount} Mesaj Temizlenmiştir`)
            );
        //client.channels.cache.get((await kanallar).get("cmdpurge").value()).send(`${message.author} tarafından ${message.channel.name} isimli kanalda ${amount} adet mesaj silindi!`)
        //await message.react("759237437091217448");



    }

}

module.exports = Banclass;