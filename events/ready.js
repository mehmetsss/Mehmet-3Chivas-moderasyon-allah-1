const low = require('lowdb');

module.exports = class {

    constructor(client) {
        this.client = client;
    }

    async run(client) {

        client = this.client;

        const utiller = low(this.client.adapterutil);
        const status = utiller.get("status").value()[0];
        client.commands.forEach(c => console.log(c.help.name))
        client.logger.log(`Loading a total of ${client.commands.size} command(s).`, "load");
        client.logger.log(`${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`, "ready");
        client.channels.cache.get((await utiller).get("lastCrush").value()).send(`__**ÇEVRİMİÇİ**__`);
        client.owner = client.users.cache.get('674565119161794560');

        client.autoUpdateDocs.update(client);

        await client.user.setActivity(status);

        const tokens = [
            process.env.Music1,
            process.env.Music2,
            process.env.Music3
        ];

        for (let index = 0; index < tokens.length; index++) {
            const token = tokens[index];
            client.bots[index].login(token);
            client.bots[index].queue = new Map();
        };
        /*
        client.user.setActivity({
            name: "I'm Back!",
            type: 'LISTENING'
        });

        const version = require("../../package.json").version;
        let i = 0;

        setInterval(function () {
            let toDisplay = status[parseInt(i, 3)].name;
            client.user.setActivity({
                name: toDisplay,
                type: status[parseInt(i, 3)].type
            });
            if (status[parseInt(i + 1, 3)]) i++
            else i = 0;
        }, 10000);
        */


    }
}  