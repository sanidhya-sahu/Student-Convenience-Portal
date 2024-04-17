const https = require('https');

async function getUserInfo(tokens) {
    try {
        const headers = {
            Authorization: `Bearer ${tokens.access_token}`,
        };
        const options = {
            hostname: 'www.googleapis.com',
            path: '/oauth2/v3/userinfo',
            method: 'GET',
            headers,
        };

        return new Promise((resolve, reject) => {

            const reqGoogle = https.request(options, (googleRes) => {
                let responseBody = '';
                googleRes.on('data', (chunk) => {
                    responseBody += chunk;
                });
                googleRes.on('end', () => {
                    const responseJson = JSON.parse(responseBody);
                    resolve({ "status": true, "user": responseJson });
                });
            });

            reqGoogle.on('error', (error) => {
                reject({ "status": false });
            });

            reqGoogle.end();


        });
    }
    catch {
        return { "status": false };
    }

}

module.exports = getUserInfo;