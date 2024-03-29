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
 * All data saved and manipulated as text except toggleFlags and cPlanDataSaved flag, numerical/date/time data is converted as needed for
 * cPlanDataSaved = 0 or 1
 * cPlanDataList = JSON.stringified(datalist)
 * dataList = {
 * "isDataSaved": "1" or null (yes/no)
 * "toggleFlags":list, 
 * "tripOvrViewList":array,  // 1 dimensional
 * "portList":array,  // {uniqueKey: [cruiseDay, City, Country, Date, Arrival, Departure, Terminal, activityList_uniqueKey]}
 * "activityList":array,  // uniqueKey: { "cruiseDay": "1", "city": "At Sea", "schedule": [{ "location": "Main Dining Room", "activity": '12', "start": "8:00", "end": "9:30", "notes": "anything noteworthy" }] },
 * "emergencyDataList": list  // [["Data Set 1", ["title 1", "Information 1"],...], ["Data Set 2", ["title 2", "Information 2"],...],...]
 * "activityTypeList": list,  // 1 dimensional list to populate drop/select 
 * "tripCalendar": array // tripDay:[tripDay, calDateYDFormat, cruiseDay, portList_uniqueKey] ==> {"0":["0","2023/07/25","-1","0"]}
 * };
 */
// https://www.w3schools.com/jsref/prop_win_localstorage.asp
// https://javascript.info/localstorage
// https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3

const msPerDay = 86400000;
const toggleFlags = { "shipDetails": 1, "portOfCallList": 1, "travelInfo": 1, "emergancyInfo": 1, "configOptions": 1, "rolloutID": null };

let tripOverViewList = {
    "tripName": "Name of My Cruise/Trip", "duration": "12",
    "dateStart": "2023/01/01", "dateEnd": "2023/01/13", "embarkationDate": "2023/01/03",
    "debarkationDate": "2023/01/10", "cruiseLine": "Fun Time Cruise Line", "cruiseLineCommon": "Fun Time", "cruiseLineAbbr": "FTCL", "shipName": "Party Barge",
    "tonnes": "145,655", "guests": "3963","shpLength":"1068'","maxBeam":"170'","crew":"1646","constructed":"2020 (2014)",
    "embarkatonCity": "Embark City", "embarkationCountry": "My Embark Country", "embarkationCountryAbbr": "MEC", "debarkationCity": "Debark City", "debarkationCountry": "My Debark Country", "debarkationCountryAbbr": "MDC",
    "reservationNumber": "1234567890", "stateRoom": "1403", "travelerFName":"Jim","travelerMI":"C","travelerLName":"Monty","travelerMobileIntnl":"011234567890"
};

// {uniqueKey[string->int]: [0:cruiseDay[string], 1:City[string], 2:Country[string], 3:Date[string->"yyyy/mm/dd"], 4:Arrival[string->hh:mm(24h)], 5:Departure[string->hh:mm(24h)], 6:Terminal[string], 7:ActivityKey[string->int],}
let portList = {
    "0": ["-1", "City / Ship Name", "Country / 'At Sea'", "2020/12/31", "00:00", "24:00", "0", "0"],
    "1": ["0", "City / Ship Name", "Country / 'At Sea'", "2020/12/31", "00:00", "24:00", "0", "1"],
    "2": ["1", "City / Ship Name", "Country / 'At Sea'", "2020/12/31", "00:00", "24:00", "1A", "2"],
    "3": ["2", "City / Ship Name", "Country / 'At Sea'", "2020/12/31", "00:00", "24:00", "1A", "3"],
    "4": ["3", "City / Ship Name", "Country / 'At Sea'", "2020/12/31", "00:00", "24:00", "1A", "4"],
    "5": ["4", "City / Ship Name", "Country / 'At Sea'", "2020/12/31", "00:00", "24:00", "1A", "5"],
    "6": ["5", "City / Ship Name", "Country / 'At Sea'", "2020/12/31", "00:00", "24:00", "1A", "6"],
    "7": ["6", "City / Ship Name", "Country / 'At Sea'", "2020/12/31", "00:00", "24:00", "1A", "7"],
    "8": ["7", "City / Ship Name", "Country / 'At Sea'", "2020/12/31", "00:00", "24:00", "1A", "8"],
    "9": ["8", "City / Ship Name", "Country / 'At Sea'", "2020/12/31", "00:00", "24:00", "1A", "9"],
    "10": ["9", "City / Ship Name", "Country / 'At Sea'", "2020/12/31", "00:00", "24:00", "1A", "10"],
    "11": ["10", "City / Ship Name", "Country / 'At Sea'", "2020/12/31", "00:00", "24:00", "1A", "11"],
    "12": ["11", "City / Ship Name", "Country / 'At Sea'", "2020/12/31", "00:00", "24:00", "1A", "12"]
};


