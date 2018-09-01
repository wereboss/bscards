// Global Vars
var scrJSONArr = [];
var mainlist = [];
var mainInd;

/* Display the screens corresponding to passed list of screen ID, no return value*/
function displayScreens(listScrID, startID, scrArr) {
  if (startID < 0) {
    sID = 0;
  } else {
    sID = listScrID.indexOf(startID);
  }
  cntList = 0;
  //console.log("displayScreens listScrID: " + JSON.stringify(listScrID));
  //console.log("displayScreens sID: " + sID);
  //console.log("displayScreens scrArr len: " + scrArr.length);

  //console.log("inside while");

  $(".card-screen").each(function() {
    if (sID < listScrID.length && cntList < 3) {
      //console.log("listScrID:" + JSON.stringify(listScrID));
      scrObj = scrArr.find(function(value, index, array) {
        //console.log("Checking " + value.Id + "with list sID:" + sID);
        return value.Id == listScrID[sID];
      });
      //console.log("displayScreens scrObj: " + JSON.stringify(scrObj));
      if(scrObj.Img.length > 0){
        tmpimg = scrObj.Img.split(",");
      }
      else {
        tmpimg = [""];
      }
      $(this)
        .find("img.card-img")
        .first()
        .attr("src", tmpimg[0]);
      $(this)
        .children("h3.card-header")
        .first()
        .text("Screen " + scrObj.Id);
      $(this)
        .children("div.card-body")
        .first()
        .text(scrObj.Desc);
      //console.log("NextScr Len:" + scrObj.nextScr.length);
      footerObj = $(this)
        .children("div.card-footer")
        .first();
      footerObj.text("");
      footerObj.innerHTML = "";
      newHTML = "";
      newHTML += '<div class="dropdown">';
      newHTML +=
        '<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Possible Next Screens</button>';
      newHTML +=
        '<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">';
      tmparr2 = [];
      if(scrObj.NextScr) {
        tmparr2 = scrObj.NextScr.split(",");
      }
      else {
        tmparr2 = [""];
      }
      
      if (tmparr2.length > 1) {
        //console.log("inside scrObj.nextScr.length")
        //nextArr = scrObj.nextScr
        //priorlist = mainlist.slice(0,mainlist.indexOf(listScrID[sID])+1);
        $.each(tmparr2, function(ini, it) {
          tmpsObj = scrArr.find(function(value, index, array) {
            //console.log("Checking " + value.Id + "with list sID:" + sID);
            return value.Id == it;
          });
          //priorlist.push(it);
          //footerObj.append('<a href="#" onclick="changeList(' + listScrID[sID] + ',' + it + ')">' + it + "</a><br>");
          newHTML +=
            '<a class="dropdown-item" href="#" onclick="changeList(' +
            listScrID[sID] +
            "," +
            it +
            ')">(' +
            it +
            ")" + tmpsObj.ScreenName + "</a>";
        });
        newHTML += " </div> </div>";
        //console.log(newHTML);
        footerObj.html(newHTML);
        //footerObj.innerHTML = newHTML;
      }
      sID += 1;
      cntList += 1;
    } else {
      //console.log("inside else");
      if (cntList <= 2) {
        //console.log("Inside cntList>3");
        $(this)
          .find("img.card-img")
          .first()
          .attr("src", "temp.png");
        $(this)
          .children("h3.card-header")
          .first()
          .text("");
        $(this)
          .children("div.card-body")
          .first()
          .text("");
        $(this)
          .children("div.card-footer")
          .first()
          .text("");
      }
    }
  });
}

function getNextScrn(lastScrID, scrArr) {
  var tmparr = [];
  lastScr = scrArr.find(function(value, index, array) {
    return value.Id >= lastScrID;
  });
  if (lastScrID < 0) {
    return lastScr.Id;
  } else {
    if(lastScr.NextScr){
      tmparr = lastScr.NextScr.split(","); 
      return parseInt(tmparr[0]);
    }
    else {
      return null;
    }
    
    
  }
}

