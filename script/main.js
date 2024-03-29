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

var Timer_POC = "";

function initFullLoadCPlan() {
    if (loadUserData()) console.log("Load completed true");
    if (Object.keys(tripCalendar).length == 0) {
        if (generateCalendar(tripOverViewList.dateStart, tripOverViewList.dateEnd, tripOverViewList.embarkationDate, tripOverViewList.debarkationDate)) console.log("Calendar generation true");
    }
    if (generateOverview()) console.log("generateOverview completed true");
    if (generateShipDetails()) console.log("generateShipDetails completed true");
    if (generatePOCList()) console.log("generatePOCList completed true");
    if (generateTravelInfoPanel()) console.log("generateTravelInfoPanel completed true");
    if (generateEmergencyPanel()) console.log("generateEmergencyPanel completed true");
    if (populateConfigPanelData()) console.log("populateConfigPanelData completed true");
}

//let timeID = null;
function toggleMove(tmObject, tmDistX, tmDistY, tmTiming, caller) {

    caller.style.pointerEvents = "none";
    let toggleVal = toggleFlags[tmObject];
    toggleFlags[tmObject] = -1 * toggleVal;
    objectToMove = document.getElementById(tmObject);
    objectToMove.style.visibility = "visible";
    console.log("ToggleMove Received = " + tmObject + ", " + tmDistX + ", " + tmDistY + ", " + tmTiming + ", " + caller);
    const objectXY = [objectToMove.style.right == "" ? -100 : -1 * Math.round(objectToMove.style.right.match("\\d+")), objectToMove.style.top == "" ? 0 : Math.round(objectToMove.style.top.match("\\d+"))];

    //console.log(objectXY + ", " + toggleVal);

    let timestamp = Date.now();
    let timestart = Date.now();
    let endTime = timestart + tmTiming;
    let newLocXY = [0, 0];
    let yX = 0;
    let yY = 0;
    let x = 0;
    let timeID = setInterval(move, 15);

    function move() {
        if (timestamp <= endTime) {
            x = (Math.PI / 2) * ((timestamp - timestart) / tmTiming);
            yX = toggleVal * tmDistX * Math.sin(x);
            yY = toggleVal * tmDistY * Math.sin(x);
            newLocXY = [Math.round(objectXY[0] + yX), Math.round(objectXY[1] + yY)];
            //console.log(newLocXY);
            if (newLocXY[0] != 0) objectToMove.style.right = "calc(" + newLocXY[0] + "% + 47px)";
            if (newLocXY[1] != 0) objectToMove.style.top = newLocXY[1] + "px";
            timestamp = Date.now();
        } else {
            objectToMove.style.right = "calc(" + newLocXY[0] + "% + 47px)";
            if (newLocXY[1] != 0) objectToMove.style.top = newLocXY[1] + "px";
            clearInterval(timeID);
            timeID = null;
            caller.style.pointerEvents = "";
            if (toggleFlags[tmObject] == 1) objectToMove.style.visibility = "hidden";
        }
    }
    //console.log("now.right" + objectToMove.style.right + ", now.newLocXY[0]" + newLocXY[0]);
    
    
}

function mouseIn(mouseObject) {
    if (mouseObject.parentElement.id == "menuMain") {
        mouseObject.style.width = "52px";
    }
}

function mouseOut(mouseObject, actionTarget) {
    if (mouseObject.parentElement.id == "menuMain") {
        if (toggleFlags[actionTarget] == 1) mouseObject.style.width = "45px";
    }
}

function mouseClick(mouseObject, actionTarget) {

    //console.log(mouseObject);
    if (mouseObject.parentElement.id == "menuMain") {
        console.log("Main Menu Button");
        for (const [key, value] of Object.entries(toggleFlags)) {
            //console.log("key = "+key+", value = "+value);
            if ((key != actionTarget) && (value == -1) && !(key == "rolloutID")) {
                console.log("in if block: sending-->" + document.getElementById("btn_" + key) + ", "+key);

                document.getElementById(key).style.right = "calc(-100% + 47px)";
                toggleFlags[key] = 1;
                document.getElementById("btn_" + key).style.width = "45px";
            }
        }
        toggleMove(actionTarget, 100, 0, 300, mouseObject);
        if (toggleFlags[actionTarget] == 1) mouseObject.style.width = "45px";
    }

}

function generateOverview() {
    console.log("entering-> generateOverview()");
    let ovrvwHTML = "";
    // Define iterable key list from tripOverViewList
    editInputList = ["overview", "tripName", "duration", "dateStart", "dateEnd", "embarkationDate", "debarkationDate",
        "cruiseLine", "cruiseLineCommon", "cruiseLineAbbr", "shipName", "embarkatonCity", "embarkationCountry",
        "embarkationCountryAbbr", "debarkationCity", "debarkationCountry", "debarkationCountryAbbr", "travelerFName",
        "travelerMI", "travelerLName", "travelerMobileIntnl"];
    document.getElementById("overviewHeader").innerHTML = tripOverViewList.duration + " Day " + tripOverViewList.tripName;
    for (let i = 3; i < editInputList.length; i++) {
        //console.log("applying-> " + tripOverViewList[editInputList[i]]+" from " + editInputList[i] + " to " + editInputList[0] + editInputList[i]);
        document.getElementById(editInputList[0] + editInputList[i]).innerHTML = tripOverViewList[editInputList[i]];
    }
    
    return true;
}

function generateShipDetails() {
    console.log("entering-> generateShipDetails()");
    editInputList = ["shipInfo", "cruiseLine", "shipName", "stateRoom", "embarkationDate", "embarkatonCity", "embarkationCountry",
        "debarkationDate", "debarkationCity", "debarkationCountry", "tonnes", "guests", "shpLength", "maxBeam", "crew", "constructed", "reservationNumber"];

    for (let i = 1; i < editInputList.length; i++) {
        //console.log("applying-> " + tripOverViewList[editInputList[i]]+" from " + editInputList[i] + " to " + editInputList[0] + editInputList[i]);
        document.getElementById(editInputList[0] + editInputList[i]).disabled = false;
        document.getElementById(editInputList[0] + editInputList[i]).value = tripOverViewList[editInputList[i]];
        document.getElementById(editInputList[0] + editInputList[i]).disabled = true;
    }
    editInputList = [0];
    console.log("exiting-> generateShipDetails()");
    return true;
}
////['-1', 'Lisbon', 'Spain', '2023/06/14', '18:00', '24:00']
// [0:cruiseDay, 1:City, 2:Country, 3:Date, 4:Arrival, 5:Departure, 6:Terminal, 7:ActivityKey, 8:uniqueKey]
function generatePOCList() {
    console.log("entering-> generatePOCList()");
    let POCHTML = "";
    POCHTML += "<div id=\"primaryInformation\" class=\"boxStyle_01\"><div style=\"width:100%\">";
    POCHTML += "<div style=\"float:left; text-align:left; font-size:.9em;\">" + tripOverViewList.dateStart + "</div>";
    POCHTML += "<div style=\"float:right; text-align:left; font-size:.9em;\">" + tripOverViewList.dateEnd + "</div>";
    POCHTML += "<div style=\"text-align:center; font-weight:bold; margin-left:100px; \">";
    POCHTML += tripOverViewList.cruiseLineAbbr + " " + tripOverViewList.shipName + "</div></div>";
    POCHTML += "<div style=\"width:100%; height:20px\"><div style=\"float: left; text-align: left;\">" + tripOverViewList.embarkatonCity + ", " + tripOverViewList.embarkationCountryAbbr +"</div>";
    POCHTML += "<div style=\"float: right; text-align: right;\">" + tripOverViewList.debarkationCity + ", " + tripOverViewList.debarkationCountryAbbr+"</div>";
    POCHTML += "</div></div>";
    
    
    //for (const portItem of portList) {
    //    POCHTML += "<div id=\"dayItem_" + portItem[0] + "\" style=\"position:relative; width:100%; cursor:pointer; height:40px;\" onclick=\"viewDaySelectedRollout("+ portItem[7] + ", this, " + ((activityList[portItem[7]].schedule.length * 50) + 46 + 42) + ")\">"; //((# of activities tin this day's schedule)*50(row height(40)margin(6)border(4))+header(46)+42(addBtn))
    //    POCHTML += "<div class=\"boxStyle_01\" style=\"position:relative; float:left; background-color:#aaccee; width:27px; height:100%; text-align:center; font-size:24px; border-radius:5px 3px 3px 20px;\">";
    //    POCHTML += "<div id=\"dayItem_"+ portItem[0] + "_Day\" style=\"padding-top:5px;\">" + portItem[0] + "</div></div>";
    //    POCHTML += "<div class=\"boxStyle_01\" style=\"position:relative; float:right; width: calc(100% - 40px); height:40px; border-radius:3px 6px 6px 3px;\">";
    //    POCHTML += "<table cellpadding =\"0\" cellspacing=\"0\" style=\"width: 100%;\"><tr>";
    //    POCHTML += "<td id=\"dayItem_" + portItem[0] + "_CityCountry\" colspan=\"5\"style=\"text-align:center\">" + portItem[1] + ", " + portItem[2] + "</td></tr>";
    //    POCHTML += "<tr><td id=\"dayItem_" + portItem[0] + "_Date\" style=\"width: 76px; text-align:left; font-size:.9em;\">" + portItem[3] + "</td><td></td>";
    //    POCHTML += "<td id=\"dayItem_" + portItem[0] + "_Arrival\" style=\"text-align:center; width:36px; font-size:.9em\">" + portItem[4] + "</td><td width=\"8px\" style=\"text-align:center\">-</td><td id=\"dayItem_" + portItem[0] + "_Departure\" style=\"width:36px; text-align:center;font-size:.9em\">" + portItem[5] + "</td></tr></table>";
    //    POCHTML += "</div></div>";
    //    POCHTML += "<div id=\"dayItem_" + portItem[0] + "Rollout\" style=\"height:0px; width: calc(100% - 10px); margin-left: 5px; padding: 0px; display:none; background-color: #00000055; overflow:hidden;\"></div>";
    //}
    // [tripDay, calDateYDFormat, cruiseDay, portKey]
    for (const [CalendarKey, CalendarItem] of Object.entries(tripCalendar)) {
        POCHTML += "<div id=\"dayItem_" + CalendarItem[0] + "\" style=\"width:100%; cursor:pointer; min-height:40px;\" onclick=\"viewDaySelectedRollout(" + CalendarKey + ", this, " + ((activityList[portList[CalendarItem[3]][7]].schedule.length * 50) + 46 + 42) + ")\">"; //((# of activities tin this day's schedule)*50(row height(40)margin(6)border(4))+header(46)+42(addBtn))
        POCHTML += "<div class=\"boxStyle_01\" style=\"float:left; background-color:#aaccee; width:27px; height:40px; text-align:center; font-size:24px; border-radius:5px 3px 3px 20px;\">";
        POCHTML += "<div id=\"dayItem_" + CalendarItem[0] + "_Day\" style=\"padding-top:5px;\">" + CalendarItem[2] + "</div></div>";
        POCHTML += "<div class=\"boxStyle_01\" style=\"width: calc(100% - 40px); height:40px; border-radius:3px 6px 6px 3px;\">";
        POCHTML += "<table cellpadding =\"0\" cellspacing=\"0\" style=\"width: 100%;\"><tr>";
        POCHTML += "<td id=\"dayItem_" + CalendarItem[0] + "_CityCountry\" colspan=\"5\"style=\"text-align:center\">" + portList[CalendarItem[3]][1] + ", " + portList[CalendarItem[3]][2] + "</td></tr>";
        POCHTML += "<tr><td id=\"dayItem_" + CalendarItem[0] + "_Date\" style=\"width: 76px; text-align:left; font-size:.9em;\">" + CalendarItem[1] + "</td><td></td>";
        POCHTML += "<td id=\"dayItem_" + CalendarItem[0] + "_Arrival\" style=\"text-align:center; width:36px; font-size:.9em\">" + portList[CalendarItem[3]][4] + "</td><td width=\"8px\" style=\"text-align:center\">-</td><td id=\"dayItem_" + CalendarItem[0] + "_Departure\" style=\"width:36px; text-align:center;font-size:.9em\">" + portList[CalendarItem[3]][5] + "</td></tr></table>";
        POCHTML += "</div></div>";
        POCHTML += "<div id=\"dayItem_" + CalendarItem[0] + "Rollout\" style=\"height:0px; width: calc(100% - 10px); margin-left: 5px; padding: 0px; display:none; background-color: #00000055; overflow:hidden;\"></div>";
    }
    POCHTML = POCHTML + "<div style=\"position:relative; margin-left:10px; float:left; width:40px; height:30px; text-align:center; font-size:24px; cursor:pointer\" class=\"boxStyle_01\" onclick=\"addPortOfCall(this)\">+</div>";
    document.getElementById('portOfCallList').innerHTML = POCHTML;

    return true;
}



