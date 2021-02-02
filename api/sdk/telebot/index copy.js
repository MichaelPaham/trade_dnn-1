var express = require('express');
var r = express.Router();

const tf = require('@tensorflow/tfjs-node');


const tf_sdk = require('./sdk/tf/tf_baseball');

const TelegramBot = require('node-telegram-bot-api');
const token = '1561164530:AAFiy-Y2GQw1qTwSDi6ZD9oRkcOBjmOdFHc'
const bot = new TelegramBot(token, {polling: true});



const TIMEOUT_BETWEEN_EPOCHS_MS = 500;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
    let steps = 1;
    for (var i = 0; i < steps; i++) {
        console.log(`Processing Training iteration : ${i+1} / ${steps} ...`);

        history = await tf_sdk.model.fitDataset(
            tf_sdk.trainingData, 
            {
                epochs: 5,
                verbose: 0
            }
        );
        console.log('accuracyPerClass', await tf_sdk.evaluate(true));
        acc =  history.history['acc'];
        const accAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length;
        console.log('accAvg', accAvg(acc));

        await sleep(TIMEOUT_BETWEEN_EPOCHS_MS);
    }
    predict_sample();
}

async function predict_sample(){
    const sample = [8, -136.4744845, -5, -19, 28.23518923, -18.43483066, 93, 0];
    const pred_res = await tf_sdk.predictSample(sample);
}

run();


bot.on('message', (msg) => {
    console.log(msg);

    const chatId = msg.chat.id;
    if(msg.text== '1'){
        bot.sendMessage(chatId, 'Getting Prediction...');

        const sample = [8, -136.4744845, -5, -19, 28.23518923, -18.43483066, 93, 0];
        tf_sdk.predictSample(sample).then((res)=>{
            bot.sendMessage(chatId, `Predicted: ${res}`);
        });

    }else{
        bot.sendMessage(chatId, 'Type: /help/data');
        bot.sendMessage(chatId, msg.text.split('/')[1]);
    }
});


module.exports = r;





// const  tf_sdk = require("./sdk/tf_js_sdk") 
// r.get("/dnn_service/", tf_sdk.tf_test);

// let tf_predict = tf_sdk.tf_predict;
// new tf_predict(50).then(function(res){
//     console.log(res);
// })

/*
async function run(){
    const loadedModel  = await tf.loadLayersModel('http://localhost:3000/ex_model/model.json');
    console.log(loadedModel)
    const prediction = loadedModel.predict([0.9995052, 0.83333333, 0.41935484, 0.125, 0.85]);
}

r.get('/', function(req, res) {
    res.on('close', async()=>{
        run();
    });

    res.render('index', { title: 'Express' });
});
*/
