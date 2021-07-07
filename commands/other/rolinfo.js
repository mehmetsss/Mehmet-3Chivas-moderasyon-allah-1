const Command = require("../../../inventory/base/Command");
const low = require('lowdb');

class TagYasakla extends Command {

    constructor(client) {
        super(client, {
            name: "rolinfo",
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
            cooldown: 60000,
            permLvl: [],
            onTest: false,
            rootOnly: false
        });
    }

    async run(client, message, args, data) {

        const roller = await low(this.client.adapterroles);
        const utiller = await low(this.client.adapterutil);

        let sexiboy = message.guild.roles.cache.get(args[0]);

        const saksocular = message.guild.members.cache.filter(saksocu => saksocu.roles.cache.has(args[0]));
        const saksocularxx = message.guild.members.cache.filter(saksocu => saksocu.roles.cache.has(args[0])).filter(ele => ele.user.presence.status !== 'offline');

        /*
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
        */

        //if (ferey0.length > 0) await message.channel.send(ferey0.join(', '));
        //if (ferey1.length > 0) await message.channel.send(ferey1.join(', '));
        //if (ferey2.length > 0) await message.channel.send(ferey2.join(', '));

        let freo = [];
        await sexiboy.members.forEach(ele => {
            freo.push(ele)
        });
        //console.log(freo)

        let i = 0;
        let erey0 = [];
        let erey1 = [];
        let arayım;
        freo.forEach(ele => {
            if (i >= 0) arayım = erey0;
            if (i >= 40) arayım = erey1;
            arayım.push(ele);
            i = i + 1;
        });

        await message.channel.send(`\`\`\`${sexiboy.name} Rolüne Sahip Toplamda ${saksocular.size} Kişi Bulunmaktadır \`\`\``);
        for (let index = 0; index < Math.floor(freo.length / 40); index++) {
            setTimeout(async () => {
                //console.log(index);
                await message.channel.send(`BÖLÜM ${index + 1}:` + freo.slice(index * 40, (index + 1) * 40).join(', '));
            }, 250);

        }
        if (saksocular.size < 40) {
            if (erey0.length > 0) await message.channel.send(erey0.join(', '));
            if (erey1.length > 0) await message.channel.send(erey1.join(', '));
        }


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