/*Parse screen list to form a connected list of screens, return back screen ID list */
function incrScreenList(scrArr) {
  //console.log("scrnIDlist len " + scrnIDlist.length);
  //console.log("scrArr len " + scrArr.length);
  /*
    if(scrnIDlist.length>0){
        lastScrID = scrnIDlist[scrnIDlist.length - 1];
    }
    else {
        lastScrID = -1;
    }
    if(scrnIDlist.length < 3){  
        iniLength = 3;
    }
    else {
        iniLength = scrnIDlist.length + 1;
    }
    */
  if (mainlist) {
    if (mainlist.length < 1) {
      finalLength = 3;
      lastScrID = -1;
    } else {
      if (mainInd) {
        finalLength = mainlist.indexOf(mainInd) + 3;
        lastScrID = mainlist[mainlist.length - 1];
        //console.log("finalLen:" + finalLength + " lastScrID:" + lastScrID);
      }
    }
  }
  while (mainlist.length < finalLength) {
    //console.log("Inside While " + scrnIDlist.length);
    nScr = getNextScrn(lastScrID, scrArr);
    if (nScr) {
      //scrnIDlist.push(nScr);
      mainlist.push(nScr);
      lastScrID = mainlist[mainlist.length - 1];

      if (mainlist.length == 1) {
        mainInd = mainlist[0];
        //console.log("length 1:" + mainInd);
      }
    } else {
      break;
    }
  }
  //console.log("Ready scrnIDlist " + JSON.stringify(scrnIDlist));
  return mainlist;
}

function checkG() {
  //console.log("Arr: " + JSON.stringify(scrJSONArr));
  console.log("G List: " + JSON.stringify(mainlist));
  console.log("MainInd: " + mainInd);
}

function callNext() {
  if (mainlist.length > 2) {
    if (mainlist.length - mainlist.indexOf(mainInd) - 1 < 3) {
      //nScr = getNextScrn(mainlist[mainlist.indexOf(mainInd)+2],scrJSONArr);
      //console.log("inside add");
      nScr = getNextScrn(mainlist[mainlist.length - 1], scrJSONArr);
      if (nScr) {
        mainlist.push(nScr);
        mainInd = mainlist[mainlist.indexOf(mainInd) + 1];
        displayScreens(mainlist, mainInd, scrJSONArr);
        //console.log("next");
        return true;
      } else {
        return false;
      }
    } else {
      mainInd = mainlist[mainlist.indexOf(mainInd) + 1];
      displayScreens(mainlist, mainInd, scrJSONArr);
      //console.log("next");
      return true;
    }
  } else {
    return false;
  }
}

function callPrev() {
  if (mainlist.indexOf(mainInd) > 0) {
    mainInd = mainlist[mainlist.indexOf(mainInd) - 1];
    displayScreens(mainlist, mainInd, scrJSONArr);
    //console.log("prev");
    return true;
  } else {
    return false;
  }
}

function changeList(currInd, nextInd) {
  console.log("changeList");
  checkG();
  mainlist = mainlist.slice(0, mainlist.indexOf(currInd) + 1);
  console.log("Sliced List: " + JSON.stringify(mainlist));
  mainlist.push(nextInd);
  console.log("Pushed List: " + JSON.stringify(mainlist));
  if (mainlist.indexOf(currInd) - mainlist.indexOf(mainInd) > 1) {
    console.log("changing mainInd");
    mainInd = mainlist[mainlist.indexOf(mainInd) + 1];
  }
  checkG();
  if (mainInd == currInd) {
    incrScreenList(scrJSONArr);
  }
  displayScreens(mainlist, mainInd, scrJSONArr);
  checkG();
}

$(function() {
  $(".arrow span").click(function() {
    //console.log($(this).attr("class"));
    //checkG();
    //debugger;
    if ($(this).hasClass("fa-chevron-left")) {
      if (!callPrev()) {
        //console.log("First");
      }
    } else {
      if (!callNext()) {
        //console.log("End");
      }
    }
    checkG();
  });
  
  
  $.getJSON("scrn2.json", function(data) {
    //var items = [];
    //scrJSONArr = data.screens;

    $.each(data.screens, function(ini, it) {
      scrJSONArr.push(it);
    });

    console.log("StringiFy " + JSON.stringify(scrJSONArr));
    //console.log("scrJSONArr len " + scrJSONArr.length);
    displayScreens(incrScreenList(scrJSONArr), -1, scrJSONArr);
    //incrScreenList([],scrJSONArr);
    //checkG();
  });
});
