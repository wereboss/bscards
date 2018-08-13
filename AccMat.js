//Func for AccessMatrix.html
$(function () {
    var AMdata = [];
    //console.log("Inside Main");
    //console.log("Before AMData:" + JSON.stringify(AMdata));
    AMdata = loadJSON("accmtrx.json");
    //console.log("After AMData:" + JSON.stringify(AMdata));
    console.log("After AMData length:" + AMdata.length);
    $('#AMtable').bootstrapTable({
        data: AMdata
    });
});