function generateTravelInfoPanel() {
    return true;
}

function generateEmergencyPanel() {
    console.log("entering-> generateEmergencyPanel()");
    let EmgcyHTML = "";
    EmgcyHTML += "<div id=\"emergencyPanelHeader\" class=\"boxStyle_01\" style=\"width: calc(100% - 5px); background-color:#600; border: #700 solid 1px; height:35px;\">";
    EmgcyHTML += "<div style=\"text-align:center; font-weight:bold; color:#fee; padding-top:7px\">Emergency Information</div></div>";

    //let i;
    for (let item = 0; item < emergencyDataList.length; item++) {
        EmgcyHTML += "<div id=\"emgcyGroup_" + item + "\" class=\"boxStyle_01\" style=\"position:relative; margin: 8px auto 0px auto; width: calc(100% - 15px); background-color:#500; border: #600 solid 1px; border-top:none; padding:0px 3px 3px 3px;\">";
        EmgcyHTML += "<div id=\"emgcyGroup" + item + "_title\" style=\"position:relative; height:27px; left:-3px; width:calc(100% + 6px); padding-left: 3px; text-align:center; font-size:16px; color: #ffffffee; background-color: #77777799;\">";
        EmgcyHTML += "<div style=\"position:relative; float:left; background-color:#cceecc44; margin:2px; border:none; padding:1px; height:19px; width: 19px; border-radius:2px; cursor:pointer;\" onclick=\"emgcyDataEdit.editItem(" + item + ", 0)\"><img src=\"./images/pencilEdit.svg\" height=\"19px\" width=\"19px\"></div>";
        EmgcyHTML += "<div style=\"position:relative; float:left; background-color:#eecccc44; margin:2px; margin-left: 10px; border:none; padding:1px; height:19px; width:19px; border-radius:2px; cursor:pointer;\" onclick=\"emgcyDataEdit.alert(" + item + ", 0)\"><img src=\"./images/trashBin.svg\" height=\"19px\" width=\"19px\"></div>";
        EmgcyHTML += emergencyDataList[item][0] + "</div>";
        EmgcyHTML += "<table style=\"border-spacing: 0px; border-collapse: separate;\">"
        for (let i = 1; i < emergencyDataList[item].length; i++) {
            EmgcyHTML += "<tr><td><div id=\"greenItem"+item+i +"\" style=\"background-color:#cceecc77; margin:2px;border:none;padding:1px; height:19px; border-radius:2px; cursor:pointer;\" onclick=\"emgcyDataEdit.editItem("+ item +","+ i +")\"><img src=\"./images/pencilEdit.svg\" height=\"19px\" width=\"19px\"></div></td>";
            EmgcyHTML += "<td><div id=\"redItem" + item + i + "\"style=\"background-color:#eecccc77; margin:2px; margin-left: 10px; border:none;padding:1px; height:19px; border-radius:2px; cursor:pointer;\" onclick=\"emgcyDataEdit.alert(" + item + "," + i +")\"><img src=\"./images/trashBin.svg\" height=\"19px\" width=\"19px\"></div></td>";
            EmgcyHTML += "<td style=\"color:#ffffffee;padding-right: 5px; padding-left: 10px; font-size:15px;\"><div id=\"emgcyLabel_" + item + i + "\">" + emergencyDataList[item][i][0] + ":</div></td><td><input id=\"emgcyData_" + item + i +"\" type=\"text\" value=\"" + emergencyDataList[item][i][1] + "\" disabled style=\"background-color:#ffffff00; border:none; color:#bbb; font-size:14px;\"/></td></tr>";
                    }
        EmgcyHTML += "</table>";
        EmgcyHTML += "<div id=\"emgcyItemAdd_g"+ item +"\" class=\"boxStyle_01\" style=\"float:left; margin-left:0px; margin-top:5px; border-radius:4px; width:20px; height: 20px; color: #ffffffaa; text-align:center; background-color: #77777799; font-size:16px; cursor:pointer;\" onclick=\"emgcyDataEdit.addItem("+ item +")\">+</div>";
        EmgcyHTML += "</div>";
    }
    EmgcyHTML += "<div id=\"emgcyGroupAdd\" class=\"boxStyle_01\" style=\"float:left; margin-left:4px; margin-top:5px; width:29px; height: 29px; color: #ffffffaa; text-align:center; background-color: #500; font-size:24px; cursor:pointer;\" onclick=\"emgcyDataEdit.addGroup()\">+</div>";
    document.getElementById('emergancyInfo').innerHTML = EmgcyHTML;

    return true;
}

function populateConfigPanelData() {
    let popConfigPanelList = [];
    Array.from(document.getElementById('form_generalInfo').elements).forEach((input) => { popConfigPanelList.push((input.id).substring(7)) });
    for (configItem of popConfigPanelList) {
        if (configItem != "duration" && configItem != "cruiseDuration") {
            document.getElementById("config_" + configItem).value = tripOverViewList[configItem];
        } else if (configItem == "duration") {
            document.getElementById("config_duration").value = calcDuration(tripOverViewList["dateStart"], tripOverViewList["dateEnd"]);
        } else if (configItem == "cruiseDuration") {
            document.getElementById("config_cruiseDuration").value = calcDuration(tripOverViewList['embarkationDate'], tripOverViewList['debarkationDate']);
        }
    }
    
    return true;
}

function calcDuration(dateA, dateB) {
    let msA = new Date(dateA);
    let msB = new Date(dateB);
        return Math.abs(msA - msB) / msPerDay;
}

