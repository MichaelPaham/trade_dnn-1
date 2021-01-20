const tf = require('@tensorflow/tfjs-node');



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


module.exports = {
    tf_predict : tf_predict
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