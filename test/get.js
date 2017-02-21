'use strict';
const app = require('../');
const supertest = require('supertest')(app);
it('api test', function(done) {
    supertest
        .get('/')
        .expect(200)
        .end();
    let data  = '{"verb":"addUser", "data":{"lname":"افضلان"}}';
    supertest
        .post('/insert')
        .type('json')
        .send(data)
        .expect('{"ip":"::ffff:127.0.0.1"}')
        .expect(200)
        .end(done);
});
