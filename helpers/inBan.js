const banned = require('../../inventory/models/bans');
module.exports = class {

    constructor(client) {
        this.client = client;
    }

    async give(member, sebep, exe, süre) {
        let system = await banned.findOne({ _id: member.user.id });
        if (!system) {
            try {
                let doggy = await banned({ _id: member.user.id, sebep: sebep, executor: exe.id, created: new Date(), süre: süre });
                await doggy.save();
            } catch (error) {
                if (error.code !== 5904) {
                    throw error;
                }
            }
        };
    };

    async take(member) {
        await banned.deleteOne({ _id: member.user.id });
    };
}  