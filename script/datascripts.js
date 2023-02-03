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
 * cPlanDataSaved = 0 or 1
 * cPlanDataList = JSON.stringified(datalist)
 * dataList = {
 * "isDataSaved": "1" or null (yes/no)
 * "toggleFlags":list, 
 * "tripOvrViewList":list,
 * "portList":array,
 * "activityList":list,
 * "emergencyDataList": array
 * "activityTypeList": array,
 * };
 */
// https://www.w3schools.com/jsref/prop_win_localstorage.asp
// https://javascript.info/localstorage
// https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3

let toggleFlags = { "shipDetails": 1, "portOfCallList": 1, "tripMap": 1, "emergancyInfo": 1, "configOptions": 1 };

let tripOverViewList = {
    "tripName": "European Mediterranean Cruise", "duration": "12",
    "dateStart": "2023/06/14", "dateEnd": "2023/06/25", "cruiseLine": "Norwegian (NCL)", "cruiseLineAbbr": "NCL", "shipName": "Getaway",
    "tonnes": "145,655", "guests": "3963","shpLength":"1068'","maxBeam":"170'","crew":"1646","constructed":"2020 (2014)",
    "portCityStart": "Lisbon", "portCountryStart": "Portugal", "portCountryStartAbbr": "PRT", "portCityEnd": "Civitavecchia", "portCountryEnd": "Italy", "portCountryEndAbbr": "ITA",
    "reservationNumber": "1234567890", "stateRoom": "1403", "travelerFName":"Bart","travelerMI":"R","travelerLName":"Voigt","travelerMobileIntnl":"013179979299"
};

let portList = [
    ['Lisbon', 'Spain', '00', '2023/06/14', '18:00', '24:00'],
    ['Lisbon', 'Spain', '0', '2023/06/15', '00:00', '20:00'],
    ['At Sea', 'NCL Getaway', '1', '2023/06/16', '00:00', '24:00']
];
let activityList = {
    'Lisbon': { '00': [['Hang Out', 'Beach'], ['Dinner', 'Hotel Restaurant']] },
    'Lisbon': { '0': [['Repack', 'Hotel'], ['Lunch', 'Hotel Restaurant'], ['Transit to Ship', 'Shuttle', '16:00', '17:00']] },
    'At Sea': { '1': [['Ship Activity 1'], ['Ship Activity 2']] },
};

let emergencyDataList = [];

let activityTypeList = ['Sleep', 'Breakfast', 'Lunch', 'Dinner', 'Free time', 'Transit', 'Check -in', 'Check - out', 'Shopping', 'Snorkling', 'SCUBA',
    'Swimming', 'Workout', 'Reading', 'Planning', 'Group Tour', 'Private Tour', 'NCL Tour', 'Wikipedia Tour'];

let dataList = { "isDataSaved": 0, "toggleFlags": toggleFlags, "tripOverViewList": tripOverViewList, "portList": portList, "activityList": activityList, "emergencyDataList": emergencyDataList, "activityTypeList": activityTypeList };

function loadUserData() {
    if (localStorage.getItem("cPlanDataSaved") == "1") {
        dataList = JSON.parse(localStorage.getItem("cPlanDataList"));
        for (const [key, value] of Object.entries(dataList)) {
            switch (key) {
                case "toggleFlags":
                    toggleFlags = value;
                    break;
                case "tripOverViewList":
                    tripOverViewList = value;
                    break;
                case "portList":
                    portList = value;
                    break;
                case "activityList":
                    activityList = value;
                    break;
                case "emergencyDataList":
                    emergencyDataList = value;
                    break;
                case "activityTypeList":
                    activityTypeList = value;
                    break;
            }
        }
        generateShipDetails();
        
    }
}

function storeUserData(formData) {
    for (const [key, value] of Object.entries(dataList)) {
        localStorage.setItem("cPlanDataSaved", 0);
        switch (key) {
            case "isDataSaved":
                dataList[key] = 0;
                //localStorage.setItem(key,1);
                break;
            case "toggleFlags":
                dataList[key] = toggleFlags;
                //localStorage.setItem(key, toggleFlags);
                break;
            case "tripOverViewList":
                dataList[key] = tripOverViewList;
                //localStorage.setItem(key, tripOvrViewList);
                break;
            case "portList":
                dataList[key] = portList;
                //localStorage.setItem(key, portList);
                break;
            case "activityList":
                dataList[key] = activityList;
                //localStorage.setItem(key, activityList);
                break;
            case "emergencyDataList":
                dataList[key] = emergencyDataList;
                //localStorage.setItem(key, emergencyDataList);
                break;
            case "activityTypeList":
                dataList[key] = activityTypeList;
                //localStorage.setItem(key, activityTypeList);
                break;
        }
    }  
    localStorage.setItem("cPlanDataList", JSON.stringify(dataList));
    dataList.isDataSaved = 1;
    localStorage.setItem("cPlanDataSaved", 1);
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
