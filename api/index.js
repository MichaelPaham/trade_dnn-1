var express = require('express');
var r = express.Router();

const tf_trader = require('./sdk/tf/tf_trader');

const TelegramBot = require('node-telegram-bot-api');
const token = '1561164530:AAFiy-Y2GQw1qTwSDi6ZD9oRkcOBjmOdFHc'
const bot = new TelegramBot(token, {polling: true});

let state = 0;

bot.onText(/\/trade_dnn/, (msg) => {
    state = 1;
    bot.sendMessage(msg.chat.id, 'type /predict to generate prediction +-3 hour');
    bot.sendMessage(msg.chat.id, 'type /history to see the history 5 hour ago');
        
});

bot.onText(/\/help/, (msg) => {
    state = 2;
    bot.sendMessage(msg.chat.id, "Type /trade_dnn");      
});

bot.onText(/\/predict/, (msg) => {
    state = 3;
    bot.sendMessage(msg.chat.id, "Type /date");     
});

bot.onText(/\/date/, (msg) => {
    state = 5;
    bot.sendMessage(msg.chat.id, "Input Date (dd/mm/yy-hh:MM)");      
});

bot.onText(/\/history/, (msg) => {
    state = 4;
    bot.sendMessage(msg.chat.id, "History trade_dnn");      
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text.toString().toLowerCase();
    
    if(state == 5){
        const d = text.split('-');
        bot.sendMessage(msg.chat.id, 'Getting Prediction of ('+ text + ')'); 
        let sample = [
            d[0].split('/')[2] / 2021, d[0].split('/')[1] / 12, d[0].split('/')[0] / 31,
            d[1].split(':')[0] / 24, d[1].split(':')[1] / 60
        ];
        tf_trader.tf_predict(sample).then((res)=>{
            console.log(res);
            bot.sendMessage(msg.chat.id, `Predicted Open: ${res[0]}`);
            bot.sendMessage(msg.chat.id, `Predicted High: ${res[1]}`);
            bot.sendMessage(msg.chat.id, `Predicted Close: ${res[2]}`);
            bot.sendMessage(msg.chat.id, `Predicted Low: ${res[3]}`);
        });
        // https://sweetcode.io/nodejs-highcharts-sweetcode/
    }else if(state == 4){
        bot.sendMessage(msg.chat.id, "Getting History 10 Minutes Ago"); 
    }else if(state == 0 || state == 2){
        bot.sendMessage(msg.chat.id, "Type /trade_dnn"); 
    }
});




async function test(){
    let sample = [0.9995052, 0.83333333, 0.41935484, 0.125, 0.85];
    
    res = await tf_trader.tf_predict(sample);

    console.log(res);
}
// test();

module.exports = r;




















// https://github.com/hosein2398/node-telegram-bot-api-tutorial
// https://github.com/vito2005/chatManagerTelegramBot
// https://github.com/yagop/node-telegram-bot-api/blob/master/examples/polling.js


// var plt = require('nodeplotlib');
// const data = [{
//     x: [ 1, 3, 4, 6, 7],
//     y: [ 2, 4, 6, 8, 9],
//     type: 'scatter'
// }];
// console.log(plt.plot(data))