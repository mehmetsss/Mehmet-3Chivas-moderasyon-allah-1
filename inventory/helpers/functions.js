const Discord = require("discord.js");

module.exports = {

    rain(sayi) {
        var basamakbir = sayi.toString().replace(/ /g, "     ");
        var basamakiki = basamakbir.match(/([0-9])/g);
        basamakbir = basamakbir.replace(/([a-zA-Z])/g, "bilinmiyor").toLowerCase();
        if (basamakiki) {
            basamakbir = basamakbir.replace(/([0-9])/g, d => {
                return {
                    "1": "<a:sayicik_1:730037608712765562>",
                    "2": "<a:sayicik_2:730037602710716477>",
                    "3": "<a:sayicik_3:730037595731525673>",
                    "4": "<a:sayicik_4:730037589834334262>",
                    "5": "<a:sayicik_5:730037584025092097>",
                    "6": "<a:sayicik_6:730037578560176138>",
                    "7": "<a:sayicik_7:730037572461527120>",
                    "8": "<a:sayicik_8:730037567285624853>",
                    "9": "<a:sayicik_9:730037560331730975>",
                    "0": "<a:sayicik_0:730037613666500689>",
                }[d];
            });
        }
    
        return basamakbir;
    
    },

    /**
     * Gets the users data
     * @param {object} client The discord client
     * @param {array} users The users to gets data
     * @returns The users data
     */
    async getUsersData(client, users){
        return new Promise(async function(resolve, reject){
            let usersData = [];
            for(let u of users){
                let result = await client.usersData.find({id: u.id});
                if(result[0]){
                    usersData.push(result[0]);
                } else {
                    let user = new client.usersData({
                        id: u.id
                    });
                    await user.save();
                    usersData.push(user);
                }
            }
            resolve(usersData);
        });
    },

    /**
     * Gets message prefix
     * @param {object} message The Discord message
     * @returns The prefix
     */
    getPrefix(message, data){
        if(message.channel.type !== "dm"){
            const prefixes = [
                `<@${message.client.user.id}>`,
                data.config.botname,
                data.guild.prefix
            ];
            let prefix = null;
            prefixes.forEach((p) => {
                if(message.content.startsWith(p)){
                    prefix = p;
                }
            });
            return prefix;
        } else {
            return true;
        }
    },

    // This function return a valid link to the support server
    async supportLink(client){
        return new Promise(async function(resolve, reject) {
            let guild = client.guilds.get(client.config.support.id);
            let member = guild.me;
            let channel = guild.channels.find((ch) => ch.permissionsFor(member.id).has("CREATE_INSTANT_INVITE"));
            if(channel){
                let invite = await channel.createInvite({maxAge :0}).catch((err) => {});
                resolve(invite ? invite.url : null);
            } else {
                resolve("https://atlanta-bot.fr");
            }
        });
    },

    // This function sort an array 
    sortByKey(array, key) {
        return array.sort(function(a, b) {
            let x = a[key];
            let y = b[key];
            return ((x < y) ? 1 : ((x > y) ? -1 : 0));
        });
    },

    // This function return a shuffled array
    shuffle(pArray) {
        let array = [];
        pArray.forEach(element => array.push(element));
        let currentIndex = array.length, temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    },

    // This function return a random number between min and max
    randomNum(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
};

