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


function down_arrow(ctx, colour, x, y, length) {
    var path = "M" + x + " " + y + " l -20 -20 h10 v-" + length + " h20 v" + length + " h10 z";
    ctx.strokeStyle = colour;
    ctx.lineWidth = 1;
    ctx.fillStyle = colour;
    var p = new Path2D(path);
    ctx.stroke(p);
    ctx.fill(p);
}

function arrow_cink(ctx, colour, x1, y1, x2, y2, x3, y3, x4, y4, width) {
    ctx.strokeStyle = colour;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.lineTo(x3,y3);
    ctx.lineTo(x4,y4);
    var h = width*5;
    var angle = Math.atan2(x4-x3, y4-y3);
    var a = 0.5;
    ctx.lineTo(x4 - h* Math.sin(angle+a), y4 - h* Math.cos(angle+a));
    ctx.moveTo(x4, y4);
    ctx.lineTo(x4 - h* Math.sin(angle-a), y4 - h* Math.cos(angle-a));
    ctx.stroke();
}

function arrow(ctx, colour, x1, y1, x2, y2, width) {
    ctx.strokeStyle = colour;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    var h = width*5;
    var angle = Math.atan2(x2-x1, y2-y1);
    var a = 0.5;
    ctx.lineTo(x2 - h* Math.sin(angle+a), y2 - h* Math.cos(angle+a));
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - h* Math.sin(angle-a), y2 - h* Math.cos(angle-a));
    ctx.stroke();
}

function machine(ctx, x, y, width, height, fill, stroke, title, host) {
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
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#000";

    ctx.fillText(title, x, y+10);
    add_link(ctx,x,y,width,10, ganglia_link2(host));
    image_link(ctx, "ganglia.png", x+width-30, y, 30, 30, ganglia_link2(host));
}

function machine_group(ctx, x, y, width, height, fill, stroke, host_stem, n) {
    console.log("in machin group", n, host_stem);
    for (var i = n; i > 0; i--) {
        var title = host_stem + i;
        console.log(title);
        machine(ctx, x-i*10, y-i*10, width, height, fill, stroke, title);
        console.log(title);
    }
}

function queue(ctx, colour1, colour2, x, y,  length, height, title){
    ctx.strokeStyle = colour1;
    ctx.lineWidth = 2;
    ctx.fillStyle = colour2;
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x,y+height);
    ctx.lineTo(x+length,y+height);
    ctx.lineTo(x+length,y);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    var a = height/2;
    var n = length/a;

    for (var i = 0; i <= n; i++) {
        ctx.beginPath();
        console.log(a,n, i, i*a);
        ctx.moveTo(x+i*a,y);
        ctx.lineTo(x+i*a,y+height);
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
    $.getJSON(url,
        function(result) {
            console.log(result, name, timeout);
            grabstore[name] = result;
            setTimeout(function() {grab(url, name, timeout)}, timeout);
        } );
}


function show_nums(ctx, x, y, key1, key2, unit, scale) {
    ctx.fillStyle = "rgba(250,255,250,0.9)";
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
    var value = 0 ;
    if (grabstore[key1] != undefined) {value=grabstore[key1][key2]}
    ctx.fillText((value*scale).toFixed(2)+" "+unit, x, y+10);
    setTimeout(function() {show_nums(ctx, x, y, key1, key2, unit, scale)}, 1000+Math.random()*1000);
}



function get_last_logs()
{
    var outut = {};
    $.post({
                url: ES_URL,
                data: JSON.stringify(last_logs_query),
                success: function (data) {
                    for (i = 0; i < data.aggregations.stream.buckets.length; i++) {
                        var stream = data.aggregations.stream.buckets[i].key;
                        var last_log = data.aggregations.stream.buckets[i].recent_logs.hits.hits[0]._source;
                        var nlogs = data.aggregations.stream.buckets[i].recent_logs.hits.hits.length;
                        var counts = {};
                        for (var j=0; j < nlogs; j++) {
                            var doc = data.aggregations.stream.buckets[i].recent_logs.hits.hits[j]._source;
                            if (doc.state in counts) {
                                counts[doc.state]++;
                            } else {
                                counts[doc.state] = 1;
                            }
                        }
                        last_log.counts = counts;
                        last_log.nlogs = nlogs;

                        outut[stream] = last_log;
                    }
                    outpt = outut; // set global var
                    refresh_page_info(outut);
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



function disk(ctx, colour1, colour2, x, y, length, width, title) {
    var w = width / 5.;
    var path1 = "M" + x + " " + y + " c0 -" + w + " " + width + " -" + w + " " + width + " 0 c0 " + w + " -" + width + " " + w + " -" + width + " 0z";
    var path2 = "M" + x + " " + y + " v" + length + " c0 " + w + " " + width + " " + w + " " + width + " 0 v-" + length + " c0 " + w + " -" + width + " " + w + " -" + width + " 0z";
    ctx.strokeStyle = colour1;
    ctx.lineWidth = 1;
    ctx.fillStyle = colour1;
    var p = new Path2D(path1);
    ctx.stroke(p);
    ctx.fill(p);
    ctx.strokeStyle = colour2;
    ctx.lineWidth = 1;
    ctx.fillStyle = colour2;
    p = new Path2D(path2);
    ctx.stroke(p);
    ctx.fill(p);
    ctx.fillStyle = "black";
    ctx.fillText(title, x, y);
}


function user(ctx, colour1, colour2, x, y, title, link) {
    ctx.strokeStyle = colour1;
    ctx.lineWidth = 2;
    ctx.fillStyle = colour2;
    ctx.beginPath();
    ctx.moveTo(x+5,y);
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.moveTo(x,y+5);
    ctx.lineTo(x,y+15);
    ctx.lineTo(x-5, y+25);
    ctx.moveTo(x, y+15);
    ctx.lineTo(x+5, y+25);
    ctx.moveTo(x-5, y+12);
    ctx.lineTo(x+5, y+12);
    ctx.closePath();

    ctx.stroke();

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.fillStyle = "black";
    ctx.fillText(title, x -10, y);
    add_link(ctx,x-10,y-10, 40,10, link)
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
    var path = "M" + x + " " + y + " h" + w + " v" + h + "h-"+ w + "z";
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
        window.open(hoverLink); // Use this to open in new tab
        //window.location = hoverLink; // Use this to open in current window
    }
}


