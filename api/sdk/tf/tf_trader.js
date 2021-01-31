const tf = require('@tensorflow/tfjs-node');
var moment = require("moment");
const luxon = require("luxon");

async function tf_predict(dt){
    try{
        const path = 'https://raw.githubusercontent.com/zendi014/trade_dnn/main/public/ex_model/model.json';
        const model = await tf.loadGraphModel(path);
        
        sample = tf.tensor2d(dt, [1, 5]);
        predict = model.predict(
          sample
        );
        
        return predict.dataSync();

        // console.log(predict.dataSync());
        //https://stackoverflow.com/questions/59957714/get-value-of-tensorflow-js-model-predict-into-a-variable
    }catch(e){
      console.log(e);
    } 
}

async function pred_json(dt){
  try{
      const path = 'https://raw.githubusercontent.com/zendi014/trade_dnn/main/public/ex_model/model.json';
      const model = await tf.loadGraphModel(path);

      let idx = 10;
      let json_data = []
      
      let pred_date = moment(dt, 'YYYY/MM/DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
      
      for(i=0; i<=idx; i++){
          pdate1 = moment(pred_date).add(i, 'minutes').format('YYYY-MM-DD HH:mm'); 
          sample = tf.tensor2d(
            [
              moment(pdate1).year() / 2021, 
              moment(pdate1).month() / 12, 
              moment(pdate1).day() / 31,
              moment(pdate1).hour() / 24, 
              moment(pdate1).minutes() / 60
            ], 
            [1, 5]
        );
        predict = model.predict(
          sample
        );
        json_data.push({
          "date": luxon.DateTime.fromRFC2822(pdate1).ts, //pdate1,
          "trade_data":predict.dataSync()
        });
      }


      for(i= (-idx); i<=0; i++){
          pdate2 = moment(pred_date).add(i, 'minutes').format('YYYY-MM-DD HH:mm'); 
          sample = tf.tensor2d(
            [
              moment(pdate2).year() / 2021, 
              moment(pdate2).month() / 12, 
              moment(pdate2).day() / 31,
              moment(pdate2).hour() / 24, 
              moment(pdate2).minutes() / 60
            ], 
            [1, 5]
        );
        predict = model.predict(
          sample
        );
        json_data.push({
          "date": luxon.DateTime.fromRFC2822(pdate2).ts, //pdate1,,
          "trade_data":predict.dataSync()
        });
      }

      return json_data;
  }catch(e){
    console.log(e);
  } 
}

module.exports = {
    tf_predict : tf_predict,
    pred_json: pred_json 
}
  



// https://www.tensorflow.org/js/guide/conversion
// https://www.tensorflow.org/js/tutorials/conversion/import_keras
// https://huningxin.github.io/tfjs-converter/
// https://github.com/tensorflow/tfjs-converter/tree/master/tfjs-converter
// https://www.tensorflow.org/js/tutorials/conversion/import_saved_model




/*
Params
2021	
12	
31	
23	
59	
1.23501	
1.23516	
1.23491	
1.23501	
546
 */