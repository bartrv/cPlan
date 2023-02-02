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
    loadUserData();
    GeneratePOCList();
}

let timeID = null;
function toggleMove(tmObject, tmDistX, tmDistY, tmTiming, caller) {

    caller.style.pointerEvents = "none";
    let toggleVal = toggleFlags[tmObject];
    toggleFlags[tmObject] = -1 * toggleVal;
    objectToMove = document.getElementById(tmObject);
    objectToMove.style.visibility = "visible";
    console.log("ToggleMove Received = " + tmObject + ", " + tmDistX + ", " + tmDistY + ", " + tmTiming + ", " + caller);
    console.log("timeID=" + timeID);
    const objectXY = [objectToMove.style.right == "" ? -100 : -1 * Math.round(objectToMove.style.right.match("\\d+")), objectToMove.style.top == "" ? 0 : Math.round(objectToMove.style.top.match("\\d+"))];

    //console.log(objectXY + ", " + toggleVal);

    let timestamp = Date.now();
    let timestart = Date.now();
    let endTime = timestart + tmTiming;
    let newLocXY = [0, 0];
    let yX = 0;
    let yY = 0;
    let x = 0;
    timeID = setInterval(move, 15);

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
    console.log(mouseObject);
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

function sleep(ms) {

    return new Promise(resolve => setTimeout(resolve, ms));
}

function GeneratePOCList() {
    let POCHTML = "";
    POCHTML = POCHTML + "<div id=\"primaryInformation\" class=\"boxStyle_01\"><div style=\"width:100%\">";
    POCHTML = POCHTML + "<div style=\"float:left; text-align:left; font-size:.9em;\">" + tripOverViewList.dateStart + "</div>";
    POCHTML = POCHTML + "<div style=\"float:right; text-align:left; font-size:.9em;\">" + tripOverViewList.dateEnd + "</div>";
    POCHTML = POCHTML + "<div style=\"text-align:center; font-weight:bold\">";
    POCHTML = POCHTML + tripOverViewList.cruiseLineAbbr + " " + tripOverViewList.shipName + "</div></div>";
    POCHTML = POCHTML + "<div style=\"width:100%; height:20px\"><div style=\"float: left; text-align: left;\">" + tripOverViewList.portCityStart + ", " + tripOverViewList.portCountryStartAbbr +"</div>";
    POCHTML = POCHTML + "<div style=\"float: right; text-align: right;\">" + tripOverViewList.portCityEnd + ", " + tripOverViewList.portCountryEndAbbr+"</div>";
    POCHTML = POCHTML + "</div></div>";
    
    
    for (const portItem of portList) {
        POCHTML = POCHTML + "<div id=\"dayItem" + portItem[2] + "\" style=\"position:relative; cursor:pointer; height:40px;\" onmouseover=\"\" onmouseout=\"\" onclick=\"alert('clicked item " + portItem[2] +"')\">";
        POCHTML = POCHTML + "<div class=\"boxStyle_01\" style=\"position:relative; float:left; width:27px; height:100%; text-align:center; font-size:24px; border-radius:16px 3px 3px 16px;\"><div style=\"padding-top:5px;\">" + portItem[2] + "</div></div>";
        POCHTML = POCHTML + "<div class=\"boxStyle_01\" style=\"position:relative; float:right; width: calc(100% - 40px); height:40px; border-radius:3px 6px 6px 3px;\"><table cellpadding=\"0\" cellspacing=\"0\" style=\"width: 100%;\"><tr>";
        POCHTML = POCHTML + "<td colspan=\"5\"style=\"text-align:center\">" + portItem[0] + ", " + portItem[1] + "</td></tr>";
        POCHTML = POCHTML + "<tr><td style=\"width: 76px; text-align:left; font-size:.9em;\">" + portItem[3] + "</td><td></td>";
        POCHTML = POCHTML + "<td style=\"text-align:center; width:36px; font-size:.9em\">" + portItem[4] + "</td><td width=\"8px\" style=\"text-align:center\">-</td><td width=\"36px\" style=\"width:36px; text-align:center;font-size:.9em\">" + portItem[5] + "</td></tr></table></div></div>";
    }
    POCHTML = POCHTML + "<div style=\"position:relative; margin-left:10px; float:left; width:40px; height:30px; text-align:center; font-size:24px; cursor:pointer\" class=\"boxStyle_01\">+</div>";
    document.getElementById('portOfCallList').innerHTML = POCHTML;
}