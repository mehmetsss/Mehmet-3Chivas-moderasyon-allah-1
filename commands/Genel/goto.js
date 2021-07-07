const Discord = require('discord.js');
const ayarlar = require('../../../inventory/helpers/config');
const Command = require("../../../inventory/base/Command");

class Goto extends Command {

    constructor(client) {
        super(client, {
            name: "goto",
            description: "İstediğiniz kişiyi odanıza çağırın",
            usage: "goto",
            enabled: true,
            aliases: ["visit", "git"],
            memberPermissions: [],
            botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            ownerOnly: false,
            cooldown: 10000,
            dmCmd: false,
            onTest: false,
            rootOnly: false,
            adminOnly: false
        });
    }

    async run(client, message) {

        const talip = message.author;
        const gelen = message.mentions.members.first();
        const guid = message.guild;
        const talibe = guid.members.cache.get(talip.id);
        if (!gelen) return message.channel.send("Kullanıcı bulunamadı");
        let kanal = gelen.voice.channel;

        if (!kanal) return message.channel.send("Etiketlediğin kişi bir kanalda bulunmuyor!");

        const cagirembed = new Discord.MessageEmbed()
            .setColor('#4b777e')
            .setAuthor(`Tantoony Hepinizi Seviyor`, message.guild.owner.user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048 }))
            .setFooter(message.member.displayName, message.member.user.displayAvatarURL())
            .setTimestamp()
            .setDescription(`Sevgili ${gelen}, ${talip} kanalına gelmek istiyor.`)
            .setThumbnail(gelen.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))

        try {
            var akısmoji = await message.channel.send(cagirembed);
            await akısmoji.react("✔️");
            await akısmoji.react("❌")
        } catch (error) {
            console.error(error);
        }

        const filter = (reaction, user) => user.id !== message.client.user.id;
        const collector = akısmoji.createReactionCollector(filter, {
            time: 120000
        });

        collector.on("collect", (reaction, user) => {

            if (!kanal) return message.channel.send("Etiketlediğin kişi bir kanalda bulunmuyor!");

            if (user.id !== gelen.id) return reaction.users.remove(user);

            switch (reaction.emoji.name) {

                case "✔️":
                    guid.member(talibe).voice.setChannel(kanal.id);
                    collector.stop();
                    akısmoji.edit(cagirembed.setDescription(`${talibe} kullanıcısı başarıyla ${gelen} kullanıcısının olduğu **${kanal.name}** isimli kanala taşınmıştır.`).setThumbnail(message.guild.iconURL()));
                    reaction.users.remove(user);
                    break;

                case "❌":
                    collector.stop();
                    reaction.users.remove(user);
                    break;

                default:
                    break;
            }
        });

        collector.on("end", async () => {
            await akısmoji.reactions.removeAll();
        });

    }
}

module.exports = Goto;