var editInputList = [0];
function initEditPanel(panelID) {
    editInputList=[];
    if (panelID == 'shipDetails') {
        editInputList = ["shipInfo", "cruiseLine", "shipName", "stateRoom", "embarkationDate", "embarkatonCity", "embarkationCountry",
            "debarkationDate", "debarkationCity", "debarkationCountry", "tonnes", "guests", "shpLength", "maxBeam", "crew", "constructed", "reservationNumber"];
        document.getElementById(editInputList[0] + editInputList[1]).disabled = false;
        document.getElementById(editInputList[0] + editInputList[1]).focus();
        for (let i = 2; i < editInputList.length; i++) {
            document.getElementById(editInputList[0] + editInputList[i]).disabled = false;
        }
        document.getElementById('btn_Edit' + editInputList[0]+'Accept').style.display = "inline";
        document.getElementById('btn_Edit' + editInputList[0] +'Cancel').style.display = "inline";
        document.getElementById('btn_Edit' + editInputList[0]).style.display = "none";
    }
    if (panelID == 'config_GeneralInfo') {
        Array.from(document.getElementById('form_generalInfo').elements).forEach((input) => { editInputList.push(input.id)});
        console.log(editInputList);
        for (item of editInputList) {
            if (item != "duration" || item != "cruiseDuration") {
                document.getElementById(item).disabled = false;
            }
        }
        document.getElementById('btn_EditGeneralInfo_Accept').style.display = "inline";
        document.getElementById('btn_EditGeneralInfo_Cancel').style.display = "inline";
        document.getElementById('btn_EditGeneralInfo').style.display = "none";
    }
}

function acceptEditPanel(panelID) {
    document.activeElement.blur();
    if (panelID == 'shipDetails') {
        document.getElementById(editInputList[0] + editInputList[1]).blur();
        for (let i = 1; i < editInputList.length; i++) {
            tripOverViewList[editInputList[i]] = document.getElementById(editInputList[0] + editInputList[i]).value;
            document.getElementById(editInputList[0] + editInputList[i]).disabled = true;
        }
        document.getElementById('btn_Edit' + editInputList[0] + 'Accept').style.display = "none";
        document.getElementById('btn_Edit' + editInputList[0] + 'Cancel').style.display = "none";
        document.getElementById('btn_Edit' + editInputList[0]).style.display = "inline";
    }
    if (panelID == 'config_GeneralInfo') {
        Array.from(document.getElementById('form_generalInfo').elements).forEach((input) => { editInputList.push((input.id).substring(7)) });
        console.log(editInputList);
        for (item of editInputList) {
            tripOverViewList[item] = document.getElementById("config_" + item).value;
            document.getElementById("config_" + item).disabled = true;
        }
        document.getElementById('btn_EditGeneralInfo_Accept').style.display = "none";
        document.getElementById('btn_EditGeneralInfo_Cancel').style.display = "none";
        document.getElementById('btn_EditGeneralInfo').style.display = "inline";
    }
    editInputList = [0];
    toggleFlags[panelID] = 1;
    storeUserData();
    toggleFlags[panelID] = -1;
}

function cancelEditPanel(panelID) {
    document.activeElement.blur();
    if (panelID == 'shipDetails') {
        document.getElementById(editInputList[0] + editInputList[1]).blur();
        for (let i = 1; i < editInputList.length; i++) {
            document.getElementById(editInputList[0] + editInputList[i]).value = tripOverViewList[editInputList[i]];
            document.getElementById(editInputList[0] + editInputList[i]).disabled = true;
        }
        document.getElementById('btn_Edit' + editInputList[0] + 'Accept').style.display = "none";
        document.getElementById('btn_Edit' + editInputList[0] + 'Cancel').style.display = "none";
        document.getElementById('btn_Edit' + editInputList[0]).style.display = "inline";

    }
    if (panelID == 'config_GeneralInfo') {
        Array.from(document.getElementById('form_generalInfo').elements).forEach((input) => { editInputList.push((input.id).substring(7)) });
        console.log(editInputList);
        for (item of editInputList) {
            document.getElementById("config_"+item).value = tripOverViewList[item];
            document.getElementById("config_"+item).disabled = true;
        }
        document.getElementById('btn_EditGeneralInfo_Accept').style.display = "none";
        document.getElementById('btn_EditGeneralInfo_Cancel').style.display = "none";
        document.getElementById('btn_EditGeneralInfo').style.display = "inline";
    }
    editInputList = [0];
}

function toggleRollout(rollCap, rollHeight, portListIndex = null) {   
    if (rollHeight == 'auto') {
        rollHeight = document.getElementById(rollCap.id + "Rollout").scrollHeight;
    }
    let rollDir;
    let heightNow;
    stopPOCTimer(); // Clear countdown timer to prevent duplicates - countdown is relative to .now so restarting is ok
    rolloutPanel = document.getElementById(rollCap.id + "Rollout");
    rolloutPanel.style.display = "block";
    rolloutPanel.style.visibility = "visible";
    if (getComputedStyle(rolloutPanel).height === "0px") {
        rollDir = 1;
        heightNow = 0;
        if (portListIndex != null) startPOCTimer(portListIndex); // If opening a panel, Start Timer for that panel's data
    } else {
        rollDir = -1;
        heightNow = parseInt(getComputedStyle(rolloutPanel).height.match("^[\\d]+"));
    }
    let slideID = setInterval(rollUpDown, 15);

    console.log(heightNow);
    console.log(slideID);
    function rollUpDown() {
        heightNow = heightNow + (10 * rollDir);
        if ((heightNow > 0) && (heightNow < rollHeight)) {
            //console.log(heightNow);
            heightNow = heightNow + (10 * rollDir);
            rolloutPanel.style.height = heightNow + 'px';
        } else if (heightNow <= 0) {
            console.log('cancel with <=0');
            rolloutPanel.style.height = "0px";
            clearInterval(slideID);
            slideID = null;
            //rolloutPanel.style.display = "none";
            rolloutPanel.style.visibility = "hidden";
            if (rollCap.id.includes("dayItem_"))  toggleFlags.rolloutID = null; 
        } else if (heightNow >= rollHeight) {
            console.log('cancel with >=0');
            rolloutPanel.style.height = rollHeight + "px";
            clearInterval(slideID);
            slideID = null;
        }
    }
}

function launchPopUp(popTarget, targetData) {
    
    //console.log("PopUp=" + popTarget);
    document.getElementById("pupUpInteractionBlocker").style.display = "block";
    let alertHTML = ""
    alertHTML = "<span style=\"font-size:24px; font-weight:bold; color:red;\">- Warning -</span><br />";
    document.getElementById("popUpPanel").style.display = "block";
    switch (popTarget) {
        case "clearAllData":
            alertHTML = "<span style=\"font-size:24px; font-weight:bold; color:red;\">- Warning -</span><br />";
            alertHTML += "This operation will irrevocably erase all data from <strong>this app</strong> and re-load the default values.<br /><br />";
            alertHTML += "<input type=\"button\" onclick=\"closePopUp()\" value=\"* Cancel *\" style=\"width:125px\"\><br /><br />";
            alertHTML += "<input type=\"button\" onclick=\"clearAllData()\" value=\"Erase Planning Data\"  style=\"width:125px\"\><br />";

            //clearAllData();
            break;
        case "addPortOfCall":
            addPortOfCall();
            break;
        case "trashPOCDay":
            alertHTML += "This operation will irrevocably trash <strong>Port of Call " + targetData[0] + "</strong> and all scheduled activities for that day.<br /><br />";
            alertHTML += "<input type=\"button\" onclick=\"closePopUp()\" value=\"* Cancel *\" style=\"width:125px\"\><br /><br />";
            alertHTML += "<input type=\"button\" onclick=\"closePopUp(); trashPOCDay(" + targetData[0] + ", " + targetData[1] + ");\" value=\"Trash Port/Day\"  style=\"width:125px\"\><br />";
            break;
        case "emData":
            if (targetData[1] > 0) {
                alertHTML += "This operation will irrevocably remove <strong>" + emergencyDataList[targetData[0]][targetData[1]][0] + "</strong>.<br /><br />";
                alertHTML += "<input type=\"button\" onclick=\"closePopUp();\" value=\"* Cancel *\" style=\"width:125px\"\><br /><br />";
                alertHTML += "<input type=\"button\" onclick=\"closePopUp(); emgcyDataEdit.removeItem(" + targetData[0] + ", " + targetData[1] + ");\" value=\"Remove Item\"  style=\"width:125px\"\><br />";
            } else if (targetData[1] == 0) {
                alertHTML += "This operation will irrevocably remove <strong>The Entire Group:" + emergencyDataList[targetData[0]][0] + "</strong>.<br /><br />";
                alertHTML += "<input type=\"button\" onclick=\"closePopUp();\" value=\"* Cancel *\" style=\"width:125px\"\><br /><br />";
                alertHTML += "<input type=\"button\" onclick=\"closePopUp(); emgcyDataEdit.removeGroup(" + targetData[0] + ");\" value=\"Remove Item\"  style=\"width:125px\"\><br />";
            }

            break;
    }
    document.getElementById("popUpPanel").innerHTML = alertHTML;
    return true;
}

function closePopUp() {
    document.getElementById("popUpPanel").innerHTML = "-";
    document.getElementById("popUpPanel").className = "popUpDefaultStyle";
    document.getElementById("popUpPanel").style.display = "none";
    document.getElementById("pupUpInteractionBlocker").style.display = "none";
}

