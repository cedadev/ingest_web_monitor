'use strict';

class GrabStoreComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = new Object();
  }
  
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      3000
    );
  }

  componentWillUnmount() {clearInterval(this.timerID);}

  tick() {this.setState(new Object()); console.log("tick")}

  // override this
  tick_state() {new Object()}
}

class Upmon extends GrabStoreComponent {
  
    tick() {this.setState({up: grabstore.uptimerobot[this.props.name]})} 
  
    render() {
        var colour;
        if (this.state.up == 2) {colour="green"} 
        else if (this.state.up == undefined){colour="gray"}
        else {colour = "red"}
        const mystyle = {
            color: "white",
            backgroundColor: colour,
            top: this.props.y + "px", 
            left: this.props.x + "px",
            position: "absolute",
            padding: "5px",
            fontFamily: "Arial"
          };
      return (
        <div style={mystyle}>
            <a href={this.props.link}>
          <h3>{this.props.name}</h3>  
          <img src={this.props.img}></img></a>
        </div>
      );
    }
  }
  


  //-----------------------------------------------------------
  class Disk extends GrabStoreComponent {

    tick() {this.setState({full: grabstore.checks[this.props.name]})}
  
    render() {
        var status_class;
        if (this.state.full == undefined) {status_class = "disk unknown"}
        else if (this.state.full > this.props.alert) {status_class = "disk error"} 
        else if (this.state.full > this.props.warn) {status_class = "disk warn"}
        else {status_class = "disk ok"}
        const mystyle = {
            top: this.props.y + "px", 
            left: this.props.x + "px",
            position: "absolute"
          };
      return (
        <div className={status_class} style={mystyle}>
            <a href={this.props.link}>
            <i className="fas fa-hdd"></i> {this.state.full}% {this.props.name}<br/>
            </a>
        </div>
      );
    }
  }

//-----------------------------------------------------------
class Light extends GrabStoreComponent {

  tick() {
    var value=undefined 
    if (this.props.groupname != undefined) {value = grabstore[this.props.groupname][this.props.keyname];}
     else {value = grabstore[this.props.keyname]}   
    this.setState({"value": value});
  }

  equals() {
    if (this.state.value == undefined) {return "unknown"}
    var value = String(this.state.value);
    if (value == this.props.alert) {return "alert"}
    else {return "ok"}
  }

  notequals() {
    if (this.state.value == undefined) {return "unknown"}
    var value = String(this.state.value);
    if (value != this.props.alert) {return "alert"}
    else {return "ok"}
  }

  above() {
    if (this.state.value == undefined) {return "unknown"}
    var value = parseFloat(this.state.value);
    if (value > parseFloat(this.props.alert)) {return "alert"}
    else if (this.props.warn != undefined && value > parseFloat(this.props.warn)) {return "warn"}
    else {return "ok"}
  }

  below() {
    if (this.state.value == undefined) {return "unknown"}
    var value = parseFloat(this.state.value);
    if (value < parseFloat(this.props.alert)) {return "alert"}
    else if (this.props.warn != undefined && value < parseFloat(this.props.warn)) {return "warn"}
    else {return "ok"}
  }

  render() {
      var alert_level = "";
      if (this.props.method == undefined) {alert_level = this.above()}
      else if (this.props.method == "above") {alert_level = this.above()}
      else if (this.props.method == "below") {alert_level = this.below()}
      else if (this.props.method == "equals") {alert_level = this.equals()}
      else if (this.props.method == "notequals") {alert_level = this.notequals()}

      const mystyle = {
          top: this.props.y + "px", 
          left: this.props.x + "px",
          position: "absolute",
          padding: "5px",
        };  
    var icon = "";
    var display_value = "";
    if (this.props.icon != undefined) {icon = <i className={"fas fa-"+this.props.icon}></i>}
    if (this.props.show_value !== undefined) {
      if (this.state.value != undefined) {display_value  = this.state.value + " "}
      else {display_value = "? "}
    }
    return (
      <div className={"light " + alert_level} style={mystyle} title={this.props.keyname + " = " + this.state.value}>
           {icon} {display_value}{this.props.name}
      </div>
    );
  }
}
  
  
//-----------------------------------------------------------
class  UptimerobotLights extends GrabStoreComponent {

  tick() {
    //console.log(this.props)
    this.setState({"values": grabstore.uptimerobot});
  }