//'-1': { "city": "Lisbon", "schedule": [{ "location": "Beach", "activity": 'Hang Out', "start": "13:00", "end": "18:00", "notes": "anything noteworthy" }
//usage:
//activitylist['0'].city == 'Lisbon'
//activitylist['1'].schedule[0].location == 'Beach'
//activitylist['2'].schedule[1].activity == '12'  // '12' => activityTypeList[12] == 'Eat/Drink'

let activityList = {'staged':[],
    '0': { "cruiseDay":"-1","city": "Lisbon", "schedule": [{ "location": "Beach", "activity": '10', "start": "13:00", "end": "18:00", "notes": "anything noteworthy" }, { "location": "Hotel Restaurant", "activity": "12", "start": "18:30", 'end': "20:00", "notes":"anything" }] },
    '1': { "cruiseDay":"0", "city": "Lisbon", "schedule": [{ "location": "Hotel", "activity": '12', "start": "09:00", "end": "10:00", "notes": "anything noteworthy" }] },
    '2': { "cruiseDay": "1", "city": "At Sea", "schedule": [{ "location": "Main Dining Room", "activity": '12', "start": "08:00", "end": "09:30", "notes": "anything noteworthy" }] },
    '3': { "cruiseDay": "2", "city": "At Sea", "schedule": [{ "location": "Main Dining Room", "activity": '12', "start": "08:00", "end": "09:30", "notes": "anything noteworthy" }] },
    '4': { "cruiseDay": "3", "city": "At Sea", "schedule": [{ "location": "Main Dining Room", "activity": '12', "start": "08:00", "end": "09:30", "notes": "anything noteworthy" }] },
    '5': { "cruiseDay": "4", "city": "At Sea", "schedule": [{ "location": "Main Dining Room", "activity": '12', "start": "08:00", "end": "09:30", "notes": "anything noteworthy" }] },
    '6': { "cruiseDay": "5", "city": "At Sea", "schedule": [{ "location": "Main Dining Room", "activity": '12', "start": "08:00", "end": "09:30", "notes": "anything noteworthy" }] },
    '7': { "cruiseDay": "6", "city": "At Sea", "schedule": [{ "location": "Main Dining Room", "activity": '12', "start": "08:00", "end": "09:30", "notes": "anything noteworthy" }] },
    '8': { "cruiseDay": "7", "city": "At Sea", "schedule": [{ "location": "Main Dining Room", "activity": '12', "start": "08:00", "end": "09:30", "notes": "anything noteworthy" }] },
    '9': { "cruiseDay": "8", "city": "At Sea", "schedule": [{ "location": "Main Dining Room", "activity": '12', "start": "08:00", "end": "09:30", "notes": "anything noteworthy" }] },
    '10': { "cruiseDay": "9", "city": "At Sea", "schedule": [{ "location": "Main Dining Room", "activity": '12', "start": "08:00", "end": "09:30", "notes": "anything noteworthy" }] },
    '11': { "cruiseDay": "10", "city": "At Sea", "schedule": [{ "location": "Main Dining Room", "activity": '12', "start": "08:00", "end": "09:30", "notes": "anything noteworthy" }] },
    '12': { "cruiseDay": "11", "city": "At Sea", "schedule": [{ "location": "Main Dining Room", "activity": '12', "start": "08:00", "end": "09:30", "notes": "anything noteworthy" }] },
};
//let activityList = {
    //'staged': [],
    //'-1': { "city": "Lisbon", "schedule": [{ "location": "Beach", "activity": '10', "start": "13:00", "end": "18:00", "notes": "anything noteworthy" }, { "location": "Hotel Restaurant", "activity": "12", "start": "18:30", 'end': "20:00", "notes": "anything" }] },
    //'0': { "city": "Lisbon", "schedule": [{ "location": "Hotel", "activity": '12', "start": "9:00", "end": "10:00", "notes": "anything noteworthy" }] },
    //'1': { "city": "At Sea", "schedule": [{ "location": "Main Dining Room", "activity": '12', "start": "8:00", "end": "9:30", "notes": "anything noteworthy" }] },
