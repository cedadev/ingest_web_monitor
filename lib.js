/**
 * Created by sjp23 on 30/08/2018.
 */



// query for last logs
last_logs_query = {
  "query": {
      "range": {
          "logtime": {
              "gte": "2018-06"
          }
      }
  },

  "aggs": {
    "stream": {
      "terms": {
        "field": "stream.keyword",
        size: 1000
      },
      "aggs": {
        "recent_logs": {
          "top_hits": {
            "size": 100,
            "sort": [
              {
                "logtime": {
                  "order": "desc"
                }
              }
            ]
          }
        }
      }
    }
  },
  "size": 0
};

// icons for states
state_icons = {"killed": "skull", "died": "bomb", "new": "asterisk", "do_not_run": "ban",
    "warn": "exclamation-triangle", "ok-errors": "exclamation-triangle", "fail": "bell", "cleanup": "broom",
    "re-running": "cog"};

// colours for states
colours = {"ok": "success", "ok-errors": "success", "fail": "danger", "killed": "dark", "new": "info",
           "warn": "warning", "running": "primary", "died": "dark", "cleanup": "info", "re-running": "info",
           "do_not_run": "secondary"};

// get parameters from url and set to global variables
var urlParams = new URLSearchParams(window.location.search);
var name_filter = urlParams.get("namefilter");

var owner_filter = urlParams.get("owner");
var states_filter = [];
var sfilter_button_names = ["running", "ok", "warn", "fail", "killed", "died", "do_not_run", "new", "ok-errors", "cleanup", "re-running"];
for (var i=0; i< sfilter_button_names.length; i++) {
    if (urlParams.get(sfilter_button_names[i])) {
        states_filter.push(sfilter_button_names[i]);
    }
}

var reclen = urlParams.get("reclen");


var reclen_date = new Date(new Date() - reclen*24*3600*1000);

last_logs_query.query.range.logtime.gte = reclen_date;

// if name filter then change query
if (name_filter) {
 //     last_logs_query.query= {"bool": {"must": {"match": {"stream": "test"}}}};

//    last_logs_query.query = {"match": {"stream": name_filter}};
}

// icons
function icons(log) {
    var state = log.state;
    var start_time = new Date(log.start_time.substring(0, 19));
    var end_time = new Date(log.end_time.substring(0, 19));
    if (state == "running") {
        end_time = new Date()
    }
    var job_time = (end_time - start_time) / (1000 * 60);
    var long_job = job_time > 60;
    var cron = ("config" in log && "when" in log.config);
    var w = '';
    if (cron) {
        w += ' <i class="fas fa-redo"></i>'
    }
    if (long_job) {
        w += ' <i class="fas fa-stopwatch"></i>'
    }
    if (state_icons.hasOwnProperty(state)) {
        w += ' <i class="fas fa-' + state_icons[state] + '"></i>'
    }
    return w
}


// make a utc date time from a string
function utc_from_str(s) {
    // replace the T
    s = s.substr(0, 10) + ' ' + s.substr(11, 19) + " GMT";
    return new Date(s);
}

// make now
function now() {
    var now = new Date;
    var utc_timestamp = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
        now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()));
    return utc_timestamp;
}

// period job display
function log_periodbadge(log) {
    if (log.state == "running") {
        return periodbadge(log.start_time);
    } else {
        return periodbadge(log.start_time, log.end_time);
    }
}

// period job display
function periodbadge(start_time, end_time) {
    start_time = utc_from_str(start_time);
    if (end_time === undefined) {
        end_time = new Date();
    } else if (end_time.substring(0, 4) == "1970") {
        end_time = start_time;
    } else {
        end_time = utc_from_str(end_time);
    }
    //var ms = log.end_time.substring(17) - log.start_time.substring(17);

    var p = end_time - start_time;
    p = Math.max(p, 0);
    console.log(end_time, start_time, p);

    var logp = Math.round(Math.pow((p/1000+0.01), 0.3)*3);
    if (logp <= 1) {logp=1}
    var svg = '<svg width="'+logp+'" height="5"></svg>';
    p = p/1000;
    if (p < 20) {return '<span class="badge badge-secondary">'+svg+' '+Math.round(p)+" s "+svg+"</span>"}
    if (p < 120) {return '<span class="badge badge-primary">'+svg+' '+Math.round(p)+" s "+svg+"</span>"}
    p = p/60;
    if (p < 90) {return '<span class="badge badge-info">'+svg+' '+Math.round(p)+" min "+svg+"</span>"}
    p = p/60;
    if (p < 50) {return '<span class="badge badge-warning">'+svg+' '+Math.round(p)+" hrs "+svg+"</span>"}
    p = p/24;
    return '<span class="badge badge-danger" style="float: left">'+svg+' '+Math.round(p)+" days "+svg+"</span>"
}

