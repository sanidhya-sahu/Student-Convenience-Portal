const { google } = require("googleapis")
async function getEventData() {
    const auth = new google.auth.GoogleAuth({
        keyFile: "services/credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    })
    const client = await auth.getClient()
    const googleSheets = google.sheets({
        version: "v4",
        auth: client
    })
    const spreadsheetId = "1GqIrp5Vg3T82o6ft7mIkfwDwvibNpv76IGhXNOAvUf0"
    const getLeadName = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Form responses 1!B:H"
    })
    var data1 = []
    var head = ""
    var date = ""
    var venue = ""
    var time = ""
    var description = ""
    var regLink = ""
    var rawImgLink = ""
    var blur = ""
    function extractFileIdFromLink(link) {
        try {
            if (String(link).includes('/file/d')) {
                const startIndex = link.indexOf('d/') + 2;
                const endIndex = link.indexOf('/view');
                const fileId = link.slice(startIndex, endIndex);
                return `https://drive.google.com/thumbnail?id=${fileId}`;
            }
            else if (String(link).includes('/open?id')) {
                const startIndex = link.indexOf('id=') + 3;
                const fileId = link.slice(startIndex);
                return `https://drive.google.com/thumbnail?id=${fileId}`;
            }
        }
        catch {
            return link
        }
    }
    function isDateInThePast(dateString) {
        const [day, month, year] = dateString.split('/');
        const date = new Date(year, month - 1, day);
        return date < new Date();
    }
    getLeadName.data.values.filter((val, idx) => { return !idx == 0 }).forEach(element => {
        head = String(element[0]).trim()
        date = String(element[1]).trim()
        venue = String(element[2]).trim()
        time = String(element[3]).trim()
        description = String(element[4]).trim()
        regLink = String(element[5]).trim()
        rawImgLink = String(element[6]).trim()
        const imgLink = extractFileIdFromLink(rawImgLink);
        if (isDateInThePast(date)) {
            blur = true
        }
        else{
            blur = false
        }
        var tempObject = {
            "heading": head,
            "date": date,
            "time": time,
            "description": description,
            "regLink": regLink,
            "imgLink": imgLink,
            "blur" : blur
        }
        data1.push(tempObject)
    })
    return data1
}
module.exports = getEventData