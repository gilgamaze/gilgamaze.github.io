(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
        var cols = [{
                id: "id",
                dataType: tableau.dataTypeEnum.string
            }, {
                id: "value",
                alias: "value",
                dataType: tableau.dataTypeEnum.float
            }, {
                id:"country",
                alias:"country",
                dataType: tableau.dataTypeEnum.string
            }];

        var tableInfo = {
            id: "worldBankFeed",
            alias: "Richard: put a description here",
            columns: cols
        };

        schemaCallback([tableInfo]);
    };

    myConnector.getData = function (table, doneCallback) {
        var data = null;
        var tableData = [];

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                var xmlDoc = xhr.responseXML;
                var arr_data = xmlDoc.getElementsByTagName("wb:data");
                for (var i = 0; i < arr_data.length; i++) {
                    var country_name = arr_data[i].getElementsByTagName('wb:country')[0].childNodes[0].nodeValue;
                    var country_value = arr_data[i].getElementsByTagName('wb:value')[0].childNodes[0].nodeValue;
                    var country_indicator = arr_data[i].getElementsByTagName('wb:indicator')[0].getAttribute('id');
                    console.log(country_indicator);
                    tableData.push({
                        "id": country_indicator,
                        "value": country_value,
                        "country": country_name
                    });
                }
                table.appendRows(tableData);
                doneCallback();
            }
        });

        //xhr.open("GET", "http://localhost:8889/api.worldbank.org/countries/all/indicators/NY.GDP.MKTP.CD?date=2002:2015");
        xhr.open("GET", "//api.worldbank.org/countries/all/indicators/NY.GDP.MKTP.CD?date=2002:2015");
        xhr.setRequestHeader("cache-control", "no-cache");

        xhr.send(data);
    };


    tableau.registerConnector(myConnector);
    $(document).ready(function () {
        $("#submitButton").click(function () {
            tableau.connectionName = "Richard: put something here if you like ";
            tableau.submit();
        });
    });
})();

