const cron = require('node-cron');
const database = require('./helper/database');
const { modules } = require('./config');
const logger = require('./helper/logger');
//schedule cron for every day

start = parseFloat(Date.now() / 1000)

async function main(){
    logger.info("Horizon's cron started. Version 1.4.4")
    await database.connect()

    if(modules.stats){
        await require('./modules/stats')();
    }
    if(modules.leaderboard){
        await require('./modules/leaderboard')();
    }
    if(modules.donator){
        await require('./modules/donator')();
    }
    if(modules.badges){
        await require('./modules/badges')();
    }
    if(modules.scores){
        await require('./modules/scores')();
    }
}

main();

cron.schedule('0 0 * * * *', async () => {
    main();
});