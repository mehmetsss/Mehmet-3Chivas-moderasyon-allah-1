const Command = require("../../../inventory/base/Command");
const low = require('lowdb');
const Discord = require('discord.js');
const teams = require('../../../../../MODELS/team');
const { checkHours, sayi, rain } = require("../../helpers/functionz");
const { stripIndents } = require("common-tags");
class Banclass extends Command {

    constructor(client) {
        super(client, {
            name: "ekip",
            description: (language) => language.get(),
            usage: (language) => language.get(),
            examples: (language) => language.get(),
            category: "moderation",
            enabled: true,
            aliases: ["takım"],
            memberPermissions: [],
            botPermissions: [],
            ownerOnly: false,
            adminOnly: false,
            onTest: false,
            permLvl: ["turnuvacı3"],
            cooldown: 60000
        });
    }

    async run(client, message, args, data) {

        const roller = await low(this.client.adapterroles);
        const utiller = await low(this.client.adapterutil);
        const emojis = await low(this.client.adapteremojis);
        const kanallar = await low(this.client.adapterchannels);

        client = this.client;
        let sexiboy;
        var sexiboyzz = message.mentions.members.first();
        if (sexiboyzz) {
            sexiboy = sexiboyzz;
        } else {
            sexiboy = message.guild.members.cache.get(args[0]);
        };
        if (!sexiboy) return;
        const jamaika = await teams.findOne({ members: message.member.user.id });
        if (!jamaika) return message.channel.send("Şuan hiçbir takımda bulunmuyorsun!");
        if (jamaika.members.length > 5) return message.channel.send("Takımın dolu!");
        const varmı = await teams.findOne({ members: sexiboy.user.id });
        if (varmı) return message.channel.send(new Discord.MessageEmbed().setDescription(`${sexiboy} kişisi şuan **${varmı._id}** takımında bulunmakta!`));

        const cagirembed = new Discord.MessageEmbed()
            .setColor('#4b777e')
            .setAuthor(`VALORANT TURNUVASI`, message.guild.owner.user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048 }))
            .setFooter(message.member.displayName, message.member.user.displayAvatarURL())
            .setTimestamp()
            .setDescription(`Sevgili ${sexiboy}, ${message.member} seni **${jamaika._id}** isimli takıma davet ediyor.`)
            .setThumbnail(message.member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))

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

        collector.on("collect", async (reaction, user) => {
            if (user.id !== sexiboy.user.id) return reaction.users.remove(user);

            switch (reaction.emoji.name) {
                case "✔️":
                    await teams.findOneAndUpdate({ _id: jamaika._id }, { $push: { members: sexiboy.user.id } });
                    collector.stop();
                    akısmoji.edit(cagirembed.setDescription(`${sexiboy} kullanıcısı başarıyla **${jamaika._id}** takımına katıldı.`).setThumbnail(message.guild.iconURL()));
                    sexiboy.roles.addd(roller.get("turnuvacı3").value());
                    break;

                case "❌":
                    collector.stop();
                    akısmoji.edit(cagirembed.setDescription(`${sexiboy} isteği reddetti.`).setThumbnail(message.guild.iconURL()));
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

module.exports = Banclass;