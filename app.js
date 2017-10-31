(function () {
    "use strict";
    //append table data
    function appendData(type, make, model) {
        var $tableRow = $('<tr>'),
            $typeData = $('<td>').text(type),
            $makeData = $('<td>').text(make),
            $modelData = $('<td>').text(model);
        $tableRow.append($typeData, $makeData, $modelData);
        $('#table-data').append($tableRow);
    }
    //grab the data from fields and update the table
    function addData(e) {
        //remove default functionality of submit
        e.preventDefault();
        var type = $('.type-select option:selected').text(),
            make = $('#make').val(),
            model = $('#model').val();
        if ($('.type-select option:selected').val() !== "not" && (type && make && model)) {
            appendData(type, make, model);
            //empty to default values
            $('#make,#model').val("");
            $('select option:contains("Select a type")').prop('selected', true);
        } else if ($('.type-select option:selected').val() === "not") {
            //overlay to show that type is required
            alert("Please select Type");
        } else {
            //overlay to show mke or model is needed
            alert("Please add make or model");
        }
    }
    // looping all the table data
    function loopTabledata(flag) {
        var vehicleObj = {};
        $('#table-data tr').each(function (index) {
            var $cells = $(this).children(),
                vehicleArry = [];
            //loop through each data of row
            $cells.each(function () {
                //for the search input field if matched the entered value highlight the column data exact search
                if ($(this).text().toLowerCase() === $('#search').val().toLowerCase() && flag === "highlightFlag") {
                    $(this).addClass('highlight-exact');
                }
                //for the search input field if matched the entered value highlight the column data matches partially
                else if ($(this).text().toLowerCase().indexOf($('#search').val().toLowerCase()) !== -1 && flag === "highlightFlag") {
                    $(this).addClass('highlight-close-match');
                }
                //pushing data for json object creation
                else if (flag === "jsonFlag") {
                    vehicleArry.push($(this).text());
                }
            });
            //creating the object if json is clicked
            flag === "jsonFlag" ? vehicleObj[index] = vehicleArry : "";
        });
        //return vehicle object only for json button click
        if (flag === "jsonFlag") {
            return vehicleObj;
        }
    }

    //make json data from table
    function makeJson() {
        var vehicle = loopTabledata("jsonFlag");
        $('#json-text').show();
        $('#json-text').val(JSON.stringify(vehicle));
    }
    //check whether the key is enter key
    function checkKeyPress(e) {
        //check whether the pressed is enter key and check for submit or json click then add data or create json 
        if (e.keyCode === 13 && (e.target.id === "submit" || e.target.id === "json-data")) {
            e.target.id === "submit" ? addData(e) : makeJson();
        } else if (e.keyCode === 13 && !(e.target.className === "type-select")) {
            //dont add data when on input fields not on select option
            e.preventDefault();
            return false;
        }
    }


    //highlight the data on table if matched
    function highlightMatch(e) {
        $('td').removeClass('highlight-exact highlight-close-match');
        //highlight only when the length is 3 or more 
        if ($('#search').val().length >= 3) {
            loopTabledata('highlightFlag');
        }
    }

    $(document).ready(function () {
        //for the enter keypress also adds the data into table
        $('body').on('keypress', checkKeyPress);
        $('#submit').on('click', addData);
        $('#json-data').on('click', makeJson);
        $('#search').on('input', highlightMatch);
    });
}());
