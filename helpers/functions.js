const request = require('request-promise');
module.exports = {
    checkDays(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let days = Math.floor(diff / 86400000);
        return days + (days == 1 ? " day" : " days") + " ago";
    },
    checkSecs(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let days = Math.floor(diff / 1000);
        return days;
    },
    isListening(client, member) {
        const kanal = member.voice.channel;
        const queue = client.queue.get(member.guild.id);
        if (kanal && queue) {
            if (kanal.members.has(client.user.id)) {
                return true;
            } else return false;
        } else return false;
    },
    isStart(client, member) {
        if (member.user.id === client.user.id) {
            if (client.queue.has(member.guild.id)) {
                return true;
            } else return false;
        } else return false;
    },
    isEnd(client, member) {
        if (member.user.id === client.user.id) {
            if (!client.queue.has(member.guild.id)) {
                return true;
            } else return false;
        } else return false;
    },
    countLevel(xp) {
        let param = xp;
        let sex = Math.floor(param / 1000);
        return sex;
    },
    async getToken() {
        const key = "d05e8613e92940d69b53c9ea215d6ae3";
        const secret = "538a68610261427aadcb592845336d2e";
        const encode = new Buffer(`${key}:${secret}`).toString('base64')
        const opts = {
            method: 'POST',
            url: 'https://accounts.spotify.com/api/token',
            form: {
                grant_type: 'client_credentials'
            },
            headers: {
                'Authorization': `Basic ${encode}`
            },
            json: true
        }
        return Promise.resolve(
            request(opts).then(async (data) => {
    
                return data.access_token
            })
        )
    },
    allah(url) {
        var videoregex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
        var regexpplaylist = /[?&]list=([^#\&\?]+)/;
        var peygamber = url.match(regexpplaylist);
        return peygamber[1];
    }
}