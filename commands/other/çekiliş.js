const Command = require("../../../inventory/base/Command");
const low = require('lowdb');
const Discord = require('discord.js');
const stats = require('../../../../../MODELS/voicestat');
const { checkHours, sayi, rain } = require("../../helpers/functionz");
const { stripIndents } = require("common-tags");
class Banclass extends Command {

    constructor(client) {
        super(client, {
            name: "çekiliş",
            description: (language) => language.get(),
            usage: (language) => language.get(),
            examples: (language) => language.get(),
            category: "moderation",
            enabled: true,
            aliases: [],
            memberPermissions: [],
            botPermissions: [],
            ownerOnly: false,
            adminOnly: true,
            onTest: true,
            permLvl: [],
            cooldown: 60000
        });
    }

    async run(client, message, args, data) {

        const roller = await low(this.client.adapterroles);
        const utiller = await low(this.client.adapterutil);
        const emojis = await low(this.client.adapteremojis);
        const kanallar = await low(this.client.adapterchannels);

        client = this.client;
        if (!sayi(args[0])) return message.channel.send("Geçerli bir kazanan sayısı gir!");
        if (!sayi(args[1])) return message.channel.send("Geçerli bir aşama gir!")
        let members = [];
        /*
        message.guild.members.cache.filter(m => m.voice).filter(m => m.user.username.includes(utiller.get("tag").value())).forEach(element => {
            members.push(element);
        });
        */

        const embed = new Discord.MessageEmbed()//.setTitle("Çekiliş!!!")
        .setDescription(stripIndents`
        **${args.slice(2).join(' ').replace('taglı', '').replace('sesli', '').toUpperCase()}** Çekilişi

        Kalan süre: **${args[1]} Dakika** 


    `);
        const mesajbir = await message.channel.send(embed);
        mesajbir.react("790698366300454952")
        const filter = (reaction, user) => user.id !== message.client.user.id;
        const collector = mesajbir.createReactionCollector(filter, {
            time: 5 * 60 * 1000
        });
        let i = 1;
        collector.on("collect", async (reaction, user) => {
            if (message.content.includes('sesli') && !message.guild.members.cache.get(user.id).voice.channel) return reaction.users.remove(user);
            if (message.content.includes('taglı') && !user.username.includes(utiller.get("tag").value())) return reaction.users.remove(user);
            if (members.some(m => m.user.id === user.id)) return reaction.users.remove(user);
            if (reaction.emoji.id !== '790698366300454952') return;
            //console.log(user)
            let system = await stats.findOne({ _id: user.id });
            if (system) {
                const loglar = await system.get("logs");
                const data = loglar.filter(d => checkHours(d.int) <= 1).filter(d => d.duration > 6000);
                for (let index = 0; index < data.length; index++) {
                    const element = message.guild.members.cache.get(user.id);
                    members.push(element);
                }
            }
            //console.log(members.length);
        });
        setInterval(async () => {
            if (i / 2 > args[1]) return;
            let nevmem = [];
            members.forEach(mem => {
                let m = message.guild.members.cache.get(mem.user.id);
                if (!m.voice.channel) return;
                nevmem.push(m);
            });
            members = nevmem;
            const embediki = new Discord.MessageEmbed()//.setTitle("Çekiliş!!!")
            .setDescription(stripIndents`
                **${args.slice(2).join(' ').replace('taglı', '').replace('sesli', '').toUpperCase()}** Çekilişi

                ${emojis.get("staries").value()} **Olasılık sayısı**  ${rain(members.length)}

                Kalan süre: **${(args[1] - i / 2)} Dakika** 
            `);
            mesajbir.edit(embediki);
            i = i + 1;
            if (i / 2 > args[1] - args[0]) return message.channel.send(`Tebrikler ${members[Math.floor(Math.random() * members.length)]} KAZANAN SENSİN!\nKazandığın ödül: **${args.slice(2).join(' ').replace('taglı', '').replace('sesli', '')}**`);
        }, 30000);

    }

}

module.exports = Banclass;