const Discord = require("discord.js");
const low = require('lowdb');

module.exports = {

    temel(message) {
        const client = message.client;
        const utiller = low(client.adapterutil);
        const temel = new Discord.MessageEmbed()
            .setColor(utiller.get("embedcolor").value())
            .setAuthor('Tantoony - CALM DOWN')
            .setTimestamp();
        return temel;
    },


}  