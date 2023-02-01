//https://www.w3schools.com/jsref/prop_win_localstorage.asp
/* */
let dataList = { "isDataSaved": 0, "inputName": "", "inputDate": "", "inputCity": "", "inputTime": "", "inputInteger": 0, "inputDescription": "" };
let toggleFlags = { "rightDiv": 1 };

function validateForm(frmItem, type) {
	
	let itemValue = frmItem.value;
	let validOutput = "";
	let matchString=""
	if (type == 'plainText') matchString = "[a-zA-Z \\-'.]";
	if (type == 'number') matchString = "\\d";
	if (type == 'mixedText') matchString = "[a-zA-Z \\-'.\\d,@()$?]";

	for (let i = 0; i < itemValue.length; i++) {
			if (itemValue.charAt(i).match(matchString) != null) validOutput = validOutput + itemValue.charAt(i);
	}

	frmItem.value = validOutput;
}

function storeData(formData) {
	//alert(formData.inputName.value);
	for (const [key, value] of Object.entries(dataList)) {
		//itemName = formData[i].name;
		dataList[key] = formData[key].value;
	}
	for (const [key, value] of Object.entries(dataList)) {
		console.log('${key}: ${value}');
		localStorage.setItem(key,value);
	}  
}

function getData() {
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

function toggleMove(tmObject, tmDistX, tmDistY, tmTiming, caller) {
	caller.disabled = "disabled";
	let toggleVal = toggleFlags[tmObject];
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
			x = (Math.PI/2) * ((timestamp - timestart) / tmTiming);
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
			toggleFlags[tmObject] = -1 * toggleVal;
			caller.disabled = "";
		}
	}
}

function getMachineId() {

	let machineId = localStorage.getItem('MachineId');

	if (!machineId) {
		machineId = crypto.randomUUID();
		localStorage.setItem('MachineId', machineId);
	}

	return machineId;
}