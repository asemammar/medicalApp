const { assert, expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
let server = require("../index");
const request = require('supertest');
const Patient = require('../model/patients.js');

// Assertion Style
chai.should();
chai.use(chaiHttp);

describe("test /api/patients route", () => {
    it('/GET it should get all the patients', (done) => {
        chai.request(server)
            .get('/api/patients')
            .end((err, res) => {
                res.body.should.be.a('array');
            });
        done();
    });

    it('/POST it should register a patient', (done) => {
        let patient = new Patient({
            patientName: "Test Patient",
            emailId: "test@mail.com"
        });

        chai.request(server)
            .post('/api/patients/register')
            .send(patient)
            .end((err, res) => {
                res.body.should.be.a('object');
                res.body.should.have.property('data');
                id = res.body.data._id  
                chai.request(server)
                .delete('/api/patients/id/' + patient.id)
                .end();    
            });   
        done();
    });

    it('/DELETE it should delete the patient', (done) => {
        let patient = new Patient({
            patientName: "Test Patient",
            emailId: "test@mail.com"
        });
        patient.save((err, patient) => {
            chai.request(server)
            .delete('/api/patients/id/' + patient.id)
            .end((err, res) => {
                res.body.should.be.a('object');
                res.body.should.have.property('message').eq("Successfully deleted 1 document.");
            });    
        });
        done();
        
    });
})