//};

let emergencyDataList = [["Data Set 1", ["title 1", "Information 1"], ["title 2", "Information 2"], ["title 3", "Information 3"]],
    ["Data Set 2", ["title 1", "Information 1"], ["title 2", "Information 2"]],
    ["Data Set 3", ["title 1", "Information 1"]]
];
 
let activityTypeList = ['Activity...', 'Bus Tour', 'Check-in', 'Check-out', 'Dancing', 'Entertainment', 'Excursion', 'Free time', 'Gambling',
    'Group Tour', 'Hang Out', 'Hiking', 'Eat/Drink', 'Planning', 'Private Tour', 'Reading', 'SCUBA', 'Shopping', 'Sleep',
    'Snorkling', 'Social', 'Swimming', 'Tasting', 'Transit', 'Walking', 'Wiki-Tour', 'Workout'];

let tripCalendar = {}; //tripDay:[tripDay, calDateYDFormat, cruiseDay, portKey]
const default_POC_Data = ["0", "City / Ship Name", "Country / 'At Sea'", "2020/12/31", "00:00", "24:00", "0", "0"];

let dataList = { "isDataSaved": 0, "tripOverViewList": tripOverViewList, "portList": portList, "activityList": activityList, "emergencyDataList": emergencyDataList, "activityTypeList": activityTypeList, "tripCalendar": tripCalendar };

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
                case "tripCalendar":
                    tripCalendar = value;
                    break;
            }
        }
        //generateOverview();
        //generateShipDetails();
        //refactoring into a Key/value list removes need for sorting, as well as the option to sort in the first place ::-> portList.sort(function (a, b) { return a[3]- b[3] }); // Sort Port of Call List by [3] - Date
        //portList.sort(function (a, b) { return parseInt(a) - parseInt(b) }); // Sort Port of Call List by [0] - targetData
        activityList.staged.length = 0; // clear POC activity removal staging list
        // sort daily activities by start time
        sortActivityList();
        //-->sortActivityList
        //for (const [key, value] of Object.entries(activityList)) {
        //    if (key != "staged") {
        //        value.schedule.sort((a, b) => (a["start"] > b["start"]) ? 1 : -1);
        //    }
        //}

        return true;
    }
}

function buildPortListFromCalander(resetPortList = false, resetActivityList = false) {
    if (resetPortList == true) {
        //default_POC_Data ["0", "City / Ship Name", "Country / 'At Sea'", "2020/12/31", "00:00", "24:00", "0", "0"];
        //{uniqueKey[string->int]: [0:cruiseDay[string->int], 1:City[string], 2:Country[string], 3:Date[string->"yyyy/mm/dd"], 4:Arrival[string->hh:mm(24h)], 5:Departure[string->hh:mm(24h)], 6:Terminal[string], 7:ActivityKey[string->int],}
        let tempActivityKeys = {};
        for (var [key, item] of Object.entries(portList)) {
            tempActivityKeys[key]=""+ item[7];
        }
        portList = {};
        if (resetActivityList == true) {
            const activitySeed = { "cruiseDay": "0", "city": "Port City", "schedule": [{ "location": "Location", "activity": '10', "start": "09:00", "end": "12:00", "notes": "Short note or description..." }] };
            activityList = { 'staged': [] };
        }
        // tripCalander {tripDay:[tripDay, calDateYDFormat, cruiseDay, portKey]}
        for (const [key, value] of Object.entries(tripCalendar)) {
            portList["" + value[3]] = [...default_POC_Data];
            portList["" + value[3]][0] = ""+value[2];
            portList["" + value[3]][3] = ""+value[1];
            if (resetActivityList == true) {
                portList["" + value[3]][7] = ""+value[3];
            } else {
                if (typeof tempActivityKeys["" + value[3]] != "undefined") {
                    portList["" + value[3]][7] = "" + tempActivityKeys["" + value[3]];
                } else {
                    portList["" + value[3]][7] = ""+value[3];
                }
            }
        }    
    }
}

