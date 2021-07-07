const Command = require("../../../inventory/base/Command");
const Discord = require("discord.js");
const low = require('lowdb');
const { sayi } = require("../../helpers/functionz");
class Banclass extends Command {

    constructor(client) {
        super(client, {
            name: "richisim",
            description: "Booster dostlarım için yaptığım isim değiştirme komutu",
            usage: "zengin isim",
            examples: ["zengin ismail"],
            aliases: ["zengin"],
            permLvl: ["th-booster"],
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

        client = this.client;
        //if (message.member.roles.cache.has((await roller).get("yetkili").value())) return;

        const genelkanal = kanallar.get("genel").value();
        const logkanal = kanallar.get("kayıt").value();

        let asd = args.join(' ');
        //console.log(asd);
        if (!asd) return message.channel.send(embed.setDescription(`${emojis.warn} Bir isim girmelisin`));
        let yaşım = message.member.displayName.split(' | ');
        let yaş = yaşım[yaşım.length - 1];
        let anan = '•';
        if (!sayi(yaş)) return message.channel.send(embed.setDescription(`${emojis.warn} İsminde yaş bulunmamaktadır.`));
        if (message.member.user.username.includes((await utiller).get("tag").value())) {
            anan = (await utiller).get("tag").value();
            message.member.roles.add(roller.get("th-taglı").value());
        };
        await message.member.setNickname(`${anan} ${asd} | ${yaş}`);

        var richyy = new Discord.MessageEmbed()
            .setAuthor("Tantoony was here", message.guild.iconURL())
            .setColor("#170319")
            .setTimestamp()
            .setTitle("Isim Başarıyla Değiştirildi!")
            .setThumbnail(message.member.user.displayAvatarURL())
            .setDescription(`${message.member} kullanıcısının adı başarıyla ${asd} olarak ayarlandı`)
        await message.guild.channels.cache.get((await kanallar).get("cmd-isim").value()).send(richyy);
        await message.react(emojiler.get("tantoony").value().split(':')[2].replace('>', ''));

    }

}

module.exports = Banclass;