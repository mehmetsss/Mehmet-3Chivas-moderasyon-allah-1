const Command = require("../../../inventory/base/Command");
const low = require('lowdb');

class Banclass extends Command {

    constructor(client) {
        super(client, {
            name: "snipe",
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
            permLvl: ["cmdmanager"]
        });
    }

    async run(client, message, args, data) {

        const kanallar = low(this.client.adapterchannels);
        const emojiler = low(this.client.adapteremojis);


        function allah(anan) {
            var reg = new RegExp("^\\d+$");
            var valid = reg.test(anan);
            return valid;
        }

        if (!allah(args[1])) return message.channel.send('Böyle bir sayı yok!');


        const amount = args[1];

        if (!amount) return message.channel.send("Kaç mesaj sileceğimi yazmalısın!").then(msg => msg.delete({ timeout: 10000 })),
            message.delete({ timeout: 10000 });
        if (isNaN(amount)) return message.channel.send('Sayı yazmalısın!').then(msg => msg.delete({ timeout: 10000 })),
            message.delete({ timeout: 10000 });

        if (amount > 100) return message.channel.send('100 mesajdan fazla silemezsin!').then(msg => msg.delete({ timeout: 10000 })),
            message.delete({ timeout: 10000 });
        if (amount < 1) return message.channel.send('En az bir mesajı silebilirsin..').then(msg => msg.delete({ timeout: 10000 })),
            message.delete({ timeout: 10000 });

        let i = 0;
        await message.channel.messages.cache.filter(msg => msg.author.id === args[0]).forEach(ele => {
            if (i > amount) return;
            ele.delete();
            i = i + 1;
        });
        
        await message.channel.send(`${amount} Mesaj Temizlenmiştir`).then(
            client.channels.cache.get((await kanallar).get("cmdpurge").value()).send(`${message.author} tarafından ${message.channel.name} isimli kanalda ${amount} adet mesaj silindi!`)
        );

        await message.react((await emojiler).get("ok").value().split(':')[2].replace('>', ''));



    }

}

module.exports = Banclass;