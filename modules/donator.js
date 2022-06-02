const logger = require('../helper/logger')
module.exports = async function(){
    const time = parseFloat(Date.now() / 1000)
    logger.info("Adjusting donator perks")

    logger.debug("Adjusting perks")
    await Promise.all([
        con.awaitQuery(`UPDATE users SET donor_expire = donor_expire + ${604800 * 4} WHERE privileges & 8 AND donor_expire < ${Math.floor(Date.now() / 1000) + 604800}`),
        con.awaitQuery(`UPDATE users SET donor_expire = 0 WHERE NOT privileges & 8 AND NOT privileges & 4`),
        con.awaitQuery(`UPDATE users SET privileges = privileges - 4 WHERE id > 999 AND privileges & 4 AND donor_expire < ${Math.floor(Date.now() / 1000)}`),
        con.awaitQuery(`UPDATE users SET privileges = privileges + 4 WHERE id > 999 AND NOT privileges & 4 AND donor_expire > ${Math.floor(Date.now() / 1000)}`),
        con.awaitQuery(`DELETE user_badges FROM user_badges INNER JOIN users ON user_badges.user = users.id WHERE user_badges.badge = 31 AND users.privileges & 4 AND users.donor_expire <= ${Math.floor(Date.now() / 1000)}`),
        con.awaitQuery(`UPDATE users_stats stats INNER JOIN users ON stats.id = users.id SET stats.can_custom_badge = 1 WHERE users.id > 999 AND users.privileges & 4 AND users.donor_expire <= ${Math.floor(Date.now() / 1000)}`)
    ])
    logger.debug("Adjusted perks")

    logger.info("Adding remaining donator perks")
    logger.debug("Checking for remaining Donator Badges")
    var users = await con.awaitQuery(`SELECT id, username FROM users WHERE id > 999 AND privileges & 4`)
    for(var i = 0; i < users.length; i++){
        const check = await con.awaitQuery(`SELECT id FROM user_badges WHERE user = ${users[i].id} AND badge = 31`)
        if(check.length > 0) continue
        logger.info("Adding Badge for " + users[i].username)
        await con.awaitQuery(`INSERT INTO user_badges (user, badge) VALUES (${users[i].id}, 31)`)
    }
    logger.debug("Added badges to Donator")
    logger.success(`Successfully finished Donator module (${logger.timer(time)}s)`)
}