const { google } = require('googleapis');

async function getUserGender(auth) {
  const people = google.people({ version: 'v1', auth: auth });

  try {
    const res = await people.people.get({
      resourceName: 'people/me',
      personFields: 'genders',
    });
    return res.data.genders[0].formattedValue;
  } catch (err) {
    return false;
  }
}

module.exports = getUserGender;