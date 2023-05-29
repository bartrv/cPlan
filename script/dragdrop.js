function drag(eventData, data) {
    eventData.dataTransfer.setData("text", data);
}

function dragOut(dropTarget) {
    dropTarget.style.backgroundColor = "#aa9999";
    dropTarget.style.height = "3px";
}

function dragIn(dropTarget) {
    dropTarget.style.backgroundColor = "#ff9999";
    dropTarget.style.height = "8px";
}

function mouseYHover(pointEvent, key, midYPoint) {
    //console.log(pointEvent);
    dividerBefore = document.getElementById('divider' + key);
    dividerAfter = document.getElementById('divider' + (parseInt(key) + 1));
    if (pointEvent.clientY > midYPoint) {
        dividerBefore.style.backgroundColor = "#aa9999";
        dividerBefore.style.height = "3px";
        dividerAfter.style.backgroundColor = "#ff9999";
        dividerAfter.style.height = "8px";
    } else {
        dividerBefore.style.backgroundColor = "#ff9999";
        dividerBefore.style.height = "8px";
        dividerAfter.style.backgroundColor = "#aa9999";
        dividerAfter.style.height = "3px";
    }
}

function allowDrop(eventData, dropTarget, key) {
    eventData.preventDefault();
    if (dropTarget.id.substring(0, 7) != "divider") {
        let dropArea = dropTarget.getBoundingClientRect();
        let midYPoint = parseInt((dropArea.bottom + dropArea.top) / 2)
        mouseYHover(eventData, key, midYPoint);
    }
}

function dropItem(eventData, dropTarget, data) {
    //console.log(data + ", " + eventData.dataTransfer.getData("text"));
    eventData.preventDefault();
    let dataInsertTarget = parseInt(data) //+ dropTargetSide;
    let dataToMoveIndex = parseInt(eventData.dataTransfer.getData("text"));
    let tempList = {};
    let DataEntryToMove = { ...itemList[dataToMoveIndex.toString()] };
    let listLength = Object.keys(itemList).length;
    let dropTargetSide;

    //determine if drop recipient is the divider, or the top/bottom of the display panel
    if (dropTarget.id.substring(0, 7) != "divider") {
        let dropTargetRect = dropTarget.getBoundingClientRect();
        dropTargetSide = (eventData.y > parseInt((dropTargetRect.bottom + dropTargetRect.top) / 2)) ? 1 : 0;  // is the mouseY > midpoint Y?, y=1, n=0
    } else {
        if (parseInt(dropTarget.id.substring(7)) < Object.entries(itemList).length) { // always divider drop inserts before data index
            dropTargetSide = 0;
        } else {
            dropTargetSide = 1; //last divider indicates a data index +1 greater than last array index value, reduce to point to last entry index/key 
            dataInsertTarget -= 1;
        }
    }
    //insert logic - ignore everything before and after dragged item and insertion point, bubble changes through range, offset by top/bottom insert Y location
    // data is copied to prevent referance overwriting and duplication
    // THIS ASSUMES Key/Value array is in CORRECT ORDER, If Array is UnOrdered this will FAIL
    // This does not re-order the array, only Value REFERANCES WITHIN THE ARRAY
    for (let i = 0; i < listLength; i++) {
        if ((i < dataInsertTarget && i < dataToMoveIndex) || (i > dataInsertTarget && i > dataToMoveIndex)) {
            continue;
        } else {
            if (dataToMoveIndex < dataInsertTarget) {
                if (i == dataInsertTarget - 1 + dropTargetSide) {
                    tempList[(i).toString()] = DataEntryToMove;
                } else if (i < dataInsertTarget) {
                    tempList[i.toString()] = { ...itemList[(i + 1).toString()] };
                } else {
                    tempList[(i).toString()] = { ...itemList[i.toString()] };
                }
            } else if (dataToMoveIndex >= dataInsertTarget) {
                if (i == dataInsertTarget + dropTargetSide) {
                    tempList[(i).toString()] = DataEntryToMove;
                } else if (i > dataInsertTarget) {
                    tempList[(i).toString()] = { ...itemList[(i - 1).toString()] };
                } else {
                    tempList[(i).toString()] = { ...itemList[i.toString()] };
                }
            }
        }
    }

    for (const [key, item] of Object.entries(tempList)) {
        itemList[key].text = tempList[key].text;
    }

    buildList();
    }
