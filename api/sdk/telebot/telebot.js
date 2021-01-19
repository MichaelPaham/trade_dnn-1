const TelegramBot = require('node-telegram-bot-api');
const token = '1561164530:AAFiy-Y2GQw1qTwSDi6ZD9oRkcOBjmOdFHc'


const bot = new TelegramBot(token, {polling: true});


bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    console.log(msg.text);

    if(msg.text== '1'){
        bot.sendMessage(chatId, 'Data 1 Received');
    }else{
        bot.sendMessage(chatId, 'Wrong Format');
    }
});

// {
//     message_id: 17,
//     from: {
//       id: 1599833896,
//       is_bot: false,
//       first_name: 'Zendi',
//       last_name: 'Iklima',
//       username: 'zendi_iklima',
//       language_code: 'en'
//     },
//     chat: {
//       id: 1599833896,
//       first_name: 'Zendi',
//       last_name: 'Iklima',
//       username: 'zendi_iklima',
//       type: 'private'
//     },
//     date: 1610766581,
//     text: '1'
//   }
  


module.exports = {
    
}