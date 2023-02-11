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
function initFullLoadCPlan() {
    if (loadUserData()) console.log("Load completed true");
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
//    if (mouseObject.id == "btn_shipDetail") {
  //      mouseObject.style.width = "45px";
    //}
    //console.log(mouseObject);
    if (mouseObject.parentElement.id == "menuMain") {
        console.log("Main Menu Button");
        for (const [key, value] of Object.entries(toggleFlags)) {
            //console.log("key = "+key+", value = "+value);
            if ((key != actionTarget) && (value == -1)) {
                console.log("in if block: sending-->" + document.getElementById("btn_" + key) + ", "+key);
                //mouseClick(document.getElementById("btn_"+key),key);
                //toggleMove(key, 100, 0, 300, mouseObject);
                document.getElementById(key).style.right = "calc(-100% + 47px)";
                toggleFlags[key] = 1;
                document.getElementById("btn_" + key).style.width = "45px";
            }
        }
        toggleMove(actionTarget, 100, 0, 300, mouseObject);
        if (toggleFlags[actionTarget] == 1) mouseObject.style.width = "45px";
    }

}

//function sleep(ms) {

//    return new Promise(resolve => setTimeout(resolve, ms));
//}

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
//['-1', 'Lisbon', 'Spain', '2023/06/14', '18:00', '24:00']

function generatePOCList() {
    console.log("entering-> generatePOCList()");
    let POCHTML = "";
    POCHTML = POCHTML + "<div id=\"primaryInformation\" class=\"boxStyle_01\"><div style=\"width:100%\">";
    POCHTML = POCHTML + "<div style=\"float:left; text-align:left; font-size:.9em;\">" + tripOverViewList.dateStart + "</div>";
    POCHTML = POCHTML + "<div style=\"float:right; text-align:left; font-size:.9em;\">" + tripOverViewList.dateEnd + "</div>";
    POCHTML = POCHTML + "<div style=\"text-align:center; font-weight:bold; margin-left:100px; \">";
    POCHTML = POCHTML + tripOverViewList.cruiseLineAbbr + " " + tripOverViewList.shipName + "</div></div>";
    POCHTML = POCHTML + "<div style=\"width:100%; height:20px\"><div style=\"float: left; text-align: left;\">" + tripOverViewList.embarkatonCity + ", " + tripOverViewList.embarkationCountryAbbr +"</div>";
    POCHTML = POCHTML + "<div style=\"float: right; text-align: right;\">" + tripOverViewList.debarkationCity + ", " + tripOverViewList.debarkationCountryAbbr+"</div>";
    POCHTML = POCHTML + "</div></div>";
    
    
    for (const portItem of portList) {
        POCHTML = POCHTML + "<div id=\"dayItem_" + portItem[0] + "\" style=\"position:relative; cursor:pointer; height:40px;\" onmouseover=\"\" onmouseout=\"\" onclick=\"launchPopUp('daySelectedOverlay'," + portItem[0] +")\">";
        POCHTML = POCHTML + "<div class=\"boxStyle_01\" style=\"position:relative; float:left; width:27px; height:100%; text-align:center; font-size:24px; border-radius:16px 3px 3px 16px;\"><div style=\"padding-top:5px;\">" + portItem[0] + "</div></div>";
        POCHTML = POCHTML + "<div class=\"boxStyle_01\" style=\"position:relative; float:right; width: calc(100% - 40px); height:40px; border-radius:3px 6px 6px 3px;\"><table cellpadding=\"0\" cellspacing=\"0\" style=\"width: 100%;\"><tr>";
        POCHTML = POCHTML + "<td colspan=\"5\"style=\"text-align:center\">" + portItem[1] + ", " + portItem[2] + "</td></tr>";
        POCHTML = POCHTML + "<tr><td style=\"width: 76px; text-align:left; font-size:.9em;\">" + portItem[3] + "</td><td></td>";
        POCHTML = POCHTML + "<td style=\"text-align:center; width:36px; font-size:.9em\">" + portItem[4] + "</td><td width=\"8px\" style=\"text-align:center\">-</td><td width=\"36px\" style=\"width:36px; text-align:center;font-size:.9em\">" + portItem[5] + "</td></tr></table></div></div>";
    }
    POCHTML = POCHTML + "<div style=\"position:relative; margin-left:10px; float:left; width:40px; height:30px; text-align:center; font-size:24px; cursor:pointer\" class=\"boxStyle_01\" onclick=\"launchPopUp('addPortOfCall')\">+</div>";
    document.getElementById('portOfCallList').innerHTML = POCHTML;

    return true;
}

function generateTravelInfoPanel() {
    return true;
}

function generateEmergencyPanel() {
    return true;
}

