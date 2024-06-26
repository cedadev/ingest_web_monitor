/**
 * Created by sjp23 on 10/01/2020.
 */

// global grabstore variable 
var grabstore = {};

//var ES_URL = "http://jasmin-es1.ceda.ac.uk:9200/ingest-log/_search";
//var ES_URL = "https://jasmin-es1.ceda.ac.uk/ingest-log/_search";
var ES_URL = "https://elasticsearch.ceda.ac.uk/ingest-log/_search";

// query for last logs
last_logs_query = {
  "query": {"range": {"logtime": {"gte": "2018-06"}}},
  "aggs": {"stream": {"terms": {"field": "stream.keyword", size: 1000},
      "aggs": {"recent_logs": {"top_hits": {"size": 100,
               "sort": [{"logtime": {"order": "desc"}}]}}}
    }},
  "size": 0
};

function fbi_item_count(timeout)
//archive size summary
{
    const onedayago = new Date(Date.now() - 86400 * 1000).toISOString()
    var file_count_query = {
        "query": {
            "bool": {
                "must": [
                    { "term": { "type": { "value": "file" } } },
                ]
            }
        }
    };
    
    grabstore["fbi"] = {};
    const ES_URL_FBI = "https://elasticsearch.ceda.ac.uk/fbi-2022/_count";
    $.post({
        url: ES_URL_FBI,
        data: JSON.stringify(file_count_query),
        success: function (data) {
            grabstore["fbi"]["total_files"] = data.count;
        },
        error: function (data) {console.log(data);},
        contentType: "application/json"
    });

    file_count_query.query.bool.must.push({ "range": { "last_modified": { "gt": onedayago } } });
    $.post({
        url: ES_URL_FBI,
        data: JSON.stringify(file_count_query),
        success: function (data) {
            grabstore["fbi"]["files_in_24hrs"] = data.count;
        },
        error: function (data) {console.log(data);},
        contentType: "application/json"
    });

    setTimeout(function () { fbi_item_count(timeout) }, timeout);
}



function grab(url, name, timeout) {
    console.log(url, name, timeout);
    $.get({
            url: url,
            success: function (result) {
                grabstore[name] = result;
                setTimeout(function () {
                    grab(url, name, timeout)
                }, timeout);
            },
            error: function (data) {console.log(data); console.log(data.getAllResponseHeaders())},
        }
    );
}



// add the json content of a url to the grabstore
function grab(url, name, timeout) {
    console.log(url, name, timeout);
    $.get({
            url: url,
            success: function (result) {
                grabstore[name] = result;
                setTimeout(function () {
                    grab(url, name, timeout)
                }, timeout);
            },
            error: function (data) {console.log(data); console.log(data.getAllResponseHeaders())},
        }
    );
}


function ingest_sum(timeout)
//ingest summary
{
    last_logs_query.query.range.logtime.gte = new Date(new Date() - 2*24*3600*1000);
    console.log(ES_URL, timeout);
    $.post({
                url: ES_URL,
                data: JSON.stringify(last_logs_query),
                success: function (data) {
                    var counts = {};
                    for (i = 0; i < data.aggregations.stream.buckets.length; i++) {
                        var stream = data.aggregations.stream.buckets[i].key;
                        var last_log = data.aggregations.stream.buckets[i].recent_logs.hits.hits[0]._source;
                        var nlogs = data.aggregations.stream.buckets[i].recent_logs.hits.hits.length;
                        var doc = data.aggregations.stream.buckets[i].recent_logs.hits.hits[0]._source;
                        if (doc.state in counts) {
                            counts[doc.state]++;
                        } else {
                            counts[doc.state] = 1;
                        }
                    }
                    grabstore["ingest"] = counts;
                    setTimeout(function () {ingest_sum(timeout)}, timeout);
                },

                error: function (data) {
                    console.log(data);
                },
                contentType: "application/json"
            }
    );
}

// add the output from the simple_checks ingest job to the grabstore.
function simple_check_output(timeout)
{
    // query for simple checks
    var query = {"query": {"bool": {"must": [{"term": {"stream.keyword": "simple_checks"}}]}},
                 "sort": [{"logtime": {"order": "desc"}}],
                 "size": 1};
    $.post({
                url: ES_URL,
                data: JSON.stringify(query),
                success: function (data) {
                    var output = data.hits.hits[0]._source.output;
                    output = output.substr(output.indexOf("{"), output.length);
                    grabstore["checks"] = JSON.parse(output);
                    setTimeout(function () {simple_check_output(timeout)}, timeout);
                    console.log("XXXX")
                },
                error: function (data) {console.log(data)},
                contentType: "application/json"
            }
    );
}

// add uptimerobot state to the grabstore
function uptimerobot(timeout) {
    var url = "https://api.uptimerobot.com/v2/getMonitors";
    var query_data = {"api_key": "ur668013-4786377064a9ad449c09d1de", "logs": 0, "limit": 50};
    grabstore["uptimerobot"] = {};
    Object.keys(grabstore["uptimerobot"]).length
    var offset = 0;
    for (var offset = 0; offset < 200; offset += 50) {
        query_data["offset"] = offset;
        $.post({url: url,
                data: JSON.stringify(query_data),
                success: function (data) {
                    for (var i=0; i < data.monitors.length; i++) {
                        m = data.monitors[i];
                        grabstore["uptimerobot"][m.friendly_name] = m.status;}
                },
                error: function (data) {console.log(data)},
                contentType: "application/json"
            });
    }
    setTimeout(function () {uptimerobot(timeout)}, timeout);

}

// get the last ingest logs 
function get_last_logs() {
    $.post({
            url: ES_URL,
            data: JSON.stringify(last_logs_query),
            success: function (data) {
                for (var i = 0; i < data.aggregations.stream.buckets.length; i++) {
                    var stream = data.aggregations.stream.buckets[i].key;
                    var last_log = data.aggregations.stream.buckets[i].recent_logs.hits.hits[0]._source;
                    var nlogs = data.aggregations.stream.buckets[i].recent_logs.hits.hits.length;
                    var counts = {};
                    for (var j = 0; j < nlogs; j++) {
                        var doc = data.aggregations.stream.buckets[i].recent_logs.hits.hits[j]._source;
                        if (doc.state in counts) {
                            counts[doc.state]++;
                        } else {
                            counts[doc.state] = 1;
                        }
                    }
                    last_log.counts = counts;
                    last_log.nlogs = nlogs;
                }
                setTimeout(get_last_logs, 5000);
            },
            error: function (data) {console.log(data)},
            contentType: "application/json"
        }
    );
}


ingest_sum(30000);
uptimerobot(120000);
simple_check_output(30000);
grab("https://archdash.ceda.ac.uk/current/api", "current_deposits", 5000);
fbi_item_count(30000);