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
            .get('/restful/log')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should get current user', function(done) {
        agent
            .get('/restful/user')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should query reportclasses', function(done) {
        agent
            .get('/restful/reportclass')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should get a reportclass', function(done) {
        agent
            .get('/restful/reportclass/1')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should query variablecat_1', function(done) {
        agent
            .get('/restful/variablecat_1')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should get a variablecat_1', function(done) {
        agent
            .get('/restful/variablecat_1/1')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should query variablecat_2', function(done) {
        agent
            .get('/restful/variablecat_2')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should get a variablecat_2', function(done) {
        agent
            .get('/restful/variablecat_2/1')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should query variablecat_3', function(done) {
        agent
            .get('/restful/variablecat_3')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should get a variablecat_3', function(done) {
        agent
            .get('/restful/variablecat_3/1')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should query variabledef', function(done) {
        agent
            .get('/restful/variabledef')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should get a variabledef', function(done) {
        agent
            .get('/restful/variabledef/1')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
});