function addPortOfCall(addNewPOCButton) {
    //console.log("PopUp in addPortOfCall");
    /* As add Line not PopUp
     * https://www.w3schools.com/jsref/met_node_insertbefore.asp
     * ->>    addNewPOCButton.parentNode.insertBefore(document.createElement("div"), addNewPOCButton);
     * or ->> document.getElementById('portOfCallList').lastChild.style
     * 
     * for (const portItem of portList) {
        POCHTML += "<div id=\"dayItem_" + portItem[0] + "\" style=\"position:relative; width:100%; cursor:pointer; height:40px;\" onclick=\"viewDaySelectedRollout(" + portItem[0] +", this, " + ((activityList[portItem[0]].schedule.length*44)+55+32+12) + ")\">"; //((# of activities tin this day's schedule)*40(row height(40)margin(2)border(2))+header(50)+32(add)+10(borders/margins/padding)
        POCHTML += "<div class=\"boxStyle_01\" style=\"position:relative; float:left; background-color:#aaccee; width:27px; height:100%; text-align:center; font-size:24px; border-radius:5px 3px 3px 20px;\">";
        POCHTML += "<div style=\"padding-top:5px;\">" + portItem[0] + "</div></div>";
        POCHTML += "<div class=\"boxStyle_01\" style=\"position:relative; float:right; width: calc(100% - 40px); height:40px; border-radius:3px 6px 6px 3px;\">";
        POCHTML += "<table cellpadding =\"0\" cellspacing=\"0\" style=\"width: 100%;\"><tr>";
        POCHTML += "<td colspan=\"5\"style=\"text-align:center\">" + portItem[1] + ", " + portItem[2] + "</td></tr>";
        POCHTML += "<tr><td style=\"width: 76px; text-align:left; font-size:.9em;\">" + portItem[3] + "</td><td></td>";
        POCHTML += "<td style=\"text-align:center; width:36px; font-size:.9em\">" + portItem[4] + "</td><td width=\"8px\" style=\"text-align:center\">-</td><td width=\"36px\" style=\"width:36px; text-align:center;font-size:.9em\">" + portItem[5] + "</td></tr></table>";
        POCHTML += "</div></div>";
        POCHTML += "<div id=\"dayItem_" + portItem[0] + "Rollout\" style=\"height:0px; width: calc(100% - 10px); margin-left: 5px; padding: 0px; display:none; background-color: #00000055; overflow:hidden;\"></div>";
    }
    target-->> 'portOfCallList' innerHTML panel
    */

    //const addPOCBox = document.getElementById("popUpPanel");
    //const default_POC_Data = ["0", "City / Ship Name", "Country / 'At Sea'", "2020/12/31", "00:00", "24:00", "0", "0"]; // defined in datascripts.js
    let newPOC_Item = document.createElement("div");
    let newPOC_Rollout = document.createElement("div");
    let nextDayNumber = 0;
    let newPocItm_HTML = "";

    // Determine last day number - probably will not match the index, possibly unordered
    let seedActivityKey = 0;
    for (i of portList) {
        n = parseInt(i[0]);
        a = parseInt(i[7]);
        nextDayNumber = n > nextDayNumber ? n : nextDayNumber;
        seedActivityKey = a > seedActivityKey ? a : seedActivityKey
    }
    nextDayNumber += 1;  //increment last day +1

    default_POC_Data[0] = "" + nextDayNumber;
    default_POC_Data[7] = "" + seedActivityKey;
    portList.push(default_POC_Data); //append default data to main portList
    portItem = portList[portList.length - 1];  //  unify referance syntax with primary POC generator
    seedNewDayActivity(default_POC_Data);

    //Define div's and elements for display
    newPOC_Item.id = "dayItem_" + portItem[0];
    newPOC_Item.style.cssText = "position:relative; width:100%; cursor:pointer; height:40px";
    newPOC_Item.setAttribute("onclick", "viewDaySelectedRollout("+ portItem[7] + ", this, " + (50 + 46 + 42) + ")")
    //newPOC_Item.setAttribute("onclick", "viewDaySelectedRollout(" + portItem[0] + ", this, " + (50 + 46 + 42) + ")")
    // document.getElementById('dayItem_2').style.cssText = "position:relative; width:100%; cursor:pointer; height:40px"
    newPocItm_HTML += "<div class=\"boxStyle_01\" style=\"position:relative; float:left; background-color:#aaccee; width:27px; height:100%; text-align:center; font-size:24px; border-radius:5px 3px 3px 20px;\">";
    newPocItm_HTML += "<div id=\"dayItem_" + portItem[0] + "_Day\" style=\"padding-top:5px;\">" + portItem[0] + "</div></div>";
    newPocItm_HTML += "<div class=\"boxStyle_01\" style=\"position:relative; float:right; width: calc(100% - 40px); height:40px; border-radius:3px 6px 6px 3px;\">";
    newPocItm_HTML += "<table cellpadding =\"0\" cellspacing=\"0\" style=\"width: 100%;\"><tr>";
    newPocItm_HTML += "<td id=\"dayItem_" + portItem[0] + "_CityCountry\" colspan=\"5\" style=\"text-align:center\">" + portItem[1] + ", " + portItem[2] + "</td></tr>";
    newPocItm_HTML += "<tr><td id=\"dayItem_" + portItem[0] + "_Date\" style=\"width: 76px; text-align:left; font-size:.9em;\">" + portItem[3] + "</td><td></td>";
    newPocItm_HTML += "<td id=\"dayItem_" + portItem[0] + "_Arrival\" style=\"text-align:center; width:36px; font-size:.9em\">" + portItem[4] + "</td><td width=\"8px\" style=\"text-align:center\">-</td><td id=\"dayItem_" + portItem[0] + "_Departure\" style=\"width:36px; text-align:center;font-size:.9em\">" + portItem[5] + "</td></tr></table>";
    newPocItm_HTML += "</div>";
    

    newPOC_Rollout.id = "dayItem_" + portItem[0] + "Rollout";
    newPOC_Rollout.style.cssText = "height:0px; width: calc(100% - 10px); margin-left: 5px; padding: 0px; display:none; background-color: #00000055; overflow:hidden;"

    // insert defined items into DOM, order is important
    addNewPOCButton.parentNode.insertBefore(newPOC_Item, addNewPOCButton);
    newPOC_Item.innerHTML = newPocItm_HTML;

    addNewPOCButton.parentNode.insertBefore(newPOC_Rollout, addNewPOCButton);

    /*Old - Popup insertion method
     * addPOCBox.className = "boxStyle_01";
    addPOCBox.style.height = "300px";
    addPOCBox.style.top = "calc(50 % - 100px)";
    
    addPortHTML += "<form id='pocAddForm'><table style=\"width:100%\"><tr>";
    addPortHTML += "<td colspan=\"2\" style=\"text-align:center;\"><span style=\"font-size:16px; font-weight:bold; color:black;\">Add New Port of Call</span></td></tr>";
    addPortHTML += "<tr><td>Cruise Day:</td><td><input type=\"text\" value=\"" + nextDayNumber + "\" oninput=\"validateForm(this,'number',2)\" disabled /></td></tr>";
    addPortHTML += "<tr><td>Port City or 'At Sea':</td><td><input type=\"text\" value=\"Evansville\" oninput=\"validateForm(this,'plainText')\" /></td></tr>";
    addPortHTML += "<tr><td>Port Country or 'Ship Name':</td><td><input type=\"text\" value=\"United States\" oninput=\"validateForm(this,'plainText')\" /></td></tr>";
    addPortHTML += "<tr><td>Date of Arrival:</td><td><input type=\"text\" value=\"2000/12/31\" oninput=\"validateForm(this,'dateAsText')\" /></td></tr>";
    addPortHTML += "<tr><td>Arrival Time:</td><td><input type=\"text\" value=\"24:00\" oninput=\"validateForm(this,'time24')\" /></td></tr>";
    addPortHTML += "<tr><td>Departure Time:</td><td><input type=\"text\" value=\"24:00\" oninput=\"validateForm(this,'time24')\" /></td></tr>";
    addPortHTML += "<tr><td><div style=\"margin-left:10px; background-image: url('./images/checkMark.svg'); background-size: cover; width:35px; height:35px; border:0px; cursor:pointer\" onclick=\"appendToList(portList,document.getElementById('pocAddForm'));seedNewDayActivity(document.getElementById('pocAddForm'));generatePOCList();storeUserData();\"/></td><td><div style=\"margin-left:10px; background-image: url('./images/xMark.svg'); background-size: cover; width:35px; height:35px; border:0px; cursor:pointer\" onclick=\"closePopUp()\"/></td></tr></table></form>";

    document.getElementById("popUpPanel").innerHTML = addPortHTML;
    document.getElementById("popUpPanel").style.display = "block";
    */
}

function seedNewDayActivity(seedData) {
    const defaultData = { "cruiseDay": seedData[0], "city": seedData[1], "schedule": [{ "location": "Location(ie. Jim's Cantina)", "activity": "0", "start": "7:00", "end": "9:00", "notes": "Notes..." }] };
    activityList[seedData[7]] = defaultData;
}

function appendNewDayActivity(targetData, rollCapId, rollHeight) {
    const defaultData = { "location": "Location(ie. Jim's Cantina)", "activity": "0", "start": "8:00", "end": "9:30", "notes": "Notes..." };
    activityList[targetData].schedule.push(defaultData);
    //regenerate list and view/extend IFF rollCap and height are provided
    if (rollCapId != null && rollHeight != null) {
        //let POCDay = document.getElementById(rollCapId).id.substring(8); // not used
        viewDaySelectedRollout(targetData, document.getElementById(rollCapId), rollHeight + 50, true);
    }

}


