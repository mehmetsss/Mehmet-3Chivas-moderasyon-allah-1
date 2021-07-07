const Command = require("../../../inventory/base/Command");
const Discord = require("discord.js");
const invites = require('../../../../../MODELS/invites');
const { checkDays, sayi } = require("../../helpers/functionz");
const stringTable = require('string-table');
const low = require('lowdb');

class Confirm extends Command {

    constructor(client) {
        super(client, {
            name: "davetlerim",
            description: "Davet sayısını görmeye yarar",
            usage: "davetlerim",
            examples: ["davetlerim", "davetlerim 674565119161794560"],
            aliases: [],
            permLvl: [],
            cooldown: 3000,
            enabled: true,
            adminOnly: false,
            ownerOnly: false,
            onTest: false,
            rootOnly: false,
            dmCmd: false
        });
    }

    async run(client, message, args, data) {

        const utiller = low(this.client.adapterutil);
        const emojiler = low(this.client.adapteremojis);
        const roller = low(this.client.adapterroles);

        client = this.client;
        let sexiboy;
        var sexiboyzz = message.mentions.members.first();
        if (sexiboyzz) {
            sexiboy = sexiboyzz;
        } else {
            sexiboy = message.guild.members.cache.get(args[0]);
        };
        let asdf = [];
        let döl = args[1];
        if (!sayi(args[1])) döl = 1;
        if (!sexiboy) sexiboy = message.member;
        let dosyacık = 0;
        let systeminv = await invites.findOne({ _id: sexiboy.user.id });
        if (!systeminv) {
            return message.channel.send(new Discord.MessageEmbed().setDescription("Hiçbir Davet Bulunamadı."))
        } else {
            var dosya = systeminv.get("invites");
            dosyacık = dosya.length;
            const scl = systeminv.get("invites")
                .filter(doc => message.guild.members.cache.get(doc.invited))
                .filter(doc => message.guild.members.cache.get(doc.invited).roles.cache.has(roller.get("member").value()))
                .reverse()
                .slice(5 * (döl - 1), 5 * (döl) + 1);
            for (let index = 0; index < scl.length - 1; index++) {
                const element = scl[index];
                let fff = message.guild.members.cache.get(element.invited);
                //console.log(element)
                const shem = {
                    no: index + 1 + 20 * (döl - 1),
                    Kullanıcı: fff.displayName,
                    id: element.invited,
                    tarih: `${checkDays(element.created)} gün önce`
                };
                asdf.push(shem);
            }
        };

        let sunucuda = 0;
        message.guild.members.cache.forEach(mem => {
            if (systeminv.get("invites").some(doc => doc.invited === mem.user.id)) sunucuda = sunucuda + 1;
        });
        const embed = new Discord.MessageEmbed()
        /*
                var richyy = new Discord.MessageEmbed()
                    .setColor("#000001")
                    .setDescription(`${sexiboy} kişisinin toplamda ${dosyacık} daveti bulunmaktadır.\nBu kişilerden ${sunucuda} kadarı hala sunucudadır.`);
                await message.channel.send(richyy);
                await message.react((await emojiler).get("ok").value().split(':')[2].replace('>', ''));
        
        */
        const embeddoc = stringTable.create(asdf, {
            headers: ['no', 'Kullanıcı', 'id', 'tarih']
        });
        message.channel.send(embed
            .setDescription(`${sexiboy} kişisinin toplamda ${dosyacık} daveti bulunmaktadır.\nBu kişilerden ${sunucuda} kadarı hala sunucudadır.\n\`\`\`${embeddoc}\`\`\``)
            .setFooter(`${sexiboy.user.username} | Sayfa ${döl}`).setTitle('DAVET KONTROL'));

    }

}

module.exports = Confirm;