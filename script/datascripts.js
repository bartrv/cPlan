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

let toggleFlags = { "shipDetails": 1, "portOfCallList": 1, "travelInfo": 1, "emergancyInfo": 1, "configOptions": 1, "rolloutID": null };

let tripOverViewList = {
    "tripName": "Mediterranean Cruise", "duration": "12",
    "dateStart": "2023/06/13", "dateEnd": "2023/06/25", "embarkationDate": "2023/06/14",
    "debarkationDate": "2023/06/23", "cruiseLine": "Norwegian Cruise Line", "cruiseLineCommon": "Norwegian", "cruiseLineAbbr": "NCL", "shipName": "Getaway",
    "tonnes": "145,655", "guests": "3963","shpLength":"1068'","maxBeam":"170'","crew":"1646","constructed":"2020 (2014)",
    "embarkatonCity": "Lisbon", "embarkationCountry": "Portugal", "embarkationCountryAbbr": "PRT", "debarkationCity": "Civitavecchia", "debarkationCountry": "Italy", "debarkationCountryAbbr": "ITA",
    "reservationNumber": "1234567890", "stateRoom": "1403", "travelerFName":"Bart","travelerMI":"R","travelerLName":"Voigt","travelerMobileIntnl":"013179979299"
};


let portList = [
    ['-1', 'Lisbon', 'Portugal', '2023/06/14', '18:00', '24:00'],
    ['0', 'Lisbon', 'Portugal', '2023/06/15', '00:00', '20:00'],
    ['1', 'At Sea', 'NCL Getaway', '2023/06/16', '00:00', '24:00']
];
//'-1': { "city": "Lisbon", "schedule": [{ "location": "Beach", "activity": 'Hang Out', "start": "13:00", "end": "18:00", "notes": "anything noteworthy" }
//usage:
//activitylist['-1'].city='Lisbon'
//activitylist['-1'].schedule[0].location='Beach'
//activitylist['-1'].schedule[1].activity = 'Lunch'

let activityList = {
    '-1': { "city": "Lisbon", "schedule": [{ "location": "Beach", "activity": 'Hang Out', "start": "13:00", "end": "18:00", "notes": "anything noteworthy" }, { "location": "Hotel Restaurant", "activity": "Dinner", "start": "18:30", 'end': "20:00", "notes":"anything" }] },
    '0': { "city": "Lisbon", "schedule": [{ "location": "Hotel", "activity": 'Breakfast', "start": "9:00", "end": "10:00", "notes": "anything noteworthy" }] },
    '1': { "city": "At Sea", "schedule": [{ "location": "Main Dinning Room", "activity": 'Breakfast', "start": "8:00", "end": "9:30", "notes": "anything noteworthy" }] },
};


let emergencyDataList = [];

let activityTypeList = ['Activity...', 'Sleep', 'Breakfast', 'Lunch', 'Dinner', 'Free time', 'Transit', 'Check-in', 'Check-out', 'Shopping', 'Snorkling', 'SCUBA',
    'Swimming', 'Workout', 'Reading', 'Planning', 'Group Tour', 'Private Tour', 'NCL Tour', 'Wiki-Tour', 'Bus-Tour', 'Hiking', 'Walking', 'Tasting'];

let dataList = { "isDataSaved": 0, "tripOverViewList": tripOverViewList, "portList": portList, "activityList": activityList, "emergencyDataList": emergencyDataList, "activityTypeList": activityTypeList };

function loadUserData() {
    console.log("cPlanDataSaved:" + localStorage.getItem("cPlanDataSaved"));
    if (localStorage.getItem("cPlanDataSaved") == "1") {
        console.log("cPlanData saved  = 1");
        dataList = JSON.parse(localStorage.getItem("cPlanDataList"));
        for (const [key, value] of Object.entries(dataList)) {
            //console.log("processing:" + key + " with " + value);
            //console.log("room default:" + tripOverViewList.stateRoom);
            switch (key) {
                //case "toggleFlags":
                //    toggleFlags = value;
                //    break;
                case "tripOverViewList":
                    tripOverViewList = value;
                    //console.log("room Data:" + value.stateRoom);
                    //console.log("Applied As:" + tripOverViewList.stateRoom);
                    break;
                case "portList":
                    portList = value;
                    console.log("portList load:" + value);
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
        //generateOverview();
        //generateShipDetails();
        return true;
    }
}

function storeUserData() {
    localStorage.setItem("cPlanDataSaved", 0);
    //let tempToggle = JSON.stringify(toggleFlags);
    //for (const key in toggleFlags) {
    //    toggleFlags[key] = 1;
    //}
    for (const [key, value] of Object.entries(dataList)) {
        switch (key) {
            case "isDataSaved":
                dataList[key] = 0;
                //localStorage.setItem(key,1);
                break;
            //case "toggleFlags":
            //    dataList[key] = toggleFlags;
                //localStorage.setItem(key, toggleFlags);
            //    break;
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
    localStorage.setItem("cPlanDataSaved", "1");
    //toggleFlags = JSON.parse(tempToggle);
    console.log("storeUserData: Complete");
    console.log("cPlanDataSaved:" + localStorage.getItem("cPlanDataSaved"));
}

function validateForm(frmItem, type, charLimit) {
    console.log("Validate Form-> value:" + frmItem.value + ", type:" + type + ", Limit:" + charLimit);
    if (charLimit == undefined) charLimit = 12;
    let itemValue = frmItem.value;
    let validOutput = "";
    let matchString = ""
    if (type == 'plainText') matchString = "^[a-zA-Z \\-'.]{0," + charLimit + "}";
    if (type == 'number') matchString = "^[\\d]{0," + charLimit + "}";
    if (type == 'mixedText') matchString = "^[a-zA-Z \\-'.\\d,@()$?]{0," + charLimit + "}";
    if (type == 'dateAsText') matchString = "^[\\d]{0,4}/{0,1}\\d{0,2}/{0,1}\\d{0,2}";
    if (type == 'time24') matchString = "^\\d{1,2}:{0,1}[0-5]{0,1}\\d{0,1}";

    //for (let i = 0; i < itemValue.length; i++) {
    //    if (itemValue.charAt(i).match(matchString) != null) validOutput = validOutput + itemValue.charAt(i);
    //}
    console.log("matchString:" + matchString + ", itemValue.match(matchString):" + itemValue.match(matchString));
    if (itemValue.match(matchString) != null) validOutput = itemValue.match(matchString);

    frmItem.value = validOutput;
}

function clearAllData() {
    let alertHTML = ""
    alertHTML = "<span style=\"font-size:24px; font-weight:bold; color:red;\">- Warning -</span><br />";
    alertHTML += "This operation will irrevocably erase all data from <strong>this app</strong> and re-load the default values.<br /><br />";
    alertHTML += "<input type=\"button\" onclick=\"closePopUp()\" value=\"* Cancel *\" style=\"width:125px\"\><br /><br />";
    alertHTML += "<input type=\"button\" onclick=\"closePopUp(); localStorage.clear(); window.location.href = window.location.href;\" value=\"Erase Planning Data\"  style=\"width:125px\"\><br />";
    document.getElementById("popUpPanel").innerHTML = alertHTML;
    document.getElementById("popUpPanel").style.display = "block";
}
