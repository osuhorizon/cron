const { relax, autopilot, v2 } = require('../config.js');
const logger = require('../helper/logger.js');
module.exports = async function(){
    const time = parseFloat(Date.now() / 1000)
    logger.info("Starting Leaderboard module");
    logger.debug("Deleting Keys from Redis")

    if((await redis.keys(`ripple:leaderboard:*`)).length > 0){
        await Promise.all([
            redis.del(await redis.keys('ripple:leaderboard:*')),
            redis.del(await redis.keys('ripple:leaderboard_relax:*')),
            redis.del(await redis.keys('ripple:leaderboard_auto:*')),
            redis.del(await redis.keys('ripple:leaderboard_v2:*'))
        ])
    }

    logger.debug("Deleted Keys from Redis")
    logger.info("Calculating Ranks for Vanilla")
    await calculateRanks('users', '')

    if(relax){
        logger.info("Calculating Ranks for Relax")
        await calculateRanks('rx', '_relax')
    }

    if(autopilot){
        logger.info("Calculating Ranks for Autopilot")
        await calculateRanks('auto', '_auto')
    }

    if(v2){
        logger.info("Calculating Ranks for V2")
        await calculateRanks('v2', '_v2')
    }

    async function calculateRanks(rx, table){
        for(m of ['std', 'taiko', 'ctb', 'mania']){
            logger.debug(`Mode: ${m}`)
            const stats = await con.awaitQuery(`SELECT stats.id, stats.pp_${m}, main.country FROM ${rx}_stats stats LEFT JOIN users ON users.id = stats.id LEFT JOIN users_stats main ON users.id = main.id WHERE stats.pp_${m} > 0 AND users.privileges & 1 ORDER BY pp_${m} DESC`)
            for(var i = 0; i < stats.length; i++){
                redis.zadd(`ripple:leaderboard${table}:${m}`, stats[i][`pp_${m}`], stats[i].id)
                if(stats[i].country != "XX"){
                    redis.zadd(`ripple:leaderboard${table}:${m}:${stats[i].country.toLowerCase()}`, stats[i][`pp_${m}`], stats[i].id)
                }
            }
        }
    }

    logger.success(`Successfully finished Leaderboard module (${logger.timer(time)}s)`)
}