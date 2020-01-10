/**
 * Created by sjp23 on 10/01/2020.
 */


function down_funnel(ctx, x, y) {

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo()
    ctx.bezierCurveTo(20, 100, 200, 100, 200, 20);
    ctx.stroke()
    <!-- down funnel arrow -->
<
    svg
    x = 470
    y = "200"
    width = "240"
    height = "170" >
        < text
    x = "0"
    y = "50"
    fill = "red" > Arrivals < / text >
        < path
    d = "M110 170 l -20 -20 h10 v-150 h20 v150 h10 z"
    style = "fill: green;opacity:0.5" / >
        < path
    d = "M120 170 l -20 -20 h10 v-55 l50 -50 v-45 h20 v55 l-50 50 v45 h10 z"
    style = "fill: lightblue;opacity:0.5" / >
        < path
    d = "M100 170 l -20 -20 h10 v-45 l-50 -50 v-55 h20 v45 l50 50 v55 h10 z"
    style = "fill: orange;opacity:0.5" / >
        < / svg >

}