function sortActivityList(thisDay = "none") {
    if (thisDay != "none") {
        //let tempVar = activityList[thisDay].schedule[0].match("\\d");
        //testList[0]["start"].substring(0, 2) + testList[0]["start"].substring(3)
        activityList[thisDay].schedule.sort((a, b) => (parseInt(a["start"].substring(0, 2) + a["start"].substring(3)) > parseInt(b["start"].substring(0, 2) + b["start"].substring(3))) ? 1 : -1);
    } else {
        for (const [key, value] of Object.entries(activityList)) {
            if (key != "staged") {
                //value.schedule.sort((a, b) => (a["start"] > b["start"]) ? 1 : -1);
                value.schedule.sort((a, b) => (parseInt(a["start"].substring(0, 2) + a["start"].substring(3)) > parseInt(b["start"].substring(0, 2) + b["start"].substring(3))) ? 1 : -1);
            }
        }
    }

}

function storeUserData() {
    localStorage.setItem("cPlanDataSaved", 0);
    //portList.sort(function (a, b) { return parseInt(a) - parseInt(b) });  // Sort Port of Call List by [0] - targetData
    //refactoring into a Key/value list removes need for sorting, as well as the option to sort in the first place ::-> portList.sort(function (a, b) { return a[3] - b[3] });  // Sort Port of Call List by [3] - Date
    activityList.staged.length = 0; // clear POC activity removal staging list
    // sort daily activities by start time
    //for (let i = 1; i < activityList.length; i++) {
    //    activityList[i].schedule.sort((a, b) => a.start - b.start);
    //    activityList[i].schedule.sort((a, b) => a["start"] - b["start"]);
    //}
    for (const [key, value] of Object.entries(activityList)) {
        if (key != "staged") {
            value.schedule.sort((a, b) => (a["start"] > b["start"]) ? 1 : -1);
        }
    }
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
            case "tripCalendar":
                dataList[key] = tripCalendar;
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

function generateCalendar(calDateStart, calDateEnd, calEmbarkationDate, calDebarkationDate) {
    calDateStartObj = new Date(calDateStart);
    calDayDate = new Date(calDateStart);
    calEmbarkationObj = new Date(calEmbarkationDate);
    tripLengthInDays = (new Date(calDateEnd) - calDateStartObj) / msPerDay;
    cruiseLengthInDays = (new Date(calDebarkationDate) - calEmbarkationObj) / msPerDay;
    if (cruiseLengthInDays > tripLengthInDays) tripLengthInDays = cruiseLengthInDays;
    if (calDateStartObj > calEmbarkationObj) {
        calDateStartObj = calEmbarkationObj;
        calDayDate = calEmbarkationObj;
    }
    cruiseDayOffset = (calEmbarkationObj - calDateStartObj) / msPerDay; //cruiseDay should syncronize with the cruise line's trip/day enumeration schema
    
    for (let tripDay = 0; tripDay < tripLengthInDays; tripDay++) {
        calDayDate.setDate(calDateStartObj.getUTCDate() + tripDay);
        calDateYDFormat = calDayDate.getUTCFullYear() + "/" + (calDayDate.getUTCMonth() + 1) + "/" + calDayDate.getUTCDate();
        //default data-> tripDay == portDay == activityDay == (cruise Day-2)
        tripCalendar[("" + tripDay)] = [tripDay, calDateYDFormat, (tripDay - cruiseDayOffset + 1), tripDay];
    }
    return true;
}

function validateForm(frmItem, type, charLimit = 12) {
    console.log("Validate Form-> value:" + frmItem.value + ", type:" + type + ", Limit:" + charLimit);
    //if (charLimit == undefined) charLimit = 12;
    let itemValue = frmItem.value;
    let validOutput = "";
    let matchString = ""
    if (type == 'plainText') matchString = "^[a-zA-Z \\-'.]{0," + charLimit + "}";
    if (type == 'number') matchString = "^[\\d]{0," + charLimit + "}";
    if (type == 'mixedText') matchString = "^[a-zA-Z \\-'.\\d,@()$?_<>:&%]{0," + charLimit + "}";
    if (type == 'dateAsText') matchString = "^[\\d]{0,4}/{0,1}\\d{0,2}/{0,1}\\d{0,2}";
    if (type == 'time24') matchString = "^(2[0-3]|[01]?\\d):?(:?[0-5]?\\d?)";

    console.log("matchString:" + matchString + ", itemValue.match(matchString):" + itemValue.match(matchString));
    tempMatch = itemValue.match(matchString);
//    if (itemValue.match(matchString) != null) validOutput = itemValue.match(matchString);
    if (tempMatch != null) validOutput = tempMatch[0];

    frmItem.value = validOutput;
    //if date configuration...
    if (type == 'dateAsText' && validOutput.length == 10) {
        switch (frmItem.id) {
            case "config_dateStart":
                document.getElementById("config_duration").value = calcDuration(validOutput, document.getElementById("config_dateEnd").value);
                break;
            case "config_dateEnd":
                document.getElementById("config_duration").value = calcDuration(validOutput, document.getElementById("config_dateStart").value);
                break;
            case "config_embarkationDate":
                document.getElementById("config_cruiseDuration").value = calcDuration(validOutput, document.getElementById("config_debarkationDate").value);
                break;
            case "config_debarkationDate":
                document.getElementById("config_cruiseDuration").value = calcDuration(validOutput, document.getElementById("config_embarkationDate").value);
                break;
        }
    }
}

function enforceTimeFormat(tElement) {
    // check/enforce time format
    vTime = tElement.value;
    console.log(vTime);
    //vTime = vTime.match("^\\d{1,2}:{0,1}[0-5]{0,1}\\d{0,1}");
    vTime = vTime.match("^(2[0-3]|[01]?\\d):?(:?[0-5]\\d)?")[0];
    console.log(vTime);
    if (vTime.length < 5) {
        if (vTime.indexOf(':') == 1) vTime = "0" + vTime;
        if (vTime.indexOf(':') == 2 && vTime.length == 3) vTime += "00";
        if ((vTime.indexOf(':') == -1) && (vTime.length == 1)) vTime = "0" + vTime + ":00";
        if ((vTime.indexOf(':') == -1) && (vTime.length == 2)) vTime += ":00";
        if ((vTime.indexOf(':') == -1) && (vTime.length == 4)) vTime = vTime.substring(0, 2) + ":" + vTime.substring(2, 4);
    }
    console.log(vTime);
    return vTime;
}
function clearAllData() {
    localStorage.clear();
    closePopUp();
    window.location.href = window.location.href;
}

class emDataEdit {
    alert(groupIndex,itemIndex) {
        launchPopUp("emData", [groupIndex, itemIndex]);
    }

    addGroup() {
        emergencyDataList.push(["New Group", ["Item 1", "Information 1"]]);
        generateEmergencyPanel();
    }

    removeGroup(groupIndex) {
        emergencyDataList.splice(groupIndex, 1);
        generateEmergencyPanel();
        storeUserData();
    }

    addItem(groupIndex) {
        let itemNumber = emergencyDataList[groupIndex].length;
        emergencyDataList[groupIndex].push(["Item " + itemNumber, "Information " + itemNumber]);
        generateEmergencyPanel();
    }

    removeItem(groupIndex,itemIndex) {
        emergencyDataList[groupIndex].splice(itemIndex, 1);
        generateEmergencyPanel();
        storeUserData();
    }

    editItem(groupIndex, itemIndex) {
        if (itemIndex > 0) {
            let labelName = "emgcyLabel_" + groupIndex + itemIndex;
            let dataName = "emgcyData_" + groupIndex + itemIndex;
            document.getElementById(labelName).innerHTML = "<input id=\"input_" + labelName + "\" type=\"text\" value=\"" + emergencyDataList[groupIndex][itemIndex][0] + "\" style=\"background-color:#ffffffee; border:none; color:#000; font-size:14px;\" oninput=\"validateForm(this,'mixedText',24)\" />";
            document.getElementById(dataName).disabled = false;
            document.getElementById(dataName).setAttribute("oninput", "validateForm(this,'mixedText',32)");
            document.getElementById(dataName).style.backgroundColor = "#ffffffee";
            document.getElementById(dataName).style.color = "#000";
            document.getElementById("greenItem" + groupIndex + itemIndex).innerHTML = "<img src=\"./images/checkMark.svg\" height=\"19px\" width=\"19px\">";
            document.getElementById("greenItem" + groupIndex + itemIndex).setAttribute("onclick", "emgcyDataEdit.updateItem(" + groupIndex + "," + itemIndex +")");
            document.getElementById("redItem" + groupIndex + itemIndex).innerHTML = "<img src=\"./images/xMark.svg\" height=\"19px\" width=\"19px\">";
            document.getElementById("redItem" + groupIndex + itemIndex).setAttribute("onclick", "emgcyDataEdit.closeEdit(" + groupIndex + "," + itemIndex + ")");
        }
        else if (itemIndex == 0) {
            let labelName = "emgcyGroup" + groupIndex + "_title";
            let dataName = "emgcyData" + groupIndex + "_title";
            let headerHTML = "<div style=\"position:relative; float:left; background-color:#cceecc44; margin:2px; border:none; padding:1px; height:19px; width: 19px; border-radius:2px; cursor:pointer;\" onclick=\"emgcyDataEdit.updateItem(" + groupIndex + ", 0)\"><img src=\"./images/checkMark.svg\" height=\"19px\" width=\"19px\"></div>";
            headerHTML += "<div style=\"position:relative; float:left; background-color:#eecccc44; margin:2px; margin-left: 10px; border:none; padding:1px; height:19px; width:19px; border-radius:2px; cursor:pointer;\" onclick=\"emgcyDataEdit.closeEdit(" + groupIndex + ", 0)\"><img src=\"./images/xMark.svg\" height=\"19px\" width=\"19px\"></div>";
            headerHTML += "<input id=\"" + dataName + "\" type=\"text\" value=\"" + emergencyDataList[groupIndex][0] + "\" style=\"background-color:#ffffffee; border:none; color:#000; font-size:14px;\" oninput=\"validateForm(this,'mixedText',36)\" />";
            document.getElementById(labelName).innerHTML = headerHTML;
        }
    }

    updateItem(groupIndex, itemIndex) {
        if (itemIndex > 0) {
            let labelName = "input_emgcyLabel_" + groupIndex + itemIndex;
            let dataName = "emgcyData_" + groupIndex + itemIndex;
            emergencyDataList[groupIndex][itemIndex][0] = "" + document.getElementById(labelName).value;
            emergencyDataList[groupIndex][itemIndex][1] = "" + document.getElementById(dataName).value;
        } else if (itemIndex == 0) {
            let dataName = "emgcyData" + groupIndex + "_title";
            emergencyDataList[groupIndex][0] = "" + document.getElementById(dataName).value;
        }
        this.closeEdit(groupIndex, itemIndex);
        storeUserData();
    }

    closeEdit(groupIndex, itemIndex) {
        if (itemIndex > 0) {
            let labelName = "emgcyLabel_" + groupIndex + itemIndex;
            let dataName = "emgcyData_" + groupIndex + itemIndex;
            document.getElementById(labelName).innerHTML = emergencyDataList[groupIndex][itemIndex][0];
            document.getElementById(dataName).value = emergencyDataList[groupIndex][itemIndex][1];
            document.getElementById(dataName).disabled = true;
            document.getElementById(dataName).style.backgroundColor = "#ffffff00";
            document.getElementById(dataName).style.color = "#bbb";
            document.getElementById(dataName).setAttribute("oninput", "");
            document.getElementById("greenItem" + groupIndex + itemIndex).innerHTML = "<img src=\"./images/pencilEdit.svg\" height=\"19px\" width=\"19px\">";
            document.getElementById("greenItem" + groupIndex + itemIndex).setAttribute("onclick", "emgcyDataEdit.editItem(" + groupIndex + "," + itemIndex + ")");
            document.getElementById("redItem" + groupIndex + itemIndex).innerHTML = "<img src=\"./images/trashBin.svg\" height=\"19px\" width=\"19px\">";
            document.getElementById("redItem" + groupIndex + itemIndex).setAttribute("onclick", "emgcyDataEdit.removeItem(" + groupIndex + "," + itemIndex + ")");
        } else if (itemIndex == 0) {
            let labelName = "emgcyGroup" + groupIndex + "_title";
            let headerHTML = "<div style=\"position:relative; float:left; background-color:#cceecc44; margin:2px; border:none; padding:1px; height:19px; width: 19px; border-radius:2px; cursor:pointer;\" onclick=\"emgcyDataEdit.editItem(" + groupIndex + ", 0)\"><img src=\"./images/pencilEdit.svg\" height=\"19px\" width=\"19px\"></div>";
            headerHTML += "<div style=\"position:relative; float:left; background-color:#eecccc44; margin:2px; margin-left: 10px; border:none; padding:1px; height:19px; width:19px; border-radius:2px; cursor:pointer;\" onclick=\"emgcyDataEdit.alert(" + groupIndex + ", 0)\"><img src=\"./images/trashBin.svg\" height=\"19px\" width=\"19px\"></div>";
            headerHTML += emergencyDataList[groupIndex][0];
            document.getElementById(labelName).innerHTML = headerHTML;
        }
    }
}
const emgcyDataEdit = new emDataEdit();
