const Discord = require('discord.js');
const Command = require("../../../inventory/base/Command");
const low = require('lowdb');
class Call extends Command {

    constructor(client) {
        super(client, {
            name: "yardım",
            description: "Hmm.sanırım şuan buradasın..",
            usage: "yardım kategori/komut adı",
            examples: ["yardım kayıt", "yardım erkek"],
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
        const prx = this.client.config.prefix;
        const commands = this.client.commands
            .filter(cmd => cmd.conf.enabled)
            .filter(cmd => !cmd.conf.adminOnly)
            .filter(cmd => !cmd.conf.ownerOnly)
            .filter(cmd => !cmd.conf.rootOnly)
            .filter(cmd => !cmd.conf.onTest);
        const emb = new Discord.MessageEmbed();
        const embed = new Discord.MessageEmbed().setFooter("Detaylı bilgi için .yardım <komut adı>");
        const embedfst = new Discord.MessageEmbed()
            .addField(".yardım ceza", "Cezalandırma komutlarını gösterir")
            .addField(".yardım unceza", "Ceza kaldırma komutlarını gösterir")
            .addField(".yardım genel", "Genel komutları gösterir")
            .addField(".yardım kayıt", "Kayıt komutlarını gösterir")
            .addField(".yardım şef", "Yetkilendirme komutlarını gösterir")
            .addField(".yardım yetkile", "Özel komutları gösterir")
            .addField(".yardım rolver", "Rol verme komutlarını gösterir");
        if (!args[0]) return message.channel.send(embedfst);
        let asd = "";
        if (args[0] == "ceza") asd = "Moderasyon";
        if (args[0] == "unceza") asd = "Ceza Kaldırma";
        if (args[0] == "genel") asd = "Genel";
        if (args[0] == "kayıt") asd = "Kayıt İşlem";
        if (args[0] == "şef") asd = "manager";
        let commandi = args[0];
        let cmd = commands.get(commandi) || commands.get(this.client.aliases.get(commandi));
        if (!cmd) {
            if (asd == "") return;
            commands.filter(cmdz => cmdz.conf.dirname == asd).forEach(async (command) => {
                embed.addField(prx + command.help.name, command.help.description, true);
            });
            if (embed.fields.length === 0) return;
            message.channel.send(embed.setTitle(asd.toUpperCase() + " KOMUTLARI"));
        } else {
            let degerrolleri = [];
            await cmd.info.permLvl.forEach(async (ele) => { degerrolleri.push((await roller).get(ele).value()) });
            let allowedroles = [];
            degerrolleri.forEach(async (rolyd) => { allowedroles.push(message.guild.roles.cache.get(rolyd)) });
            if (allowedroles.length === 0) allowedroles = ["\`-Genel Komut-\`"];
            let allias = cmd.info.aliases.join(', ');
            if (cmd.info.aliases.length === 0) allias = ["\`EŞDEĞERİ YOK\`"]
            emb.setDescription(cmd.help.description);
            emb.setTitle(cmd.help.name.toUpperCase() + " Komut Bilgisi");
            emb.addField("Kullanım:", prx + cmd.help.usage);
            emb.addField("Eşdeğerleri:", allias);
            emb.addField("Örnekler:", cmd.help.examples.join('\n'));
            emb.addField("Kullanım:", cmd.help.usage);
            emb.addField("Kategori", cmd.info.category);
            emb.addField("Süresi:", cmd.info.cooldown / 1000 + " Saniye");
            emb.addField("Kullanabilen Roller:", allowedroles.join('\n'));
            message.channel.send(emb);
        }

    }
}

module.exports = Call;