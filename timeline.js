/**
 * Created by sjp23 on 11/01/2021.
 */


var test_data = [{"start_time": new Date("2021-01-11 12:06:02"), "end_time": new Date("2021-01-11 13:06:02"), "Label": "A"},
    {"start_time": new Date("2021-01-11 12:20:02"), "end_time": new Date("2021-01-11 13:06:00"), "Label": "B"},
    {"start_time": new Date("2021-01-11 12:06:02"), "end_time": new Date("2021-01-11 13:06:02"), "Label": "C"},
    {"start_time": new Date("2021-01-12 14:06:02"), "end_time": new Date("2021-01-12 22:06:02"), "Label": "D"},
    {"start_time": new Date("2021-01-12 12:06:02"), "end_time": new Date("2021-01-12 13:06:02"), "Label": "E"},
    {"start_time": new Date("2021-01-12 12:06:02"), "end_time": new Date("2021-01-12 13:06:02"), "Label": "F"},
    {"start_time": new Date("2021-01-13 03:06:02"), "end_time": new Date("2021-01-13 03:50:02"), "Label": "G"}
                ];


// step 1 find all sig times for intervals. record intervals  start and end. Index and reorder.
var times = [];
var times3 = [];

time_res = 1000*60;
for (var i in test_data) {
    times.push(test_data[i]["start_time"].time_floor(time_res));
    times.push(test_data[i]["end_time"].time_floor(time_res));
    times3.push({"time": test_data[i]["start_time"].time_floor(time_res),
                 "type": "interval_start", "data": test_data[i]});
    times3.push({"time": test_data[i]["end_time"].time_floor(time_res),
                 "type": "interval_end", "data": test_data[i]});
}

times.sort();
times3.sort(function(a, b) {return a.time - b.time});

console.log(times);


// step 1a add date markers when date changes. Addtick markers every time.
var boundaries =[];
boundary_res = 1000*3600;
var l = times3.length;
for (var i=1; i<l; i++) {
    var this_time = times3[i]["time"].time_floor(boundary_res);
    var last_time = times3[i-1]["time"].time_floor(boundary_res);
    if (this_time.getTime() != last_time.getTime()) {
        times3.push({"time": this_time, "type": "boundary", "data": {}})
    }
}

// ticks from srat to end
var ticks =[];
tick_res = 1000*3600 *24;
tick_start = new Date(times3[0]["time"].time_floor(tick_res));
tick_end = new Date(times3[times3.length-1]["time"].time_ceil(tick_res));

var tick = new Date(tick_start);
while (tick < tick_end) {
    console.log(tick);
    console.log(tick.getTime());
    console.log(tick_start.getTime());

    if (tick.getTime() > tick_start.getTime() && tick.getTime() < tick_end.getTime()) {
        times3.push({"time": new Date(tick), "type": "tick", "data": {}})
    }
     tick.setTime(tick.getTime() + tick_res);
}


// step find "same times", if times are the same to a specified resolution.
var times2 = times.concat(boundaries, ticks);


times3.sort(function(a, b) {return a.time - b.time});




// make display lengeths x = c + d(period length)

// find the row for each interval. Go through each interval in order of start time. mark each interval with a row.

// scale the time and display

