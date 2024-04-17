require('dotenv').config()
const Perspective = require('perspective-api-client');
const apiKey = process.env.API_KEY
const perspective = new Perspective({ apiKey: apiKey });

async function getPerspective(text) {
    try {
        const result = await perspective.analyze(text, { attributes: ['PROFANITY', 'THREAT', 'TOXICITY', 'INSULT'] });
        const TOXICITY = result.attributeScores.TOXICITY.summaryScore.value
        const PROFANITY = result.attributeScores.PROFANITY.summaryScore.value
        const INSULT = result.attributeScores.INSULT.summaryScore.value
        const THREAT = result.attributeScores.THREAT.summaryScore.value
        if (TOXICITY > 0.6) {
            return { "res": "Toxicity" }
        }
        else if (PROFANITY > 0.5) {
            return { "res": "Profanity" }
        }
        else if (THREAT > 0.5) {
            return { "res": "Threat" }
        }
        else if (INSULT > 0.5) {
            return { "res": "Insult" }
        }
        else {
            return { "res": true }
        }
    } catch (error) {
        if (String(error).includes("does not support request languages")) {
            return {"res" : "Unprofessional language"}
        }
        return {"res": false}
    }
}

module.exports = getPerspective