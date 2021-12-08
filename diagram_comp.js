/**
 * Created by sjp23 on 10/01/2020.
 */



function down_cink_arrow(ctx, colour, x, y, toplength, midlength, bottomlength, angle) {
    var width = 20;
    angle = angle * Math.PI / 180.0;
    var bend_length = width * Math.tan(Math.abs(angle / 2));
    var slope_length = midlength + bend_length;
    var slope_x = slope_length * Math.sin(angle);
    var slope_y = slope_length * Math.cos(angle);
    var left_bottom, right_bottom, left_top, right_top;
    if (angle > 0) {
        left_bottom = bottomlength + bend_length;
        right_bottom = bottomlength;
        left_top = toplength;
        right_top = toplength + bend_length;
    } else {
        left_bottom = bottomlength;
        right_bottom = bottomlength + bend_length;
        left_top = toplength + bend_length;
        right_top = toplength;
    }

    var path = "M" + x + " " + y + " l -20 -20 h10 v-" + left_bottom;
    path += " l" + slope_x + " " + (-slope_y) + " v-" + left_top + " h20 v" + right_top;
    path += " l" + (-slope_x) + " " + slope_y + " v" + right_bottom + " h10 z";
    ctx.strokeStyle = colour;
    ctx.lineWidth = 1;
    ctx.fillStyle = colour;
    var p = new Path2D(path);
    ctx.stroke(p);
    ctx.fill(p);
}


function down_cink_arrow2(ctx, colour, x1, y1, x2, y2,
                          toplength, bottomlength, width) {
    var xd = x1 - x2;
    var yd = y2 - y1 -toplength-bottomlength;
    bottomlength = bottomlength - width;
    var angle = Math.atan2(xd, yd);
    var bend_length = width * Math.tan(angle / 2);
    var midlength = Math.sqrt(Math.pow(xd, 2) + Math.pow(yd, 2)) - bend_length;
    var slope_length = midlength + bend_length;
    var slope_x = slope_length * Math.sin(angle);
    var slope_y = slope_length * Math.cos(angle);
    var left_bottom, right_bottom, left_top, right_top;
    left_bottom = bottomlength + bend_length/2;
    right_bottom = bottomlength - bend_length/2;
    left_top = toplength - bend_length/2;
    right_top = toplength + bend_length/2;

    var path = "M" + x2 + " " + y2 + " l -"+width+" -"+width+" h"+width/2+" v-" + left_bottom;
    path += " l" + slope_x + " " + (-slope_y) + " v-" + left_top + " h"+width+" v" + right_top;
    path += " l" + (-slope_x) + " " + slope_y + " v" + right_bottom + " h"+width/2+" z";
    ctx.strokeStyle = colour_blender(0.7, colour, "rgba(0,0,0)");
    ctx.lineWidth = 1;
    ctx.fillStyle = colour;
    var p = new Path2D(path);
    ctx.stroke(p);
    ctx.fill(p);
}


function down_arrow(ctx, colour, x, y, length) {
    var path = "M" + x + " " + y + " l -20 -20 h10 v-" + length + " h20 v" + length + " h10 z";
    ctx.strokeStyle = colour;
    ctx.lineWidth = 1;
    ctx.fillStyle = colour;
    var p = new Path2D(path);
    ctx.stroke(p);
    ctx.fill(p);
}

function arrow_cink(ctx, colour, x1, y1, x2, y2, x3, y3, x4, y4, width, dash) {
    ctx.strokeStyle = colour;
    ctx.lineWidth = width;
    if (dash != undefined) {ctx.setLineDash([dash]);}
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.stroke();
    var h = width * 5;
    var angle = Math.atan2(x4 - x3, y4 - y3);
    var a = 0.5;
    ctx.setLineDash([0]);
    ctx.beginPath();
    ctx.lineTo(x4 - h * Math.sin(angle + a), y4 - h * Math.cos(angle + a));
    ctx.moveTo(x4, y4);
    ctx.lineTo(x4 - h * Math.sin(angle - a), y4 - h * Math.cos(angle - a));
    ctx.stroke();
}