// function editCurrentDayPOC(portIndex, targetData) {
function editCurrentDayPOC(targetCalendarKey) {

    //refactoring into a Key/value list removes need for sorting, as well as the option to sort in the first place ::-> portList.sort(function (a, b) { return a[3] - b[3] });
    const blockPanelTop = document.createElement('div');
    const blockPanelTBottom = document.createElement('div');

    //const portHeader = document.getElementById('dayItem_' + portIndex);
    const portHeader = document.getElementById('dayItem_' + targetCalendarKey);
    const portHeaderDiv_Day = portHeader.childNodes[0].firstChild;
    //const portHeaderDiv_CC = document.getElementById('dayItem_' + portIndex + '_CityCountry');
    //const portArrivalDiv = document.getElementById('daySelectHeader_' + portIndex + '_Arrival');
    //const portDepartureDiv = document.getElementById('daySelectHeader_' + portIndex + '_Departure');
    //const portDateDiv = document.getElementById('daySelectHeader_' + portIndex + '_Date');
    //const portTerminalDiv = document.getElementById('daySelectHeader_' + portIndex + '_Terminal');
    const portHeaderDiv_CC = document.getElementById('dayItem_' + targetCalendarKey + '_CityCountry');
    const portArrivalDiv = document.getElementById('daySelectHeader_' + targetCalendarKey + '_Arrival');
    const portDepartureDiv = document.getElementById('daySelectHeader_' + targetCalendarKey + '_Departure');
    const portDateDiv = document.getElementById('daySelectHeader_' + targetCalendarKey + '_Date');
    const portTerminalDiv = document.getElementById('daySelectHeader_' + targetCalendarKey + '_Terminal');

    let portIndex = tripCalendar[targetCalendarKey][3];
    let currentRow = portIndex;

    const portItem = portList[tripCalendar[targetCalendarKey][3]];

    portHeader.setAttribute('onclick', null);
    portHeader.style.cursor = "auto";
    document.getElementById('portOfCallList').appendChild(blockPanelTop);
    document.getElementById('portOfCallList').appendChild(blockPanelTBottom);
    /*blockPanelTBottom.appendChild(editPOCAcceptBtn);
    blockPanelTBottom.appendChild(editPOCCancelBtn);
    editPOCAcceptBtn.innerHTML = "<img src='./images/checkMark.svg' style=\"height:30px; width:30px;\" />";
    editPOCAcceptBtn.style.cssText = "position:relative; float:left; left: calc(50% - 50px); background-color: #eeffeedd; width:35px; height:35px; text-align:center; padding-top:2px; border-radius:4px;";
    editPOCAcceptBtn.style.top = (activityList[targetData].schedule.length * 50) + 'px';
    editPOCCancelBtn.innerHTML = "<img src='./images/xMark.svg' style=\"padding-left:4px; height:30px; width:30px;\" />";
    editPOCCancelBtn.style.cssText = "position:relative; float:left; left: calc(50% + 15px); background-color: #ffeeeedd; width:35px; height:35px; text-align:center; padding-top:2px; border-radius:4px;";
    editPOCCancelBtn.style.top = (activityList[targetData].schedule.length * 50) + 'px';
    */

    blockPanelTop.setAttribute('div', 'pocBlockTop');
    blockPanelTop.style.cssText = "position:absolute; left:0px; top: 0px; width:100%; background-color:#00000044; z-index:29";
    blockPanelTBottom.setAttribute('div', 'pocBlockTop');
    blockPanelTBottom.style.cssText = "position:absolute; left:0px; width:100%; background-color:#00000044; z-index:29";

    blockPanelTBottomHTML = "";

    for (let i = 0; i < activityList[portItem[7]].schedule.length; i++) {
        //blockPanelTBottomHTML += "<div id=\"activity_" + targetData + i + "_toggle\" style=\"height:50px; width:100%;\"><div onclick=\"removePOCDayActivity(this, '" + targetData + "', " + i + ",'stage')\" style=\"position:relative; float:left; margin-left: 12px; top: 8px; background-color: #eeffeedd; width:35px; height:35px; text-align:center; padding-top:2px; border-radius:4px; cursor:pointer;\"><img src='./images/checkMark.svg' style=\"height:30px; width:30px;\" /></div>";
        //blockPanelTBottomHTML += "<div id=\"activity_" + targetData + i + "_stripe\" style=\"position:relative; float:left; height:20px; width: calc(100% - 55px); top: 16px; background-color:#00FF0055; border-radius: 0px 4px 4px 0px;\"></div></div>";
        blockPanelTBottomHTML += "<div id=\"activity_" + targetCalendarKey + i + "_toggle\" style=\"height:50px; width:100%;\"><div onclick=\"removePOCDayActivity(this, '" + targetCalendarKey + "', " + i + ",'stage')\" style=\"position:relative; float:left; margin-left: 12px; top: 8px; background-color: #eeffeedd; width:35px; height:35px; text-align:center; padding-top:2px; border-radius:4px; cursor:pointer;\"><img src='./images/checkMark.svg' style=\"height:30px; width:30px;\" /></div>";
        blockPanelTBottomHTML += "<div id=\"activity_" + targetCalendarKey + i + "_stripe\" style=\"position:relative; float:left; height:20px; width: calc(100% - 55px); top: 16px; background-color:#00FF0055; border-radius: 0px 4px 4px 0px;\"></div></div>";
    }

    //blockPanelTBottomHTML += "<div onclick=\"launchPopUp('trashPOCDay',[" + targetData+","+currentRow + "])\" style=\"position:relative; float:left; left: calc(50% - 150px); background-color: #ffccccdd; width:35px; height:35px; text-align:center; padding-top:2px; border-radius:4px; cursor:pointer;\"><img src='./images/trashBin.svg' style=\"height:30px; width:30px;\" /></div>";
    //blockPanelTBottomHTML += "<div onclick=\"acceptEditCurrentDayPOC(" + targetData +")\"style=\"position:relative; float:left; left: calc(50% - 50px); background-color: #eeffeedd; width:35px; height:35px; text-align:center; padding-top:2px; border-radius:4px; cursor:pointer;\"><img src='./images/checkMark.svg' style=\"height:30px; width:30px;\" /></div>";
    //blockPanelTBottomHTML += "<div onclick=\"cancelEditCurrentDayPOC("+ targetData +")\" style=\"position:relative; float:left; left: calc(50% + 15px); background-color: #ffeeeedd; width:35px; height:35px; padding-top:2px; border-radius:4px; cursor:pointer;\"><img src='./images/xMark.svg' style=\"position:relative; margin-left:4px; height:30px; width:30px;\" /></div>";
    blockPanelTBottomHTML += "<div onclick=\"launchPopUp('trashPOCDay',[" + targetCalendarKey + "," + currentRow + "])\" style=\"position:relative; float:left; left: calc(50% - 150px); background-color: #ffccccdd; width:35px; height:35px; text-align:center; padding-top:2px; border-radius:4px; cursor:pointer;\"><img src='./images/trashBin.svg' style=\"height:30px; width:30px;\" /></div>";
    blockPanelTBottomHTML += "<div onclick=\"acceptEditCurrentDayPOC(" + portIndex + ", " + targetCalendarKey + ")\"style=\"position:relative; float:left; left: calc(50% - 50px); background-color: #eeffeedd; width:35px; height:35px; text-align:center; padding-top:2px; border-radius:4px; cursor:pointer;\"><img src='./images/checkMark.svg' style=\"height:30px; width:30px;\" /></div>";
    blockPanelTBottomHTML += "<div onclick=\"cancelEditCurrentDayPOC(" + portIndex + ", " + targetCalendarKey + ")\" style=\"position:relative; float:left; left: calc(50% + 15px); background-color: #ffeeeedd; width:35px; height:35px; padding-top:2px; border-radius:4px; cursor:pointer;\"><img src='./images/xMark.svg' style=\"position:relative; margin-left:4px; height:30px; width:30px;\" /></div>";

    portHeaderDiv_Day.innerHTML = "<input id=\"POC_Edit_Day\" type=\"text\" value=\"" + portItem[0] + "\" oninput=\"validateForm(this,'number')\" style=\"font-size:18px; width:19px; text-align:center;\" />";
    portHeaderDiv_CC.innerHTML = "<input id=\"POC_Edit_City\" type=\"text\" value=\"" + portItem[1] + "\" style=\"width:120px;\" oninput=\"validateForm(this,'plainText')\" />, <input id=\"POC_Edit_Country\" type=\"text\" value=\"" + portItem[2] + "\" style=\"width:120px;\" oninput=\"validateForm(this,'plainText')\" />";
    portArrivalDiv.innerHTML = "<input id=\"POC_Edit_Arrival\" type=\"text\" value=\"" + portItem[4] + "\" style=\"width:75px;\" oninput=\"validateForm(this,'time24')\" />";
    portArrivalDiv.style.padding = "0px";
    portDepartureDiv.innerHTML = "<input id=\"POC_Edit_Departure\" type=\"text\" value=\"" + portItem[5] + "\" style=\"width: 75px; text-align: right;\" oninput=\"validateForm(this,'time24')\" />";
    portDepartureDiv.style.padding = "0px";
    portDateDiv.innerHTML = "<input id=\"POC_Edit_Date\" type=\"text\" value=\"" + portItem[3] + "\" oninput=\"validateForm(this,'dateAsText')\" style=\"width:75px;\" />";
    portDateDiv.style.padding = '0px';
    portTerminalDiv.innerHTML = "Term:<input id=\"POC_Edit_Terminal\" type=\"text\" value=\"" + portItem[6] + "\" oninput=\"validateForm(this,'number')\" style=\"width:24px; text-align:right;\"/>";
    portTerminalDiv.style.padding = '0px';

    blockPanelTop.style.height = (42 + ((currentRow) * 44)) + "px";
    blockPanelTBottom.style.top = (42 + ((currentRow + 1) * 44) + 46) + "px";
    blockPanelTBottom.style.height = ((activityList[portItem[7]].schedule.length * 50) + 42 + (portList.length - currentRow) * 44) + "px";

    blockPanelTBottom.innerHTML = blockPanelTBottomHTML;
}

