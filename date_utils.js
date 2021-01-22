/**
 * Created by sjp23 on 16/12/2020.
 */

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

Date.prototype.calender_icon = function(size) {
        var month = this.toLocaleString('default', { month: 'short' });
        var weekday = this.toLocaleString('default', { weekday: 'short' });
        var day = this.getDate();
        var svg_str = '<svg width="' +size*0.7+ '" height="' +size+ '"><title>'+this+'</title>';
        var stroke_width = size/50;
        const wcolours = {"Sun": "red", "Sat": "red", "Mon": "grey", "Tue": "grey", "Wed": "grey", "Thu": "grey", "Fri": "grey" };
        var day_colour = wcolours[weekday];

        // white box
        svg_str += '<rect x="4%" y="4%" rx="15%" ry="15%" width="94%" height="94%"';
        svg_str += ' style="fill:white;stroke:black;stroke-width:'+stroke_width+'" />';

        // red box
        svg_str += '<rect x="4%" y="4%"  width="94%" height="25%"';
        svg_str += ' style="fill:black;stroke:black;stroke-width:'+stroke_width+'" />';

        // red box
        if (day ==1) {
            svg_str += '<rect x="20%" y="38%"  width="60%" height="30%"';
            svg_str += ' style="fill:red;stroke:red;stroke-width:' + stroke_width + '" />';
            svg_str += '<text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle"';
            svg_str += ' fill="white" style="font-family:Verdana;font-size:' +size/3+ '">' +day+ '</text>';
        }
        else {
            svg_str += '<text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle"';
            svg_str += ' fill="black" style="font-family:Verdana;font-size:' +size/3+ '">' +day+ '</text>';
        }

        // month
        svg_str += '<text x="50%" y="20%" dominant-baseline="middle" text-anchor="middle"';
        svg_str += ' fill="white" style="font-family:Verdana;font-size:' +size/5+ '">' +month+ '</text>';

        // week day
        svg_str += '<text x="50%" y="85%" dominant-baseline="middle" text-anchor="middle"';
        svg_str += ' fill="' +day_colour+ '" style="font-family:Verdana;font-size:' +size/5+ '">' +weekday+ '</text>';

        svg_str += '</svg>';

        return svg_str;
};

Date.prototype.diff_day = function(d) {return this.getDate() != d.getDate()};

Date.prototype.time_floor = function(ms_res) {return new Date(Math.floor(this.getTime() / ms_res) * ms_res)};
Date.prototype.time_month_floor = function() {return new Date(this.getFullYear(), this.getMonth(), 1, 0, 0, 0, 0)};
Date.prototype.time_year_floor = function() {return new Date(this.getFullYear(), 0, 1, 0, 0, 0, 0)};

Date.prototype.time_ceil = function(ms_res) {return new Date(Math.ceil(this.getTime() / ms_res) * ms_res)};

Date.prototype.time_icon = function(size) {
        var svg_str = '<svg width="' +size*1.8+ '" height="' +size+ '">';
        var stroke_width = size/50;
        var time_str = ("0" + this.getHours()).slice(-2) + ":" + ("0" + this.getMinutes()).slice(-2);
        // white box
        svg_str += '<rect x="5%" y="20%"  width="95%" height="80%"';
        svg_str += ' style="fill:white;stroke:black;stroke-width:'+stroke_width+'"><title>'+this+'</title></rect>';

        // time
        svg_str += '<text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle"';
        svg_str += ' fill="black" style="font-family:courier, courier new, serif;;font-size:' +size*0.5+ '">' +time_str+ '</text>';

        svg_str += '</svg>';

        return svg_str;
};


Date.prototype.year_icon = function(size) {
        var year = this.getFullYear()
        var svg_str = '<svg width="' +size*0.7+ '" height="' +size+ '">';
        var stroke_width = size/50;
        var box_colour = "green";

        // red box
        svg_str += '<rect x="4%" y="4%"  width="94%" height="25%"';
        svg_str += ' style="fill:' + box_colour + ';stroke:' + box_colour + ';stroke-width:'+stroke_width+'" />';
        // year
        svg_str += '<text x="50%" y="20%" dominant-baseline="middle" text-anchor="middle"';
        svg_str += ' fill="white" style="font-family:Verdana;font-size:' +size/5+ '">' +year+ '</text>';
        svg_str += '</svg>';

        return svg_str;
};


