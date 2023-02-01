/* Itinerary data
 Overview / Detail: Port/City
 Overview / Detail: Day = 0-n
 Overview / Detail: Date
 Overview / Detail: time arrive
 Overview / Detail: time leave
 
 Detail:    Itinerary Title*
 Detail:    Type*
 Detail:    Ref. Number
 Detail:    Contact Name
 Detail:    Contact Phone
 Detail:    Pick-Up/Start Location*
 Detail:    Time to arrive*
 Detail:    Time Start
 Detail:    Est. time to complete
 Detail:    Est. time of Drop-Off*
 Detail:    Drop-Off/End location

 */
/* localStorage data schema:
 * dataList = {
 * "isDataSaved": "1" or null (yes/no)
 * "toggleFlags":"Stringified list", 
 * "tripOvrViewList":"Stringified list",
 * "portList":"Stringified array",
 * "activityList":"Stringified list",
 * "emergencyDataList": "Stringified array"
 * "activityTypeList": "Stringified array",
 * };
 */

let dataList = { "isDataSaved": null, "toggleFlags": null, "tripOvrViewList": null, "portList": null, "activityList": null, "emergencyDataList": null, "activityTypeList": null };

let toggleFlags = { "shipDetails": 1, "portOfCallList": 1, "tripMap": 1, "emergancyInfo": 1, "configOptions": 1 };

let tripOvrViewList = {
    "TripName": "European Mediterranean Cruise", "Duration": "12",
    "DateStart": "20230614", "DateEnd": "20230625", "CruiseLine": "Norwegian Cruise Lines(NCL)", "CruiseLineAcronym": "NCL",
    "ReservationNumber": "1234567890", "StateRoom": "1403", "travelerFName":"Bart","travelerMI":"R","travelerLName":"Voigt","travelerMobileIntnl":"013179979299"
};

let portList = [
    ['Lisbon', 'Spain', '00', '2023-06-14', '18:00', '-'],
    ['Lisbon', 'Spain', '0', '2023-06-15', '-', '20:00'],
    ['At Sea', 'NCL Getaway', '1', '2023-06-16', '00:00', '24:00']
];
let activityList = {
    'Lisbon': { '00': [['Hang Out', 'Beach'], ['Dinner', 'Hotel Restaurant']] },
    'Lisbon': { '0': [['Repack', 'Hotel'], ['Lunch', 'Hotel Restaurant'], ['Transit to Ship', 'Shuttle', '16:00', '17:00']] },
    'At Sea': { '1': [['Ship Activity 1'], ['Ship Activity 2']] },
};

let activityTypeList = ['Sleep', 'Breakfast', 'Lunch', 'Dinner', 'Free time', 'Transit', 'Check -in', 'Check - out', 'Shopping', 'Snorkling', 'SCUBA',
    'Swimming', 'Workout', 'Reading', 'Planning', 'Group Tour', 'Private Tour', 'NCL Tour', 'Wikipedia Tour'];

function loadUserData() {
    if (localStorage.getItem("isDataSaved")) {
        for (const [key, value] of Object.entries(dataList)) {
            //itemName = formData[i].name;
            dataList[key] = localStorage.getItem(key);
        }
        for (const [key, value] of Object.entries(dataList)) {
            switch (key) {
                case "inputName":
                    document.getElementById("outName").value = localStorage.getItem(key);
                    break;
                case "inputDate":
                    document.getElementById("outDate").value = localStorage.getItem(key);
                    break;
                case "inputCity":
                    document.getElementById("outCity").value = localStorage.getItem(key);
                    break;
                case "inputTime":
                    document.getElementById("outTime").value = localStorage.getItem(key);
                    break;
                case "inputInteger":
                    document.getElementById("outInteger").value = localStorage.getItem(key);
                    break;
                case "inputDescription":
                    document.getElementById("outDescription").value = localStorage.getItem(key);
                    break;

            }

        }
    }
}
function storeUserData(formData) {
    //alert(formData.inputName.value);
    for (const [key, value] of Object.entries(dataList)) {
        //itemName = formData[i].name;
        dataList[key] = formData[key].value;
    }
    for (const [key, value] of Object.entries(dataList)) {
        console.log(`${key}: ${value}`);
        localStorage.setItem(key, value);
    }
}

function validateForm(frmItem, type) {

    let itemValue = frmItem.value;
    let validOutput = "";
    let matchString = ""
    if (type == 'plainText') matchString = "[a-zA-Z \\-'.]";
    if (type == 'number') matchString = "\\d";
    if (type == 'mixedText') matchString = "[a-zA-Z \\-'.\\d,@()$?]";

    for (let i = 0; i < itemValue.length; i++) {
        if (itemValue.charAt(i).match(matchString) != null) validOutput = validOutput + itemValue.charAt(i);
    }

    frmItem.value = validOutput;
}
