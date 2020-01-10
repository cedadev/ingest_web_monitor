/**
 * Created by sjp23 on 10/01/2020.
 */


   function down_cink_arrow(ctx, colour, x , y, toplength, midlength, bottomlength, angle) {
       var width = 20;
       var angle = angle * Math.PI/180.0;
       console.log(angle);
       var bend_length = width * Math.tan(Math.abs(angle/2));
       var slope_length = midlength + bend_length;
       var slope_x =  slope_length * Math.sin(angle);
       var slope_y =  slope_length * Math.cos(angle);
       var left_bottom, right_bottom, left_top, right_top;
       if (angle > 0) {
           left_bottom = bottomlength+bend_length;
           right_bottom = bottomlength;
           left_top = toplength;
           right_top = toplength+bend_length;
       } else {
           left_bottom = bottomlength;
           right_bottom = bottomlength+bend_length;
           left_top = toplength+bend_length;
           right_top = toplength;
       }

       console.log(angle, bend_length);

       //var path = "M"+x+" "+y+" l -20 -20 h10 v-"+length+" h20 v"+length+" h10 z";

       var path = "M"+x+" "+y+" l -20 -20 h10 v-"+left_bottom;
       path += " l"+slope_x+" "+(-slope_y)+" v-"+left_top+" h20 v"+right_top;
       path += " l"+(-slope_x)+" "+slope_y+" v"+right_bottom+" h10 z";
       console.log(path);
       ctx.strokeStyle = colour;
       ctx.lineWidth = 1;
       ctx.fillStyle = colour;
       var p = new Path2D(path);
       ctx.stroke(p);
       ctx.fill(p);
   }


   function down_arrow(ctx, colour, x , y, length) {
       var path = "M"+x+" "+y+" l -20 -20 h10 v-"+length+" h20 v"+length+" h10 z";
       ctx.strokeStyle = colour;
       ctx.lineWidth = 1;
       ctx.fillStyle = colour;
       var p = new Path2D(path);
       ctx.stroke(p);
       ctx.fill(p);
   }



   function disk(ctx, colour1, colour2, x , y, length, width) {
       var w = width/5.;
       var path1 = "M"+x+" "+y+" c0 -"+w+" "+width+" -"+w+" "+width+" 0 c0 "+w+" -"+width+" "+w+" -"+width+" 0z";
       var path2 = "M"+x+" "+y+" v"+length+" c0 "+w+" "+width+" "+w+" "+width+" 0 v-"+length+" c0 "+w+" -"+width+" "+w+" -"+width+" 0z";
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
   }



        function network_plot(host, size, period, report) {
            var link;
            link += 'http://mgmt.jc.rl.ac.uk/ganglia/graph.php?h=' + host;
            link += '.ceda.ac.uk&m=load_one&r=' + period;
            link += '&s=by%20name&hc=4&mc=2&st=1561013641&g=' + report;
            link += '&z=medium&c=JASMIN%20Cluster';
            return link;
        }
