const mysql = require('mysql-await')
const asyncRedis = require('async-redis')
const { host, user, password, database } = require('../config').database
const logger = require('./logger')

module.exports = {
    connect: async function(){
        logger.debug("Connecting to MySQL")
        con = mysql.createConnection({
            host,
            user,
            password,
            database
        })
        await con.connect()
        logger.debug("Connected to MySQL")

        logger.debug("Connecting to Redis")
        redis = asyncRedis.createClient();
        logger.debug("Connected to Redis")
    }
}