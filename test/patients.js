const { assert, expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
let  server  = require("../index");
const request = require('supertest');
const Patient = require('../model/patients.js');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");


// Assertion Style
chai.should();
chai.use(chaiHttp);

let db;

describe("Test /api/patients route", () => {
    before(function(done) {

          
    db = mongoose.connect(
            process.env.DB,
            {
              useNewUrlParser: true,
              useUnifiedTopology: true,
            }
            
            );

done();
    })


    // after(function(done) {

          
    //     db.connection.close()
    
    // done();
    //     })
    

    

    let  token = jwt.sign(
        // payload data
        {
          name: "test",
          id: "6058b9c5c965304bd4665cdd",
          role: [
              "admin"
          ]
        },
        process.env.TOKEN_SECRET
      );
    it('/GET / -> it should get all the patients', async (done) => {

        chai.request(server)
            .get('/api/patients')
            .set({'auth-token' : token})
            .end((err, res) => {
                res.body.should.be.a('array');
            });
        done();
    })

    it('/GET /id/:id should get a patient given the id', (done) => {
        let patient = new Patient({
            patientName: "Test Patient",
            emailId: "test@mail.com", 
            machineId: "6058b9c5c965304bd4665cdd"
        });
        
        patient.save((err, patient) => {
                chai.request(server)
                .get('/api/patients/id/' + patient.id)
                .set({'auth-token' : token})
                .end((err, res) => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id').eql(patient.id);
                    chai.request(server)
                        .delete('/api/patients/id/' + patient.id)
                        .set({'auth-token' : token})
                        .end(); 
              });
        });
        done();
    });


    it('/POST /register -> it should register a patient', (done) => {
        let patient = new Patient({
            patientName: "Test Patient",
            emailId: "test@mail.com"
        });

        chai.request(server)
            .post('/api/patients/register')
            .set({'auth-token' : token})
            .send(patient)
            .end((err, res) => {
                res.body.should.be.a('object');
                res.body.should.have.property('data');
                chai.request(server)
                    .delete('/api/patients/id/' + res.body.data._id)
                    .set({'auth-token' : token})
                    .end();
            });   
        done();
    });

    it('/PUT /id/:id should update a patient given the id', (done) => {
        let patient = new Patient({
            patientName: "Test Patient",
            emailId: "test@mail.com", 
            machineId: "6058b9c5c965304bd4665cdd"
        });
        
        patient.save((err, patient) => {
                chai.request(server)
                .put('/api/patients/id/' + patient.id)
                .set({'auth-token' : token})
                .send({
                    patientName: "Test Update",
                    emailId: "testupdate@mail.com", 
                    machineId: "6058b9c5c965304bd4665cdd"
                })
                .end((err, res) => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql("Successfully updated 1 document.");
                    chai.request(server)
                        .delete('/api/patients/id/' + patient.id)
                        .set({'auth-token' : token})
                        .end(); 
              });
        });
        done();
    });

    it('/DELETE /id/:id it should delete the patient', (done) => {
        let patient = new Patient({
            patientName: "Test Patient",
            emailId: "test@mail.com", 
            machineId: "6058b9c5c965304bd4665cdd"
        });

        patient.save((err, patient) => {
            chai.request(server)
                .delete('/api/patients/id/' + patient._id)
                .set({'auth-token' : token})
                .end((err, res) => {
                      res.body.should.be.a('object');
                      res.body.should.have.property('message').eq("Successfully deleted 1 document.");
                });
        });
        done();
    });



})



