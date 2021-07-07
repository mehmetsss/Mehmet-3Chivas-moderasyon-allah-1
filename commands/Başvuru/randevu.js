const Command = require("../../../inventory/base/Command");
const Discord = require("discord.js");
const low = require('lowdb');

class MoveClass extends Command {

    constructor(client) {
        super(client, {
            name: "randevu",
            description: "Terapi için randevu alır",
            usage: "randevu",
            examples: ["unban 674565119161794560"],
            aliases: [],
            cooldown: 120000,
            enabled: true,
            adminOnly: false,
            ownerOnly: false,
            onTest: false,
            rootOnly: false,
            dmCmd: false
        });
    }

    async run(client, message, args, data) {
        
        const roller = await low(this.client.adapterroles);
        const kanallar = await low(this.client.adapterchannels);

        const kanalakıs = message.guild.channels.cache.get(kanallar.get("randevular").value());
        const kanallog = message.guild.channels.cache.get(kanallar.get("terapilog").value());
        const kanalran = message.guild.channels.cache.get(kanallar.get("terapibek").value());

        let yetki = message.guild.roles.cache.get(roller.get("mod-terapist").value());
        let yetkili = message.guild.roles.cache.get(roller.get("mod-cterapist").value());

        if (message.channel.id !== kanalran.id) {
            return;
        };

        const erkek = [
            "erkek"
        ];
        const kız = [
            "kız",
            "kadın",
            "bayan"
        ];
        const trial = [
            "tri",
            "trial"
        ];

        const akısembed = new Discord.MessageEmbed()
            .setColor('#814ca0')
            .setTitle('Yeni Randevu Talebi')
            .setAuthor('Sierra Terapist Ekibi')
            .setDescription(`${message.member} terapi için sizi bekliyor`)
            .setThumbnail(`${message.member.user.displayAvatarURL()}`)
            .setTimestamp()
            .setFooter(`Kabul etmek için lütfen emojiye tıklayın`)

        if (erkek.some(word => message.content.toLowerCase().includes(word))) {
            akısembed.addField('Ek istek', 'Erkek Terapist', true);
        }
        if (kız.some(word => message.content.toLowerCase().includes(word))) {
            akısembed.addField('Ek istek', 'Kadın Terapist', true);
        }
        if (trial.some(word => message.content.toLowerCase().includes(word))) {
            akısembed.addField('Ek istek', 'Trial Terapist', true);
        }

        const onayembed = new Discord.MessageEmbed()
            .setColor('#814ca0')
            .setTitle('Talep Başarıyla Onaylandı')
            .setAuthor('Sierra Terapist Ekibi')
            .setDescription(`${message.member} kişisinin talebi onaylandı`)
            .setTimestamp()
            .setFooter(`Teşekkürler Sierra `)

        message.channel.send(`Talebiniz alınmıştır, değerli ${message.member}. Talebiniz 2 saat içinde onaylanırsa sizi etiketleyeceğim. Lütfen o zamana kadar sakince bekleyin.`);

        try {

            var akısmoji = await kanalakıs.send(akısembed);

            kanalakıs.send(`${yetki} ${yetkili}`).then(
                msg => msg.delete({ timeout: 1000 })
            );

            await akısmoji.react("✔️");
        } catch (error) {
            console.error(error);
        }
        const filter = (reaction, user) => user.id !== message.client.user.id;
        const collector = akısmoji.createReactionCollector(filter, {
            time: 7200000
        });

        collector.on("collect", (reaction, user) => {

            switch (reaction.emoji.name) {
                case "✔️":
                    onayembed.setThumbnail(`${user.avatarURL()}`)
                    onayembed.addField(`Onaylayan Terapist`, `${user}`, true)
                    kanallog.send(onayembed).then(
                        kanalran.send(
                            `Talebiniz ${user} tarafından onaylanmıştır değerli ${message.member}. Lütfen bekleme odasına geçiniz.`
                        )
                    ).catch(console.error);
                    collector.stop();
                    reaction.users.remove(user);
                    break;

                default:
                    break;
            }
        });

        collector.on("end", () => {
            akısmoji.reactions.removeAll();
            akısmoji.delete({ timeout: 5000 });
        });
    
    }

}

module.exports = MoveClass;