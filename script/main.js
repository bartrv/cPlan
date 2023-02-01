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
    /*
       <div id="primaryInformation" class="boxStyle_01">
			<div style="width:100%; text-align:center;">- NCL Getaway -</div>
			<div id="overviewItems" style="font-weight:normal;width:100%; overflow:hidden;">
				<div style="float:left; width:30%;padding-left:5px">June 14th - June 25th</div>
				<div style="float:right;width:50%;text-align:right;padding-right:5px">Lisbon, Portugal - Rome, Italy</div>
			</div>
		</div>
		<div id="dayItem_000" class="boxStyle_01">
			<table style="width:100%;"><tr><td style="width:60px;">Day:</td><td style="width:20px;">0</td><td style="text-align:right;">Arrive in Lisbon</td><td style="width:30px;"> </td></tr></table>
		</div>
		<div id="dayItem_001" class="boxStyle_01">
			<table style="width:100%;"><tr><td style="width:60px;">Day:</td><td style="width:20px;">0</td><td style="text-align:right;">Arrive in Lisbon</td><td style="width:30px;"> </td></tr></table>
		</div>
		<div id="dayItem_002" class="boxStyle_01">
			<table style="width:100%;"><tr><td style="width:60px;">Day:</td><td style="width:20px;">0</td><td style="text-align:right;">Arrive in Lisbon</td><td style="width:30px;"> </td></tr></table>
		</div>
		<div id="dayItem_003" class="boxStyle_01">
			<table style="width:100%;"><tr><td style="width:60px;">Day:</td><td style="width:20px;">0</td><td style="text-align:right;">Arrive in Lisbon</td><td style="width:30px;"> </td></tr></table>
		</div>
    */
    let POCHTML = "";
    for (const portItem of portList) {
        POCHTML = POCHTML + "<div id=\"day" + portItem[2] + "\" class=\"PortOfCallItem\" onclick='' onmouseenter='' onmouseleave=''>";
        POCHTML = POCHTML + "<table width='100%'><tr><td width='15px' style='text-align:center'>" + portItem[2] + "</td><td width='50px' style='text-align:center'>" + portItem[3] + "</td><td style='text-align:center'>" + portItem[0] + ", " + portItem[1] + "</td>";
        POCHTML = POCHTML + "<td width='35px' style='text-align:center'>" + portItem[4] + "</td><td width='10px'>-</td><td width='35px' style='text-align:center'>" + portItem[5] + "</td></tr></table></div>";
    }
    POCHTML = POCHTML + "<div id=\"btn_addPort\" style=\"position:relative; float:left; width:28px; height:28px; text-align:center; padding: 0px; background-color:#EEE; border:#000 solid 1px; border-radius:4px; font-size:25px; font-weight:bold; overflow:hidden;\">";
    POCHTML = POCHTML + "+</div>"
    document.getElementById('itineraryList').innerHTML = POCHTML;
}