function arrow(ctx, colour, x1, y1, x2, y2, width, dash) {
    ctx.strokeStyle = colour;
    ctx.lineWidth = width;
    if (dash != undefined) {ctx.setLineDash([dash]);}
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    var h = width * 5;
    var angle = Math.atan2(x2 - x1, y2 - y1);
    var a = 0.5;
    ctx.setLineDash([0]);
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - h * Math.sin(angle + a), y2 - h * Math.cos(angle + a));
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - h * Math.sin(angle - a), y2 - h * Math.cos(angle - a));
    ctx.stroke();
}

function machine(ctx, x, y, width, height, colour, title, host) {
    if (typeof host === 'undefined') {
        host = title + ".ceda.ac.uk";
    }
    var radius = 5;
    ctx.lineWidth = 3;


    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.strokeStyle = colour_blender(0.5, colour, "rgba(0,0,0,1)");
    ctx.lineWidth = 1;
    ctx.fillStyle = colour;
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#000";

    ctx.fillText(title, x+3, y + 12);
    image_link(ctx, "ganglia.png", x + width - 30, y, 30, 30, ganglia_link2(host));
}

function machine_group(ctx, x, y, width, height, colour, host_stem, n) {
    for (var i = n; i > 0; i--) {
        var title = host_stem + i;
        machine(ctx, x - (i-1)*10, y - (i-1)*12, width, height, colour, title);
    }
}

function machine_group2(ctx, x, y, width, height, colour, hosts) {
    for (var i = hosts.length - 1; i >= 0; i--) {
        host = hosts[i];
        if (host.title != undefined) {
            machine(ctx, x - i * 10, y - i * 12, width, height, colour, host.title, host.name);
        }
        else {
            machine(ctx, x - i * 10, y - i * 12, width, height, colour, title);
        }
    }
}

function web_machine(ctx, x, y, width, height, colour, title, host, image, monitor, url) {
    machine(ctx, x, y, width, height, mcolour, title, host);
    up(ctx, x+width-40, y+40, monitor);
    image_link(ctx, image, x, y+35, width, height-40, url);
}

function queue(ctx, colour1, x, y, length, height, title) {
    ctx.strokeStyle = colour_blender(0.7,colour1,"rgb(255,0,0,1)");
    ctx.lineWidth = 2;
    ctx.fillStyle = colour1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x + length, y + height);
    ctx.lineTo(x + length, y);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    var a = height / 2;
    var n = length / a;

    for (var i = 0; i <= n; i++) {
        ctx.beginPath();
        ctx.moveTo(x + i * a, y);
        ctx.lineTo(x + i * a, y + height);
        ctx.closePath();
        ctx.stroke();
    }
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#000";
    ctx.fillText(title, x, y);

}

var grabstore = {};
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
{
    last_logs_query.query.range.logtime.gte = new Date(new Date() - 30*24*3600*1000);
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


function simple_check_output(timeout)
{
    // query for simple checks
    var query = {"query": {"term": {"stream.keyword": "simple_checks"}},
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
                },

                error: function (data) {
                    console.log(data);
                },
                contentType: "application/json"
            }
    );
}






function uptimerobot(timeout) {
    var url = "https://api.uptimerobot.com/v2/getMonitors";
    var query_data = {"api_key": "ur668013-4786377064a9ad449c09d1de", "logs": 0};

    $.post({
            url: url,
            data: JSON.stringify(query_data),
            success: function (data) {
                grabstore["uptimerobot"] = {};
                for (var i=0; i < data.monitors.length; i++) {
                    m = data.monitors[i];
                    grabstore["uptimerobot"][m.friendly_name] = m.status;
                }
                setTimeout(function () {uptimerobot(timeout)}, timeout);
            },

            error: function (data) {
                console.log(data)
            },
            contentType: "application/json"
        }
    );
}


