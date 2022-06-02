const logger = require('../helper/logger')
const privileges = require('../helper/privileges')
module.exports = async function(){
    const time = parseFloat(Date.now() / 1000)
    logger.info("Adjusting Badges")
    const [ tourney, admin, manager, dev, mod, nominator ] = await Promise.all([
        con.awaitQuery(`SELECT * FROM users WHERE privileges = ${privileges.Tournament}`),
        con.awaitQuery(`SELECT * FROM users WHERE privileges = ${privileges.Full}`),
        con.awaitQuery(`SELECT * FROM users WHERE privileges = ${privileges.Manager}`),
        con.awaitQuery(`SELECT * FROM users WHERE privileges = ${privileges.Developer}`),
        con.awaitQuery(`SELECT * FROM users WHERE privileges = ${privileges.Moderator}`),
        con.awaitQuery(`SELECT * FROM users WHERE privileges = ${privileges.Nominator}`)
    ])

    logger.debug("Adding Badges")
    await Promise.all([
        addBadges(tourney, 2),
        addBadges(admin, 4),
        addBadges(manager, 5),
        addBadges(dev, 6),
        addBadges(mod, 8),
        addBadges(nominator, 7),
        removeBadges(privileges.Tournament, 2),
        removeBadges(privileges.Full, 4),
        removeBadges(privileges.Manager, 5),
        removeBadges(privileges.Developer, 6),
        removeBadges(privileges.Moderator, 8),
        removeBadges(privileges.Nominator, 7)
    ])

    async function addBadges(role, badge){
        for(var i = 0; i < role.length; i++) {
            const check = await con.awaitQuery(`SELECT id FROM user_badges WHERE user = ${role[i].id} AND badge = ${badge}`)
            if(check.length > 0) continue
            logger.info(`Adding Badge for ${role[i].username}`)
            await con.awaitQuery(`INSERT INTO user_badges (user, badge) VALUES (${role[i].id}, ${badge})`)
        }
    }

    async function removeBadges(privileges, badge){
        await con.awaitQuery(`DELETE user_badges FROM user_badges LEFT JOIN users ON user_badges.user = users.id WHERE NOT users.privileges = ${privileges} AND user_badges.badge = ${badge}`)
    }

    logger.success(`Successfully finished Badges module (${logger.timer(time)}s)`)
}