const http = require('http');

module.exports = (postData) => {

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
