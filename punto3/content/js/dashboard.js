/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 6;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 85.66551634569001, "KoPercent": 14.334483654309993};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8564510742513637, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9998702646600934, 500, 1500, "\/icons\/ubuntu-logo.png-3"], "isController": false}, {"data": [0.99934997399896, 500, 1500, "\/-11"], "isController": false}, {"data": [0.0, 500, 1500, "\/favicon.ico-4"], "isController": false}, {"data": [0.9998697577494139, 500, 1500, "\/icons\/ubuntu-logo.png-14"], "isController": false}, {"data": [0.9987043275459964, 500, 1500, "\/-2"], "isController": false}, {"data": [0.0, 500, 1500, "\/robots.txt-1"], "isController": false}, {"data": [0.9981789802289281, 500, 1500, "\/-13"], "isController": false}, {"data": [0.999351323300467, 500, 1500, "\/-5"], "isController": false}, {"data": [0.9996106929665196, 500, 1500, "\/icons\/ubuntu-logo.png-6"], "isController": false}, {"data": [0.9990911451571021, 500, 1500, "\/-7"], "isController": false}, {"data": [0.9994805194805195, 500, 1500, "\/icons\/ubuntu-logo.png-8"], "isController": false}, {"data": [0.9994802494802495, 500, 1500, "\/-9"], "isController": false}, {"data": [0.999739921976593, 500, 1500, "\/icons\/ubuntu-logo.png-12"], "isController": false}, {"data": [1.0, 500, 1500, "\/icons\/ubuntu-logo.png-10"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 53898, 7726, 14.334483654309993, 5.901833092137019, 0, 834, 12.0, 25.0, 63.0, 3274.085773296076, 9948.02144949353, 1111.7884061588811], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/icons\/ubuntu-logo.png-3", 3854, 0, 0.0, 4.405812143227797, 0, 520, 9.0, 21.0, 51.44999999999982, 234.28571428571428, 828.8087124810031, 72.75669642857143], "isController": false}, {"data": ["\/-11", 3846, 1, 0.026001040041601663, 7.402756110244441, 0, 830, 18.0, 34.0, 83.05999999999949, 233.79939209726444, 793.5046423822189, 86.96719462386018], "isController": false}, {"data": ["\/favicon.ico-4", 3854, 3854, 100.0, 4.035806953814229, 0, 481, 7.0, 17.0, 49.0, 234.28571428571428, 112.23333016717326, 70.46875], "isController": false}, {"data": ["\/icons\/ubuntu-logo.png-14", 3839, 0, 0.0, 4.4389163844751245, 0, 584, 8.0, 18.0, 55.79999999999973, 233.4874102907189, 826.0220229632952, 78.43717689453838], "isController": false}, {"data": ["\/-2", 3859, 4, 0.10365379632029023, 8.514381964239414, 0, 658, 19.0, 36.0, 110.80000000000018, 234.41866115903292, 795.4176308505953, 81.18395063251731], "isController": false}, {"data": ["\/robots.txt-1", 3855, 3855, 100.0, 4.515175097276282, 0, 745, 7.0, 17.0, 49.88000000000011, 234.24682505924528, 112.34931136826275, 60.37609375949444], "isController": false}, {"data": ["\/-13", 3844, 5, 0.13007284079084286, 7.990634755463057, 0, 834, 16.0, 31.0, 82.55000000000018, 233.66360707555774, 792.810788003009, 86.8262068985168], "isController": false}, {"data": ["\/-5", 3854, 1, 0.02594706798131811, 8.275817332641415, 0, 759, 18.0, 33.25, 112.34999999999945, 234.21452446065024, 794.902171642358, 87.1216599247949], "isController": false}, {"data": ["\/icons\/ubuntu-logo.png-6", 3853, 1, 0.025953802232026993, 4.519335582662871, 0, 625, 8.0, 21.0, 49.460000000000036, 234.13952357802626, 828.2333618816846, 78.63583191541079], "isController": false}, {"data": ["\/-7", 3851, 1, 0.025967281225655673, 7.887561672292915, 0, 756, 17.0, 33.0, 84.0, 234.0464324784247, 794.3234975158016, 87.05911651422146], "isController": false}, {"data": ["\/icons\/ubuntu-logo.png-8", 3850, 2, 0.05194805194805195, 4.874805194805201, 0, 417, 9.0, 20.0, 56.0, 234.01410162898128, 827.7494401326586, 78.57327376610746], "isController": false}, {"data": ["\/-9", 3848, 1, 0.02598752598752599, 7.591216216216233, 0, 636, 17.0, 32.0, 93.01999999999953, 233.90675338885174, 793.8436255774725, 87.00714194805786], "isController": false}, {"data": ["\/icons\/ubuntu-logo.png-12", 3845, 1, 0.02600780234070221, 4.110793237971382, 0, 273, 9.0, 19.0, 43.0, 233.76702334630352, 826.9182494642206, 78.51068518968872], "isController": false}, {"data": ["\/icons\/ubuntu-logo.png-10", 3846, 0, 0.0, 4.057202288091525, 0, 422, 9.0, 18.0, 43.529999999999745, 233.91314925191583, 827.5042692684892, 78.58019857681548], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 18, 0.23297954957287081, 0.033396415451408215], "isController": false}, {"data": ["404\/Not Found", 7708, 99.76702045042713, 14.301087238858585], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 53898, 7726, "404\/Not Found", 7708, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 18, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["\/-11", 3846, 1, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/favicon.ico-4", 3854, 3854, "404\/Not Found", 3854, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/-2", 3859, 4, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/robots.txt-1", 3855, 3855, "404\/Not Found", 3854, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["\/-13", 3844, 5, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/-5", 3854, 1, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/icons\/ubuntu-logo.png-6", 3853, 1, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/-7", 3851, 1, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/icons\/ubuntu-logo.png-8", 3850, 2, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/-9", 3848, 1, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/icons\/ubuntu-logo.png-12", 3845, 1, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
