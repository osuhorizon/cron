const logger = require("../helper/logger")
const { relax, autopilot, v2 } = require("../config")

module.exports = async function(){
    const time = parseFloat(Date.now() / 1000)
    logger.info("Updating Stats")
    logger.info("Updating Performance")
    logger.debug("Grabbing Users")
    
    logger.info("Calculating Performance for Vanilla")
    await calculatePP('users', '')

    if(relax){
        logger.info("Calculating Performance for Relax")
        await calculatePP('rx', '_relax')
    }

    if(autopilot){
        logger.info("Calculating Performance for Autopilot")
        await calculatePP('auto', '_ap')
    }

    if(v2){
        logger.info("Calculating Performance for V2")
        await calculatePP('v2', '_v2')
    }

    async function calculatePP(table, rx){
        const modes = ["std", "taiko", "ctb", "mania"]
        const full = ["Standard", "Taiko", "Catch the Beat", "Mania"]
        for(m in modes){
            logger.debug(`Calculating ${full[m]}`)
            const users = await con.awaitQuery(`SELECT users.id FROM users INNER JOIN ${table}_stats stats ON users.id = stats.id WHERE users.privileges & 1 AND stats.pp_${modes[m]} > 0`)
            logger.info(`Updating ${users.length} users (${table} | ${modes[m]})`)
            for(var i = 0; i < users.length; i++){
                const user = users[i]
                logger.debug(`Updating ${user.id} (${i + 1}/${users.length})`)
                let pp = 0;
                let count = 0;
                let playcount = 0;
                let ranked_score = 0;
                let total_score = 0;
                const scores = await con.awaitQuery(`SELECT s.pp, s.score, s.completed, b.ranked FROM scores${rx} s INNER JOIN beatmaps b ON s.beatmap_md5 = b.beatmap_md5 WHERE s.userid = ${user.id} AND s.play_mode = ${m} ORDER BY s.pp DESC`)
                for(var j = 0; j < scores.length; j++){
                    const score = scores[j]
                    if(score.score < 0){
                        logger.error(`Negative Score: ${score.score} - UID: ${user.id}`)
                        continue
                    }

                    playcount += 1

                    if(!score.completed) continue;
                    if(score.completed == 3 && score.ranked == 2) ranked_score += score.score
                    total_score += score.score

                    if(count >= 500) continue;
                    if(score.completed == 3 && score.ranked == 2) pp += score.pp * Math.pow(0.95, j)
                    count += 1
                }
                con.awaitQuery(`UPDATE ${table}_stats SET total_score_${modes[m]} = ${total_score}, ranked_score_${modes[m]} = ${ranked_score}, playcount_${modes[m]} = ${playcount}, pp_${modes[m]} = ${pp} WHERE id = ${user.id}`)
            }
        }
        logger.debug("Calculated Stats")
    }

    logger.success(`Successfully finished Stats module (${logger.timer(time)}s)`)
}