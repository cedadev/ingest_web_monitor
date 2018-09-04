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
        size: 500
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
    "warn": "exclamation-triangle", "fail": "bell"};

// colours for states
colours = {"ok": "success", "ok-errors": "success", "fail": "danger", "killed": "dark", "new": "secondary",
           "warn": "warning", "running": "primary", "died": "dark", "cleanup": "info", "re-running": "info",
           "do_not_run": "secondary"};


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

// period job display
function periodbadge(log, do_millisec) {
    var start_time = new Date(log.start_time.substring(0, 19));
    var end_time = new Date(log.end_time.substring(0, 19));
    var ms = log.end_time.substring(17) - log.start_time.substring(17);


    if (log.state == "running") {
        end_time = new Date()
    }
    var p = end_time - start_time;
    if (p < 2000) {
        if (do_millisec) {return '<span class="badge badge-info">'+ms.toFixed(5)+" s</span>"}
        else {return ''}
    }
    p = p/1000;
    if (p < 120) {return '<span class="badge badge-info">'+Math.round(p)+" s</span>"}
    p = p/60;
    if (p < 90) {return '<span class="badge badge-info">'+Math.round(p)+" min</span>"}
    p = p/60;
    if (p < 50) {return '<span class="badge badge-warning">'+Math.round(p)+" hrs</span>"}
    p = p/24;
    return '<span class="badge badge-danger">'+Math.round(p)+" days</span>"
}

// spacer
function spacer(p, last_p) {
    if (p < last_p*1.01 && p > last_p*0.99) {var c = "white"} else { var c = "#220"}

    var s = '<svg height="15" width="50"> <path d="M0 7 L7 0 L45 0 L45 15 L7 15 L0 7" fill="'+c+'", stroke="black"/>';
    s += '<text x=7 y=11 fill="gray" style="font-family: Courier New; font-weight: bold; font-style: normal; font-size: 10px">';
    var unit = "ms";

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


function job_button(log) {
    var state = log.state;
    var job_name = log.jobname;
    var start_time = new Date(log.start_time.substring(0, 19));
    var end_time = new Date(log.end_time.substring(0, 19));
    if (state == "running") {
        end_time = new Date()
    }
    var ago = Math.floor((new Date() - end_time) / (1000 * 60));
    var recent = (ago < 5);

    var b = periodbadge(log);

    var boot_class = "mb-1 btn btn-sm";
    boot_class += " btn-outline-" + colours[state];
    if (recent || state == "running") {
        boot_class += " active"
    }
    var label = ("0" + start_time.getDate()).slice(-2) + "-" + ("0"+(start_time.getMonth()+1)).slice(-2) + "-" +
    start_time.getFullYear() + " " + ("0" + start_time.getHours()).slice(-2) + ":" + ("0" + start_time.getMinutes()).slice(-2);

    var p = make_params();
    p["job"] = job_name;
    var url = 'job.html?' + $.param(p);
    var w = '<a href="'+url+'" class="' + boot_class + '">' + label + ' ' +b;

    w += icons(log);
    w += '</a> ';
    return w;
}

function make_params() {
    var urlParams = new URLSearchParams(window.location.search);
    var name_filter = urlParams.get("namefilter");
    var owner_filter = urlParams.get("owner");
    var hide_ok = urlParams.get("hide_ok");
    var parameters = {};
    if (name_filter) {parameters["namefilter"] = name_filter}
    if (owner_filter) {parameters["owner"] = owner_filter}
    if (hide_ok) {parameters["hide_ok"] = hide_ok}
    return parameters;
}
