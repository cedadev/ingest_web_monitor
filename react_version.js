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
        var alert_level = "unknown";
        if (this.state.up == 2) {alert_level = "ok"} 
        else if (this.state.up == undefined) {alert_level = "unknown"}
        else {alert_level = "alert"}
        const mystyle = {
            top: this.props.y + "px", 
            left: this.props.x + "px",
          };
      return (
        <div className={"upmon " + alert_level} style={mystyle}>
            <a href={this.props.link}>
          <h5>{this.props.name}</h5>  
          <img src={this.props.img}></img></a>
        </div>
      );
    }
  }
  

//-----------------------------------------------------------
class Light extends GrabStoreComponent {

  tick() {
    var value=undefined 
    if (this.props.groupname != undefined) {value = grabstore[this.props.groupname][this.props.keyname];}
    else if (this.props.keyname != undefined) {value = grabstore[this.props.keyname]}   
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
        };  
    var icon = "";
    var display_value = "";
    if (this.props.icon != undefined) {icon = <span><i className={"fas fa-"+this.props.icon}></i>&nbsp;</span>}
    if (this.props.show_value !== undefined) {
      if (this.state.value != undefined) {display_value  = this.state.value + " "}
      else {display_value = "? "}
    }
    return (
      <div className={"light " + alert_level} style={mystyle} title={this.props.keyname + " = " + this.state.value}>
           {icon}{display_value}{this.props.name}
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
      this.setState(Object.assign({}, grabstore.current_deposits));
    }
  
    render() {
        const mystyle = {
            top: this.props.y + "px", 
            left: this.props.x + "px",
          };
      return (
        <div className="group" style={mystyle}>
            <h4>Deposit Server</h4>
            <a href="https://archdash.ceda.ac.uk/current/a_sum">current deposits</a>
            <table className="metrics_table">
              <tbody>
              <tr><td>Period</td><td>Files/s</td><td>MB/s</td></tr>
              <tr><td>2 Min</td><td>{this.state.filerate_2min.toFixed(2)}</td><td>{(this.state.volrate_2min/1e6).toFixed(2)}</td></tr>
              <tr><td>10 Min</td><td>{this.state.filerate_10min.toFixed(2)}</td><td>{(this.state.volrate_10min/1e6).toFixed(2)}</td></tr>
              <tr><td>60 Min</td><td>{this.state.filerate_60min.toFixed(2)}</td><td>{(this.state.volrate_60min/1e6).toFixed(2)}</td></tr>
              </tbody>
          </table>
          <Light icon="inbox" name="RPCQ length" groupname="current_deposits" show_value="yes" keyname="rcpq_len" warn="1" alert="100"/>
        </div>
      );
    }
  }

  //---------------------
  function Access(props) {
    const posstyle = {top: parseInt(props.y) + "px", left: parseInt(props.x) + "px",};
    return (
      <div className="group" style={posstyle}>
         <h4>Access</h4>
        <Upmon name="catalogue.ceda.ac.uk" img="images/cat_s.png"/>
        <Light  icon="address-book" name="Haystack" groupname="uptimerobot"  keyname="Haystack" alert="2" method="notequals"/>
        <Upmon name="archive.ceda.ac.uk" img="images/archive_s.png"/>
        <Upmon name="data.ceda.ac.uk" img="images/data_s.png"/>     
        <Upmon name="dap.ceda.ac.uk" img="images/dap_s.png" link="https://dap.ceda.ac.uk" />   
        <Light icon="download" name="ftp" groupname="uptimerobot"  keyname="ftp.ceda.ac.uk" alert="2" method="notequals"/>
        <Light icon="download" name="anon-ftp" groupname="uptimerobot"  keyname="anon-ftp.ceda.ac.uk" alert="2" method="notequals"/>
        <Light name="Artefacts" groupname="uptimerobot"  keyname="artefacts server"  alert="2" method="notequals"/>
      </div>
    );
  }

  //---------------------
  function ExtraAccess(props) {
    const posstyle = {top: parseInt(props.y) + "px", left: parseInt(props.x) + "px",};
    return (
      <div className="group" style={posstyle}>
         <h4>Access</h4>
        <Upmon name="catalogue.ceda.ac.uk" img="images/cat_s.png"/>
        <Light  icon="address-book" name="Haystack" groupname="uptimerobot"  keyname="Haystack" alert="2" method="notequals"/>
        <Upmon name="archive.ceda.ac.uk" img="images/archive_s.png"/>
        <Upmon name="data.ceda.ac.uk" img="images/data_s.png"/>     
        <Upmon name="dap.ceda.ac.uk" img="images/dap_s.png" link="https://dap.ceda.ac.uk" />   
        <Light icon="download" name="ftp" groupname="uptimerobot"  keyname="ftp.ceda.ac.uk" alert="2" method="notequals"/>
      </div>
    );
  }



 //---------------------
 function FBI(props) {
  const posstyle = {top: parseInt(props.y) + "px", left: parseInt(props.x) + "px",};
  return (
    <div className="group" style={posstyle}>
       <h4>FBI</h4>
      <Light icon="address-book" name="FBI up" groupname="uptimerobot" keyname="FBI"  alert="2" method="notequals"/>
      <Light icon="inbox" name="Slow Q" groupname="current_deposits" show_value="yes" keyname="slowq_len" warn="1" alert="10000"/>
      <Light icon="inbox" name="Fast Q" groupname="current_deposits" show_value="yes" keyname="fastq_len" warn="1" alert="10000"/>
      <Light name="Files last 24 hrs" groupname="fbi" keyname="files_in_24hrs" show_value="on" method="below" warn="10000" alert="1000"/>  
      <Light name="Total files" groupname="fbi" keyname="total_files" show_value="on" method="below" alert="100000000"/>  
    </div>
  );
}


  //---------------------
  function Arrivals(props) {
    const posstyle = {top: parseInt(props.y) + "px", left: parseInt(props.x) + "px",};
    return (
      <div className="group" style={posstyle}>
         <h4>Arrivals</h4>
        <Upmon name="arrivals" img="images/arrivals_s.png" link="https://arrivals.ceda.ac.uk"/>
        <Light icon="upload" name="ftp" groupname="uptimerobot"  keyname="arrivals-ftp" x={100} alert="2" method="notequals"/>
        <Light icon="upload" name="rsync" groupname="uptimerobot"  keyname="arrivals-rsync" x={100} y={30} alert="2" method="notequals"/>
        <Light icon="eraser" name="deleter" groupname="checks"  keyname="arrivals_deleter_ok" x={100} y={60} alert="true" method="notequals"/>
        <Light icon="hdd" name="processing3" groupname="checks"  keyname="/datacentre/processing3" x={100} y={90}
             alert="90" warn="50" show_value="on"/>
        <Light icon="hdd" name="arrivals" groupname="checks"  keyname="/datacentre/arrivals" x={100} y={120}
             alert="90" warn="50" show_value="on"/>
        <Light icon="hdd" name="GWS" groupname="checks"  keyname="/datacentre/gws" x={100} y={150}
             alert="90" warn="50" />             
      </div>
    );
  }

  //---------------------
  function Storage(props) {
    const posstyle = {top: parseInt(props.y) + "px", left: parseInt(props.x) + "px",};
    return (
      <div className="group" style={posstyle}>
        <h4>Storage</h4>
        <Upmon name="cedaarchiveapp" link="https://cedaarchiveapp.ceda.ac.uk"/>
        <Light icon="hdd" name="archive" groupname="checks"  keyname="archive" x="100" y={10}
             alert="95" warn="90" show_value="on"/>
        <Light icon="hdd" name="opshome" groupname="checks"  keyname="/datacentre/opshome" x="100" y={40}
             alert="95" warn="90" show_value="on"/>             
        <Light icon="hdd" name="home" groupname="checks"  keyname="/home/badc" x="100" y={70}
             alert="90" warn="50" show_value="on"/>
      </div>
    );
  }
  