function up(ctx, x, y, key) {
    var value = '-';
    if (grabstore["uptimerobot"] != undefined) {
        value = grabstore["uptimerobot"][key]
    }
    if (value == 2) {ctx.fillStyle = "rgba(100,250,100,0.9)"; value = "OK"}
    else {ctx.fillStyle = "rgba(250,100,100,0.9)"};
    ctx.strokeStyle = "rgba(0,0,0,1)";
    var width = 30;
    var height = 12;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x, y + height);
    ctx.closePath();
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#000";
    ctx.fillText(value, x + 2, y + 10);
    setTimeout(function () {
        up(ctx, x, y, key)
    }, 1000);

}

function show_nums(ctx, x, y, key1, key2, unit, scale, fixed, warn_level, alert_level) {
    var value = 0;
    if (grabstore[key1] != undefined) {
        value = grabstore[key1][key2]
    }
    ctx.fillStyle = "rgba(200,255,200,0.9)";
    if (value > warn_level) {ctx.fillStyle = "rgba(250,255,0,0.9)"}
    if (value > alert_level) {ctx.fillStyle = "rgba(250,0,0,0.9)"}

    ctx.strokeStyle = "rgba(0,0,0,1)";
    var width = 60;
    var height = 12;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 60, y);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x, y + height);
    ctx.closePath();
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();

    //ctx.rect(x,y,60,12);
    //ctx.fill();
    ctx.fillStyle = "#000";

    ctx.fillText((value * scale).toFixed(fixed) + " " + unit, x + 2, y + 10);
    setTimeout(function () {
        show_nums(ctx, x, y, key1, key2, unit, scale, fixed, warn_level, alert_level)
    }, 1000 + Math.random() * 1000);
}


