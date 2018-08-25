//Func for AccessMatrix.html
$(function () {
    var AMdata = [];
    //console.log("Inside Main");
    //console.log("Before AMData:" + JSON.stringify(AMdata)); 
    //Switch "glyphicon glyphicon-plus icon-plus" to ""
    AMdata = loadJSON("accmtrx.json");
    //console.log("After AMData:" + JSON.stringify(AMdata));
    console.log("After AMData length:" + AMdata.length);
    $('#AMtable').bootstrapTable({
        data: AMdata,
        icons: {
            detailOpen: 'fas fa-plus fa-xs logogrey icon-plus',
            detailClose: 'fas fa-minus fa-xs logogrey icon-minus'
        },
        columns: [
            [
                {
                    field: "Feature",
                    title: "Feature",
                    align: 'center',
                    valign: 'middle',
                    sortable: true
                },
                {
                    field: "Function",
                    title: "Function",
                    align: 'left',
                    valign: 'middle',
                    sortable: true
                },
                {
                    field: "HRT",
                    title: "HRT",
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    formatter: HRTFormatter
                },
                {
                    field: "OTP",
                    title: "OTP",
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    formatter: OTPFormatter
                },
                {
                    field: "CMAMTCheck",
                    title: "CMAMT",
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    formatter: CMAMTFormatter
                },
                {
                    field: "Tags",
                    title: "Tags",
                    align: 'left',
                    valign: 'middle',
                    sortable: true
                }
            ]
        ],
        detailView: true,
        detailFormatter: dFormatter,
        detailFilter: dFilter
    });
    /*
        $('#AMtable').on('click-row.bs.table', function (row, $element, field) {
            var tmp = field.text();
            debugger;
            alert(row.innerHTML);
        });
    */
    //$(".glyphicon-plus").addClass("fas fa-plus");
    //$(".glyphicon-minus").addClass("fas fa-minus");
    $('[data-toggle="popover"]').popover();

    $('#AMtable').on('expand-row.bs.table', function (e, index, row, $detail) {
        //debugger;
        //alert("expanded:" + index);
        //$(".glyphicon-plus").addClass("fas fa-plus");
        //$(".glyphicon-minus").addClass("fas fa-minus");
        $detail.text(AMdata[index].Desc);
    });

    $('#AMtable').on('collapse-row.bs.table', function (e, index, row) {
        //debugger;
        //alert("collapsed:" + index);
        //$(".glyphicon-plus").addClass("fas fa-plus");
        //$(".glyphicon-minus").addClass("fas fa-minus");
    });
    $('#AMtable').on('search.bs.table', function (e, text) {
        //debugger;
        //alert("collapsed:" + index);
        //$(".glyphicon-plus").addClass("fas fa-plus");
        //$(".glyphicon-minus").addClass("fas fa-minus");
    });

    var strCountry = ['APAC', 'EMEA',
        'AU', 'SG', 'SGIPB', 'HK', 'CN', 'MY', 'TH', 'PH', 'VN', 'TW',
        'PL', 'RU', 'UKIPB', 'BH', 'AE'
    ];
    strCountry.forEach(function (val, ini) {
        $("#CountryDropdown").append('<a class="dropdown-item" href="#" onclick="filterCountry(' + "'" + val.toUpperCase() + "'" + ')">' + val.toUpperCase() + '</a>');
    });

});

function dFormatter(index, row, element) {
    //debugger;
    //$(".glyphicon-plus").addClass("fas fa-plus");
    //$(".glyphicon-minus").addClass("fas fa-minus");
    return 'sample detail text';
}

function dFilter(index, row) {
    //debugger;
    return true;
}

function HRTFormatter(value, row, index) {
    if (value) {
        return [
            '<a class="logogreen" href="javascript:void(0)" title="Protected">',
            '<i class="fas fa-lock" data-toggle="popover" data-placement="top" data-content="High Risk Transaction, needs Password Entry "></i>',
            '</a>'
        ].join('');
    }
    else {
        return [
            '<a class="logogrey" href="javascript:void(0)" title="Normal">',
            '<i class="fas fa-lock-open" data-toggle="popover" data-placement="top" data-content="Non-HRT, allows access for Biometric login"></i>',
            '</a>'
        ].join('');
    }
}

function OTPFormatter(value, row, index) {
    var strOvr;
    if (value == "Session") {
        //console.log(row.OverrideCMAMT);
        /*
                return [
                    '<a href="javascript:void(0)" title="Session">',
                    '<span class="badge badge-secondary">Session</span>',
                    '</a>'
                ].join('');
                */
        if (!row.OverrideCMAMT) {
            strOvr = '<button type="button" class="btn btn-secondary" data-toggle="popover" data-placement="top" data-content="CMAMT Interdicts are prioritised"><i class="fas fa-user-shield logoorange"></i></button>';
        }
        else {
            strOvr = '<button type="button" class="btn btn-secondary" data-toggle="popover" data-placement="top" data-content="CMAMT Interdicts are ignored if already interdicted previously in the same session"><i class="fas fa-user-shield logogrey"></i></button>';
        }
        return [
            '<div class="btn-group btn-group-sm" role="group" aria-label="Session">',
            '<button type="button" class="btn btn-secondary" data-toggle="popover" data-placement="top" data-content="Needs OTP interdicts only once per session">Session</button>',
            strOvr,
            '</div>'
        ].join('');
    }
    else {
        return [
            '<button type="button" class="btn btn-secondary btn-sm" data-toggle="popover" data-placement="top" data-content="OTP is triggered for every transaction">Transaction</button>'
        ].join('');
    }
}

function CMAMTFormatter(value, row, index) {
    if (value) {
        return [
            '<a class="logogreen" href="javascript:void(0)" title="CMAMT Checked">',
            '<i class="fas fa-user-shield" data-toggle="popover" data-placement="top" data-content="CMAMT contacted for OTP interdicts"></i>',
            '</a>'
        ].join('');
    }
    else {
        return [
            '<a class="logogrey" href="javascript:void(0)" title="No Check">',
            '<i class="fas fa-user" data-toggle="popover" data-placement="top" data-content="CMAMT not contacted"></i>',
            '</a>'
        ].join('');
    }
}

function filterCountry(option) {
    var jData = [], nData = [];
    if (option == "All") {
        $('#AMtable').bootstrapTable('load', loadJSON("accmtrx.json"));
        $("#infoalert").text("");
    }
    else {
        jData = loadJSON("accmtrx.json");
        nData = jData.filter(function (val, index) {
            return (val.Tags.indexOf(option) > -1);
        });
        $('#AMtable').bootstrapTable('load', nData);
        $("#infoalert").text("Filtered by Country :" + option);
    }
    //$(".glyphicon-plus").addClass("fas fa-plus");
    //$(".glyphicon-minus").addClass("fas fa-minus");
}