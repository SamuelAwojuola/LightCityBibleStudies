//SVG PATH
function nodesconnector2(pathXYcord, divClassforColor) {
	console.log('divClassforColor=>' + divClassforColor);

	var path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
	document.getElementById("svg").append(path1);

	//	path1.setAttributeNS(null, pathXYcord);
	path1.setAttributeNS(null, "d", pathXYcord);
	//		path1.setAttributeNS(null, "stroke", "black");
	path1.setAttributeNS(null, "stroke-width", 19);
//	path1.setAttributeNS(null, "stroke-dasharray", 5);
//	path1.setAttributeNS(null, "stroke-dashoffset", 1);
	path1.setAttributeNS(null, "opacity", 0.9);
	path1.setAttributeNS(null, "fill", "none");
	path1.classList.add("svg-connectors2");
	path1.classList.add(divClassforColor);
}

function drawConnector2(X, Y, divClassforColor) {
	var svgMasterTop = svgMaster.getBoundingClientRect().top;
	var svgMasterLeft = svgMaster.getBoundingClientRect().left;
	var pageScrollX = documentHTML.scrollLeft;
	var pageScrollY = documentHTML.scrollTop;

	var A = getCoordinates(X);
	var B = getCoordinates(Y);
	var posnA = {
		x: A.rightCenterX - svgMasterLeft - pageScrollX,
		y: A.rightCenterY - svgMasterTop - pageScrollY
	};
	var posnB = {
		x: B.leftCenterX - svgMasterLeft - pageScrollX,
		y: B.leftCenterY - svgMasterTop - pageScrollY
	};
	var dStr =
		"M" +
		(posnA.x) + "," + (posnA.y) + " " +
		"C" +
		(posnA.x + 100) + "," + (posnA.y) + " " +
		(posnB.x - 100) + "," + (posnB.y) + " " +
		(posnB.x) + "," + (posnB.y);
	//	connector.setAttribute("d", dStr);
	nodesconnector2(("M" +
		(posnA.x) + "," + (posnA.y) + " " +
		"C" +
		(posnA.x + 100) + "," + (posnA.y) + " " +
		(posnB.x - 100) + "," + (posnB.y) + " " +
		(posnB.x) + "," + (posnB.y)), 'opt_' + divClassforColor);
	console.log('drawConnector2()');
}

//The following generates the special lines
function generateCustomSVGConnectorsType2() {
	//before redrawing svg-connectors, the old ones have to be removed or else there will be duplicates. So
	//Check if there are svg-connectors. If there are, remove them
	if (document.querySelector('.svg-connectors2')) {
		var allLeaderLines = document.querySelectorAll('.svg-connectors2');
		// Remove all existing lines.
		for (k = 0; k < allLeaderLines.length; k++) {
			allLeaderLines[k].remove();
		}
	}

	//Get all divs that are to have special connections
	//These have the connectFrom attribute in common
	var allDivsWithConnectFromAttr = document.querySelectorAll('[connectFrom]');
	console.log('allDivsWithConnectFromAttr:');
	console.log(allDivsWithConnectFromAttr);
	for (cfrm = 0; cfrm < allDivsWithConnectFromAttr.length; cfrm++) {

		var destinationDiv = allDivsWithConnectFromAttr[cfrm];
		var node2 = destinationDiv;
		var node1;

		var destinationDivzParent = destinationDiv.parentNode;
		var clickedDivOptClass = destinationDiv.getAttribute('divclassname');
		var divzConnectFromValue = destinationDiv.getAttribute('connectFrom');
		var divzConnectFromArray = divzConnectFromValue.split(', ');

		//GENERATE CONNECTION
		var precedingCellIndex = destinationDivzParent.cellIndex - 1;
		for (k = 0; k < divzConnectFromArray.length; k++) {
			//index to count backwards from
			//we are looking for the closest preceding connectFrom class clickedCell - 1
			var connectFromThisClass = divzConnectFromArray[k];
			for (i = precedingCellIndex; i > -1; i--) {
				// pc -> preceedingCell
				var pcI = i + 1;
				var pcColX = 'col-' + pcI;
				//all the cells in the defined col-X column
				var allpcColX = storyLineTable.querySelectorAll('.' + pcColX);

				for (j = 0; j < allpcColX.length; j++) {
					//when you find a cell with the divClass,
					if (allpcColX[j].querySelector('.opt_' + connectFromThisClass)) {
						//connect it and break the loop
						node1 = allpcColX[j].querySelector('.opt_' + connectFromThisClass);
						//however, don't connect it if its parent cell is hidden or
						//the div to connect from is hidden (there is not need to add this extra condition because the connector carries the same class as the div is connected from so when that class is hidden, it will be hidden along with it)
						if ((allpcColX[j].style.display != 'none') && (node2.style.display != 'none')) {
							//actual connect function
							drawConnector2(node1, node2, connectFromThisClass);
						}
						node1 = null;
//						j = allpcColX.length;
						i = 0;
						break;
					}
					//after finding the first connectable element of current connectFrom class, 
					//break the loop and search for the next connectFrom class to connect with
					if ((i == 0) && (j == allpcColX.length - 1) && (node1 == null)) {
						customAlert(connectFromThisClass + ' does not exist before this point to connect from');
						divClass2ConnectTo.value = '';

					}
				}
				//reset node1
				node1 = null;
			}
		}

		divDeleteButton.style.backgroundColor = '';
		connectToButton.style.backgroundColor = '';
		clearTimeout(deletButtonColorTimeOut);

		//	deselectEmptyCell();
		buildLegendTable();
		connectAllDraggableDivsWithSVGLines();
	}
}