function get_last_logs() {
    $.post({
            url: ES_URL,
            data: JSON.stringify(last_logs_query),
            success: function (data) {
                for (i = 0; i < data.aggregations.stream.buckets.length; i++) {
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

            error: function (data) {
                console.log(data)
            },
            contentType: "application/json"
        }
    );
    // return outut;
}


function disk(ctx, colour, x, y, length, width, title) {
    var w = width / 5.;
    var path1 = "M" + x + " " + y + " c0 -" + w + " " + width + " -" + w + " " + width + " 0 c0 " + w + " -" + width + " " + w + " -" + width + " 0z";
    var path2 = "M" + x + " " + y + " v" + length + " c0 " + w + " " + width + " " + w + " " + width + " 0 v-" + length + " c0 " + w + " -" + width + " " + w + " -" + width + " 0z";
    var strokecolour = colour_blender(0.7, colour, "rgba(0,0,0,1)");
    var topcolour = colour_blender(0.4, colour, "rgba(0,0,0)");
    ctx.strokeStyle = strokecolour;
    ctx.lineWidth = 2;
    ctx.fillStyle = topcolour;
    var p = new Path2D(path1);
    ctx.stroke(p);
    ctx.fill(p);
    ctx.strokeStyle = strokecolour;
    ctx.lineWidth = 1;
    ctx.fillStyle = colour;
    p = new Path2D(path2);
    ctx.stroke(p);
    ctx.fill(p);
    ctx.fillStyle = "black";
    ctx.fillText(title, x+3, y+3);
}


function user(ctx, colour, x, y, title, link) {
    ctx.strokeStyle = colour;
    ctx.lineWidth = 2;
    ctx.fillStyle = colour_blender(0.7, "rbga(255,255,255)");
    ctx.beginPath();
    ctx.moveTo(x + 5, y);
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.moveTo(x, y + 5);
    ctx.lineTo(x, y + 15);
    ctx.lineTo(x - 5, y + 25);
    ctx.moveTo(x, y + 15);
    ctx.lineTo(x + 5, y + 25);
    ctx.moveTo(x - 5, y + 12);
    ctx.lineTo(x + 5, y + 12);
    ctx.closePath();

    ctx.stroke();

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.fillStyle = "black";
    ctx.fillText(title, x - 10, y);
    add_link(ctx, x - 10, y - 10, 40, 10, link)
}

function ganglia_link2(host) {
    var link;
    link = "http://mgmt.jc.rl.ac.uk/ganglia/?r=hour&cs=&ce=&m=load_one&s=by+name&c=JASMIN+Cluster&h=";
    link += host;
    link += "&host_regex=&max_graphs=0&tab=m&vn=&sh=1&z=small&hc=4";
    return link;
}
//http://mgmt.jc.rl.ac.uk/ganglia/?r=hour&cs=&ce=&m=load_one&s=by+name&c=JASMIN+Cluster&h=arrivals1.ceda.ac.uk&host_regex=&max_graphs=0&tab=m&vn=&sh=1&z=small&hc=4

function ganglia_link(host, period, report) {
    var link;
    link = 'http://mgmt.jc.rl.ac.uk/ganglia/graph.php?h=' + host;
    link += '.ceda.ac.uk&m=load_one&r=' + period;
    link += '&s=by%20name&hc=4&mc=2&st=1561013641&g=' + report;
    link += '&z=medium&c=JASMIN%20Cluster';
    return link;
}


function image_link(ctx, src, x, y, w, h, href) {
    image(ctx, src, x, y, w, h);
    add_link(ctx, x, y, w, h, href);
}

function image(ctx, src, x, y, w, h) {
    var img = document.getElementById(src);
    ctx.drawImage(img, x, y, w, h);
}


function link_listen(canvas) {
    canvas.addEventListener("mousemove", on_mousemove, false);
    canvas.addEventListener("click", on_click, false);
}

var Links = [];

function add_link(ctx, x, y, w, h, href) {
    var link = [x, y, w, h, href];
    //Links.push("xxx");
    Links[Links.length] = link;
    var path = "M" + x + " " + y + " h" + w + " v" + h + "h-" + w + "z";
    ctx.strokeStyle = "rgba(0,0,0,0.3)";
    ctx.lineWidth = 1;
    var p = new Path2D(path);
    ctx.stroke(p);
}

// Link hover
function on_mousemove(ev) {
    var x, y;

    // Get the mouse position relative to the canvas element
    if (ev.layerX || ev.layerX == 0) { // For Firefox
        x = ev.layerX;
        y = ev.layerY;
    }
    //console.log(x,y);

    // Link hover
    for (var i = Links.length - 1; i >= 0; i--) {
        var linkX = Links[i][0],
            linkY = Links[i][1],
            linkWidth = Links[i][2],
            linkHeight = Links[i][3],
            linkHref = Links[i][4];

        // Check if cursor is in the link area
        if (x >= linkX && x <= (linkX + linkWidth) && y >= linkY && y <= (linkY + linkHeight)) {
            document.body.style.cursor = "pointer";
            hoverLink = linkHref;
            break;
        }
        else {
            document.body.style.cursor = "";
            hoverLink = "";
        }
    }
}

// Link click
function on_click(e) {
    if (hoverLink) {
        //window.open(hoverLink); // Use this to open in new tab
        window.location = hoverLink; // Use this to open in current window
    }
}


function draw() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    user(ctx, c8, 250, 10, "data provider", "https://secure.helpscout.net/mailbox/7b0c55db545d4969/1952553/");
    image_link(ctx, "helpscout.png", 260, 15, 20, 20, "https://secure.helpscout.net/mailbox/7b0c55db545d4969/1952553/");
    web_machine(ctx, 220, 50, 150,100,  mcolour, "arrivals", "arrivals", "arrivals.png", "arrivals", "https://arrivals.ceda.ac.uk");
    disk(ctx, c5, 400, 130, 70, 70, "/arrivals");
    //down_cink_arrow(ctx, c7, 430 , 150, 30, 100, 20, -60);
    down_cink_arrow2(ctx, c10, 300, 20, 430, 150, 50, 50, dw);

    disk(ctx, c8, 500, 130, 70, 70, "/processing3");
    //down_arrow(ctx, c10, 550, 150, 70);
    down_cink_arrow2(ctx, c12, 550, 20, 550, 150, 10, 30, dw);

    disk(ctx, c11, 600, 130, 70, 70, "/gws...");
    //down_arrow(ctx, c12, 650, 150, 70);
    down_cink_arrow2(ctx, c12, 650, 20, 650, 150, 10, 30, dw);

    machine_group(ctx, 560, 350, 150,100,  mcolour, "deposit", 5);
    image_link(ctx, "image/deposit_mon.png", 565, 350, 105, 75, "https://archdash1.ceda.ac.uk/current/a_sum");


    //down_cink_arrow(ctx, c4, 610 , 500, 20, 140, 230, -85);
    //down_cink_arrow(ctx, c5, 610 , 500, 30, 50 , 210, -75);
    //down_cink_arrow(ctx, c6, 610 , 500, 60, 30, 190, 75);
    down_cink_arrow2(ctx, c12, 430, 200, 610, 480, 30, 200, dw);
    down_cink_arrow2(ctx, c12, 550, 200, 610, 480, 30, 220, dw);
    down_cink_arrow2(ctx, c12, 650, 200, 610, 480, 60, 200, dw);


    //down_cink_arrow(ctx, c7, 710 , 750, 20, 80, 130, -85);
    //down_cink_arrow(ctx, c8, 610 , 750, 90, 50 , 20, -20);
    //down_cink_arrow(ctx, c9, 450 , 750, 10, 110, 150, 90);
    down_cink_arrow2(ctx, c12, 610, 580, 710, 750, 20, 140, dw);
    down_cink_arrow2(ctx, c12, 610, 580, 610, 750, 20, 140, dw);
    down_cink_arrow2(ctx, c12, 610, 580, 450, 750, 20, 140, dw);


    machine_group(ctx, 170, 350, 150,120,  mcolour,  "ingest", 5);
    image_link(ctx, "image/ingest_mon.png", 175, 350, 105, 75, "http://stats.ceda.ac.uk/ingest_state/index.html?namefilter=&owner=&reclen=30&ingest1=on&ingest2=on&ingest3=on&running=on&warn=on&fail=on&killed=on&died=on");
    arrow_cink(ctx, 'black', 250, 130, 250, 250, 200, 250, 200, 350, iw);


    machine(ctx, 350, 300, 150,200,  mcolour, "rbq");
    queue(ctx, c8, 370, 370, 100, 20,  "deposit_rpc");
    queue(ctx, c9, 370, 420, 100, 20,  "fast");
    queue(ctx, c9, 370, 460, 100, 20,  "slow");
    arrow_cink(ctx, 'black', 280, 380, 280, 380, 280, 380, 370, 380, iw);
    arrow(ctx, 'black', 470, 380, 550, 380, iw);

    arrow_cink(ctx, 'black', 470, 430, 520, 430, 520, 450, 750, 450, iw);
    arrow_cink(ctx, 'black', 470, 470, 520, 470, 520, 450, 750, 450, iw);
    arrow_cink(ctx, 'black', 550, 400, 330, 400, 330, 430, 370, 430, iw);
    arrow_cink(ctx, 'black', 550, 400, 330, 400, 330, 470, 370, 470, iw);

    //machine(ctx, 750, 390, 150,100,  c3,  "indexer");
    machine_group2(ctx, 750, 390, 150,100,  mcolour,
            [{title: "indexer - ingest4", name: "ingest4"}, {title: "indexer - ingest5", name: "ingest5"}]);
    machine_group(ctx, 1000, 390, 150,100,  mcolour,  "jasmin-es", 8);
    disk(ctx, c3, 1010, 450, 30, 50, "FBI");
    up(ctx, 1020, 460, "FBI");
    disk(ctx, c3, 1070, 450, 30, 50, "Haystack");
    up(ctx, 1080, 460, "Haystack");
    arrow(ctx, 'black', 900, 450, 1000, 450, iw);
    arrow_cink(ctx, 'black', 1000, 470, 950, 470, 950, 470, 950, 600, iw);


    machine(ctx, 1040, 520, 150,100,  mcolour,  "db1");
    disk(ctx, c2, 1050, 570, 30, 40, "Moles");
    arrow(ctx, 'black', 1080, 480, 1080, 650, iw);
    arrow(ctx, 'black', 1070, 600, 1070, 650, iw);

    disk(ctx, c4, 540, 490, 80, 140, "/archive");
    add_link(ctx, 550,480, 100, 10, "http://cedaarchiveapp.ceda.ac.uk/cedaarchiveapp/home/");


    web_machine(ctx, 1040, 650, 150,100,  mcolour, "catalogue", "catalogue", "image/cat.png", "catalogue.ceda.ac.uk" ,"https://catalogue.ceda.ac.uk");

    web_machine(ctx, 860, 720, 150,100,  mcolour, "archive", "archive", "image/archive.png", "archive.ceda.ac.uk", "http://archive.ceda.ac.uk");

    web_machine(ctx, 860, 600, 150,100,  mcolour, "data", "data_201911251517.ceda-web-S.jasmin.ac.uk", "image/data.png", "data.ceda.ac.uk", "http://data.ceda.ac.uk");

    web_machine(ctx, 680, 620, 150,100,  mcolour, "dap", "dap", "image/dap.png", "dap.ceda.ac.uk", "http://dap.ceda.ac.uk");

    machine(ctx, 500, 620, 150,100,  mcolour, "ftp2", "ftp2-mgmt.ceda.ac.uk");
    up(ctx, 510, 640, "ftp.ceda.ac.uk");
    machine(ctx, 320, 620, 150,100,  mcolour, "jasmin");

    user(ctx, c10, 650, 750, "archive users", "https://secure.helpscout.net/mailbox/8c6107481a61d1f4/");
    image_link(ctx, "helpscout.png", 660, 755, 20, 20, "https://secure.helpscout.net/mailbox/7b0c55db545d4969/1952553/");
    arrow(ctx, 'black', 680, 750, 880, 770, 1, 5);
    arrow(ctx, 'black', 950, 770, 1050, 730, 1, 5);
    arrow(ctx, 'black', 1050, 710, 950, 680, 1, 5);
    arrow(ctx, 'black', 880, 680, 760, 700, 1, 5);
    arrow(ctx, 'black', 680, 750, 880, 770, 1, 5);

    user(ctx, c10, 400, 750, "jasmin user", "https://secure.helpscout.net/mailbox/8c6107481a61d1f4/");
    image_link(ctx, "helpscout.png", 410, 755, 20, 20, "https://secure.helpscout.net/mailbox/7b0c55db545d4969/1952553/");

    //deposit_nums(ctx, 20, 100, "filerate_2min", "files/s", 1);
    //deposit_nums(ctx, 20, 60, "volrate_2min", "MB/s", 1e-6);

    grab("https://archdash1.ceda.ac.uk/current/api", "current_deposits", 5000);
    //grab("http://archdash1.ceda.ac.uk/downloads/json/methods?start=2019%2F10%2F26&end=2020%2F01%2F24&user=&dataset=&method=&anon=all", "b", 5000);
    ingest_sum(20000);
    uptimerobot(60000);
    simple_check_output(30000);

    show_nums(ctx, 580, 400, "current_deposits", "filerate_2min", "files/s", 1, 2, 10, 30);
    show_nums(ctx, 580, 420, "current_deposits", "volrate_2min", "MB/s", 1e-6, 1, 1000000000, 2000000000);
    show_nums(ctx, 390, 420, "current_deposits", "fastq_len", "files", 1, 0, 1000, 100000);
    show_nums(ctx, 390, 470, "current_deposits", "slowq_len", "files", 1, 0, 200000, 1000000);

    show_nums(ctx, 240, 380, "ingest", "ok", "ok", 1, 0);
    show_nums(ctx, 240, 395, "ingest", "fail", "fails", 1, 0, 5, 20);
    show_nums(ctx, 240, 410, "ingest", "running", "running", 1, 0, 10, 30);
    show_nums(ctx, 240, 425, "ingest", "killed", "killed", 1, 0, 2, 10);
    show_nums(ctx, 240, 440, "ingest", "died", "died", 1, 0, 1, 3);

    show_nums(ctx, 390, 150, "checks", "/datacentre/arrivals", "% full", 1, 0, 80, 90);
    show_nums(ctx, 490, 150, "checks", "/datacentre/processing3", "% full", 1, 0, 80, 90);



    link_listen(canvas);
}