  render() {
      var colour; var radius;
      if (this.state.value == undefined) {colour="gray"}
      else if (this.state.value === false || this.state.value > this.props.alert) {colour="red"; radius=10} 
      else if (this.state.value > this.props.warn) {colour="orange"; radius=7}
      else {colour = "green"; radius=5}
      
      const mystyle = {
          color: "black",
          backgroundColor: "white",
          top: this.props.y + "px", 
          left: this.props.x + "px",
          position: "relative",
          padding: "5px",
          fontFamily: "Arial"
        };  
        
        var lights = [];
        for (let key in this.state.values) {
          lights.push(<Light key={key} name={key} groupname="uptimerobot"  keyname={key}/>)
        } 
    return (
      <div style={mystyle}>
        {lights}
      </div>
    );
  }
}



//------------------------------------------------------------------
  class Deposit extends GrabStoreComponent {
    constructor(props) {
      super(props);
      this.state = {rcpq_len: undefined, filerate_2min: -1, volrate_2min: -1,
                    filerate_10min: -1, volrate_10min: -1,
                    filerate_60min: -1, volrate_60min: -1};
    }
  
    tick() {
      this.setState({
        rcpq_len:  grabstore.current_deposits["rcpq_len"],
        filerate_2min: grabstore.current_deposits["filerate_2min"], 
        volrate_2min: grabstore.current_deposits["volrate_2min"],
        filerate_10min: grabstore.current_deposits["filerate_10min"],
        volrate_10min: grabstore.current_deposits["volrate_10min"],
        filerate_60min: grabstore.current_deposits["filerate_60min"], 
        volrate_60min: grabstore.current_deposits["volrate_60min"]
      });
    }
  
    render() {
        const mystyle = {
            color: "white",
            backgroundColor: "purple",
            top: this.props.y + "px", 
            left: this.props.x + "px",
            position: "absolute",
            padding: "5px",
            fontFamily: "Arial"
          };
      return (
        <div style={mystyle}>
            <a href={this.props.link}>
            <h4>Deposit Server</h4>
            <table className="metrics_table">
              <tbody>
              <tr><td>Period</td><td>Files/s</td><td>MB/s</td></tr>
              <tr><td>2 Min</td><td>{this.state.filerate_2min.toFixed(2)}</td><td>{(this.state.volrate_2min/1e6).toFixed(2)}</td></tr>
              <tr><td>10 Min</td><td>{this.state.filerate_10min.toFixed(2)}</td><td>{(this.state.volrate_10min/1e6).toFixed(2)}</td></tr>
              <tr><td>60 Min</td><td>{this.state.filerate_60min.toFixed(2)}</td><td>{(this.state.volrate_60min/1e6).toFixed(2)}</td></tr>
              </tbody>
          </table>
          <Light icon="inbox" name="RPCQ length" groupname="current_deposits" show_value="yes" keyname="rcpq_len" warn="1" alert="100"/>
          </a>
        </div>
      );
    }
  }

  //---------------------
  function Catalogue(props) {
    var x = parseInt(props.x);
    var y = parseInt(props.y);

    const mystyle = {
      color: "white",
      backgroundColor: "purple",
      top: y + "px", 
      left: x + "px",
      position: "absolute",
      padding: "5px",
      fontFamily: "Arial"
    };
    return (
      <div style={mystyle} width="150">
        <Upmon name="catalogue.ceda.ac.uk" img="images/cat_s.png"/>
        <Light  icon="address-book" name="Haystack" groupname="uptimerobot"  keyname="Haystack" x="100"/>
      </div>
    );
  }

  //---------------------
  function Arrivals(props) {
    var x = parseInt(props.x);
    var y = parseInt(props.y);
    return (
      <div>
        <Upmon name="arrivals" img="images/arrivals_s.png" x={x} y={y} link="https://arrivals.ceda.ac.uk"/>
        <Light icon="upload" name="ftp" groupname="uptimerobot"  keyname="arrivals-ftp" x={x+100} y={y}/>
        <Light icon="upload" name="rsync" groupname="uptimerobot"  keyname="arrivals-rsync" x={x+100} y={y+30}/>
        <Light icon="eraser" name="deleter" groupname="checks"  keyname="arrivals_deleter_ok" x={x+100} y={y+60}/>
        <Light icon="hdd" name="processing3" groupname="checks"  keyname="/datacentre/processing3" x={x+100} y={y+90}
             alert="90" warn="50" show_value="on"/>
        <Light icon="hdd" name="arrivals" groupname="checks"  keyname="/datacentre/arrivals" x={x+100} y={y+120}
             alert="90" warn="50" show_value="on"/>
        <Light icon="hdd" name="GWS" groupname="checks"  keyname="/datacentre/gws" x={x+100} y={y+150}
             alert="90" warn="50" />             
      </div>
    );
  }


