const Command = require("../../../inventory/base/Command");
const low = require('lowdb');

class TagYasakla extends Command {

    constructor(client) {
        super(client, {
            name: "onlineinfo",
            description: (language) => language.get(),
            usage: (language) => language.get(),
            examples: (language) => language.get(),
            category: "moderation",
            enabled: false,
            aliases: [],
            memberPermissions: [],
            botPermissions: [],
            ownerOnly: false,
            adminOnly: true,
            cooldown: 60000,
            permLvl: ["roltaç"]
        });
    }

    async run(client, message, args, data) {

        const roller = await low(this.client.adapterroles);
        const utiller = await low(this.client.adapterutil);

        if (!message.member.roles.cache.has(roller.get("root").value())) {
            if (!message.member.roles.cache.has(roller.get("roltaç").value())) {

                if (!utiller.get("kkv").value().some(idz => message.member.user.id === idz)) return;
            }
        }

        let sexiboy = message.guild.roles.cache.get(args[0]);

        const saksocular = message.guild.members.cache.filter(saksocu => saksocu.roles.cache.has(args[0]));
        const saksocularxx = message.guild.members.cache.filter(saksocu => saksocu.roles.cache.has(args[0])).filter(ele => ele.user.presence.status !== 'offline');

        let freoo = [];
        await sexiboy.members.forEach(ele => {
            if (ele.user.presence.status !== 'offline') {
                freoo.push(ele)
            };
        });
        console.log(freoo)
        console.log(freoo.length)
        console.log(Math.floor(freoo.length / 20))

        
        let a = 0;
        let ferey0 = [];
        let ferey1 = [];
        let ferey2 = [];
        let farayım;
        freoo.forEach(ele => {
            if (a >= 0) farayım = ferey0;
            if (a >= 40) farayım = ferey1;
            if (a >= 80) farayım = ferey2;
            farayım.push(ele);
            a = a + 1;
        });
        
        await message.channel.send(`\`\`\`${sexiboy.name} Rolüne Sahip Online Olan ${saksocularxx.size} Kişi Bulunmaktadır \`\`\``)
        /////////vvvvvvvvvvvvvvvvvvvvvvv
        for (let index = 0; index < Math.floor(freoo.length / 40); index++) {
            setTimeout(async () => {
                console.log(index);
                await message.channel.send(`BÖLÜM ${index + 1}:` + freoo.slice(index * 40, (index + 1) * 40).join(', '));
            }, 250);

        }
        if (saksocularxx.size < 40) {
            if (ferey0.length > 0) await message.channel.send(ferey0.join(', '));
            if (ferey1.length > 0) await message.channel.send(ferey1.join(', '));
            if (ferey2.length > 0) await message.channel.send(ferey2.join(', '));
        }
        /*
        let i = 0;
        let erey0 = [];
        let erey1 = [];
        let erey2 = [];
        let erey3 = [];
        let erey4 = [];
        let erey5 = [];
        let arayım;
        freo.forEach(ele => {
            if (i >= 0) arayım = erey0;
            if (i >= 40) arayım = erey1;
            if (i >= 80) arayım = erey2;
            if (i >= 120) arayım = erey3;
            if (i >= 160) arayım = erey4;
            if (i >= 200) arayım = erey5;
            arayım.push(ele);
            i = i + 1;
        });
        */
      
        await message.react("759237437091217448");


        /*
         let goy = [];
         await message.channel.send(`\`\`\`${sexiboy.name} Rolüne Sahip Toplamda ${saksocular.size} Kişi Bulunmaktadır \`\`\``);
         freo.forEach(async (sok) => {
             goy.push(sok);
             if (goy.length === 20) {
                 await message.channel.send(goy.join(', '));
                 goy = [];
             }
         });
         */


    }

}

module.exports = TagYasakla;