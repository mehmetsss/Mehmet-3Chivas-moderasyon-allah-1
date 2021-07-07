const Command = require("../../../inventory/base/Command");
const low = require('lowdb');
const Discord = require('discord.js');
const teams = require('../../../../../MODELS/team');
const { checkHours, sayi, rain } = require("../../helpers/functionz");
const { stripIndents } = require("common-tags");
class Banclass extends Command {

    constructor(client) {
        super(client, {
            name: "ekipaç",
            description: (language) => language.get(),
            usage: (language) => language.get(),
            examples: (language) => language.get(),
            category: "moderation",
            enabled: true,
            aliases: ["takımaç"],
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

        const varım = await teams.findOne({ members: message.member.user.id });
        if (varım) return message.channel.send(`sen zaten **${varım._id}** takımına üyesin!`);
        const name = args.join(" ");
        if (name.length < 2) return message.channel.send('OLmaz abi öyle şey')
        const system = await teams.findOne({ _id: name });
        if (system) return message.channel.send("Lütfen özgün bir isim seç!");
        let asdf = [];
        asdf.push(message.member.user.id);
        try {
            const sex = await teams({ _id: name, members: asdf });
            await sex.save();
            message.channel.send("Takımınız başarıyla oluşturuldu!");
        } catch (error) {
            console.log(error)
        }



    }

}

module.exports = Banclass;