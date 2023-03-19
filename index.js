import { Configuration, OpenAIApi } from "openai";
import * as dotenv from 'dotenv';
import express, { json } from 'express';
import mysql from "mysql"

const app = express();
dotenv.config()

var connection = mysql.createConnection({
    host: 'localhost',
    database: 'communicate',
    user: 'root',
    password: '123456'
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

 
app.get("/api/query", (req, res) => {
  var sqlquery= (req.query.sqlquery);
  console.log(sqlquery);
  connection.query(sqlquery, function (error, result) {
    if (error) {
      console.log(error);
    } else {
      res.send({ status: true, data: result });
    }
  });
});

app.get('/api/detail', async (req, res) => {
    const sqlquery=`Given this SQL Query: ${req.query.sqlquery} What should be 1. the graph used 2. x-axis 3. y-axis 4. title of query ?`;
    try{
    const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: sqlquery,
            temperature: 0,
          });
    const data=completion.data.choices[0].text;
    const temp=data.split("\n");
    res.status(200).json({
        "Graph_used":temp[2].split(". ")[1],
        "x-axis":temp[3].split(". ")[1],
        "y-axis":temp[4].split(". ")[1],
    });
    }
    catch (err) {
        res.status(500).json(err);
      }
});
connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
app.listen(3000, () =>
  console.log('app listening on port 3000!'),
);