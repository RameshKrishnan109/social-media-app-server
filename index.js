const express = require('express');
const cors = require('cors')
const { Client } = require('pg');

const app = express();

app.use(cors());
app.use(express.json());

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'socialMediaDb',
    password: 'postgres123',
    port: 5432
});

client.connect();

app.post("/signIn", (req, res) => {
    try {
        let { id, name } = req.body
        client.query(`SELECT id from "Users" WHERE id = '${id}'`,(err, result)=>{

            if (err) {
                res.send({
                    error: err
                })
                return;
            }

            if (result.rowCount == 0) {
                client.query(`INSERT INTO "Users" (id,name) VALUES('${id}', '${name}')`,(err,result)=>{
                    if (err) {
                        res.send({
                            error:err
                        })
                        return;
                    }
                    res.send({
                        id: id,
                        name: name,
                        message: 'New User added'
                    })
                })
            }else{
                res.send({
                    id: id,
                    name: name,
                    message: 'User already exists'
                })
            }

        })
    } catch (error) {
        console.error(error);
        res.send({
            error: error
        });
    }
})


app.listen(5000, () => {
    console.log("server started on port 5000");
})