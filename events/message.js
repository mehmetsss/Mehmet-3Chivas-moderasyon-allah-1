const Discord = require("discord.js");
const low = require('lowdb');

module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run(message) {
        
        const data = {};
        const client = this.client;
        data.config = client.config;
        data.low = {
            utiller: await low(client.adapterutil),
            roller: await low(client.adapterroles),
            emojiler: await low(client.adapteremojis),
            kanallar: await low(client.adapterchannels)
        };

        //if (message.guild && !message.member) await message.guild.members.fetch(message.author.id);
        if (message.author.bot) return;

        if (!message.content.startsWith(client.config.prefix)) return;

        let command = message.content.split(' ')[0].slice(client.config.prefix.length);
        let cmd;
        let args = message.content.split(' ').slice(1);

        if (client.commands.has(command)) {
            cmd = client.commands.get(command);
        } else if (client.aliases.has(command)) {
            cmd = client.commands.get(client.aliases.get(command));
        }

        const embed = new Discord.MessageEmbed().setColor('#2f3136')

        if (!cmd) return;
        if (!cmd.conf.enabled) return message.channel.send(embed.setDescription(`${data.low.emojiler.get("error").value()} Komut devredışı!`));
        if (cmd.conf.dmCmd && (message.channel.type !== 'dm')) return message.channel.send(embed.setDescription(`${data.low.emojiler.get("textchannel").value()} Bu komut bir DM komutudur!`));
        if (cmd.conf.adminOnly && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription(`${data.low.emojiler.get("admin").value()} Bu komutu sadece yöneticiler kullanabilir!`));
        if (cmd.conf.ownerOnly && !data.low.utiller.get("yardımcılar").value().includes(message.author.id)) return message.channel.send(embed.setDescription(`${data.low.emojiler.get("root").value()} Bu komutu sadece yardımcılar kullanabbliir!`));
        if (cmd.conf.onTest && !data.low.utiller.get("testers").value().includes(message.author.id)) return message.channel.send(embed.setDescription(`${data.low.emojiler.get("testing").value()} Bu komut henüz test aşamasındadır!`));
        if (cmd.conf.kkvOnly && !(data.low.utiller.get("kkv").value().includes(message.author.id))) return message.channel.send(embed.setDescription(`${data.low.emojiler.get("staff").value()} Bu komutu kullanmak için iznin yok!`));
        if (cmd.conf.rootOnly && (message.author.id !== client.owner.id)) return message.channel.send(embed.setDescription(`${data.low.emojiler.get("tantoony").value()} Bu komutu sadece ${this.client.owner} kullanabilir!`));
        if (cmd.info.cmdChannel && (message.channel.id !== data.low.kanallar.get(cmd.info.cmdChannel).value()) && !message.member.roles.cache.has(data.low.roller.get("roltaç").value())) return;
        if (message.guild && !cmd.conf.dmCmd) {

            const requiredroles = cmd.info.permLvl || [];
            let degerrolleri = [];

            let allowedroles = [];
            await requiredroles.forEach(async (rolyd) => {
                let rolson = message.guild.roles.cache.get(data.low.roller.get(rolyd).value());
                allowedroles.push(rolson);
            });

            let sıralıroller = allowedroles.join(`\n`);
            let deyim = `Bu komutu kullanabilmek için ${allowedroles[0]} rolüne sahip olmalısın..`;
            if (allowedroles.length > 1) deyim = `Bu komutu kullanabilmek için aşağıdaki rollerden birine sahip olmalısın:\n${sıralıroller}`;

            var embeduyari = new Discord.MessageEmbed()
                .setAuthor("Tantoony Seni Önemsiyor <3", data.low.utiller.get("tantoony").value())
                .setColor('#2f3136')
                .setDescription(deyim)
                .setFooter("Abi valla çok önemsiyorum bak <333", data.low.utiller.get("tantoony").value())

            if ((allowedroles.length >= 1) && !allowedroles.some(rolson => message.member.roles.cache.has(rolson.id))) {
                if (!message.member.hasPermission("ADMINISTRATOR")) {
                    if (message.author.id !== client.config.owner.id) return message.channel.send(embeduyari);
                };
            };
        };

        let uCooldown = client.cmdCooldown[message.author.id];
        if (!uCooldown) {
            client.cmdCooldown[message.author.id] = {};
            uCooldown = client.cmdCooldown[message.author.id];
        };
        let time = uCooldown[cmd.help.name] || 0;
        if (time && (time > Date.now())) return message.channel.send(`${data.low.emojiler.get("error").value()} | **${Math.ceil((time - Date.now()) / 1000)}** saniye beklemelisin!`);

        client.logger.log(`[(${message.author.id})] ${message.author.username} ran command [${cmd.help.name}]`, "cmd");

        try {
            cmd.run(client, message, args, data);
        } catch (e) {
            console.log(e);
            return message.channel.send(`${data.low.emojiler.get("error").value()} | Sanırım bir hata oluştu...`);
        }


    }
};