function removePOCDayActivity(thisElement, targetData, i, thisAction,) {

    if (thisAction == "stage") {
        thisElement.innerHTML = "<img src='./images/xMark.svg' style=\"height:30px; width:30px;\" />";
        thisElement.setAttribute('onclick', "removePOCDayActivity(this,'" + targetData + "', " + i + ", 'clear')")
        document.getElementById("activity_" + targetData + i + "_stripe").style.backgroundColor = "#FF000055";
        if (!activityList.staged.includes(i)) { activityList.staged.push(i); }
    } else if (thisAction == "clear") {
        thisElement.innerHTML = "<img src='./images/checkMark.svg' style=\"height:30px; width:30px;\" />";
        thisElement.setAttribute('onclick', "removePOCDayActivity(this,'" + targetData + "', " + i + ", 'stage')")
        document.getElementById("activity_" + targetData + i + "_stripe").style.backgroundColor = "#00FF0055";
        if (activityList.staged.includes(i) && activityList.staged.length > 1) {
            iIndex = activityList.staged.indexOf(i);
            activityList.staged.splice(iIndex, 1);
        } else if (activityList.staged.length == 1) {
            activityList.staged.pop();
        }
    } else if (thisAction == "remove") {
        if (activityList.staged.length > 0) {
            for (item of activityList.staged) {
                activityList["" + targetData].schedule.splice(item, 1); // removes items assuming list in view has same ordering as data in activitiesList.schedule -> This should be guaranteed
            }
            activityList.staged.length = 0;  // clears staging list
            activityList["" + targetData].schedule.sort((a, b) => a.start - b.start);  // resorts remaining items - If there were edits prior to removal, the ordering could become unknown
        }
        if (activityList["" + targetData].schedule.length == 0) appendNewDayActivity(targetData, null, null); //schedule.length should not be 0, re-seed with default entry if schedule is empty
        storeUserData();
    }
    
    return true;
}

function cancelEditCurrentDayPOC(portIndex, targetData) {
    generatePOCList();
    toggleFlags.rolloutID = null;
    activityList.staged.length = 0;
    //viewDaySelectedRollout(("" + targetData), document.getElementById("dayItem_" + targetData), (activityList["" + targetData].schedule.length * 50) + 88);
    viewDaySelectedRollout(("" + targetData), document.getElementById("dayItem_" + targetData), (activityList["" + targetData].schedule.length * 50) + 88);
    return true;
}

function acceptEditCurrentDayPOC(portIndex, targetData) {
    removePOCDayActivity(null, targetData, null, "remove");
    arriveTimeEl = document.getElementById("POC_Edit_Arrival");
    departTimeEl = document.getElementById("POC_Edit_Departure");
    arriveTimeEl.value = enforceTimeFormat(arriveTimeEl);
    departTimeEl.value = enforceTimeFormat(departTimeEl);
    //let i;
    //for (i = 0; i < portList.length; i++) {
        //if (portList[i][7] == targetData) {
            //portList[i][0] = document.getElementById("POC_Edit_Day").value;
            //portList[i][1] = document.getElementById("POC_Edit_City").value;
            //portList[i][2] = document.getElementById("POC_Edit_Country").value;
            //portList[i][3] = document.getElementById("POC_Edit_Date").value;
            //portList[i][4] = arriveTimeEl.value;
            //portList[i][5] = departTimeEl.value;
            //portList[i][6] = document.getElementById("POC_Edit_Terminal").value;
        //}
    //}
    portList[portIndex][0] = document.getElementById("POC_Edit_Day").value;
    portList[portIndex][1] = document.getElementById("POC_Edit_City").value;
    portList[portIndex][2] = document.getElementById("POC_Edit_Country").value;
    portList[portIndex][3] = document.getElementById("POC_Edit_Date").value;
    portList[portIndex][4] = arriveTimeEl.value;
    portList[portIndex][5] = departTimeEl.value;
    portList[portIndex][6] = document.getElementById("POC_Edit_Terminal").value;

    generatePOCList();
    toggleFlags.rolloutID = null;
    storeUserData();
    //viewDaySelectedRollout(("" + targetData), document.getElementById("dayItem_" + targetData), (activityList["" + targetData].schedule.length * 50) + 88);
    viewDaySelectedRollout(("" + targetData), document.getElementById("dayItem_" + portIndex), (activityList["" + targetData].schedule.length * 50) + 88);

    return true;
}


function trashPOCDay(targetData, portIndex,) {
    console.log("entering trashPOCDay()");
    console.log("targetData=" + targetData + ", portIndex=" + portIndex);
    //console.log("portList.splice("+portIndex+",1)");
    //console.log("delete activityList['"+targetData+"']");
    // array.splice(a,b); --> take 'array' from index 'a' remove 'b' items, ie. (1,1) means remove 1 item, at array[1]; (2,3) means remove items [2],[3], and[4]
    // presumably this action is copying the back of the array after the operation, "pop-ing" all elements starting with 'a' and pushing (splicing) the copied array back onto the original
    portList.splice(portIndex, 1);
    delete activityList["" + targetData];
    toggleFlags.rolloutID = null;
    portList.sort();
    storeUserData();
    generatePOCList();
    console.log("exiting trashPOCDay()");
    return true;
}


function editCurrentDayActivity(targetData, i, rollCapID) {
    console.log("Entering editCurrentDayActivity()");
    for (let n = 0; n < activityList[targetData].schedule.length; n++) {
        //console.log("n="+n+", i="+i)
        if (n != i) {
            document.getElementById("buttonAImg" + targetData + n).style.cursor = "default";
            document.getElementById("buttonAImg" + targetData + n).style.opacity = "0.3";
            document.getElementById("buttonAImg" + targetData + n).setAttribute('onclick',null);
            document.getElementById("buttonBImg" + targetData + n).style.cursor = "default";
            document.getElementById("buttonBImg" + targetData + n).style.opacity = "0.3";
            document.getElementById("buttonBImg" + targetData + n).setAttribute('onclick',null);
        } else {
            for (const post$ of ["_start", "_end", "_location", "_activity", "_notes"]) {
                document.getElementById("dayItem" + targetData + i + post$).disabled = false;
                document.getElementById("dayItem" + targetData + i + post$).style.backgroundColor = "#ffffffaa";
                document.getElementById("dayItem" + targetData + i + post$).style.border = "#000 solid 1px";
                document.getElementById("dayItem" + targetData + i + post$).style.color = "#000";
            }
            document.getElementById("buttonAImg" + targetData + i).style.cursor = "default";
            document.getElementById("buttonAImg" + targetData + i).style.opacity = "0.3";
            document.getElementById("buttonAImg" + targetData + i).setAttribute('onclick', null);

            document.getElementById("buttonB" + targetData + i).innerHTML = "<img src=\"images/checkMark.svg\" onclick=\"closeCurrentDayActivityEdit(" + targetData + ", " + i + ", '" + rollCapID + "', true)\" style=\"width: 25px; height: 25px; cursor: pointer;\" />";
            document.getElementById("formDayActivityItemFooter" + targetData + i).style.display = "block";
            document.getElementById("dayItem" + targetData + i + "_start").focus();
        }
    }
    document.getElementById('dayActivityFooter').style.display = "none";
}


