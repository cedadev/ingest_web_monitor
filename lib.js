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


// colours for states
colours = {"ok": "success", "ok-errors": "success", "fail": "danger", "killed": "dark",
           "warn": "warning", "running": "primary", "died": "dark", "cleanup": "info", "re-running": "info"};

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
function spacer(p) {
    function closeto(n, target) {return (n < target*1.01 && n > target*0.99)}
    if (p < 2000) {return ''}
    p = p/1000;  // miliseconds to seconds
    if (p < 120) {return ''}
    p = p/60;    // seconds to minutes
    if (closeto(p, 5)) {return '<img src="5m.png" width="20">'}
    if (closeto(p, 10)) {return '<img src="10m.png" width="20">'}
    if (closeto(p, 15)) {return '<img src="15m.png" width="20">'}
    if (closeto(p, 20)) {return '<img src="20m.png" width="20">'}
    if (closeto(p, 30)) {return '<img src="30m.png" width="20">'}
    if (closeto(p, 60)) {return '<img src="1h.png" width="20">'}
    if (p < 90) {return '<span class="btn btn-secondary btn-sm" disabled>'+Math.round(p)+" min</span>"}
    p = p/60;    // mins to hours
    if (closeto(p, 2)) {return '<img src="2h.png" width="20">'}
    if (closeto(p, 6)) {return '<img src="6h.png" width="20">'}
    if (closeto(p, 24)) {return '<img src="1d.png" width="20">'}
    if (p < 50) {return '<span class="btn btn-secondary btn-sm" disabled>'+Math.round(p)+" hrs</span>"}
    p = p/24;    // hours to days
    if (closeto(p, 7)) {return '<img src="1w.png" width="20">'}
    return '<span class="btn btn-dark btn-sm" disabled>'+Math.round(p)+" days</span>"
}

function top_button() {
    var p = make_params();
    var url = 'index.html?' + $.param(p);
    return '<a href="'+url+'" class="btn btn-lg btn-primary">All streams</a>';
}



function stream_button(log) {
    var state = log.state;
    var streamname = log.stream;
    var start_time = new Date(log.start_time.substring(0, 19));
    var end_time = new Date(log.end_time.substring(0, 19));
    if (state == "running") {
        end_time = new Date()
    }
    var job_time = (end_time - start_time) / (1000 * 60);
    var long_job = job_time > 60;
    var ago = Math.floor((new Date() - end_time) / (1000 * 60));
    var recent = (ago < 5);
    var cron = ("config" in log && "when" in log.config);
    var killed = log.killed;

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
    if (!cron) {
        w += ' <i class="fas fa-hand-pointer"></i>'
    }
    if (long_job) {
        w += ' <i class="fas fa-stopwatch"></i>'
    }
    if (killed) {
        w += ' <i class="fas fa-skull"></i>'
    }
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
    var job_time = (end_time - start_time) / (1000 * 60);
    var long_job = job_time > 60;
    var ago = Math.floor((new Date() - end_time) / (1000 * 60));
    var recent = (ago < 5);
    var cron = ("config" in log && "when" in log.config);
    var killed = log.killed;

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
    var url = 'job.html?' + $.param(p)
    var w = '<a href="'+url+'" class="' + boot_class + '">' + label + ' ' +b;
    if (!cron) {
        w += ' <i class="fas fa-hand-pointer"></i>'
    }
    if (long_job) {
        w += ' <i class="fas fa-stopwatch"></i>'
    }
    if (killed) {
        w += ' <i class="fas fa-skull"></i>'
    }
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