Date.prototype.icon = function(size) {
  if (this.time_year_floor().getTime() == this.getTime()) {return this.year_icon(size)}
  if (this.time_month_floor().getTime() == this.getTime()) {return this.calender_icon(size)}
  if (this.time_floor(24*3600*1000).getTime() == this.getTime()) {return this.calender_icon(size)}
  if (this.time_floor(3600*1000).getTime() == this.getTime()) {return this.time_vicon(size)}
  if (this.time_floor(60*1000).getTime() == this.getTime()) {return this.time_vicon(size)}
  if (this.time_floor(1000).getTime() == this.getTime()) {return this.seconds_vicon(size)}
  return this.seconds_vicon(size);
};

Date.prototype.time_vicon = function(size) {
        var svg_str = '<svg width="' +size*0.3+ '" height="' +size+ '"><title>'+this+'</title>';
        var stroke_width = size/50;
        var time_str = ("0" + this.getHours()).slice(-2) + ":" + ("0" + this.getMinutes()).slice(-2)
        // white box
        //svg_str += '<rect x="0%" y="0%"  width="100%" height="100%"';
        //svg_str += ' style="fill:white;stroke:black;stroke-width:'+stroke_width+'">';
        //svg_str += '</rect>';

        // time
        svg_str += '<text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle"';
        svg_str += ' fill="black" style="font-family:courier, courier new, serif;writing-mode: tb;font-size:' +size*0.25+ '">' +time_str+ '</text>';

        svg_str += '</svg>';

        return svg_str;
};

Date.prototype.seconds_vicon = function(size) {
        var svg_str = '<svg width="' +size*0.3+ '" height="' +size+ '">';
        var stroke_width = size/50;
        var time_str = ("0" + this.getHours()).slice(-2) + ":" + ("0" + this.getMinutes()).slice(-2) +
                         ":" + ("0" + this.getSeconds()).slice(-2);
        // white box
        //svg_str += '<rect x="0%" y="0%"  width="100%" height="100%"';
        //svg_str += ' style="fill:white;stroke:black;stroke-width:'+stroke_width+'" />';

        // time
        svg_str += '<text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle"';
        svg_str += ' fill="black" style="font-family:courier, courier new, serif;writing-mode: tb;font-size:' +size*0.2+ '">' +time_str+ '</text>';

        svg_str += '</svg>';

        return svg_str;
};

Date.prototype.time_start_icon = function(size) {
        var svg_str = '<svg width="' +size*0.5+ '" height="' +size+ '">';
        var stroke_width = size/50;
        var time_str = ("0" + this.getHours()).slice(-2) + ":" + ("0" + this.getMinutes()).slice(-2)
        // white box
        svg_str += '<rect x="0%" y="0%"  width="95%" height="100%"';
        svg_str += ' style="fill:white;stroke:black;stroke-width:'+stroke_width+'" />';
        svg_str += '<rect x="0%" y="0%"  width="85%" height="100%"';
        svg_str += ' style="fill:white;stroke:black;stroke-width:'+stroke_width+'" />';

        // time
        svg_str += '<text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle"';
        svg_str += ' fill="black" style="font-family:courier, courier new, serif;writing-mode: tb;font-size:' +size*0.25+ '">' +time_str+ '</text>';

        svg_str += '</svg>';

        return svg_str;
};

Date.prototype.time_end_icon = function(size) {
        var svg_str = '<svg width="' +size*0.5+ '" height="' +size+ '">';
        var stroke_width = size/50;
        var time_str = ("0" + this.getHours()).slice(-2) + ":" + ("0" + this.getMinutes()).slice(-2)
        // white box
        svg_str += '<rect x="0%" y="0%"  width="100%" height="100%"';
        svg_str += ' style="fill:white;stroke:black;stroke-width:'+stroke_width+'" />';

        svg_str += '<line x1="5%" y1="0" x2="5%" y2="100%" stroke="black" stroke-dasharray="4" stroke-width="'+stroke_width*4+'" />';
        // time
        svg_str += '<text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle"';
        svg_str += ' fill="black" style="font-family:courier, courier new, serif;writing-mode: tb;font-size:' +
                    size*0.25+ '">' +time_str+ '</text>';

        svg_str += '</svg>';

        return svg_str;
};

Date.prototype.format_period = function(d) {
    var p = this - d;
    p = Math.abs(p);
    if (p < 1000) {return p.toFixed() + " ms"}
    p = p/1000;  // miliseconds to seconds
    if (p < 120) {return p.toFixed() + " s"}
    p = p/60;    // seconds to minutes
    if (p < 90) {return p.toFixed() + " min"}
    p = p/60;    // mins to hours
    if (p < 50) {return p.toFixed()+ " hrs"}
    p = p/24;     // hours to days
    return p.toFixed() + " days"
};

