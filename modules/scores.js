const { relax, autopilot, v2 } = require('../config');
const logger = require('../helper/logger');
module.exports = async function(){
    const time = parseFloat(Date.now() / 1000)
    logger.info("Updating submitted scores")
    let total = 0;

    logger.info("Updating Vanilla")
    const scores = await con.awaitQuery(`SELECT COUNT(id) count FROM scores`)
    redis.set("ripple:submitted_scores", scores[0].count)

    total += scores[0].count

    if(relax){
        logger.info("Updating Relax")
        const scores_relax = await con.awaitQuery(`SELECT COUNT(id) count FROM scores_relax`)
        total += scores[0].count
        await redis.set("ripple:submitted_scores_relax", scores_relax[0].count)
    }

    if(autopilot){
        logger.info("Updating Autopilot")
        const scores_auto = await con.awaitQuery(`SELECT COUNT(id) count FROM scores_ap`)
        total += scores[0].count
        await redis.set("ripple:submitted_scores_auto", scores_auto[0].count)
    }

    if(v2){
        logger.info("Updating V2")
        const scores_v2 = await con.awaitQuery(`SELECT COUNT(id) count FROM scores_v2`)
        total += scores[0].count
        await redis.set("ripple:submitted_scores_v2", scores_v2[0].count)
    }

    redis.set("ripple:submitted_scores_total", total)
    
    logger.success(`Successfully finished Scores module (${logger.timer(time)}s)`)
}