function populateConfigPanelData(){
    return true;
}

var editInputList = [0];
function initEditPanel(panelID) {
    editInputList=[0];
    if (panelID == 'shipDetails') {
        editInputList = ["shipInfo", "cruiseLine", "shipName", "stateRoom", "embarkationDate", "embarkatonCity", "embarkationCountry",
            "debarkationDate", "debarkationCity", "debarkationCountry", "tonnes", "guests", "shpLength", "maxBeam", "crew", "constructed", "reservationNumber"];
        document.getElementById(editInputList[0] + editInputList[1]).disabled = false;
        document.getElementById(editInputList[0] + editInputList[1]).focus();
        for (let i = 2; i < editInputList.length; i++) {
            document.getElementById(editInputList[0] + editInputList[i]).disabled = false;
        }
        document.getElementById('btn_Edit'+editInputList[0]+'Accept').style.display = "inline";
        document.getElementById('btn_Edit' + editInputList[0] +'Cancel').style.display = "inline";
        document.getElementById('btn_Edit' + editInputList[0]).style.display = "none";
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
    editInputList = [0];
}

function toggleRollout(rollCap, rollHeight) {   
    let rollDir;
    let heightNow;
    rolloutPanel = document.getElementById(rollCap.id + "Rollout");
    rolloutPanel.style.display = "block";
    if (getComputedStyle(rolloutPanel).height === "0px") {
        rollDir = 1;
        heightNow = 0;
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
            console.log(heightNow);
            heightNow = heightNow + (10 * rollDir);
            rolloutPanel.style.height = heightNow + 'px';
        } else if (heightNow <= 0) {
            console.log('cancel with <=0');
            rolloutPanel.style.height = "0px";
            clearInterval(slideID);
            slideID = null;
            rolloutPanel.style.display = "none";
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
    switch (popTarget) {
        case "clearAllData":
            clearAllData();
            break;
        case "addPortOfCall":
            addPortOfCall();
            break;
        case "daySelectedOverlay":
            viewdaySelectedOverlay(targetData);
        }
    return true;
}

function closePopUp() {
    document.getElementById("popUpPanel").innerHTML = "-";
    document.getElementById("popUpPanel").className = "popUpDefaultStyle";
    document.getElementById("popUpPanel").style.display = "none";
    document.getElementById("pupUpInteractionBlocker").style.display = "none";
}

function addPortOfCall() {
    //console.log("PopUp in addPortOfCall");
    const addPOCBox = document.getElementById("popUpPanel");
    addPOCBox.className = "boxStyle_01";
    addPOCBox.style.height = "300px";
    addPOCBox.style.top = "calc(50 % - 100px)";
    let addPortHTML = "<form id='pocAddForm'><table style=\"width:100%\"><tr>";
    addPortHTML += "<td colspan=\"2\" style=\"text-align:center;\"><span style=\"font-size:16px; font-weight:bold; color:black;\">Add New Port of Call</span></td></tr>";
    addPortHTML += "<tr><td>Cruise Day:</td><td><input type=\"text\" value=\"0\" oninput=\"validateForm(this,'number',2)\" /></td></tr>";
    addPortHTML += "<tr><td>Port City or 'At Sea':</td><td><input type=\"text\" value=\"Evansville\" oninput=\"validateForm(this,'plainText')\" /></td></tr>";
    addPortHTML += "<tr><td>Port Country or 'Ship Name':</td><td><input type=\"text\" value=\"United States\" oninput=\"validateForm(this,'plainText')\" /></td></tr>";
    addPortHTML += "<tr><td>Date of Arrival:</td><td><input type=\"text\" value=\"yyyy/mm/dd\" oninput=\"validateForm(this,'dateAsText')\" /></td></tr>";
    addPortHTML += "<tr><td>Arrival Time:</td><td><input type=\"text\" value=\"24:00\" oninput=\"validateForm(this,'time24')\" /></td></tr>";
    addPortHTML += "<tr><td>Departure Time:</td><td><input type=\"text\" value=\"24:00\" oninput=\"validateForm(this,'time24')\" /></td></tr>";
    addPortHTML += "<tr><td><input type=\"button\" value=\"Accept/Add\" onclick=\"appendToList(portList,document.getElementById('pocAddForm'));seedNewDayActivity(document.getElementById('pocAddForm')[0]);generatePOCList();storeUserData();\"/></td><td><input type=\"button\" value=\"Discard/Cancel/Done\" onclick=\"closePopUp()\"/></td></tr></table></form>";

    document.getElementById("popUpPanel").innerHTML = addPortHTML;
    document.getElementById("popUpPanel").style.display = "block";
}

function seedNewDayActivity(seedData) {
    const defaultData = { "city": seedData[1].value, "schedule": [{ "location": "Location(ie. Jim's Cantina)", "activity": "Activity(ie. Brunch)", "start": "8:00", "end": "9:30", "notes": "Notes..." }] };
    activityList[seedData] = defaultData;
}

function appendNewDayActivity(targetDay) {
    const defaultData = { "location": "Location(ie. Jim's Cantina)", "activity": "Activity(ie. Brunch)", "start": "8:00", "end": "9:30", "notes": "Notes..." };
    activityList[targetDay].schedule.push(defaultData);
    viewdaySelectedOverlay(targetDay);
}

function deleteCurrentActivity(targetData, i) {
    return true;
}

function editCurrentDayActivity(targetData, i) {
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
            document.getElementById("buttonA" + targetData + i).innerHTML = "<img src=\"images/xMark.svg\" style=\"width: 40px, height: 40px; cursor: pointer;\" onclick=\"closeCurrentDayActivityEdit(" + targetData + ", " + i + ")\"/>";
            document.getElementById("buttonB" + targetData + i).innerHTML = "<img src=\"images/checkMark.svg\" style=\"width: 40px, height: 40px; cursor: pointer;\" />";
            document.getElementById("dayItem" + targetData + i + "_start").focus();
        }
    }
    document.getElementById('dayActivityAddRemove').innerHTML = "<img src=\"images/trashBin.svg\" style=\"width: 40px, height: 40px; cursor: pointer;\" />";
    document.getElementById("dayActivityAddRemove" + targetData + n).setAttribute('onclick', 'deleteCurrentActivity(' + targetData +', '+ i +')');
}

    function closeCurrentDayActivityEdit(targetData, i) {
        console.log("Entering closeCurrentDayActivityEdit()");
        document.activeElement.blur();
        for (let n = 0; n < activityList[targetData].schedule.length; n++) {
            if (n != i) {
                document.getElementById("buttonAImg" + targetData + n).style.cursor = "pointer";
                document.getElementById("buttonAImg" + targetData + n).style.opacity = "1.0";
                //document.getElementById("buttonAImg" + targetData + n).onclick = undefined;
                document.getElementById("buttonBImg" + targetData + n).style.cursor = "pointer";
                document.getElementById("buttonBImg" + targetData + n).style.opacity = "1.0";
                document.getElementById("buttonBImg" + targetData + n).setAttribute('onclick','editCurrentDayActivity(' + targetData + ', ' + n + ')');

            } else {
                for (const post$ of ["_start", "_end", "_location", "_activity", "_notes"]) {
                    document.getElementById("dayItem" + targetData + i + post$).disabled = true;
                    document.getElementById("dayItem" + targetData + i + post$).style.backgroundColor = "#ffffff11";
                    document.getElementById("dayItem" + targetData + i + post$).style.border = "0px";
                    document.getElementById("dayItem" + targetData + i + post$).style.color = "#222299";
                }
                //<img id=\"buttonAImg" + targetData + i + "\" src=\"./images/compass.svg\" height=\"35px\" width=\"35px\" /></td>
                //<td id=\"buttonB" + targetData + i + "\" rowspan=\"2\" style=\"width:42px;padding-top:5px;\">
                //<img id=\"buttonBImg" + targetData + i + "\" src=\"./images/pencilEdit.svg\" style=\"height:35px; width:35px; cursor:pointer;\" onclick=\"editCurrentDayActivity(" + targetData + ", " + i + ")\" />
                document.getElementById("buttonA" + targetData + i).innerHTML = "<img id=\"buttonAImg" + targetData + i + "\" src=\"./images/compass.svg\" height=\"35px\" width=\"35px\" />";
                document.getElementById("buttonB" + targetData + i).innerHTML = "<img id=\"buttonBImg" + targetData + i + "\" src=\"./images/pencilEdit.svg\" style=\"height:35px; width:35px; cursor:pointer;\" onclick=\"editCurrentDayActivity(" + targetData + ", " + i + ")\" />";
            }
        }
        document.getElementById('dayActivityAddRemove').innerHTML = "+"
        document.getElementById("dayActivityAddRemove" + targetData + n).setAttribute('onclick', 'appendNewDayActivity(' + targetData + ')');
    }