function isEmptyObject(obj) {
  return obj // null and undefined check
  && Object.keys(obj).length === 0
  && Object.getPrototypeOf(obj) === Object.prototype
}

//------------------------------------------------------------------
class Ingest extends GrabStoreComponent {

  tick() {
    if (grabstore.ingest == undefined) {this.setState( new Object())}
    else {this.setState(Object.assign({}, grabstore.ingest))}
  }

  render() {
      const mystyle = {
          top: this.props.y + "px", 
          left: this.props.x + "px",
          position: "absolute",
          padding: "5px",
        };

    var s = this.state;
    var alert_class = "unknown";

    if (isEmptyObject(s)) {alert_class = "unknown"}
    if (s["running"] > 30 || s["warn"] > 30 || s["fail"] > 10 || s["died"] > 10 || s["killed"] > 10) {alert_class = "alert"}
    else if (s["running"] > 25 || s["warn"] > 10 || s["fail"] > 5 || s["died"] > 5 || s["killed"] > 5) {alert_class = "warn"}
    else {alert_class = "ok"}

    var lines = []    
    for (var k in this.state) {lines.push(<tr key={k}><td>{k}</td><td>{this.state[k]}</td></tr>)}    
      
    return (
      <div className={alert_class} style={mystyle}>
          <a href={this.props.link}>
          <h4>Ingest Control</h4>
          <table className="metrics_table">
            <tbody>
            <tr><td>State</td><td>Streams</td></tr>
            {lines}
           </tbody>
        </table>
        <Light name="Crontab populated" groupname="checks" keyname="crontab_lines" 
   warn="100" alert="30" method="below"/>  
        </a>
      </div>
    );
  }
}




  //----------
function DownnBlockArrow(props) {
  const x = parseInt(props.x);
  const y = parseInt(props.y);
  const width = parseInt(props.width);
  const length = parseInt(props.length);
  var x2 = x + width;
  var y2 = y + length;
  var yp = y2 + width * 0.3;
  var xp = x + width * 0.5;
  var points = x+","+y+" "+x+","+y2+" "+xp+","+yp+" "+x2+","+y2+" "+x2+","+y
  return (
<g><title>{props.title}</title>
<polygon  fill={props.fill} points={points} opacity="0.6"/>
<text textAnchor="start" x={x} y={y} fontFamily="Times,serif" fontSize="14.00">{props.title}</text>
</g>)
}  


  function App() {
    return (
      <div>

<svg height="800" width="1100">
<DownnBlockArrow title="data" fill="pink" x="100" y="10" width="500" length="600"/>
<DownnBlockArrow title="catalogue records" fill="blue" x="600" y="10" width="300" length="600"/>
<DownnBlockArrow title="file metadata" fill="yellow" x="400" y="250" width="300" length="300"/>
<circle cx="230" cy="20" r="100" fill="white" />
<circle cx="230" cy="20" r="80" fill="yellow" />

</svg>
 



<Upmon name="dap.ceda.ac.uk" img="images/dap_s.png" link="https://dap.ceda.ac.uk" 
          x="400" y="700"/>
  

        <Disk name="/datacentre/archive" x="350" y="600" alert="90" warn="20"/>

        
        <Light name="FBI" groupname="uptimerobot" keyname="FBI" x="700"/>
        <Upmon name="data.ceda.ac.uk" img="images/data_s.png" x="650" y="800"/>
 
        <Catalogue x="650" y="600"/>
 
        <Upmon name="archive.ceda.ac.uk" img="images/archive_s.png" y="650" x="1300"/>
        
        <Arrivals x="150" y="100"/>

        <Ingest x="400" y="200"/>

        <Deposit x="150" y="380"/>
        <Light icon="download" name="ftp" groupname="uptimerobot"  keyname="ftp.ceda.ac.uk"/>

      
      </div>
    );
  }
  

  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );


  