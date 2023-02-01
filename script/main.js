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

function toggleMove(tmObject, tmDistX, tmDistY, tmTiming, caller) {
    caller.disabled = "disabled";
    let toggleVal = toggleFlags[tmObject];
    toggleFlags[tmObject] = -1 * toggleVal;
    objectToMove = document.getElementById(tmObject);
    //console.log(tmObject + ", " + tmDistX + ", " + tmDistY + ", " + tmTiming);
    const objectXY = [objectToMove.style.left == "" ? 0 : Math.round(objectToMove.style.left.match("\\d+")), objectToMove.style.top == "" ? 0 : Math.round(objectToMove.style.top.match("\\d+"))];

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
            //x = (timestamp - timestart) / tmTiming;
            //yX = toggleVal*tmDistX * x;
            x = (Math.PI / 2) * ((timestamp - timestart) / tmTiming);
            yX = toggleVal * tmDistX * Math.sin(x);
            //yY = toggleVal*tmDistY * x;
            yY = toggleVal * tmDistY * Math.sin(x);
            newLocXY = [Math.round(objectXY[0] + yX), Math.round(objectXY[1] + yY)];
            //console.log(newLocXY);
            if (newLocXY[0] != 0) objectToMove.style.left = newLocXY[0] + "px";
            if (newLocXY[1] != 0) objectToMove.style.top = newLocXY[1] + "px";
            timestamp = Date.now();
        } else {
            newLocXY = [objectXY[0] + (tmDistX * toggleVal), objectXY[1] + (tmDistY * toggleVal)];
            if (newLocXY[0] != 0) objectToMove.style.left = newLocXY[0] + "px";
            if (newLocXY[1] != 0) objectToMove.style.top = newLocXY[1] + "px";
            clearInterval(timeID);
            //toggleFlags[tmObject] = -1 * toggleVal;
            caller.disabled = "";
        }
    }
}

function mouseIn(mouseObject) {
    if (mouseObject.parentElement.id == "menuMain") {
        mouseObject.style.width = "52px";
    }
    if (mouseObject.parentElement.id == "portOfCallList") {
        mouseObject.style.cursor = "pointer";
    }
}

function mouseOut(mouseObject, actionTarget) {
    if (mouseObject.parentElement.id == "menuMain") {
        if (toggleFlags[actionTarget] == 1) mouseObject.style.width = "45px";
    }
}

function mouseClick(mouseObject, actionTarget) {
    if (mouseObject.id == "btn_tripHome") {
        mouseObject.style.width = "45px";
    }
    if (mouseObject.id == "btn_dayPlans") {
        toggleMove(actionTarget, -150, 0, 300, this);
        if (toggleFlags[actionTarget] == 1) mouseObject.style.width = "45px";
    }

}

function GeneratePOCList() {
    let POCHTML = "";
    POCHTML = POCHTML + "<div id=\"primaryInformation\" class=\"boxStyle_01\"><div style=\"width:100%\">";
    POCHTML = POCHTML + "<div style=\"float:left; text-align:left;\">" + tripOverViewList.dateStart + "</div>";
    POCHTML = POCHTML + "<div style=\"float:right; text-align:left;\">" + tripOverViewList.dateEnd + "</div>";
    POCHTML = POCHTML + "<div style=\"text-align:center;\">- ";
    POCHTML = POCHTML + tripOverViewList.cruiseLineAcronym + " " + tripOverViewList.shipName + "-</div></div>";
    POCHTML = POCHTML + "<div style=\"width:100%; height:30px\"><div style=\"float: left; text-align: left;\">" + tripOverViewList.portCityStart + ", " + tripOverViewList.portCountryStart +"</div>";
    POCHTML = POCHTML + "<div style=\"float: right; text-align: right;\">" + tripOverViewList.portCityEnd + ", " + tripOverViewList.portCountryEnd+"</div>";
    POCHTML = POCHTML + "</div></div>";
    /*
    *   <div id="primaryInformation" class="boxStyle_01">
	*		<div style="width:100%; text-align:center;">- NCL Getaway -</div>
	*		<div id="overviewItems" style="font-weight:normal;width:100%; overflow:hidden;">
	*			<div style="float:left; width:30%;padding-left:5px">June 14th - June 25th</div>
	*			<div style="float:right;width:50%;text-align:right;padding-right:5px">Lisbon, Portugal - Rome, Italy</div>
	*		</div>
	*	</div>
    
     **	['Lisbon', 'Spain', '0', '2023/06/15', '-', '20:00'] **
    *	
        <div id="dayItem_000" class="boxStyle_01">
			<table style="width:100%;">
				<tr><td style="width:60px;">Day:</td>
				<td style="width:20px;">0</td><td style="width:100px">2023/06/14</td>
				<td style="text-align:center;">Lisbon, Portugal</td>
				<td style="width:100px;">12:00 - 18:00</td>
			</tr></table>
		</div>
    */
    
    for (const portItem of portList) {
        POCHTML = POCHTML + "<div id=\"dayItem" + portItem[2] + "\" class=\"boxStyle_01\" style=\"cursor:pointer\" onmouseover=\"\" onmouseout=\"\" onclick=\"alert('clicked')\">";
        POCHTML = POCHTML + "<table style=\"width: 100%\"><tr><td style=\"width: 50px\">Day:</td>";
        POCHTML = POCHTML + "<td style=\"width: 35px;text-align:left\">" + portItem[2] + "</td><td style=\"width: 100px; text-align:center\">" + portItem[3] + "</td>";
        POCHTML = POCHTML + "<td style=\"text-align:center\">" + portItem[0] + ", " + portItem[1] + "</td>";
        POCHTML = POCHTML + "<td style=\"width:40px; text-align:center\">" + portItem[4] + "</td><td width='10px'>-</td><td width='40px' style='text-align:center'>" + portItem[5] + "</td></tr></table></div>";
    }
    POCHTML = POCHTML + "<div style=\"position:relative; float:left; width:30px; height:30px; text-align:center; cursor:pointer\" class=\"boxStyle_01\">+</div>";
    document.getElementById('portOfCallList').innerHTML = POCHTML;
}