// const sqs = require('sqs');
const http = require('http');

module.exports = (postData) => {

    // const queue = sqs({
    //     access:'AKIAVLPRS43YTLW6IQQU',
    //     secret:'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',
    //     region:'eu-west-1' // defaults to us-east-1
    // });

    const options = {
        host: process.env.INFLUXDB_HOST,
        port: 8086,
        path: '/write?db=workoutData&precision=ms',
        method: 'POST',
        headers: {
            'Content-Type': 'text/html',
        }
    }



    return new Promise ((resolve, reject) => {
        // queue.push('InfluxDBQueue', postData, data => {
        //     console.log(postData, 'queued', data);
        // });

        const request = http.request(options, (response) => {
            let data = '';
            response.on('data', d => {
                data += d;
            });

            response.on('end', () => {
                resolve(data);
            });
        });

        request.on('error', err => {
            reject(err);
        });

        request.write(postData);
        request.end();
    });
}
