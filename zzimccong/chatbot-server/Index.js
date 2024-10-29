const express = require('express');
const bodyParser = require('body-parser');
const dialogflow = require('dialogflow');
const uuid = require('uuid');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const projectId = 'zzimccong-chatbot-suvw'; // Dialogflow 프로젝트 ID
const sessionId = uuid.v4();
const languageCode = 'ko';

const sessionClient = new dialogflow.SessionsClient({
    keyFilename: './zzimccong-chatbot-suvw-64ec21f2bbae.json' // 서비스 계정 키 파일 경로
});

app.post('/webhook', async (req, res) => {
    const query = req.body.query;
    console.log('Received query:', query); 
    const request = {
        session: sessionClient.sessionPath(projectId, sessionId),
        queryInput: {
            text: {
                text: query,
                languageCode: languageCode,
            },
        },
    };

    try {
        const responses = await sessionClient.detectIntent(request);
        const result = responses[0].queryResult;
        console.log('Dialogflow response:', result); 
        res.json(result);
    } catch (err) {
        console.error('ERROR:', err);
        res.status(500).send('Error connecting to Dialogflow');
    }
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
