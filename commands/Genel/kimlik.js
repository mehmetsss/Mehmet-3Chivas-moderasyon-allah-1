const Discord = require('discord.js');
const Command = require("../../../inventory/base/Command");
const kimlik = require('../../../../../MODELS/nameData');
const low = require('lowdb');
const { stripIndents } = require('common-tags');
class Call extends Command {

    constructor(client) {
        super(client, {
            name: "kimlik",
            description: "Kişinin kimliğini gösterir",
            usage: "kimlik",
            examples: ["kimlik 674565119161794560"],
            aliases: [],
            permLvl: [],
            cooldown: 300000,
            enabled: true,
            adminOnly: false,
            ownerOnly: false,
            onTest: false,
            rootOnly: false,
            dmCmd: false
        });
    }

    async run(client, message, args, data) {

        const roller = low(this.client.adapterroles);
        const kanallar = low(this.client.adapterchannels);
        const utiller = low(this.client.adapterutil);
        const emojiler = await low(this.client.adapteremojis);
        const emojis = emojiler.value()
        const embed = new Discord.MessageEmbed().setColor('#2f3136');
        let sexiboy;
        var sexiboyzz = message.mentions.members.first();
        if (sexiboyzz) {
            sexiboy = sexiboyzz;
        } else {
            sexiboy = message.guild.members.cache.get(args[0]);
        }
        if (!sexiboy) sexiboy = message.member;
        let katılma = 'Bulunamadı';
        let system = await kimlik.findOne({ _id: sexiboy.user.id });
        if (!system) return message.channel.send(embed.setDescription(`Veri Bulunamadı`));
        const Aylar = [
            "Ocak",
            "Şubat",
            "Mart",
            "Nisan",
            "Mayıs",
            "Haziran",
            "Temmuz",
            "Ağustos",
            "Eylül",
            "Ekim",
            "Kasım",
            "Aralık"
        ];
        katılma = `${system.date.getUTCDate()} ${Aylar[system.date.getUTCMonth()]} ${system.date.getUTCFullYear()}`
        let cinsiyet = "Bilinmiyor";
        if (system.sex === 'Male') cinsiyet = 'Erkek';
        if (system.sex === 'Female') cinsiyet = 'Kadın';

        embed.setAuthor("HUB Nüfus Müdürlüğü", message.guild.iconURL());
        embed.setThumbnail(sexiboy.user.displayAvatarURL());
        embed.setTitle("Nüfus Cüzdanı");
        embed.setDescription(
            stripIndents`
            
         ${emojis.hexagon} **ID:** ${sexiboy.user.id}

         ${emojis.hexagon} **Kullanıcı Adı:** ${sexiboy.user.username}

         ${emojis.hexagon} **Adı:** ${system.isim || "Bulunamadı"} **| Yaşı:** ${system.yaş || "Bilinmiyor"}  **|  Cinsiyeti:** ${cinsiyet}

         ${emojis.hexagon} **Hesap Oluşturma Tarihi:** ${sexiboy.user.createdAt.getUTCDate()} ${Aylar[sexiboy.user.createdAt.getUTCMonth()]} ${sexiboy.user.createdAt.getUTCFullYear()}
        
         ${emojis.hexagon} **Katılma Tarihi:** ${sexiboy.joinedAt.getUTCDate()} ${Aylar[sexiboy.joinedAt.getUTCMonth()]} ${sexiboy.joinedAt.getUTCFullYear()}
         
         ${emojis.hexagon} **Kayıt Tarihi:** ${katılma}



        `).setFooter(`* Veri değişikliği talebi için lütfen Tantoony'ye ulaşın <3`, client.owner.displayAvatarURL())


        

        message.channel.send(embed);

    }
}

module.exports = Call;