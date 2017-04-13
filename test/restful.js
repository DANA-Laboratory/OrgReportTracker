const app = require('../');

describe('restful', function() {
    var agent = require('supertest').agent(app);
    beforeEach(function(done) {
        let data = {username : 'rafzalan', password : 'arg707'};
        agent
            .post('/auth/login')
            .type('form')
            .send(data)
            .expect(302)
            .expect('Location', '/')
            .end(function(err) {
                if (err) {
                  return done(err);
                }
                done();
            });
    });
    afterEach(function(done) {
        agent
            .get('/auth/logout')
            .expect(302)
            .expect('Location', '/')
            .end(function(err) {
                if (err) {
                  return done(err);
                }
                done();
            });
    });
    it('should get current user logs', function(done) {
        agent
            .get('/restful/Log')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should get current user', function(done) {
        agent
            .get('/restful/User')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should query ReportClass', function(done) {
        agent
            .get('/restful/ReportClass')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should get a ReportClass', function(done) {
        agent
            .get('/restful/ReportClass/1')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should query VariableCat_1', function(done) {
        agent
            .get('/restful/VariableCat_1')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should get a VariableCat_1', function(done) {
        agent
            .get('/restful/VariableCat_1/1')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should query VariableCat_2', function(done) {
        agent
            .get('/restful/VariableCat_2')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should get a VariableCat_2', function(done) {
        agent
            .get('/restful/VariableCat_2/1')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should query VariableCat_3', function(done) {
        agent
            .get('/restful/VariableCat_3')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should get a VariableCat_3', function(done) {
        agent
            .get('/restful/VariableCat_3/1')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should query VariableDef', function(done) {
        agent
            .get('/restful/VariableDef')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should get a VariableDef', function(done) {
        agent
            .get('/restful/VariableDef/1')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
});
