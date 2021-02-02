var express = require('express');
var r = express.Router();

const tf_trader = require('./sdk/tf/tf_trader');

const TelegramBot = require('node-telegram-bot-api');
const token = '1561164530:AAFiy-Y2GQw1qTwSDi6ZD9oRkcOBjmOdFHc'
const bot = new TelegramBot(token, {polling: true});

var TinyURL = require('tinyurl');

let baseurl = 'http://localhost:3000';
let prod = true;

if(prod == true){
    baseurl = 'https://tradednn.herokuapp.com';
}

let state = 0;

bot.onText(/\/trade_dnn/, (msg) => {    
    state = 1;
    bot.sendMessage(
        msg.chat.id,
        `Selamat datang di BOT prediksi pola Metatrader menggunakan Deep Neural Network.\nSilahkan pilih menu dibawah ini:\n
        (/1) Prediksi dengan Input (YYYY-MM-DD|HH:mm)\n
        (/2) Live Prediksi Forest Metatrader\n
        (/3) Melihat Riwayat Prediksi 30 menit lalu\n
        (/4) Prediksi dengan Riwayat +- 10 Menit dengan Input (YYYY-MM-DD|HH:mm)\n
        (/5) Batal`
    ); 
    bot.sendMessage(msg.chat.id, "Pilihan Anda: ");    
});

bot.onText(/\/1/, (msg) => {
    state = 2;
    bot.sendMessage(msg.chat.id, "Date Format (YYYY-MM-DD|HH:mm)\ncontoh: 2020-01-31|17:21");   
});
bot.onText(/\/2/, (msg) => {
    state = 3; 
    const d = new Date();
    bot.sendMessage(msg.chat.id, 'Mendapatkan Prediksi \n('+ d + ')'); 
            
    let date_ = [
        d.getFullYear() / 2021, d.getMonth() / 12, d.getDay() / 31,
        d.getHours() / 24, d.getMinutes() / 60
    ];

    tf_trader.tf_predict(date_).then((res)=>{
        bot.sendMessage(
            msg.chat.id, 
            `Predicted Open: ${res[0]}\nPredicted High: ${res[1]}\nPredicted Close: ${res[2]}\nPredicted Low: ${res[3]}`
        );
        bot.sendMessage(msg.chat.id, "kembali ke menu utama ketik/klik /trade_dnn");        
    });       
    
});
bot.onText(/\/3/, (msg) => {
    state = 4;
    const d = new Date();
    bot.sendMessage(msg.chat.id, 'Mendapatkan Riwayat 30 menit yang lalu dari of \n('+ d + ')');

    let link = `${baseurl}/api/prediction/y/2/${d.getFullYear()}/${d.getMonth()}/${d.getDay()}/${d.getHours()}/${d.getMinutes()}`;
    var alias = `trade-dnn-prediction`;
    
    TinyURL.shorten(link).then(function(slink) {
        bot.sendMessage(msg.chat.id, `Silahkan Kunjungi: ${slink}`);

        bot.sendMessage(msg.chat.id, "kembali ke menu utama ketik/klik /trade_dnn");
    }, function(err) {
        console.log(err)
    });  
});
bot.onText(/\/4/, (msg) => {
    state = 5;    
    bot.sendMessage(msg.chat.id, "Prediksi dengan Riwayat +- 10 Menit\nDate Format (YYYY-MM-DD|HH:mm)\ncontoh: 2020-01-31|17:21"); 
});

bot.onText(/\/5/, (msg) => {
    state = 0;
    bot.sendMessage(msg.chat.id, "untuk membuka menu silahkan ketik/klik /trade_dnn");   
});

bot.onText(/\/back/, (msg) => {
    state = 0;
    bot.sendMessage(msg.chat.id, "untuk membuka menu silahkan ketik/klik /trade_dnn");   
});

bot.onText(/\/y/, (msg) => {
    state = 0;
    bot.sendMessage(msg.chat.id, "untuk membuka menu silahkan ketik/klik /trade_dnn");   
});



bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text.toString().toLowerCase();

    if(state == 2){
        const d = text.split('|');
        if(d.length == 2 ){
            d_ = `${d[0]} ${d[1]}`;
            bot.sendMessage(msg.chat.id, `Mendapatkan Prediksi \n(${new Date(d_)})`); 
            
            let date_ = [
                d[0].split('-')[0] / 2021, d[0].split('-')[1] / 12, d[0].split('-')[2] / 31,
                d[1].split(':')[0] / 24, d[1].split(':')[1] / 60
            ];

            tf_trader.tf_predict(date_).then((res)=>{
                bot.sendMessage(
                    msg.chat.id, 
                    `Predicted Open: ${res[0]}\nPredicted High: ${res[1]}\nPredicted Close: ${res[2]}\nPredicted Low: ${res[3]}`
                );
                bot.sendMessage(msg.chat.id, "kembali ke menu utama ketik/klik /trade_dnn");
            });       
            
        }else{
            bot.sendMessage(msg.chat.id, 'Mohon ikuti format (YYYY-MM-DD|HH:mm), contoh: 2020-01-31|17:21'); 
        }
    }else if(state == 5){
        const d = text.split('|');

        if(d.length == 2 ){
            d_ = `${d[0]} ${d[1]}`;
            bot.sendMessage(msg.chat.id, `Mendapatkan Prediksi \n(${new Date(d_)})`); 
            
            let date_ = [
                d[0].split('-')[0] / 2021, d[0].split('-')[1] / 12, d[0].split('-')[2] / 31,
                d[1].split(':')[0] / 24, d[1].split(':')[1] / 60
            ];

            tf_trader.tf_predict(date_).then((res)=>{
                console.log(res);
                bot.sendMessage(
                    msg.chat.id, 
                    `Predicted Open: ${res[0]}\nPredicted High: ${res[1]}\nPredicted Close: ${res[2]}\nPredicted Low: ${res[3]}`
                );
                
                
                let link = `${baseurl}/api/prediction/y/1/${d[0].split('-')[0]}/${d[0].split('-')[1]}/${d[0].split('-')[0]}/${d[1].split(':')[0]}/${d[1].split(':')[1]}`;
                var alias = `trade-dnn-prediction`;
                
                TinyURL.shorten(link).then(function(slink) {
                    bot.sendMessage(msg.chat.id, `Silahkan Kunjungi: ${slink}`);

                    bot.sendMessage(msg.chat.id, "kembali ke menu utama ketik/klik /trade_dnn");
                }, function(err) {
                    console.log(err)
                });
            });       
            state = 1;
        }else{
            bot.sendMessage(msg.chat.id, 'Mohon ikuti format (YYYY-MM-DD|HH:mm), contoh: 2020-01-31|17:21'); 
        }
    }else if(state == 0){
        bot.sendMessage(msg.chat.id, "untuk membuka menu silahkan ketik/klik\n /trade_dnn");   
    }else if(state == 1){
        // bot.sendMessage(msg.chat.id, "kembali kemenu utama (/y)");
    }
    console.log(msg)
});


async function test(){
    let sample = [0.9995052, 0.83333333, 0.41935484, 0.125, 0.85];
    res = await tf_trader.tf_predict(sample);
    console.log(res);
}


/* load page*/
r.get('/prediction/:p/:s/:y/:m/:d/:h/:M', function(req, res, next) {    
    let d = new Date(
        req.params.y, req.params.m, req.params.d, req.params.h, req.params.M
    )
    if(req.params.p == 'y'){
        res.render('predict', {title: "Prediction", state: req.params.s});
    }else{
        tf_trader.pred_json(d, req.params.s).then((jres)=>{
            res.json(jres);
        })
    }    
});


// link = 'http://localhost:3000/api/prediction/y/2020/06/30/07/28';

// TinyURL.shorten(link).then(function(slink) {
//    console.log(slink)
// }, function(err) {
//     console.log(err)
// });


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