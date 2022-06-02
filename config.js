module.exports = {
    database : {
        host : 'localhost',
        user : 'user',
        password : 'password',
        database : 'database'
    },
    modules : {
        //* Recalculates Stats (Ranked & Total Score, Performance, Playcount)
        //! This is the most time consuming module. Depending on how many modes you have and how many users are playing on the server.
        //! Please use this module only when you do pp changes or move scores around.
        stats: true,
        //* Calculates Ranks for Leaderboard
        leaderboard: true, 
        //* Removes expired donator tags
        donator: true, 
        //* Adjusts badges
        //! Only use if you setup privileges and badges yourself
        badges: true, 
        //* Updates Score Counter (Admin Panel)
        scores: true, 
    },
    relax: true,
    autopilot: true,
    v2: true,
    debug: false
}