
google.charts.load('current', {'packages':['corechart']});
var ES_URL = "https://elasticsearch.ceda.ac.uk/access-stats-dev2024/_search";

var urlParams = new URLSearchParams(window.location.search);
var path = urlParams.get("path");
var start = urlParams.get("start");
var end = urlParams.get("end");

download_stats_query(path, start, end);


//resp = es.search(index="access-stats-dev2024", query=query, size=10, aggs=aggs, request_timeout=900)

//stats = resp["aggregations"]["size_stats"]
//methods = buckets_to_dict(resp["aggregations"]["methods"]["buckets"])
//countries = buckets_to_dict(resp["aggregations"]["countries"]["buckets"])
//timeline = buckets_to_dict(resp["aggregations"]["timeline"]["buckets"], timeline=True)

// grab download stats and trigger page updates
function download_stats_query(path, start, end) {

    const sortorder = [{"datetime": "asc"}];
    
    const query = {"bool": {"must": [{"range": {"datetime": {"gt": start,"lte": end}}}, 
                               {"term": {"archive_path.tree": {"value": path }}}]}};
    
    const aggs = {"size_stats": {"stats": {"field": "size"}},
            "countries": {"terms": {"field": "country"}},
            "methods": {"terms": {"field": "method.keyword"}},
            "timeline": {"date_histogram": {"field": "datetime","interval": "month"}},
            "users": {"cardinality": {"field": "user", "precision_threshold": 100000}},
            "unique_files": {"cardinality": {"field": "archive_path.keyword", "precision_threshold": 100000}},
            "paths": {"terms": {"field": "archive_path.keyword"}}};
    
    const es_query = {"query": query, "sort": sortorder, "aggs": aggs};

    $.post({
        url: ES_URL,
        data: JSON.stringify(es_query),
        success: function (data) {
            console.log("OK")
            console.log(data);
            countries = data.aggregations.countries;
            update_pies(data);
            const stats = data.aggregations.size_stats
            stats.unique_files = data.aggregations.unique_files.value;
            fbi_item_count(path, end, stats, "stats")

            stats.downloads = data.aggregations.size_stats;
            methods = data.aggregations.methods;
        },
        error: function (data) {
            console.log("FAIL")
            console.log(data);
        },
        contentType: "application/json"
    });
}


function update_pies(data) {
    termPieChart("Access by country", "countries_piechart", "Country", "Accesses", data.aggregations.countries);
    termPieChart("Access by method", "methods_piechart", "Method", "Accesses", data.aggregations.methods);
    termPieChart("Access by path", "paths_piechart", "Path", "Accesses", data.aggregations.paths);
}

function update_stats_table(stats, stats_table_id) {
    table = "<table>";
    table += "<tr><td>FBI</td><td>" + stats.fbi_count + "</td></tr>";
    table += "<tr><td>downloads</td><td>" + stats.count + " (" + (stats.count*100/stats.fbi_count).toFixed(1) + "%)</td></tr>";
    table += "<tr><td>Vol</td><td>" + humanize.filesize(stats.sum) + "</td></tr>";
    table += "<tr><td>ave</td><td>" + humanize.filesize(stats.avg) + "</td></tr>";
    table += "<tr><td>max</td><td>" + humanize.filesize(stats.max) + "</td></tr>";
    table += "<tr><td>coverage</td><td>" + stats.unique_files + " (" + (stats.unique_files*100/stats.fbi_count).toFixed(1) + "%)</td></tr>";

    document.getElementById(stats_table_id).innerHTML = table;
}


function fbi_item_count(path, end, stats, stats_table_id)
//archive size summary
{
    var file_count_query = {
        "query": {
            "bool": {
                "must": [
                    { "term": { "type": { "value": "file" } } },
                    { "term": {"directory.tree": {"value": path}}},
                    {"range": {"last_modified": {"lte": end}}}
                ]
            }
        }
    };
    
    const ES_URL_FBI = "https://elasticsearch.ceda.ac.uk/fbi-2022/_count";
    $.post({
        url: ES_URL_FBI,
        data: JSON.stringify(file_count_query),
        success: function (data) {
            stats.fbi_count = data.count;
            update_stats_table(stats, stats_table_id)
        },
        error: function (data) {console.log(data);},
        contentType: "application/json"
    });
}



function getFYStartAndEndDates(startingYear) {
    let dates = [];

    for (let i = 0; i < 12; i++) {
        // Calculate the month based on fiscal year starting in April
        let month = (3 + i) % 12; // 3 = April (0 = January, 11 = December)
        
        // Adjust year: months April to December belong to the starting year,
        // and months January to March belong to the next year
        let year = month < 3 ? startingYear + 1 : startingYear;

        // Get the first day of the month
        let startDate = new Date(year, month, 1);

        // Get the last day of the month
        let endDate = new Date(year, month + 1, 0);

        dates.push({
            month: startDate.toLocaleString('default', { month: 'long'jegr8ktycwd}),
            start: startDate,
            end: endDate
        });
    }

    return dates;
}




function termPieChart(title, divID, key_heading, value_heading, agg_result) {
    const table = new Array;
    table.push([key_heading, value_heading])
    for (b of agg_result.buckets) {
        table.push([b.key, b.doc_count])
    }
    if (agg_result.sum_other_doc_count > 0) {
        table.push(['Other', agg_result.sum_other_doc_count])
    }
    var data = google.visualization.arrayToDataTable(table);
    var options = {"title": title}
    var chart = new google.visualization.PieChart(document.getElementById(divID));
    chart.draw(data, options);
  }