function isEmptyObject(obj) {
  return obj // null and undefined check
  && Object.keys(obj).length === 0
  && Object.getPrototypeOf(obj) === Object.prototype
}

//------------------------------------------------------------------
function Ingest(props) {
  const posstyle = {top: parseInt(props.y) + "px", left: parseInt(props.x) + "px",};   
    return (
      <div className="group" style={posstyle}>
        <h4>Ingest control</h4>
        <Light name="Crontab populated" groupname="checks" keyname="crontab_lines" 
   warn="100" alert="30" method="below"/>  
       <Light name="Deposit test" groupname="checks" keyname="deposit_client_ok" 
   alert="false" method="equals"/>  
   <Light name="fail" groupname="ingest" keyname="fail" show_value="on" warn="5" alert="10"/>  
   <Light name="warn" groupname="ingest" keyname="warn" show_value="on" warn="10" alert="30"/>  
   <Light name="died" groupname="ingest" keyname="died" show_value="on" warn="1" alert="20"/>  
   <Light name="killed" groupname="ingest" keyname="killed" show_value="on" warn="5" alert="10"/>  
   <Light name="running" groupname="ingest" keyname="running" show_value="on" warn="25" alert="50"/>  
   <Light name="ok" groupname="ingest" keyname="ok" show_value="on" warn="25" alert="50" method="below"/>
   <Light name="ok-errors" groupname="ingest" keyname="ok-errors" show_value="on" warn="10" alert="50"/>
      </div>
    );
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
 //----------
 function RightBlockArrow(props) {
  const x = parseInt(props.x);
  const y = parseInt(props.y);
  const width = parseInt(props.width);
  const length = parseInt(props.length);
  var x2 = x + length;
  var y2 = y + width;
  var yp = y + width * 0.5;
  var xp = x2 + width * 0.3;
  var points = x+","+y+" "+x2+","+y+" "+xp+","+yp+" "+x2+","+y2+" "+x+","+y2
  return (
<g><title>{props.title}</title>
<polygon  fill={props.fill} points={points} opacity="0.6"/>
<text textAnchor="start" x={x} y={y} fontFamily="Times,serif" fontSize="14.00">{props.title}</text>
</g>)
}  

//---------
  function App() {
    return (
      <div>

<svg height="800" width="1100">
<RightBlockArrow title="data" fill="pink" x="100" y="200" width="200" length="900"/>
<circle cx="30" cy="200" r="100" fill="yellow" stroke="white" strokeWidth="40px"/>
</svg>
 
<Arrivals x="180" y="120"/> 
<Ingest x="400" y="120"/>
<Deposit x="630" y="120"/>
<Storage x="400" y="500"/>
<Access x="850" y="120"/>
<FBI x="630" y="450"/>

      
      </div>
    );
  }
  

  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );


  