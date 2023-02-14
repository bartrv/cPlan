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

    //console.log(mouseObject);
    if (mouseObject.parentElement.id == "menuMain") {
        console.log("Main Menu Button");
        for (const [key, value] of Object.entries(toggleFlags)) {
            //console.log("key = "+key+", value = "+value);
            if ((key != actionTarget) && (value == -1) && ! (key == "rolloutID")) {
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
//['-1', 'Lisbon', 'Spain', '2023/06/14', '18:00', '24:00']

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
    
    
    for (const portItem of portList) {
        //POCHTML += "<div id=\"dayItem_" + portItem[0] + "\" style=\"position:relative; cursor:pointer; height:40px;\" onmouseover=\"\" onmouseout=\"\" onclick=\"launchPopUp('daySelectedOverlay'," + portItem[0] +")\">";
        POCHTML += "<div id=\"dayItem_" + portItem[0] + "\" style=\"position:relative; width:100%; cursor:pointer; height:40px;\" onclick=\"viewdaySelectedOverlay(" + portItem[0] +", this, " + ((activityList[portItem[0]].schedule.length*44)+55+32+12) + ")\">"; //((# of activities tin this day's schedule)*40(row height(40)margin(2)border(2))+header(50)+32(add)+10(borders/margins/padding)
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
    POCHTML = POCHTML + "<div style=\"position:relative; margin-left:10px; float:left; width:40px; height:30px; text-align:center; font-size:24px; cursor:pointer\" class=\"boxStyle_01\" onclick=\"addPortOfCall(this)\">+</div>";
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
            //console.log(heightNow);
            heightNow = heightNow + (10 * rollDir);
            rolloutPanel.style.height = heightNow + 'px';
        } else if (heightNow <= 0) {
            console.log('cancel with <=0');
            rolloutPanel.style.height = "0px";
            clearInterval(slideID);
            slideID = null;
            rolloutPanel.style.display = "none";
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

function addPortOfCall(addNewPOCButton) {
    //console.log("PopUp in addPortOfCall");
    /* As add Line not PopUp
     * https://www.w3schools.com/jsref/met_node_insertbefore.asp
     * ->>    addNewPOCButton.parentNode.insertBefore(document.createElement("div"), addNewPOCButton);
     * or ->> document.getElementById('portOfCallList').lastChild.style
     * 
     * for (const portItem of portList) {
        POCHTML += "<div id=\"dayItem_" + portItem[0] + "\" style=\"position:relative; width:100%; cursor:pointer; height:40px;\" onclick=\"viewdaySelectedOverlay(" + portItem[0] +", this, " + ((activityList[portItem[0]].schedule.length*44)+55+32+12) + ")\">"; //((# of activities tin this day's schedule)*40(row height(40)margin(2)border(2))+header(50)+32(add)+10(borders/margins/padding)
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
    const default_POC_Data = ["0", "City / Ship Name", "Country / 'At Sea'", "2020/12/31", "00:00", "24:00"];
    let newPOC_Item = document.createElement("div");
    let newPOC_Rollout = document.createElement("div");
    let nextDayNumber = 0;
    let newPocItm_HTML = "";

    // Determine last day number - probably will not match the index, possibly unordered
    for (i of portList) {
        n = parseInt(i[0]);
        nextDayNumber = n > nextDayNumber ? n : nextDayNumber;
    }
    nextDayNumber += 1;  //increment last day +1

    default_POC_Data[0] = "" + nextDayNumber;
    portList.push(default_POC_Data); //append default data to main portList
    portItem = portList[portList.length - 1];  //  unify referance syntax with primary POC generator
    seedNewDayActivity(default_POC_Data);

    //Define div's and elements for display
    newPOC_Item.id = "dayItem_" + portItem[0];
    newPOC_Item.style.cssText = "position:relative; width:100%; cursor:pointer; height:40px";
    newPOC_Item.setAttribute("onclick", "viewdaySelectedOverlay(" + portItem[0] + ", this, " + (44 + 55 + 32 + 12) + ")")
    // document.getElementById('dayItem_2').style.cssText = "position:relative; width:100%; cursor:pointer; height:40px"
    newPocItm_HTML += "<div class=\"boxStyle_01\" style=\"position:relative; float:left; background-color:#aaccee; width:27px; height:100%; text-align:center; font-size:24px; border-radius:5px 3px 3px 20px;\">";
    newPocItm_HTML += "<div style=\"padding-top:5px;\">" + portItem[0] + "</div></div>";
    newPocItm_HTML += "<div class=\"boxStyle_01\" style=\"position:relative; float:right; width: calc(100% - 40px); height:40px; border-radius:3px 6px 6px 3px;\">";
    newPocItm_HTML += "<table cellpadding =\"0\" cellspacing=\"0\" style=\"width: 100%;\"><tr>";
    newPocItm_HTML += "<td colspan=\"5\"style=\"text-align:center\">" + portItem[1] + ", " + portItem[2] + "</td></tr>";
    newPocItm_HTML += "<tr><td style=\"width: 76px; text-align:left; font-size:.9em;\">" + portItem[3] + "</td><td></td>";
    newPocItm_HTML += "<td style=\"text-align:center; width:36px; font-size:.9em\">" + portItem[4] + "</td><td width=\"8px\" style=\"text-align:center\">-</td><td width=\"36px\" style=\"width:36px; text-align:center;font-size:.9em\">" + portItem[5] + "</td></tr></table>";
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
    const defaultData = { "city": seedData[1].value, "schedule": [{ "location": "Location(ie. Jim's Cantina)", "activity": "0", "start": "7:00", "end": "9:00", "notes": "Notes..." }] };
    activityList[seedData[0]] = defaultData;
}

function appendNewDayActivity(targetData, rollCapId, rollHeight) {
    const defaultData = { "location": "Location(ie. Jim's Cantina)", "activity": "0", "start": "8:00", "end": "9:30", "notes": "Notes..." };
    activityList[targetData].schedule.push(defaultData);
    viewdaySelectedOverlay(targetData, document.getElementById(rollCapId), rollHeight + 50, true);

}

function deleteCurrentActivity(targetData, i) {
    return true;
}
function editCurrentDayPOC(targetData) {

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
            document.getElementById("buttonAImg" + targetData + i).style.cursor = "default";
            document.getElementById("buttonAImg" + targetData + i).style.opacity = "0.3";
            document.getElementById("buttonAImg" + targetData + i).setAttribute('onclick', null);

            document.getElementById("buttonB" + targetData + i).innerHTML = "<img src=\"images/checkMark.svg\" style=\"width: 25px; height: 25px; cursor: pointer;\" />";
            document.getElementById("formDayActivityItemFooter" + targetData + i).style.display = "block";
            document.getElementById("dayItem" + targetData + i + "_start").focus();
        }
    }
    document.getElementById('dayActivityFooter').style.display = "none";
}

function closeCurrentDayActivityEdit(targetData, i) {
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
                document.getElementById("dayItem" + targetData + i + post$).disabled = true;
                document.getElementById("dayItem" + targetData + i + post$).style.backgroundColor = "#ffffff11";
                document.getElementById("dayItem" + targetData + i + post$).style.border = "0px";
                document.getElementById("dayItem" + targetData + i + post$).style.color = "#222299";
            }
            document.getElementById("buttonAImg" + targetData + i).style.cursor = "pointer";
            document.getElementById("buttonAImg" + targetData + i).style.opacity = "1.0";
            document.getElementById("buttonAImg" + targetData + i).setAttribute('onclick', 'mapToLocation(' + activityList[targetData].schedule[i].location + ')');

            document.getElementById("buttonB" + targetData + i).innerHTML = "<img id=\"buttonBImg" + targetData + i + "\" src=\"./images/pencilEdit.svg\" style=\"height:25px; width:25px; cursor:pointer;\" onclick=\"editCurrentDayActivity(" + targetData + ", " + i + ")\" />";
            document.getElementById("formDayActivityItemFooter" + targetData + i).style.display = "none";
        }
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

function viewdaySelectedOverlay(targetData, rollCap, rollHeight, itemAppended) {

    if ((toggleFlags.rolloutID != targetData) && (toggleFlags.rolloutID != null)) {
        document.getElementById("dayItem_" + toggleFlags.rolloutID + "Rollout").style.height = "0px";
        document.getElementById("dayItem_" + toggleFlags.rolloutID + "Rollout").style.display = "none";
        document.getElementById("dayItem_" + toggleFlags.rolloutID + "Rollout").innerHTML = "";
        toggleFlags.rolloutID = null;
    }

    if (toggleFlags.rolloutID == null || itemAppended === true) {
        toggleFlags.rolloutID = targetData;
        rolloutTarget = document.getElementById(rollCap.id + "Rollout")
        let portListIndex = 0;
        for (portListIndex; portListIndex < portList.length; portListIndex++) {
            if (portList[portListIndex][0] == targetData) break;
        }
        let portYear = portList[portListIndex][3].match("^\\d{4}");
        let portDayName = new Date(portList[portListIndex][3]).toLocaleDateString('en-us', { weekday: "long" }).toString();
        let portMonthName = new Date(portList[portListIndex][3]).toLocaleDateString('en-us', { month: "long" }).toString();
        let portDayNum = portList[portListIndex][3].match("(?<=\/)\\d+$")[0];
        let portTerminalId = "Tmp #";

        //Set up Header
        let daySelectedHTML = "";
        daySelectedHTML += "<table id=\"daySelectHeader\"><tr><td style=\"text-align:left; background-color:#44bb4499; border-bottom:#ffffff88 solid 1px;\">" + portList[portListIndex][4] + "</td>";
        daySelectedHTML += "<td rowspan=\"2\" id=\"currentTimeObj\" style=\"text-align:center; width:54px; font-size:24px; border-left:#ffffff88 solid 1px; border-right:#ffffff88 solid 1px;background-color:#44bb4499;\">00:00</td>";
        daySelectedHTML += "<td style =\"text-align:right; background-color:#ee444499; border-bottom:#ffffff88 solid 1px;\">" + portList[portListIndex][5] + "</td>";
        daySelectedHTML += "</tr><tr><td style=\"text-align:left; font-size:14px; background-color:#ffffff44;\">" + portDayName + ",&nbsp;" + portMonthName + "&nbsp;" + portDayNum + "</td><td style=\"font-size:14px;text-align:right; background-color:#ffffff44;\">Term. ID:" + portTerminalId + "</td>";
        daySelectedHTML += "</tr></table>";

        let portSchedule = activityList[targetData].schedule;
        //Loop through activities
        for (let i = 0; i < portSchedule.length; i++) {
            daySelectedHTML += "<form id=\"formDayActivityItem" + targetData + i + "\"><table class=\"dayActivityItem\" style=\"width:100%;\">";
            daySelectedHTML += "<tr><td style=\"width:42px; background-color:#a0deff99;border-bottom:#ffffff99 solid 1px;\"><input id=\"dayItem" + targetData + i + "_start\" type=\"text\" value=\"" + portSchedule[i].start + "\" style=\"width:41px; font-size:16px;\" disabled/></td><td id=\"buttonA" + targetData + i + "\" style=\"width:15px; padding-right:0px; padding-top:3px;\"><img id=\"buttonAImg" + targetData + i + "\" src=\"./images/compass.svg\" style=\"height: 15px; width: 15px; cursor:pointer;\" onclick=\"mapToLocation(\"" + portSchedule[i].location + "\")\" /></td><td style=\"width:40%;\"><input id=\"dayItem" + targetData + i + "_location\" type=\"text\" value=\"" + portSchedule[i].location + "\" disabled /></td>";
             daySelectedHTML += "<td><select id=\"dayItem" + targetData + i + "_activity\" disabled />";
            for (let item = 0; item < activityTypeList.length; item++) {

                daySelectedHTML += "<option value=\"" + item + "\" " + (item == portSchedule[i].activity ? 'selected' : '') + ">" + activityTypeList[item] + "</option>";
            }
            daySelectedHTML += "</select></td><td id=\"buttonB" + targetData + i + "\" rowspan=\"2\" style=\"width:27px;padding-top:10px;\"><img id=\"buttonBImg" + targetData + i + "\" src=\"./images/pencilEdit.svg\" style=\"height: 25px; width: 25px; cursor: pointer; opacity: 1\" onclick=\"editCurrentDayActivity(" + targetData + ", " + i + ")\" /></td></tr>";
            daySelectedHTML += "<tr><td style=\"width:42px; background-color:#a0deff99;\"><input id=\"dayItem" + targetData + i + "_end\" type=\"text\" value=\"" + portSchedule[i].end + "\" style=\"width:41px; font-size:16px;\" disabled /></td><td colspan=\"3\" style=\"font-size:14px;\"><textarea id=\"dayItem" + targetData + i + "_notes\" style=\"height:17px; font-size:13px; resize:none;\" disabled>" + portSchedule[i].notes + "</textarea></td></tr>";
            daySelectedHTML += "</table></form><div id=\"formDayActivityItemFooter" + targetData + i + "\" style=\"height:30px; width:50%; margin:auto; text-align:center; display:none;\"><img src=\"./images/xMark.svg\" style=\"position:relative; float:left; width:25px; height:25px; cursor:pointer;\"  onclick=\"closeCurrentDayActivityEdit(" + targetData + ", " + i + ")\"/><img src=\"./images/checkMark.svg\" style=\"position:relative; float:right; width:25px; height:25px\" /></div>";
        }
        daySelectedHTML += "<div id=\"dayActivityFooter\" style=\"width: 55%; margin-top:2px;\">";
        daySelectedHTML += "<div id=\"dayActivityAdd\" class=\"dayActivityItem\" style=\"float:left; margin-left:10px; width:28px; height: 28px; text-align:center; background-color: #ffffffaa; font-size:24px; cursor:pointer;\" onclick=\"appendNewDayActivity(" + targetData + ", '" + rollCap.id + "', " + rollHeight + ")\">+</div>";
        daySelectedHTML += "<div id=\"dayEditPOC\" class=\"dayActivityItem\" style=\"float:right; width:28px; height:28px; text-align:center; padding: 0; background-color: #ffffffaa; overflow:hidden;\" onclick=\"editCurrentDayPOC(" + targetData + ")\"><img src=\"./images/pencilEdit.svg\" height=\"24px\" width=\"24px\" style=\"position:relative; top:2px;\" /></div>";
        daySelectedHTML += "</div>";


        rolloutTarget.innerHTML = daySelectedHTML;

    }
    if (itemAppended != true) {
        toggleRollout(rollCap, rollHeight);
    } else {
        document.getElementById(rollCap.id + "Rollout").style.height = rollHeight + "px";
        rollCap.setAttribute('onclick', "viewdaySelectedOverlay(" + targetData + ", this, " + rollHeight + ")");
    }
    console.log("daySelectedHTML built/applied")
}