const { debug } = require('../config')
module.exports = {
    timer : function(time){
        return ((Date.now() / 1000) - time).toFixed(2)
    },
    info : async function(message){
        this.message(94, message)
    },
    error : async function(message){
        this.message(91, message)
    },
    success : async function(message){
        this.message(92, message)
    },
    warn : async function(message){
        this.message(93, message)
    },
    debug : async function(message){
        if(debug){
            this.message(96, message)
        }
    },
    message : async function(color, message){
        console.log(`\x1b[${color}m${this.timer(start)}s\t| ${message}\x1b[0m`)
    }
}