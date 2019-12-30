const expect = require('chai').expect,
      sinon = require('sinon'),
      nock = require('nock');

const captureMetric = require('../../src/utils/captureMetrics');

const httpOptions = {
    host: 'ec2-54-246-171-93.eu-west-1.compute.amazonaws.com',
    port: 8086,
    path: '/write?db=workoutData&precision=ms',
    method: 'POST',
    headers: {
        'Content-Type': 'text/html',
    }
};

describe('Capture Metric', () => {

    beforeEach(() => {
        process.env.INFLUXDB_HOST = 'testhost';
    });

    afterEach(() => {
        nock.cleanAll();
    });

    it('should capture a metric when called', done => {
        nock('http://testhost:8086')
        .post('/write?db=workoutData&precision=ms')
        .reply(200, 'ok');

        captureMetric('metricline').then(data => {
            expect(data).to.equal('ok');
            done();
        });
    });

    it('should capture a metric when called', done => {
        nock('http://testhost:8086')
        .post('/write?db=workoutData&precision=ms')
        .replyWithError('bad request');

        captureMetric('metricline').then().catch(e => {
            expect(e.message).to.equal('bad request');

            done();
        });
    });
});