function closeCurrentDayActivityEdit(targetData, i, rollCapID, acceptEdit=false) {
    console.log("Entering closeCurrentDayActivityEdit()");
    document.activeElement.blur();
    for (let n = 0; n < activityList[targetData].schedule.length; n++) {
        if (n != i) {
            document.getElementById("buttonAImg" + targetData + n).style.cursor = "pointer";
            document.getElementById("buttonAImg" + targetData + n).style.opacity = "1.0";
            document.getElementById("buttonAImg" + targetData + i).setAttribute('onclick', null);
            document.getElementById("buttonBImg" + targetData + n).style.cursor = "pointer";
            document.getElementById("buttonBImg" + targetData + n).style.opacity = "1.0";
            document.getElementById("buttonBImg" + targetData + n).setAttribute('onclick','editCurrentDayActivity(' + targetData + ', ' + n + ')');

        } else {
            for (const post$ of ["_start", "_end", "_location", "_activity", "_notes"]) {
                let targetActivityElement = document.getElementById("dayItem" + targetData + i + post$);
                targetActivityElement.disabled = true;
                targetActivityElement.style.backgroundColor = "#ffffff11";
                targetActivityElement.style.border = "0px";
                targetActivityElement.style.color = "#222299";
                if (acceptEdit == false) {
                    if (targetActivityElement.type == "text" || targetActivityElement.type == 'textarea') {
                        targetActivityElement.value = activityList["" + targetData].schedule[i][post$.match("[^_]+")[0]];
                    } else if (targetActivityElement.type == "select-one") {
                        targetActivityElement.selectedIndex = activityList["" + targetData].schedule[i][post$.match("[^_]+")]
                    }
                } else if (acceptEdit == true) {
                    if (targetActivityElement.type == "text" || targetActivityElement.type == 'textarea') {
                        activityList["" + targetData].schedule[i][post$.match("[^_]+")] = targetActivityElement.value;
                    } else if (targetActivityElement.type == "select-one") {
                        activityList["" + targetData].schedule[i][post$.match("[^_]+")] = targetActivityElement.selectedIndex;
                    }
                }
            }
            document.getElementById("buttonAImg" + targetData + i).style.cursor = "pointer";
            document.getElementById("buttonAImg" + targetData + i).style.opacity = "1.0";
            document.getElementById("buttonAImg" + targetData + i).setAttribute('onclick', 'mapToLocation(' + activityList[targetData].schedule[i].location + ')');

            document.getElementById("buttonB" + targetData + i).innerHTML = "<img id=\"buttonBImg" + targetData + i + "\" src=\"./images/pencilEdit.svg\" style=\"height:25px; width:25px; cursor:pointer;\" onclick=\"editCurrentDayActivity(" + targetData + ", " + i + ")\" />";
            document.getElementById("formDayActivityItemFooter" + targetData + i).style.display = "none";
        }
    }
    if (acceptEdit == true) {
        // check/enforce time format
        
        /*
         * let sTime = document.getElementById('dayItem' + targetData + i + '_start').value;
        let eTime = document.getElementById('dayItem' + targetData + i + '_end').value;
        if (sTime.length != 5) {
            if (sTime.indexOf(':') == 1) sTime = "0" + sTime;
            if (sTime.indexOf(':') == 2) sTime += "0";
            if (sTime.indexOf(':') == -1 && sTime.length == 1) sTime = "0"+sTime+":00";
            if (sTime.indexOf(':') == -1 && sTime.length == 2) sTime += ":00";
        }
        if (eTime.length != 5) {
            if (eTime.indexOf(':') == 1) eTime = "0" + eTime;
            if (eTime.indexOf(':') == 2) eTime += "0";
            if (eTime.indexOf(':') == -1 && eTime.length == 1) eTime = "0" + eTime + ":00";
            if (eTime.indexOf(':') == -1 && eTime.length == 2) eTime += ":00";       
        }
        */
        sTimeElement = document.getElementById('dayItem' + targetData + i + '_start');
        sTime = enforceTimeFormat(sTimeElement);
        eTimeElement = document.getElementById('dayItem' + targetData + i + '_end');
        eTime = enforceTimeFormat(eTimeElement);
        activityList["" + targetData]["schedule"][i]["start"] = sTime;
        activityList["" + targetData]["schedule"][i]["end"] = eTime;
        //document.getElementById('dayItem' + targetData + i + '_start').value = sTime;
        //document.getElementById('dayItem' + targetData + i + '_end').value = eTime;
        sTimeElement.value = sTime;
        eTimeElement.value = eTime;
        sortActivityList("" + targetData);
        storeUserData();
        const rollCap = document.getElementById(rollCapID);
        const rollout = document.getElementById(rollCapID + "Rollout");
        const rollHeight = rollout.scrollHeight;
        //portIndex=
        viewDaySelectedRollout(targetData, rollCap, rollHeight, true);
    }

    document.getElementById('dayActivityFooter').style.display = "block";
}



function appendToList(listObj, formElement) {
    let i = [];
    for (n of formElement) {
        if (n.type == 'text') {
            i.push(n.value);
        }
    }
    listObj.push(i);
}

