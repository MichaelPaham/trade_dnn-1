// https://github.com/tensorflow/tfjs-converter/tree/master/tfjs-converter
// https://github.com/tensorflow/tfjs-examples
// https://www.tensorflow.org/js/tutorials/conversion/import_keras
// https://www.tensorflow.org/js/guide/conversion

// const tf = require('@tensorflow/tfjs');
const tf = require('@tensorflow/tfjs-node-gpu');
require('@tensorflow/tfjs-node');


const Dense = tf.layers.dense;
const leakyReLU = tf.layers.leakyReLU;
const Dropout = tf.layers.dropout;
const Flatten = tf.layers.flatten;
const Adam = tf.train.adam;
const MSE = tf.losses.meanSquaredError;



try {
    const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
    const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

    // console.log(xs[0])

    // Train a simple model:
    const model = tf.sequential();
    model.add(
        Dense({
            units: 1, 
            activation: 'relu', 
            inputShape: [1]
        })
    );
    model.add(
        leakyReLU(10)
    );
    // model.add(
    //     Dropout(0.2)
    // );
    model.add(
        Dense({
            units: 1, activation: 'linear'
        })
    );
    model.compile({
        optimizer: 'sgd', //Adam(0.2, 0.01, 0.01), //https://js.tensorflow.org/api/latest/#Training-Optimizers
        loss: 'meanSquaredError', //MSE, binaryCrossentropy//https://js.tensorflow.org/api/latest/#Training-Losses
        metrics: [
            tf.metrics.binaryAccuracy,
            'accuracy'
        ] //https://js.tensorflow.org/api/latest/#Metrics
    });

    model.summary();

    history = model.fit(xs, ys, {
        epochs: epoch,
        verbose: 0,
        batchSize: 32,
        validation: 0.2,
        callbacks: {
            // onEpochEnd: (epoch, log) => console.log(`Epoch ${epoch}: loss = ${log.loss}`)
        }
    }).then(()=>{
        model.predict(tf.tensor2d([5], [1, 1])).print();
    });

    // binary_acc = tf.metrics.binaryAccuracy(xs, ys);
    // binary_acc.print();
    
    timer(1);

    resolve('trained')
}
catch(err) {
    resolve(err)
}



function predict(y, m, d, h, m){
    return new Promise(function(resolve, reject) {
        
    })
}



function timer(stat){
    simulateTime = 5;
    start = new Date();
    hrstart = process.hrtime();
    if(stat == 1){
        setTimeout(function(argument) {
            var end = new Date() - start,
              hrend = process.hrtime(hrstart)
          
            console.info('Execution time: %dms', end)
            console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
        }, simulateTime);
    }
}

module.exports = {
    tf_predict : predict
}