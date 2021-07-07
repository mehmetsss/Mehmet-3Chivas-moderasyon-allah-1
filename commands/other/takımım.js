const Command = require("../../../inventory/base/Command");
const low = require('lowdb');
const Discord = require('discord.js');
const teams = require('../../../../../MODELS/team');
const { checkHours, sayi, rain } = require("../../helpers/functionz");
const { stripIndents } = require("common-tags");
const stringTable = require('string-table');
class Banclass extends Command {

    constructor(client) {
        super(client, {
            name: "takımım",
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
        if (!varım) return message.channel.send(`Hiçbir takımda bulunmuyorsun!`);
        const memz = varım.members;
        let docs = [];
        for (let index = 0; index < memz.length; index++) {
            const element = memz[index];
            let fff = message.guild.members.cache.get(element);
            if (fff) {
                fff = fff.displayName;
            } else {
                fff = 'Bilinmiyor';
            };
            const shem = {
                no: index + 1,
                Kullanıcı: fff,
                id: element
            }
            docs.push(shem)
        }
        //console.log(memz
        const embeddoc = stringTable.create(docs, {
            headers: ['no', 'Kullanıcı', 'id']
        });
        const embed = new Discord.MessageEmbed()
        message.channel.send(embed.setTitle(varım._id).setDescription(`\`\`\`md\n${embeddoc}\`\`\``))


    }

}

module.exports = Banclass;