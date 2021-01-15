/**
 * Created by sjp23 on 11/01/2021.
 */


var test_data = [{"start_time": new Date("2021-01-11 12:06:02"), "end_time": new Date("2021-01-11 13:06:00"), "label": "A"},
    {"start_time": new Date("2021-01-11 12:20:02"), "end_time": new Date("2021-01-11 13:06:04"), "label": "B"},
    {"start_time": new Date("2020-12-25 06:00:02"), "end_time": new Date("2021-01-11 15:06:00"), "label": "B0"},
    {"start_time": new Date("2021-01-11 12:06:02"), "end_time": new Date("2021-01-11 13:06:02"), "label": "C"},
    {"start_time": new Date("2021-01-12 14:06:02"), "end_time": new Date("2021-01-12 22:06:00"), "label": "D"},
    {"start_time": new Date("2021-01-12 12:06:00"), "end_time": new Date("2021-01-12 13:00:00"), "label": "E"},
    {"start_time": new Date("2021-01-12 12:06:00"), "end_time": new Date("2021-01-12 13:06:02"), "label": "F"},
    {"start_time": new Date("2021-01-13 03:06:00"), "end_time": new Date("2021-01-13 03:50:02"), "label": "G"},
    {"start_time": new Date("2021-01-12 05:50:08"), "end_time": new Date("2021-01-13 03:50:30"), "label": "H"}
                ];

function timeline(data, wwidth, time_res, boundary_res, tick_res) {
    // step 1 find all sig times for intervals. record intervals  start and end. Index and reorder.
    var times = [];
    for (var i in test_data) {
        var start_event = {
            "time": test_data[i]["start_time"].time_floor(time_res), "type": "interval_start",
            "data": test_data[i]
        };
        var end_event = {
            "time": test_data[i]["end_time"].time_floor(time_res), "type": "interval_end",
            "data": test_data[i]
        };
        start_event["end"] = end_event;
        end_event["start"] = start_event;
        times.push(start_event);
        times.push(end_event);
    }

    times.sort(function (a, b) {
        return a.time - b.time
    });

    // step 1a add date markers when date changes. Addtick markers every time.
    var l = times.length;
    for (var i = 1; i < l; i++) {
        var this_time = times[i]["time"].time_floor(boundary_res);
        var last_time = times[i - 1]["time"].time_floor(boundary_res);
        if (this_time.getTime() != last_time.getTime()) {
            times.push({"time": this_time, "type": "boundary", "data": {}})
        }
    }

    // ticks from start to end
    var ticks = [];
    tick_start = new Date(times[0]["time"].time_floor(tick_res));
    tick_end = new Date(times[times.length - 1]["time"].time_ceil(tick_res));

    var tick = new Date(tick_start);
    while (tick < tick_end) {

        if (tick.getTime() > tick_start.getTime() && tick.getTime() < tick_end.getTime()) {
            times.push({"time": new Date(tick), "type": "tick", "data": {}})
        }
        tick.setTime(tick.getTime() + tick_res);
    }

    // make display lengeths x = c + d(period length)
    times.sort(function (a, b) {
        return a.time - b.time
    });
    var x = 0;
    var d = 5;
    last_time = times[0]["time"];
    var nmark = 0;
    for (i in times) {
        this_time = times[i]["time"];
        if (last_time.getTime() < this_time.getTime()) {
            nmark += 1;
            x += d + Math.pow(this_time.getTime() - last_time.getTime(), 0.3) * 0.5;
        }
        times[i]["x"] = x;
        last_time = this_time;
    }
    var xmax = times[times.length-1]["x"];
    for (i in times) {
        times[i]["x"] /= xmax;
    }
    for (i=0; i < times.length-2; i++) {
        times[i]["x_mid"] = (times[i]["x"] + times[i+1]["x"]) *0.5;
        times[i]["period"] = times[i]["time"].format_period(times[i+1]["time"]);
    }
    times[times.length-1]["x_mid"] = 1.0;
    times[times.length-1]["period"] = '----';

    // find the row for each interval. Go through each interval in order of start time. mark each interval with a row.
    var row;
    var max_rows = 0;
    var rows = new Array(test_data.length).fill(undefined);
    for (i in times) {
        if (times[i]["type"] == "interval_start") {
            row = rows.indexOf(undefined);
            rows[row] = i;
            if (row > max_rows) {
                max_rows = row
            }
            times[i]["row"] = row;
        }
        for (row in rows) {
            if (rows[row] == undefined) {
                continue
            }
            start_event = times[rows[row]];
            if (start_event["end"]["time"].getTime() < times[i]["time"].getTime()) {
                // clear row if the event start time is less than current time
                rows[row] = undefined;
            }
        }
    }

    // scale the time and display


    var y;
    var w;
    var x_mid;
    var row_h = 30;
    var tl_svg = '<svg height="' + (max_rows * row_h + 60) + '" width="' + (wwidth + 50) + '">';
    for (i in times) {
        x = times[i]["x"] * wwidth;
        x_mid = times[i]["x_mid"] * wwidth;

        tl_svg += '<circle cx="' + x + '" cy="5" r="4" stroke="black" stroke-width="1" fill="red" />';
            console.log(i, times[i], times[i+1]);

            tl_svg += '<text dominant-baseline="middle" text-anchor="middle" x="'+ x_mid +'" y="60">'+times[i].period+'</text>';

        tl_svg += '<line x1="' + x + '" y1="5" x2="' + x + '" y2="100% "stroke="black" stroke-width="1" stroke-dasharray="1 4"/>';
        var icon = times[i]["time"].icon(40);
        tl_svg += '<svg x="' + x + '" y="5" width="40" height="40">' + icon + '</svg>';


        if (times[i]["type"] == "interval_start") {
            y = times[i]["row"] * row_h + 40;
            w = times[i]["end"]["x"]* wwidth - x;
            if (w < 1) {
            tl_svg += '<svg x="' + x + '" y="' + y + '" width="20" height="25">';
            tl_svg += '<rect height="100%" width="100%" fill="pink"></rect>';
            tl_svg += '<text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle"';
            tl_svg += ' fill="black" style="font-family:courier, courier new, serif;;font-size:' + 10 + '">';
            tl_svg += times[i]["data"]["label"] + '</text>';
            tl_svg += '</svg>'

            }
            tl_svg += '<svg x="' + x + '" y="' + y + '" width="' + w + '" height="20">';
            tl_svg += '<rect height="100%" width="100%" fill="blue"></rect>';
            tl_svg += '<text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle"';
            tl_svg += ' fill="black" style="font-family:courier, courier new, serif;;font-size:' + 10 + '">';
            tl_svg += times[i]["data"]["label"] + '</text>';
            tl_svg += '</svg>'
        }

    }
    tl_svg += "</svg>";

    return tl_svg;
}