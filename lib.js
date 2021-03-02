/**
 * Created by sjp23 on 30/08/2018.
 */

//var ES_URL = "http://jasmin-es1.ceda.ac.uk:9200/ingest-log/_search";
//var ES_URL = "https://jasmin-es1.ceda.ac.uk/ingest-log/_search";
var ES_URL = "https://elasticsearch.ceda.ac.uk/ingest-log/_search";


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
        "size": 1000
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


last_logs_query2 = {
  "query": {
    "range": {
      "logtime": {
        "gte": "2021-01-09"
      }
    }
  },
  "aggs": {
    "stream": {
      "terms": {
        "field": "stream.keyword",
        "size": 1000
      },
      "aggs": {
        "state_count": {
          "terms": {
            "field": "state.keyword",
            "size": 10
          }
        },
        "last_log": {
          "top_hits": {
            "size": 1,
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



// get parameters from url and set to global variables
var urlParams = new URLSearchParams(window.location.search);

var states_filter = [];
var sfilter_button_names = ["running", "ok", "warn", "fail", "killed", "died", "do_not_run", "new", "ok-errors", "cleanup", "re-running"];
for (var i=0; i< sfilter_button_names.length; i++) {
    if (urlParams.get(sfilter_button_names[i])) {
        states_filter.push(sfilter_button_names[i]);
    }
}

var reclen = urlParams.get("reclen");

var reclen_date = new Date(new Date() - reclen*24*3600*1000);

last_logs_query2.query.range.logtime.gte = reclen_date;

var ingest4 = urlParams.get("ingest4");
var ingest5 = urlParams.get("ingest5");
var ingest6 = urlParams.get("ingest6");




function escapeHtml(unsafe) {
    if (unsafe == undefined) {return ''}
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }

function test_icons() {
    var s = '';
    for (var i=0; i < 256; i++) {
        s +=  i+  icongen(i)
    }
    return s
}


function icongen(s) {
    // generate a random icon form a string

    const icon_list = ["ambulance","anchor","archive","balance-scale","bath","bed","beer","bicycle",
        "binoculars","birthday-cake", "bolt","book","bookmark","briefcase","bug","building","bullhorn","bullseye",
        "bus","calculator","camera","camera-retro","car", "certificate","child","clipboard","cloud","coffee","cog",
        "cogs","compass","crosshairs","cube","cubes","cut","database","desktop",
        "envelope","envelope-open","eye","female","fighter-jet","film","fire","fire-extinguisher","flag",
        "flag-checkered","flask", "gamepad","gavel","gift","globe","graduation-cap","headphones","heart","heartbeat",
        "home","hotel","hourglass","hourglass-half", "image","inbox","industry","lock","magic","magnet","male","map",
        "map-marker","map-pin","map-signs","medkit","microchip","microphone", "mobile","motorcycle","music",
        "paint-brush","paper-plane","paperclip","paw","phone","plane","plug","podcast","puzzle-piece","recycle",
        "road","rocket","save","search","server","ship","shopping-bag","shopping-basket","shopping-cart","shower",
        "space-shuttle","star", "stethoscope","subway","suitcase","tablet","tag","tags","taxi","thermometer",
        "thermometer-empty","thermometer-full", "thermometer-half","tint","train","trash","tree","trophy","truck","tv",
        "umbrella","universal-access","university","unlock","user-md", "user-secret","wrench","apple-alt","archway",
        "atom","bone","basketball-ball","bowling-ball","brush","broom","car-side","couch",
        "chess-bishop","chess-king","chess-knight","gem","glass-martini","helicopter","marker","chess-pawn",
        "chess-rook","cookie", "crow","dove","feather","fish","frog","kiwi-bird","lemon","oil-can","seedling",
        "shuttle-van","truck-monster","truck-pickup",

        "ambulance","anchor","archive","balance-scale","bath","bed","beer","bicycle",
        "binoculars","birthday-cake", "bolt","book","bookmark","briefcase","bug","building","bullhorn","bullseye",
        "bus","calculator","camera","camera-retro","car", "certificate","child","clipboard","cloud","coffee","cog",
        "cogs","compass","crosshairs","cube","cubes","cut","database","desktop",
        "envelope","envelope-open","eye","female","fighter-jet","film","fire","fire-extinguisher","flag",
        "flag-checkered","flask", "gamepad","gavel","gift","globe","graduation-cap","headphones","heart","heartbeat",
        "home","hotel","hourglass","hourglass-half", "image","inbox","industry","lock","magic","magnet","male","map",
        "map-marker","map-pin","map-signs","medkit","microchip","microphone", "mobile","motorcycle","music",
        "paint-brush","paper-plane","paperclip","paw","phone","plane","plug","podcast","puzzle-piece","recycle",
        "road","rocket","save","search","server","ship","shopping-bag","shopping-basket","shopping-cart","shower",
        "space-shuttle","star", "stethoscope"
    ];

    if (s == undefined) {n=0}
    else if (Number.isInteger(s)) {n = Math.abs(s) % 256}
    else {
        var hash = 0, i, chr;
        for (i = 0; i < s.length; i++) {
            chr = s.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        var n = hash & 0x000000ff;
    }
    return '<span title="' + s +'"><i class="fas fa-' + icon_list[n] + '"></i></span> '
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

    if ("user" in log && log.user) {
        cron = false;
        w += ' <span style="background-color: #ff0; color: #333"><i class="fas fa-user"></i> ' + log.user + '</span>';
    }
    if (cron) {
        w += ' <i class="fas fa-redo" title="'+log.config.when+'"></i>'
    }
    if (long_job) {
        w += ' <i class="fas fa-stopwatch"></i>'
    }
    w += state_icon(state);
    return w
}


// make a utc date time from a string
function utc_from_str(s) {
    // replace the T
    s = s.substr(0, 10) + ' ' + s.substr(11, 19) + " GMT";
    return new Date(s);
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
   // console.log(end_time, start_time, p);

    var logp = Math.round(Math.pow((p/1000+0.01), 0.3)*3);
    if (logp <= 1) {logp=1}
    var svg = '<svg width="'+logp+'" height="50"></svg>';
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


function tooltip(log) {
    var ttip = log.errors || log.output;
    ttip = escapeHtml(ttip);
    ttip = "Last ran: " + log.start_time + " -> " + log.end_time + "\n\n" + ttip;
    return ttip;
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
    var start_time = new Date(log.start_time.substring(0, 19));
    if (state == "running") {
        end_time = new Date()
    }
    var ago = Math.floor((new Date() - end_time) / (1000 * 60));
    var recent = (ago < 5);

    // counts not running that are not this state
    var b = '';
    for (var c in log.counts) {
        if (c == "running") {continue}
        b += ' <span class="badge badge-' + state_bootstrap_colours[c] + '" title="'+ c +'">' + log.counts[c] + '</span>';
    }

    var boot_class = "mb-1 btn btn-sm";
    boot_class += " btn-outline-" + state_bootstrap_colours[state];
    if (recent || state == "running") {
        boot_class += " active"
    }
    var p = make_params();
    p["streamname"] = streamname;
    var url = 'stream.html?'+ $.param(p);
    var confbar = icongen(log.configfile);
    var ttip = tooltip(log);

    var w = '<a href="'+ url +'" class="' + boot_class + '"' +
        'title="' + ttip + '">' +
        confbar + streamname + ' ' + b;

    w += icons(log);
    w += '</a> ';

    //console.log(streamname, end_time, new Date - end_time, "ff");
    if (((new Date - end_time) < 5000) && (state != "running")) {
        console.log("****** End  ****", streamname, end_time, new Date - end_time);
        state_sounds[state].play();
    }
    if ((new Date - start_time) < 5000) {
        console.log("***** Start **", streamname, end_time, new Date - end_time);
        state_sounds[state].play();
    }
    return w;
}



function job_bar(log, last_log) {
    var height = 40;
    var state = log.state;
    var job_name = log.jobname;

    // start time
    var start_time = new Date(log.start_time.substring(0, 19));

    // end time
    var end_time;
    if (log.end_time == null) {end_time = new Date()}
    else {end_time = new Date(log.end_time.substring(0, 19))};
    if (end_time.getTime() < start_time.getTime()) {end_time = start_time}
    if (state == "running") {end_time = new Date()}

    // start of last job
    var last_job_start;
    if (last_log.start_time == null) {last_job_start = new Date()}
    else {last_job_start = new Date(last_log.start_time.substring(0, 19))};
    if (last_job_start.getTime() < end_time.getTime()) {last_job_start = end_time}

    var recent = (Math.floor((new Date() - end_time) / (1000 * 60)) < 5);
    var user = '<text x="50%" y="80%">xxxxx</text>';
    if ("config" in log && "when" in log.config) {
        user = '<text x="50%" y="80%" dominant-baseline="middle" text-anchor="middle"';
        user += ' fill="gray" style="font-size:' +height*0.2+ '">CRON</text>';
    }
    if ("params" in log && ! "user" in log) {
        user = '<text x="50%" y="80%" dominant-baseline="middle" text-anchor="middle"';
        user += ' fill="gray" style="font-size:' +height*0.2+ '">ARRIVALS</text>';
    }
    if ("user" in log && log.user) {
        user =  '<rect y="70%" width="100%" fill="black" height="' +height*0.2+ '"/>'
        user += '<text x="50%" y="80%" dominant-baseline="middle" text-anchor="middle"';
        user += ' fill="white" style="font-size:' +height*0.2+ '">'+log.user+'</text>';
    }

    var job_length = end_time - start_time;
    var period_length = last_job_start - start_time;
    var idle_length = period_length - job_length;
    var dis_period_length = Math.round(Math.pow((period_length/1000+0.01), 0.3)*6);
    var dis_job_length = dis_period_length * job_length/period_length;
    var dis_idle_length = dis_period_length - dis_job_length;


    var opacity =0.3;
    if (recent) {opacity=1.0}
    var state_colour = state_colours[state];

    var p = make_params();
    p["job"] = job_name;
    var url = 'job.html?' + $.param(p);
    var ttip = tooltip(log);
    var gap = 3;


    // the idle period
    var svg = '<span class="p-1">';
    svg += '<svg width="' + (dis_idle_length +height) + '" height="'+height+'">';
    svg += '<rect x="0" y="0" width="100%" height="100%" fill="lightgrey" stroke="black" />';
    svg += '  <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle"';
    svg += '   fill="black" style="font-size:' +height*0.3+ '">';
    svg += end_time.format_period(last_job_start) + '</text></svg>';

    // add the end time first
    svg += end_time.time_vicon(height);
    if (last_job_start.diff_day(end_time)) {svg += end_time.calender_icon(height)};

    // the job block
    svg += '<svg width="'+(dis_job_length + height)+'" height="'+height +'"';
    svg += ' xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">';
    svg += '<a xlink:href="' + url + '">';
    svg += '<rect x="0" y="0" width="100%" height="100%" stroke="black" fill="'+ state_colour +'" style="opacity:'+opacity+'"/>';
    svg += '  <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle"';
    svg += '   fill="'+ state_colour +'" style="opacity:0.2;font-size:' +height*0.9+ '">';
    svg += state + '</text>';
    svg += '  <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle"';
    svg += '   fill="black" style="font-size:' +height*0.3+ '">';
    svg += start_time.format_period(end_time) + '</text>';
    svg += user + '</a></svg>';


    // the start time
    svg += start_time.time_vicon(height);
    if (end_time.diff_day(start_time)) {svg += start_time.calender_icon(height)}

    svg += '</span>';

    return svg
}






function make_params() {
    var urlParams = new URLSearchParams(window.location.search);
    var name_filter = urlParams.get("namefilter");
    var owner_filter = urlParams.get("owner");
    var reclen = urlParams.get("reclen");
    var timeline_res = urlParams.get("timeline_res");
    var ingest4 = urlParams.get("ingest4");
    var ingest5 = urlParams.get("ingest5");
    var ingest6 = urlParams.get("ingest6");
    var parameters = {};
    if (name_filter) {parameters["namefilter"] = name_filter}
    if (owner_filter) {parameters["owner"] = owner_filter}
    if (reclen) {parameters["reclen"] = reclen}
    if (timeline_res) {parameters["timeline_res"] = timeline_res}
    if (ingest4) {parameters["ingest4"] = ingest4}
    if (ingest5) {parameters["ingest5"] = ingest5}
    if (ingest6) {parameters["ingest6"] = ingest6}
    for (var i=0; i<states_filter.length; i++){
        parameters[states_filter[i]] = "on"
    }
    return parameters;
}


var soundPlayer = new Audio();
function playLowerNote(src, rate) {
    soundPlayer.src = src;
    soundPlayer.mozPreservesPitch = false;
    soundPlayer.playbackRate = rate;
    soundPlayer.play();
}



//C7B9X6W4L6