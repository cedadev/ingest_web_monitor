
google.charts.load('current', {packages: ['corechart', 'bar']});
//google.charts.setOnLoadCallback(drawBasic);

var ES_URL = "https://elasticsearch.ceda.ac.uk/ceda-fbi/_search";


function get_hist(n)
{
    var nn = 100 * Math.pow(100, n);
    var histogram_filesize = {
        "query": {
            "bool": {"must": [
              {"prefix": {"info.directory": {"value": "/badc"}}},
              //{"term": {"info.type.keyword": {"value": ".na"}}}
              {"range": {"info.size": {"gte": nn, "lte": nn*150}}}
            ] 
          }
          },
          "size": 1, 
         "aggs": {
           "tvol": {"sum": {"field": "info.size"}},
           "num": {"histogram": {
             "field": "info.size",
             "interval": nn
           }},
           "dirs": {"value_count": {"field": "info.directory"}}
         }};
    var chartid = "chart_div" + n 
    var last_logs = {};
    $.post({
                url: ES_URL,
                data: JSON.stringify(histogram_filesize),
                success: function (data) {
                    console.log("in sussess")
                    var stats = data.aggregations.num.buckets;
                    var num = new Array;
                    num.push(["Size", "count"]);
                    for (var j=0; j < stats.length; j++){
                        num.push([stats[j].key, stats[j].doc_count]);
                    }
                    drawBasic(num, chartid);
                },
                error: function (data) {
                    console.log(data)
                },
                contentType: "application/json"
            }
    );
}

function drawBasic(d, chartid) {
    console.log(d);
      var data = google.visualization.arrayToDataTable(d);

      var options = {
        title: 'Number of files by file size xx',
        height: 400,
        width: 500,
        chartArea: {width: '45%', hieght: '300'},
        hAxis: {
          title: 'Number of files x',
          minValue: 0
        },
        vAxis: {
          title: 'Size'
        }
      };

      var chart = new google.visualization.BarChart(document.getElementById(chartid));

      chart.draw(data, options);
    }

    get_hist(0); 
    get_hist(1);
  get_hist(2);
  get_hist(3);
  get_hist(4);