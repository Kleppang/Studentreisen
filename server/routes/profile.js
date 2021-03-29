const { connection } = require('../db');
const mysql = require('mysql');

const router = require('express').Router();

router.get('/getFagfelt', async (req, res) => {
    try{
        connection.query('SELECT * FROM fagfelt', (error, results) => {
            res.send(results);
        });

    }catch(err) {
        res.json({message:err});
    }
});

router.get('/getBruker', async (req, res) => {
    try{
        // TODO: Jokernoter inn faktiske brukerid //
        connection.query("SELECT fnavn, enavn, telefon, email FROM bruker WHERE brukerid='1'", (error, results) => {
            res.send(results);
        });

    }catch(err) {
        res.json({message:err});
    }
});

module.exports = router;