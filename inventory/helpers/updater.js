/* THIS CHECK IF THE DOCS NEED TO BE UPDATED */

module.exports = {
    
    /**
     * Update the doc
     * @param {object} client The Discord Client instance
     */
    update(client){
        let table = require("markdown-table");
        let commands = client.commands;
        let categories = [];
        commands.forEach((cmd) => {
            if(!categories.includes(cmd.help.category)){
                categories.push(cmd.help.category);
            }
        });
       
        categories.sort(function(a, b){
            let aCmdsLength = commands.filter((cmd) => cmd.help.category === a).array().length;
            let bCmdsLength = commands.filter((cmd) => cmd.help.category === b).array().length;
            if(aCmdsLength > bCmdsLength){
                return -1;
            } else {
                return 1;
            }
        }).forEach((cat) => {
            let arrCat = [
                [ "Name", "Description", "Usage", "Cooldown" ]
            ];
            let cmds = commands.filter((cmd) => cmd.help.category === cat).array();
            cmds.sort(function(a, b){
                if(a.help.name < b.help.name) {
                    return -1;
                } else {
                    return 1;
                }
            }).forEach((cmd) => {
                arrCat.push([
                    `**${cmd.help.name}**`,
                    Math.ceil(cmd.conf.cooldown/1000)+" saniye"
                ]);
            });
        });
        let fs = require("fs");
        client.logger.log("Dosyalar güncellendi!");
    }

};