import { Configuration, OpenAIApi } from "openai";
import * as dotenv from 'dotenv';
import express from 'express';

const app = express();


dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


app.get('/', async (req, res) => {
    const sqlquery=req.query.sqlquery;
    try{
    const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: sqlquery,
            temperature: 0,
          });
    const data=completion.data.choices[0].text;
    const temp=data.split("\n");
    res.status(200).json({
        "Used_graph":temp[2].split(". ")[1],
        "x-axis":temp[3].split(". ")[1],
        "y-axis":temp[4].split(". ")[1],
    });
    }
    catch (err) {
        res.status(500).json(err);
      }
});
  
app.listen(3000, () =>
  console.log('app listening on port 3000!'),
);