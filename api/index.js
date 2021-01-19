var express = require('express');
var r = express.Router();

const tf_trader = require('./sdk/tf/tf_trader');
const TelegramBot = require('node-telegram-bot-api');
const token = '1561164530:AAFiy-Y2GQw1qTwSDi6ZD9oRkcOBjmOdFHc'
const bot = new TelegramBot(token, {polling: true});



bot.on('message', (msg) => {

  const chatId = msg.chat.id;
  if(msg.text== '1'){
      bot.sendMessage(chatId, 'Getting Prediction...');
      
      let sample = [0.9995052, 0.83333333, 0.41935484, 0.125, 0.85];
      tf_trader.tf_predict(sample).then((res)=>{
          console.log(res);
          bot.sendMessage(chatId, `Predicted Open: ${res[0]}`);
          bot.sendMessage(chatId, `Predicted High: ${res[1]}`);
          bot.sendMessage(chatId, `Predicted Close: ${res[2]}`);
          bot.sendMessage(chatId, `Predicted Low: ${res[3]}`);
      });

  }else{
      bot.sendMessage(chatId, 'ERROR!...');
  }
});


async function test(){
    let sample = [0.9995052, 0.83333333, 0.41935484, 0.125, 0.85];
    
    res = await tf_trader.tf_predict(sample);

    console.log(res);
}


module.exports = r;

