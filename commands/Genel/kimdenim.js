const Command = require("../../../inventory/base/Command");
const Discord = require("discord.js");
const invites = require('../../../../../MODELS/invites');
const { checkDays } = require("../../helpers/functionz");
const low = require('lowdb');

class Confirm extends Command {

    constructor(client) {
        super(client, {
            name: "kimdenim",
            description: "Sizi davet eden kişileri görmek için kullanılır",
            usage: "kimdenim",
            examples: "kimdenim",
            aliases: [],
            permLvl: [],
            cooldown: 3000,
            enabled: true,
            adminOnly: false,
            ownerOnly: false,
            onTest: true,
            rootOnly: false,
            dmCmd: false
        });
    }

    async run(client, message, args, data) {

        const utiller = low(this.client.adapterutil);
        const emojiler = low(this.client.adapteremojis);

        client = this.client;

        let sexiboy;
        var sexiboyzz = message.mentions.members.first();
        if (sexiboyzz) {
            sexiboy = sexiboyzz;
        } else {
            sexiboy = message.guild.members.cache.get(args[0]);
        };
        if (!sexiboy) sexiboy = message.member;
        let dosyacık = 0;
        let davetçi = [];
        message.guild.members.cache.forEach(async (mem) => {
            let systeminv = await invites.findOne({ _id: mem.user.id });
            if (!systeminv) return;
            if (systeminv.get("invites").some(doc => doc.invited === sexiboy.user.id)) {
                let sistem = systeminv.get({ _id: mem.user.id }).find(ss => ss.invited === sexiboy.user.id);
                console.log(sistem)
            }
        });
        /*
        var richyy = new Discord.MessageEmbed()
            .setColor("#000001")
            .setDescription(`${sexiboy} kişisinin toplamda ${dosyacık} daveti bulunmaktadır.\nBu kişilerden ${sunucuda} kadarı hala sunucudadır.`);
        await message.channel.send(richyy);
        await message.react((await emojiler).get("ok").value().split(':')[2].replace('>', ''));
        */

    }

}

module.exports = Confirm;