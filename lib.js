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

// period display
function periodbadge(p) {

    if (p < 2000) {return ''}
    p = p/1000;
    if (p < 120) {return '<span class="badge badge-info">'+Math.round(p)+" s</span>"}
    p = p/60;
    if (p < 90) {return '<span class="badge badge-info">'+Math.round(p)+" min</span>"}
    p = p/60;
    if (p < 50) {return '<span class="badge badge-warning">'+Math.round(p)+" hrs</span>"}
    p = p/24;
    return '<span class="badge badge-danger">'+Math.round(p)+" days</span>"
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

    var w = '<a href="stream.html?streamname='+ streamname +'" class="' + boot_class + '">' + streamname + ' ' + b;
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

    var b = periodbadge(end_time-start_time);


    var boot_class = "mb-1 btn btn-sm";
    boot_class += " btn-outline-" + colours[state];
    if (recent || state == "running") {
        boot_class += " active"
    }
    var label = ("0" + start_time.getDate()).slice(-2) + "-" + ("0"+(start_time.getMonth()+1)).slice(-2) + "-" +
    start_time.getFullYear() + " " + ("0" + start_time.getHours()).slice(-2) + ":" + ("0" + start_time.getMinutes()).slice(-2);

    var w = '<a href="job.html?job='+job_name+'" class="' + boot_class + '">' + label + ' ' +b;
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
