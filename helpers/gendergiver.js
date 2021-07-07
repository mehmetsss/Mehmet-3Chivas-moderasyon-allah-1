const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const Discord = require("discord.js");
const registries = require("../../../../MODELS/registries");
const namedata = require("../../../../MODELS/nameData");
const dutyreg = require("../../../../MODELS/duty_registry");
const duties = require("../../../../MODELS/userXp");

module.exports = class {

    constructor(client) {
        this.client = client;
    }

    async kız(message, embedx, member, exe) {
        const adapterroles = new FileSync('../../BASE/roller.json');
        const roller = low(adapterroles);
        const adapteremojis = new FileSync('../../BASE/emojiler.json');
        const emojiler = low(adapteremojis);
        const adapterchannels = new FileSync('../../BASE/kanallar.json');
        const kanallar = low(adapterchannels);
        const adapterutil = new FileSync('../../BASE/utiller.json');
        const utiller = low(adapterutil);
        const embed = new Discord.MessageEmbed()
            .setColor("#fbb2b6")
            //.setFooter(member.displayName);
        const edid = embedx.setDescription(`${member} kişisinin cinsiyetini 'kız' olarak ayarlayacağım. Onaylıyor musun? Bu işlem geri alınamaz.`);
        try {
            var onay = await message.edit(edid);
            await onay.react(emojiler.get("verified").value().split(`:`)[2].replace('>', ''));
            await onay.react(emojiler.get("error").value().split(`:`)[2].replace('>', ''));
        } catch (error) {
            console.log(error);
        }
        member = message.guild.members.cache.get(member.user.id);
        const filter = (reaction, user) => user.id !== message.client.user.id;
        const collector = onay.createReactionCollector(filter, {
            time: 30000
        });

        collector.on("collect", async (reaction, user) => {

            if (user.id !== exe.user.id) return reaction.users.remove(user);

            switch (reaction.emoji.id) {

                case emojiler.get("verified").value().split(`:`)[2].replace('>', ''):

                    let ism = member.displayName.split(" ").slice(1).join(" ");
                    let arrs = ism.split(" | ")[1];
                    let isim = ism.split(" | ")[0];

                    await member.roles.add([roller.get("kız").value(), roller.get("kızi").value(), roller.get("member").value(), roller.get("memberi").value()]);
                    await member.roles.remove(roller.get("yeni").value());
                    if (member.user.username.includes((await utiller).get("tag").value())) member.roles.add(roller.get("th-taglı").value());

                    let invarray = [];
                    let dosyacık = 0;
                    let dosya;
                    let systeminv = await registries.findOne({ _id: exe.user.id });
                    const shem = {
                        invited: member.user.id,
                        created: new Date()
                    }
                    invarray.push(shem);
                    if (!systeminv) {
                        try {
                            let sex = await registries({ _id: exe.user.id, registries: invarray });
                            await sex.save();
                        } catch (error) {
                            throw error;
                        }
                        dosya = invarray;
                        dosyacık = 1;
                    } else {
                        dosya = systeminv.get("registries");
                        dosyacık = dosya.length;
                        if (!dosya.some(dos => dos.invited === member.user.id)) {
                            await registries.updateOne({ _id: exe.user.id }, { $push: { registries: shem } });
                            dosyacık = dosya.length + 1;
                        };
                    };
                    let system = await namedata.findOne({ _id: member.user.id });
                    if (!system) {
                        try {
                            let sex = await namedata({ _id: member.user.id, isim: isim, yaş: arrs, sex: "Female", date: new Date() });
                            await sex.save();
                        } catch (error) {
                            throw error;
                        }
                    } else return;
                    let ecrin = await dutyreg.findOne({ _id: exe.user.id });
                    if (ecrin) {
                        if (checkDays(ecrin.created) > ecrin.expiresIn) await dutyreg.deleteOne({ _id: exe.user.id });
                        await dutyreg.updateOne({ _id: exe.user.id }, { $inc: { processx: 1 } });
                        ecrin = await dutyreg.findOne({ _id: exe.user.id });
                        if (ecrin.count === ecrin.processx) await dutyreg.deleteOne({ _id: exe.user.id });
                        const shem = {
                            date: new Date(),
                            type: 'Kayıt',
                            count: ecrin.count
                        };
                        let lewanch = await duties.findOne({ _id: exe.user.id });
                        if (!lewanch) {
                            let laden = [];
                            laden.push(shem);
                            let sex = await lewanch({ _id: exe.user.id, complated: laden });
                            await sex.save();
                        } else {
                            duties.updateOne({ _id: exe.user.id }, { $push: { complated: shem } });
                        };
                    };
                    message.edit(embed.setDescription(`${member} kişisinin kaydı ${exe} tarafından gerçekleştirildi.\nBu kişinin kayıt sayısı: \`${dosyacık}\``));
                    message.guild.channels.cache.get((await kanallar).get("cmd_kayıt").value()).send(new Discord.MessageEmbed()
                        .setDescription(`${member} kişisinin verileri başarıyla işlenmiştir.`).setColor('#fbb2b6')
                        .addField("Cinsiyet:", "Kadın", true).addField("İsim:", isim, true).addField("Yaş", arrs, true));
                    collector.stop()
                    break;

                case emojiler.get("error").value().split(`:`)[2].replace('>', ''):
                    collector.stop();
                    message.edit(embedx.setDescription(`${member} kişisinin kaydı iptal edildi.`));
                    break;

                default:
                    break;
            }
        });

        collector.on("end", async () => {
            await onay.reactions.removeAll();
        });

    };

    async erkek(message, embedx, member, exe) {
        const adapterroles = new FileSync('../../BASE/roller.json');
        const roller = low(adapterroles);
        const adapteremojis = new FileSync('../../BASE/emojiler.json');
        const emojiler = low(adapteremojis);
        const adapterchannels = new FileSync('../../BASE/kanallar.json');
        const kanallar = low(adapterchannels);
        const adapterutil = new FileSync('../../BASE/utiller.json');
        const utiller = low(adapterutil);
        const embed = new Discord.MessageEmbed()
            .setColor("#96e7f4")
            //.setFooter(member.displayName);

        const edid = embedx.setDescription(`${member} kişisinin cinsiyetini 'erkek' olarak ayarlayacağım. Onaylıyor musun? Bu işlem geri alınamaz.`);
        try {
            var onay = await message.edit(edid);
            await onay.react(emojiler.get("verified").value().split(`:`)[2].replace('>', ''));
            await onay.react(emojiler.get("error").value().split(`:`)[2].replace('>', ''));
        } catch (error) {
            console.log(error);
        }


        member = message.guild.members.cache.get(member.user.id);
        const filter = (reaction, user) => user.id !== message.client.user.id;
        const collector = onay.createReactionCollector(filter, {
            time: 30000
        });

        collector.on("collect", async (reaction, user) => {

            if (user.id !== exe.user.id) return reaction.users.remove(user);

            switch (reaction.emoji.id) {

                case emojiler.get("verified").value().split(`:`)[2].replace('>', ''):
                    let ism = member.displayName.split(" ").slice(1).join(" ");
                    let arrs = ism.split(" | ")[1];
                    let isim = ism.split(" | ")[0];

                    await member.roles.add([roller.get("erkek").value(), roller.get("erkeki").value(), roller.get("member").value(), roller.get("memberi").value()]);
                    await member.roles.remove(roller.get("yeni").value());
                    if (member.user.username.includes((await utiller).get("tag").value())) member.roles.add(roller.get("th-taglı").value());

                    let invarray = [];
                    let dosyacık = 0;
                    let dosya;
                    let systeminv = await registries.findOne({ _id: exe.user.id });
                    const shem = {
                        invited: member.user.id,
                        created: new Date()
                    }
                    invarray.push(shem);
                    if (!systeminv) {
                        try {
                            let sex = await registries({ _id: exe.user.id, registries: invarray });
                            await sex.save();
                        } catch (error) {
                            throw error;
                        }
                        dosya = invarray;
                        dosyacık = 1;
                    } else {
                        dosya = systeminv.get("registries");
                        dosyacık = dosya.length;
                        if (!dosya.some(dos => dos.invited === member.user.id)) {
                            await registries.updateOne({ _id: exe.user.id }, { $push: { registries: shem } });
                            dosyacık = dosya.length + 1;
                        };
                    };
                    let system = await namedata.findOne({ _id: member.user.id });
                    if (!system) {
                        try {
                            let sex = await namedata({ _id: member.user.id, isim: isim, yaş: arrs, sex: "Male", date: new Date() });
                            await sex.save();
                        } catch (error) {
                            throw error;
                        }
                    } else return;
                    let ecrin = await dutyreg.findOne({ _id: exe.user.id });
                    if (ecrin) {
                        if (checkDays(ecrin.created) > ecrin.expiresIn) await dutyreg.deleteOne({ _id: exe.user.id });
                        await dutyreg.updateOne({ _id: exe.user.id }, { $inc: { processx: 1 } });
                        ecrin = await dutyreg.findOne({ _id: exe.user.id });
                        if (ecrin.count === ecrin.processx) await dutyreg.deleteOne({ _id: exe.user.id });
                        const shem = {
                            date: new Date(),
                            type: 'Kayıt',
                            count: ecrin.count
                        };
                        let lewanch = await duties.findOne({ _id: exe.user.id });
                        if (!lewanch) {
                            let laden = [];
                            laden.push(shem);
                            let sex = await lewanch({ _id: exe.user.id, complated: laden });
                            await sex.save();
                        } else {
                            duties.updateOne({ _id: exe.user.id }, { $push: { complated: shem } });
                        };
                    };
                    message.edit(embed.setDescription(`${member} kişisinin kaydı ${exe} tarafından gerçekleştirildi.\nBu kişinin kayıt sayısı: \`${dosyacık}\``));
                    message.guild.channels.cache.get((await kanallar).get("cmd_kayıt").value()).send(new Discord.MessageEmbed()
                        .setDescription(`${member} kişisinin verileri başarıyla işlenmiştir.`).setColor('#96e7f4')
                        .addField("Cinsiyet:", "Erkek", true).addField("İsim:", isim, true).addField("Yaş", arrs, true));
                    collector.stop()
                    break;

                case emojiler.get("error").value().split(`:`)[2].replace('>', ''):
                    collector.stop();
                    message.edit(embedx.setDescription(`${member} kişisinin kaydı iptal edildi.`));
                    break;

                default:
                    break;
            }
        });

        collector.on("end", async () => {
            await message.reactions.removeAll();
        });


    }

}  