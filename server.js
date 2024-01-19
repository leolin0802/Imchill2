/*********************************************************************************
 *  BTI425 – Assignment 1
 * 
 *  I declare that this assignment is my own work in accordance with Seneca's
 *  Academic Integrity Policy:
 * 
 *  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html 
 * 
 *  Name: Maosen Lin Student ID: 109121210 Date: Jan 19, 2024
 * 
 *  Published URL: ___________________________________________________________
 ********************************************************************************/

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

const ListingsDB = require("./modules/listingsDB.js"); // modules
const { disconnect } = require("process");
const db = new ListingsDB(); //modules

const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());

app.use(express.json());

app.get("/", (req,res) => {
    res.json({ message: "API Listening" });
});


// app.listen(HTTP_PORT, () => {
//     console.log(`server listening on: ${HTTP_PORT}`);
// });

// POST

app.post("/api/listings", async (req, res) => {

    try{
        await db.addNewListing(req.body);
        res.status(201).send({message: "Documents added!"});
    } catch (err) {
        res.status(500).send({message: "Failed to add the document."});
    }
});

// GET /api/listings

app.get("/api/listings", async (req, res) => {
    try {
        let page = req.query.page;
        let perPage = req.query.perPage

        let alllisting = await db.getAllListings(page, perPage, req.query.name);

        if (alllisting) {
            res.status(202).send(alllisting);
        }
        else {
            res.status(500).send({message: "Failed to find the documents."});
        }

    } catch(err) {
        res.status(404).send({message: err});
    }
});

// GET /api/listings/(_id value)

app.get("/api/listings/:id", async (req, res) => {
    try {
        let document = await db.getListingById(req.params.id);
        if (document) {
            res.status(201).send(document);
        }
        else {
            res.status(500).send({message: "Failed to find the document."});
        }
    } catch(err) {
        res.status(404).send({message: err});
    }
});

// PUT /api/listings/(_id value)

app.put("/api/listings/:id", async (req, res) => {
    try {
        let updateDoc = await db.getListingById(req.params.id);

        if (updateDoc) {
            await db.updateListingById(req.body, req.params.id);
            res.status(201).send({message: "Successfully updated the document."});
        }
        else {
            res.status(500).send({message: "Failed to update the document."});
        }
    } catch(err) {
        res.status(404).send({message: err});
    }
});

// DELETE /api/listings/(_id value)

app.delete("/api/listings/:id", async (req, res) => {
    try {
        let deleteDoc = await db.getListingById(req.params.id);

        if (deleteDoc) {
            await db.deleteListingById(req.params.id);
        }
        else {
            res.status(204).send({message: "Failed to delete the document."});
        }
    } catch(err) {
        res.status(404).send({message: err});
    }
});

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
    }).catch((err)=>{console.log(err);
});