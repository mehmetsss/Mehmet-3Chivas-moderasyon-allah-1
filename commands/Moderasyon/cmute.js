const Command = require("../../../inventory/base/Command");
const Discord = require("discord.js");
const low = require('lowdb');
const cmutes = require("../../../../../MODELS/cmutes");
const { sayi } = require("../../helpers/functionz");
const sicil = require('../../../../../MODELS/sicil');

class CmuteClass extends Command {

    constructor(client) {
        super(client, {
            name: "cmute",
            description: "Kullanıcıyı metin kanallarından susturur",
            usage: "cmute etiket/id süre sebep",
            examples: ["cmute 674565119161794560 5 uyarılmasına rağmen kışkırtma"],
            aliases: ["cm", "chatmute"],
            permLvl: ["cmd-cmuter", "cmd-rhode", "cmd-authority"],
            cooldown: 1000,
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
        let sexiboy = message.mentions.members.first();
        if (!sexiboy) sexiboy = await message.guild.members.cache.get(args[0]);
        if (!sexiboy) return message.channel.send(embed.setDescription(`${emojis.ocured} Kişi bulunamadı.`));
        let dakika = args[1];
        if (!dakika) return message.channel.send(embed.setDescription(`${emojis.countdown} Geçerli bir dakika girmelisin`));
        if (!sayi(dakika)) return message.channel.send(embed.setDescription(`${emojis.countdown} Geçerli bir dakika girmelisin`));
        var sebep = args.slice(2).join(" ");
        if (!sebep) return message.channel.send(embed.setDescription(`${emojis.question} Bir sebep girmelisin`));
        if (message.member.roles.highest.rawPosition <= sexiboy.roles.highest.rawPosition) return message.channel.send(embed.setDescription(`${emojis.warn} Bunu yapmak için yeterli yetkiye sahip değilsin`));
        if (parseInt(dakika) > 100 || parseInt(dakika) < 5) return message.channel.send(`${emojis.countdown} 5 ile 100 arası bir sayı girebilirsin`);
        if (sexiboy.hasPermission("ADMINISTRATOR")) {
            if (message.member.hasPermission("ADMINISTRATOR") && (await utiller).get("kkv").includes(message.member.user.id)) {
                sexiboy.roles.remove(sexiboy.roles.cache.filter(rol => rol.permissions.has("ADMINISTRATOR")));
            } else return message.channel.send(`${emojis.warn} Bunu yapabilmek için yeterli yetkiye sahip değilsin.`);
        };
        let system = await cmutes.findOne({ _id: sexiboy.user.id });
        if (system) return message.channel.send(`${emojis.question} Belirtilen kullanıcıda zaten mevcut bir chat mute bulunmaktaadır.`);
        if (!system) {
            try {
                let sex = cmutes({ _id: sexiboy.user.id, sebep: sebep, muter: message.author.id, created: new Date(), süre: dakika });
                await sex.save();
            } catch (error) {
                if (error.code !== 5904) {
                    throw error;
                };
            };
        };
        message.channel.send(embed.setDescription(`${emojis.cmuted} ${sexiboy} başarıyla metin kanallarında susturuldu`));
        const embedd = embed.setTitle(`Chat Mute Atıldı`).setDescription(`${emojis.cmuted} ${sexiboy} kişisi ${message.member} tarafından metin kanallarında susturuldu`)
            .addField("Sebep:", sebep, true).addField("Süre", `${dakika} Dakika`, true).setThumbnail(sexiboy.user.displayAvatarURL({ dynamic: true }))
            .setAuthor(message.member.displayName, message.member.user.displayAvatarURL({ dynamic: true }))
            .setFooter(`Tantoony Bots`).setTimestamp();
        message.guild.channels.cache.get((await kanallar).get("cmd-cmute").value()).send(embedd);
        const obje = {
            date: new Date(),
            type: `TempChatMute - ${dakika} dakika`,
            executor: message.member.user.id,
            reason: sebep
        }
        let invarray = [];
        let gg = invarray.push(obje);
        let systemm = await sicil.findOne({ _id: sexiboy.user.id });
        if (!systemm) {
            try {
                let doffy = await sicil({ _id: sexiboy.user.id, punishes: gg });
                await doffy.save();
            } catch (error) {
                if (error.code !== 5904) {
                    throw error;
                }
            }
        } else {
            await sicil.updateOne({ _id: sexiboy.user.id }, { $push: { punishes: obje } });
        }
        await sexiboy.roles.add((await roller).get("mod-muted").value());
        message.react(emojiler.get("okred").value().split(':')[2].replace('>', ''));
        this.client.cmdCooldown[message.author.id][this.help.name] = Date.now() + this.info.cooldown;

    }

}

module.exports = CmuteClass;