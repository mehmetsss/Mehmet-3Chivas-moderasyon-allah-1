const Command = require("../../../inventory/base/Command");
const Discord = require("discord.js");
const low = require('lowdb');
const cmutes = require("../../../../../MODELS/cmutes");
const vmutes = require('../../../../../MODELS/vmutes');
const { sayi } = require("../../helpers/functionz");
const sicil = require('../../../../../MODELS/sicil');

class CmuteClass extends Command {

    constructor(client) {
        super(client, {
            name: "mute",
            description: "Kullanıcıyı kanallardan susturur",
            usage: "mute etiket/id süre sebep",
            examples: ["mute 674565119161794560 5 uyarılmasına rağmen kışkırtma"],
            aliases: [],
            permLvl: ["cmd-cmuter", "cmd-vmuter", "cmd-rhode", "cmd-authority"],
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

        const cmoji = emojis.textchannel;
        const vmoji = emojis.allowedvoice;
        const embeddd = embed.setDescription(`${sexiboy} kullanıcısının metin Kanallarından susturulması için ${cmoji} emojisine,\nSes kanalları için ise ${vmoji} emojisine tıkla!`).setFooter(message.member.displayName);
        try {
            var akismoji = await message.channel.send(embeddd);
            akismoji.react(cmoji.split(':')[2].replace('>', ''));
            akismoji.react(vmoji.split(':')[2].replace('>', ''));
        } catch (error) {
            console.log(error);
        };

        const filter = (reaction, user) => user.id !== message.client.user.id;
        const collector = akismoji.createReactionCollector(filter, {
            time: 120000
        });
        let typeofmute;
        collector.on("collect", (reaction, user) => {
            if (user.id !== message.author.id) return reaction.users.remove(user);
            switch (reaction.emoji.id) {
                case cmoji.split(':')[2].replace('>', ''):
                    collector.stop();
                    typeofmute = cmutes;
                    break;

                case vmoji.split(':')[2].replace('>', ''):
                    collector.stop();
                    typeofmute = vmutes;
                    break;

                default:
                    break;
            }
        });

        collector.on("end", async () => {
            await akismoji.reactions.removeAll();
            if (!typeofmute) return akismoji.edit(embed.setDescription(`${sexiboy} kullanıcısına uygulanacak mute işlemi zaman aşımına uğradı`).setFooter(message.member.displayName));

            let system = await typeofmute.findOne({ _id: sexiboy.user.id });
            if (system) return message.channel.send(`${emojis.question} Belirtilen kullanıcıda zaten mevcut bir mute bulunmaktaadır.`);
            if (!system) {
                try {
                    let sex = typeofmute({ _id: sexiboy.user.id, sebep: sebep, muter: message.author.id, created: new Date(), süre: dakika });
                    await sex.save();
                } catch (error) {
                    if (error.code !== 5904) {
                        throw error;
                    };
                };
            };
            let ttype;
            if (typeofmute === cmutes) {
                ttype = `TempChatMute - ${dakika} dakika`;
                await sexiboy.roles.add((await roller).get("mod-muted").value());
                akismoji.edit(embed.setDescription(`${sexiboy} başarıyla metin kanallarından susturuldu!`).setFooter(message.member.displayName));
                const embedd = embed.setTitle(`Chat Mute Atıldı`).setDescription(`${emojis.cmuted} ${sexiboy} kişisi ${message.member} tarafından metin kanallarında susturuldu`)
                    .addField("Sebep:", sebep, true).addField("Süre", `${dakika} Dakika`, true).setThumbnail(sexiboy.user.displayAvatarURL({ dynamic: true }))
                    .setAuthor(message.member.displayName, message.member.user.displayAvatarURL({ dynamic: true }))
                    .setFooter(`Tantoony Bots`).setTimestamp();
                message.guild.channels.cache.get((await kanallar).get("cmd-cmute").value()).send(embedd);
            };
            if (typeofmute === vmutes) {
                ttype = `TempVoiceMute - ${dakika} dakika`;
                try {
                    await sexiboy.voice.setMute(true, sebep);
                } catch (error) {
                    console.log(error)
                }
                akismoji.edit(embed.setDescription(`${sexiboy} ses kanallarından başarıyla susturuldu`).setFooter(message.member.displayName));
                const embedd = embed.setTitle(`Ses Mute Atıldı`).setDescription(`${emojis.vmuted} ${sexiboy} kişisi ${message.member} tarafından ses kanallarında susturuldu`)
                    .addField("Sebep:", sebep, true).addField("Süre", `${dakika} Dakika`, true).setThumbnail(sexiboy.user.displayAvatarURL({ dynamic: true }))
                    .setAuthor(message.member.displayName, message.member.user.displayAvatarURL({ dynamic: true }))
                    .setFooter(`Tantoony Bots`).setTimestamp();
                message.guild.channels.cache.get((await kanallar).get("cmd-vmute").value()).send(embedd);
            };
            const obje = {
                date: new Date(),
                type: ttype,
                executor: message.member.user.id,
                reason: sebep
            };
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

        });
        this.client.cmdCooldown[message.author.id][this.help.name] = Date.now() + this.info.cooldown;

    }

}

module.exports = CmuteClass;