function appendToList(listObj, formElement) {
    let i = [];
    for (n of formElement) {
        i.push(n.value);
    }
    listObj.push(i);
}

function viewdaySelectedOverlay(targetData) {
    popUpTarget = document.getElementById("popUpPanel");
    popUpTarget.className = "daySelectedOverlay";
    popUpTarget.style.visibility = "visible";
    let portListIndex = 0;
    let ActivityDayItemIdList = [];
    for (portListIndex; portListIndex < portList.length; portListIndex++) {
        if (portList[portListIndex][0] == targetData) break;
    }
    let portYear = portList[portListIndex][3].match("^\\d{4}");
    let portDayName = new Date(portList[portListIndex][3]).toLocaleDateString('en-us', { weekday: "long" }).toString();
    let portMonthName = new Date(portList[portListIndex][3]).toLocaleDateString('en-us', { month: "long" }).toString();
    let portDayNum = portList[portListIndex][3].match("(?<=\/)\\d+$")[0];
    //Set up Header
    let daySelectedHTML = "<table id=\"daySelectHeader\"><tr><td rowspan=\"2\" style=\"width:40px;background-color:#4499bb99;font-size:32px;\">" + portList[portListIndex][0] + "</td>";
    daySelectedHTML += "<td style=\"text-align:left; background-color:#ffffff44;\">" + portList[portListIndex][1] + ", " + portList[portListIndex][2] + "</td>";
    daySelectedHTML += "<td style=\"width:45px; text-align:right; background-color:#44bb4499;border-bottom:#ffffff88 solid 1px;\">" + portList[portListIndex][4] +"</td><td rowspan=\"2\" style=\"width:100px;text-align:left;padding-left:4px;background-color:#44bb4499;\"><span id=\"currentTimeObj\" style=\"font-size:32px;\">00:00</span></td></tr>";
    daySelectedHTML += "<tr><td style=\"text-align:left; background-color:#ffffff44;\">" + portDayName + ", " + portMonthName+" "+ portDayNum + ", " + portYear + "</td>";
    daySelectedHTML += "<td style=\"width:45px; text-align:right; background-color:#ee444499;\">" + portList[portListIndex][5] +"</td></tr></table>";

    let portSchedule = activityList[targetData].schedule;
    //Loop through activities
    for (let i = 0; i < portSchedule.length; i++) {
        daySelectedHTML += "<form id=\"formDayActivityItem" + targetData + i + "\"><table class=\"dayActivityItem\" style=\"width:100%;\">";
        daySelectedHTML += "<tr><td style=\"width:42px; background-color:#55b0dd69;border-bottom:#ffffff99 solid 1px;\"><input id=\"dayItem" + targetData + i + "_start\" type=\"text\" value=\"" + portSchedule[i].start + "\" style=\"width:41px; font-size:16px;\" disabled/></td><td style=\"width:40%;\"><input id=\"dayItem" + targetData + i + "_location\" type=\"text\" value=\"" + portSchedule[i].location + "\" disabled /></td><td><input id=\"dayItem" + targetData + i + "_activity\" type=\"text\" value=\"" + portSchedule[i].activity + "\" disabled /></td><td id=\"buttonA" + targetData + i + "\" rowspan=\"2\" style=\"width:42px;padding-top:5px;\"><img id=\"buttonAImg" + targetData + i + "\" src=\"./images/compass.svg\" height=\"35px\" width=\"35px\" /></td><td id=\"buttonB" + targetData + i + "\" rowspan=\"2\" style=\"width:42px;padding-top:5px;\"><img id=\"buttonBImg" + targetData + i + "\" src=\"./images/pencilEdit.svg\" style=\"height: 35px; width: 35px; cursor: pointer; opacity: 1\" onclick=\"editCurrentDayActivity(" + targetData + ", " + i + ")\" /></td></tr>";
        daySelectedHTML += "<tr><td style=\"width:42px; background-color:#55b0dd79;\"><input id=\"dayItem" + targetData + i + "_end\" type=\"text\" value=\"" + portSchedule[i].end + "\" style=\"width:41px; font-size:16px;\" disabled /></td><td colspan=\"2\" style=\"font-size:14px;\"><textarea id=\"dayItem" + targetData + i +"_notes\" style=\"height:17px; font-size:13px; resize:none;\" disabled>" + portSchedule[i].notes +"</textarea></td></tr></table></form>";
    }
    daySelectedHTML += "<table id=\"addDayActivity\" class=\"dayActivityItem\" style=\"margin-left:5px;\">";
    daySelectedHTML += "<tr><td id=\"dayActivityAddRemove\" style=\"width:35px; height:32px; text-align:center; font-size:24px; cursor:pointer;\" onclick=\"appendNewDayActivity("+targetData+")\">+</td></tr>";
    daySelectedHTML += "</table>";
    daySelectedHTML += "<input type=\"button\" value=\"Close Itinerary\" style=\"position:inline; right: 50%; margin-top:10px; margin-bottom:40px; font-size:16px; width:190px;\" onclick=\"\" />";

    popUpTarget.innerHTML = daySelectedHTML;
    console.log("daySelectedHTML built/applied")
}