//function viewDaySelectedRollout(targetData, rollCap, rollHeight, itemAppended) {
function viewDaySelectedRollout(targetCalendarKey, rollCap, rollHeight, itemAppended) {

    //if ((toggleFlags.rolloutID != targetData) && (toggleFlags.rolloutID != null)) {
    if ((toggleFlags.rolloutID != targetCalendarKey) && (toggleFlags.rolloutID != null)) {
        document.getElementById("dayItem_" + toggleFlags.rolloutID + "Rollout").style.height = "0px";
        document.getElementById("dayItem_" + toggleFlags.rolloutID + "Rollout").style.display = "none";
        document.getElementById("dayItem_" + toggleFlags.rolloutID + "Rollout").innerHTML = "";
        toggleFlags.rolloutID = null;
    }
    //let portListIndex = 0; // raised from inside if block
    if (toggleFlags.rolloutID == null || itemAppended === true) {
        //toggleFlags.rolloutID = targetData;
        toggleFlags.rolloutID = targetCalendarKey;
        rolloutTarget = document.getElementById(rollCap.id + "Rollout")
        // let portListIndex = 0; //raised to outside of if block

        //for (portListIndex; portListIndex < Object.keys(portList).length; portListIndex++) {
        //    //if (portList[portListIndex][7] == targetData) break;
        //    if (portList[portListIndex][7] == targetCalendarKey) break;
        //}

        //let portYear = portList[portListIndex][3].match("^\\d{4}");
        let portYear = tripCalendar[targetCalendarKey][1].match("^\\d{4}")[0];
        //let portDayName = new Date(portList[portListIndex][3]).toLocaleDateString('en-us', { weekday: "long" }).toString();
        let portDayName = new Date(tripCalendar[targetCalendarKey][1]).toLocaleDateString('en-us', { weekday: "long" }).toString();
        //let portMonthName = new Date(portList[portListIndex][3]).toLocaleDateString('en-us', { month: "long" }).toString();
        let portMonthName = new Date(tripCalendar[targetCalendarKey][1]).toLocaleDateString('en-us', { month: "long" }).toString();
        //let portDayNum = portList[portListIndex][3].match("(?<=\/)\\d+$")[0];
        let portDayNum = tripCalendar[targetCalendarKey][1].match("(?<=\/)\\d+$")[0];
        //let portTerminalId = portList[portListIndex][6];
        let portTerminalId = portList[tripCalendar[targetCalendarKey][3]][6];

        //Set up Header
        let daySelectedHTML = "";
        daySelectedHTML += "<table id=\"daySelectHeader\"><tr><td id=\"daySelectHeader_" + targetCalendarKey + "_Arrival\" style=\"text-align:left; background-color:#44bb4499; border-bottom:#ffffff88 solid 1px;\">" + portList[tripCalendar[targetCalendarKey][3]][4] + "</td>";
        daySelectedHTML += "<td rowspan=\"2\" id=\"currentTimeObj\" style=\"text-align:center; width:54px; font-size:24px; border-left:#ffffff88 solid 1px; border-right:#ffffff88 solid 1px;background-color:#44bb4499;\">00:00</td>";
        daySelectedHTML += "<td id=\"daySelectHeader_" + targetCalendarKey + "_Departure\" style =\"text-align:right; background-color:#ee444499; border-bottom:#ffffff88 solid 1px;\">" + portList[tripCalendar[targetCalendarKey][3]][5] + "</td>";
        daySelectedHTML += "</tr><tr><td id=\"daySelectHeader_" + targetCalendarKey + "_Date\" style=\"text-align:left; font-size:14px; background-color:#ffffff44;\">" + portDayName + ",&nbsp;" + portMonthName + "&nbsp;" + portDayNum + "</td><td id=\"daySelectHeader_" + targetCalendarKey + "_Terminal\" style=\"font-size:14px;text-align:right; background-color:#ffffff44;\">Term. ID:" + portTerminalId + "</td>";
        daySelectedHTML += "</tr></table>";
        /*
         * daySelectHeader_" + portItem[0] + "_Arrival   
         * daySelectHeader_" + portItem[0] + "_Departure
         * currentTimeObj   [Non unique to allow current time to be persistent]
         * daySelectHeader_" + portItem[0] + "_Date
         * daySelectHeader_" + portItem[0] + "_Terminal
         */

        //let portSchedule = activityList[targetData].schedule;
        let portSchedule = activityList[portList[tripCalendar[targetCalendarKey][3]][7]].schedule;
        //Loop through activities
        for (let i = 0; i < portSchedule.length; i++) {
         //   daySelectedHTML += "<form id=\"formDayActivityItem" + targetData + i + "\"><table class=\"dayActivityItem\" style=\"width:100%;\">";
         //   daySelectedHTML += "<tr><td style=\"width:42px; background-color:#a0deff99;border-bottom:#ffffff99 solid 1px;\"><input id=\"dayItem" + targetData + i + "_start\" type=\"text\" value=\"" + portSchedule[i].start + "\" style=\"width:41px; font-size:16px;\" oninput=\"validateForm(this,'time24',5)\" disabled/></td><td id=\"buttonA" + targetData + i + "\" style=\"width:15px; padding-right:0px; padding-top:3px;\"><img id=\"buttonAImg" + targetData + i + "\" src=\"./images/compass.svg\" style=\"height: 15px; width: 15px; cursor:pointer;\" onclick=\"mapToLocation(\"" + portSchedule[i].location + "\")\" /></td><td style=\"width:40%;\"><input id=\"dayItem" + targetData + i + "_location\" type=\"text\" value=\"" + portSchedule[i].location + "\"  oninput=\"validateForm(this,'mixedText',36)\"disabled /></td>";
         //    daySelectedHTML += "<td><select id=\"dayItem" + targetData + i + "_activity\" disabled />";
         //   for (let item = 0; item < activityTypeList.length; item++) {
         //       daySelectedHTML += "<option value=\"" + item + "\" " + (item == portSchedule[i].activity ? 'selected' : '') + ">" + activityTypeList[item] + "</option>";
         //   }
         //   daySelectedHTML += "</select></td><td id=\"buttonB" + targetData + i + "\" rowspan=\"2\" style=\"width:27px;padding-top:10px;\"><img id=\"buttonBImg" + targetData + i + "\" src=\"./images/pencilEdit.svg\" style=\"height: 25px; width: 25px; cursor: pointer; opacity: 1\" onclick=\"editCurrentDayActivity(" + targetData + ", " + i + ", '" + rollCap.id + "')\" /></td></tr>";
         //   daySelectedHTML += "<tr><td style=\"width:42px; background-color:#a0deff99;\"><input id=\"dayItem" + targetData + i + "_end\" type=\"text\" value=\"" + portSchedule[i].end + "\" style=\"width:41px; font-size:16px;\"  oninput=\"validateForm(this,'time24',5)\" disabled /></td><td colspan=\"3\" style=\"font-size:14px;\"><textarea id=\"dayItem" + targetData + i + "_notes\" style=\"height:17px; font-size:13px; resize:none;\" disabled>" + portSchedule[i].notes + "</textarea></td></tr>";
         //   daySelectedHTML += "</table></form><div id=\"formDayActivityItemFooter" + targetData + i + "\" style=\"height:30px; width:50%; margin:auto; text-align:center; display:none;\"><img src=\"./images/trashBin.svg\" style=\"position:relative; float:left; width:25px; height:25px\" /><img src=\"./images/xMark.svg\" style=\"position:relative; float:right; width:25px; height:25px; cursor:pointer;\"  onclick=\"closeCurrentDayActivityEdit(" + targetData + ", " + i + ", false)\"/></div>";
            daySelectedHTML += "<form id=\"formDayActivityItem" + targetCalendarKey + i + "\"><table class=\"dayActivityItem\" style=\"width:100%;\">";
            daySelectedHTML += "<tr><td style=\"width:42px; background-color:#a0deff99;border-bottom:#ffffff99 solid 1px;\"><input id=\"dayItem" + targetCalendarKey + i + "_start\" type=\"text\" value=\"" + portSchedule[i].start + "\" style=\"width:41px; font-size:16px;\" oninput=\"validateForm(this,'time24',5)\" disabled/></td><td id=\"buttonA" + targetCalendarKey + i + "\" style=\"width:15px; padding-right:0px; padding-top:3px;\"><img id=\"buttonAImg" + targetCalendarKey + i + "\" src=\"./images/compass.svg\" style=\"height: 15px; width: 15px; cursor:pointer;\" onclick=\"mapToLocation(\"" + portSchedule[i].location + "\")\" /></td><td style=\"width:40%;\"><input id=\"dayItem" + targetCalendarKey + i + "_location\" type=\"text\" value=\"" + portSchedule[i].location + "\"  oninput=\"validateForm(this,'mixedText',36)\"disabled /></td>";
            daySelectedHTML += "<td><select id=\"dayItem" + targetCalendarKey + i + "_activity\" disabled />";
            for (let item = 0; item < activityTypeList.length; item++) {

                daySelectedHTML += "<option value=\"" + item + "\" " + (item == portSchedule[i].activity ? 'selected' : '') + ">" + activityTypeList[item] + "</option>";
            }
            daySelectedHTML += "</select></td><td id=\"buttonB" + targetCalendarKey + i + "\" rowspan=\"2\" style=\"width:27px;padding-top:10px;\"><img id=\"buttonBImg" + targetCalendarKey + i + "\" src=\"./images/pencilEdit.svg\" style=\"height: 25px; width: 25px; cursor: pointer; opacity: 1\" onclick=\"editCurrentDayActivity(" + targetCalendarKey + ", " + i + ", '" + rollCap.id + "')\" /></td></tr>";
            daySelectedHTML += "<tr><td style=\"width:42px; background-color:#a0deff99;\"><input id=\"dayItem" + targetCalendarKey + i + "_end\" type=\"text\" value=\"" + portSchedule[i].end + "\" style=\"width:41px; font-size:16px;\"  oninput=\"validateForm(this,'time24',5)\" disabled /></td><td colspan=\"3\" style=\"font-size:14px;\"><textarea id=\"dayItem" + targetCalendarKey + i + "_notes\" style=\"height:17px; font-size:13px; resize:none;\" disabled>" + portSchedule[i].notes + "</textarea></td></tr>";
            daySelectedHTML += "</table></form><div id=\"formDayActivityItemFooter" + targetCalendarKey + i + "\" style=\"height:30px; width:50%; margin:auto; text-align:center; display:none;\"><img src=\"./images/xMark.svg\" style=\"position:relative; float:right; width:25px; height:25px; cursor:pointer;\"  onclick=\"closeCurrentDayActivityEdit(" + targetCalendarKey + ", " + i + ", "+rollCap.id + ", false)\"/></div>";
        }
        daySelectedHTML += "<div id=\"dayActivityFooter\" style=\"width: 55%; margin-top:2px; min-height:34px;\">";
        daySelectedHTML += "<div id=\"dayActivityAdd\" class=\"dayActivityItem\" style=\"float:left; margin-left:10px; width:28px; height: 28px; text-align:center; background-color: #ffffffaa; font-size:24px; cursor:pointer;\" onclick=\"appendNewDayActivity(" + targetCalendarKey + ", '" + rollCap.id + "', " + rollHeight + ")\">+</div>";
        daySelectedHTML += "<div id=\"dayEditPOC\" class=\"dayActivityItem\" style=\"float:right; width:28px; height:28px; text-align:center; padding: 0; background-color: #ffffffaa; overflow:hidden; cursor:pointer;\" onclick=\"editCurrentDayPOC(" + tripCalendar[targetCalendarKey][3] + ", " + targetCalendarKey + ")\"><img src=\"./images/pencilEdit.svg\" height=\"24px\" width=\"24px\" style=\"position:relative; top:2px;\" /></div>";
        daySelectedHTML += "</div>";

        rolloutTarget.innerHTML = daySelectedHTML;

    }
    if (itemAppended != true) {
        toggleRollout(rollCap, rollHeight, tripCalendar[targetCalendarKey][3]);
    } else {
        document.getElementById(rollCap.id + "Rollout").style.height = rollHeight + "px";
        rollCap.setAttribute('onclick', "viewDaySelectedRollout(" + targetCalendarKey + ", this, " + rollHeight + ")");
    }
    console.log("daySelectedHTML built/applied")
}

function startPOCTimer(portListIndex) {
    if (new Date(Date.now()).toLocaleDateString() == new Date(portList[portListIndex][3]).toLocaleDateString()) {
        Timer_POC = setInterval(function () { countdownTimer(portListIndex) }, 1000);
    }
    return true;
}
function stopPOCTimer() {
    clearInterval(Timer_POC);
    return true;
}
function countdownTimer(portListIndex) {
    console.log("Tick: " + portList[portListIndex][3] + ", " + portList[portListIndex][4] + ", " + portList[portListIndex][5]);
    // rgb at arrival = [68, 187, 68, 153], rgb at departure = [187, 68, 68, 153] --> + or - 119 is 100% offset, Alpha 153 = 0.6
    const arrivalTimeInMs = new Date(portList[portListIndex][3] + " " + portList[portListIndex][4]);
    const departureTimeInMs = new Date(portList[portListIndex][3] + " " + portList[portListIndex][5]);
    const timeInPortInMins = parseInt((departureTimeInMs - arrivalTimeInMs) / 1000 / 60);
    let durationUntilDeparture = parseInt((departureTimeInMs - new Date(Date.now())) / 1000 / 60); // Converted to minuites

    let departureClockString = parseInt(Math.abs(durationUntilDeparture) / 60) + ":" + minsLeft();
    document.getElementById("currentTimeObj").innerHTML = departureClockString;
    //console.log("durationUntilDeparture=" + durationUntilDeparture)
    if (durationUntilDeparture > 0) {
        let timeRemainingRatio = (durationUntilDeparture - 60) / timeInPortInMins;
        let rgbOffset = parseInt(119 * timeRemainingRatio);
        let rgbNow = [187 - rgbOffset, 68 + rgbOffset];
        document.getElementById("currentTimeObj").style.backgroundColor = "rgba(" + rgbNow[0] + "," + rgbNow[1] + ",68,0.6)";
        if (durationUntilDeparture > 60) {
            document.getElementById("currentTimeObj").style.color = "#DDFFEEFF";
        } else {
            document.getElementById("currentTimeObj").style.color = "#FFDDDDFF";
        }
    } else {
        document.getElementById("currentTimeObj").style.backgroundColor = "#000000FF";
        document.getElementById("currentTimeObj").style.color = "#FF0000FF";
    }

    function minsLeft() {
        if (("" + parseInt(Math.abs(durationUntilDeparture)) % 60).length > 1) {
            return parseInt(Math.abs(durationUntilDeparture)) % 60;
        } else {
            return "0" + parseInt(Math.abs(durationUntilDeparture)) % 60;
        }
    }
    // (new Date("2023/05/01 13:30:00") - new Date(Date.now()))/1000/60
}
 