// spacer
function spacer(p, last_p) {
    var c = '';
    if (p < last_p*1.01 && p > last_p*0.99) {c = "white"} else {c = "#220"}

    var s = '<svg height="15" width="50"> <path d="M0 7 L7 0 L45 0 L45 15 L7 15 L0 7" fill="'+c+'" stroke="black"/>';
    s += '<text x=7 y=11 fill="gray" style="font-family: monospace, Courier New; font-weight: bold; font-style: normal; font-size: 10px">';
    var unit;

    if (p < 2000) {return ''}
    p = p/1000; unit = "s";   // miliseconds to seconds
    if (p < 120) {return ''}
    p = p/60; unit = "min";     // seconds to minutes
    if (p < 90) {return s + Math.round(p) + " " + unit + "</text></svg>"}
    p = p/60; unit = "hrs";     // mins to hours
    if (p < 50) {return s + Math.round(p) + " " + unit + "</text></svg>"}
    p = p/24; unit = "days";     // hours to days
    return s + Math.round(p) + " " + unit + "</text></svg>";

}

// spacer
function spacer2(p, last_p) {
    var c = '';
    if (p < last_p*1.01 && p > last_p*0.99) {c = "white"} else {c = "#220"}

    var s = '<svg height="15" width="50"> <path d="M0 7 L7 0 L45 0 L45 15 L7 15 L0 7" fill="'+c+'" stroke="black"/>';
    s += '<text x=7 y=11 fill="gray" style="font-family: monospace, Courier New; font-weight: bold; font-style: normal; font-size: 10px">';
    var unit;

    if (p < 2000) {return ''}
    p = p/1000; unit = "s";   // miliseconds to seconds
    if (p < 120) {return ''}
    p = p/60; unit = "min";     // seconds to minutes
    if (p < 90) {return s + Math.round(p) + " " + unit + "</text></svg>"}
    p = p/60; unit = "hrs";     // mins to hours
    if (p < 50) {return s + Math.round(p) + " " + unit + "</text></svg>"}
    p = p/24; unit = "days";     // hours to days
    return s + Math.round(p) + " " + unit + "</text></svg>";

}

function top_button() {
    var p = make_params();
    var url = 'index.html?' + $.param(p);
    return '<a href="'+url+'" class="btn btn-lg btn-primary">All streams</a>';
}


function stream_button(log) {
    var state = log.state;
    var streamname = log.stream;
    var end_time = new Date(log.end_time.substring(0, 19));
    if (state == "running") {
        end_time = new Date()
    }
    var ago = Math.floor((new Date() - end_time) / (1000 * 60));
    var recent = (ago < 5);

    // counts not running that are not this state
    var b = '';
    for (var c in log.counts) {
        if (c == "running") {
            continue
        }
        b += ' <span class="badge badge-' + colours[c] + '">' + log.counts[c] + '</span>';
    }

    var boot_class = "mb-1 btn btn-sm";
    boot_class += " btn-outline-" + colours[state];
    if (recent || state == "running") {
        boot_class += " active"
    }
    var p = make_params();
    p["streamname"] = streamname;
    var url = 'stream.html?'+ $.param(p);
    var w = '<a href="'+ url +'" class="' + boot_class + '">' + streamname + ' ' + b;

    w += icons(log);
    w += '</a> ';
    return w;
}


function job_button(log, last_log) {
    var state = log.state;
    var job_name = log.jobname;
    var start_time = new Date(log.start_time.substring(0, 19));
    var end_time = new Date(log.end_time.substring(0, 19));
    if (state == "running") {
        end_time = new Date()
    }
    var ago = Math.floor((new Date() - end_time) / (1000 * 60));
    var recent = (ago < 5);

    var b = log_periodbadge(log);

    var boot_class = "mb-1 btn";
    boot_class += " btn-outline-" + colours[state];
    if (recent || state == "running") {
        boot_class += " active"
    }
    var label = ("0" + start_time.getDate()).slice(-2) + "-" + ("0"+(start_time.getMonth()+1)).slice(-2) + "-" +
    start_time.getFullYear() + " " + ("0" + start_time.getHours()).slice(-2) + ":" + ("0" + start_time.getMinutes()).slice(-2);

    var p = make_params();
    p["job"] = job_name;
    var url = 'job.html?' + $.param(p);

    var job_start = new Date(log.start_time.substring(0, 19));
    var last_job_start = new Date(last_log.start_time.substring(0, 19));
    var space = last_job_start - job_start;
    //var s = spacer(space, 0);
    var s = '<div style="float: right">' + periodbadge(log.start_time, last_log.start_time) + '</div>';

    var w = '<div style="float: left" class="mb-3 mr-1">';
    w += '<div style="float: right"><a href="'+url+'" class="' + boot_class + '"><small>' + label + ' ' + icons(log) + '</small></a></div>';
    w += '<br/><div style="float: right" class="mb-1">' + b + '</div>';
    w += '<br/><div style="float: right">'+s+'</div>';
    return w;
}

function make_params() {
    var urlParams = new URLSearchParams(window.location.search);
    var name_filter = urlParams.get("namefilter");
    var owner_filter = urlParams.get("owner");
    var reclen = urlParams.get("reclen");
    var parameters = {};
    if (name_filter) {parameters["namefilter"] = name_filter}
    if (owner_filter) {parameters["owner"] = owner_filter}
    if (reclen) {parameters["reclen"] = reclen}
    for (var i=0; i<states_filter.length; i++){
        parameters[states_filter[i]] = "on"
    }
    return parameters;
}

function button_filter(f) {
    var checkbox = $('#'+ f.id+' :input');
    checkbox.prop("checked", !checkbox.prop("checked"));
}

//C7B9X6W4L6