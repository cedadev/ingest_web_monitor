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


//-----------------------------------------------------------
class Light extends GrabStoreComponent {

  tick() {
    var value=undefined 
    if (this.props.groupname != undefined) {value = grabstore[this.props.groupname][this.props.keyname];}
    else if (this.props.keyname != undefined) {value = grabstore[this.props.keyname]}   
    this.setState({"value": value});
  }

  render() {
      var alert_level = this.alevel();

    var icon = "";
    var display_value = "";
    if (this.props.icon != undefined) {icon = <span><i className={"fas fa-"+this.props.icon}></i>&nbsp;</span>}
    if (this.props.show_value !== undefined) {
      if (this.state.value != undefined) {
        var value = this.state.value
        if (this.props.show_value == "int") {value = parseInt(value)}
        else if (this.props.show_value == "percent") {value = parseInt(value) +"%"}
        else if (this.props.show_value == "fixed") {value = value.toFixed(2)}
        display_value  = value + " "}
      else {display_value = "? "}
    }
    var display = <span>{icon}{display_value}{this.props.name}</span>;
    if (this.props.link != undefined) {display = <a href={this.props.link}>{display}</a>}
    if (this.props.warn_msg != undefined && alert_level != "ok" && alert_level != "unknown") {
      display = <span>{icon}{display_value}{this.props.name} [{this.props.warn_msg}]</span>}
    return (
      <div className={"light " + alert_level} title={this.props.keyname + " = " + this.state.value}>
           {display}
      </div>
    );
  }
}

//-----------------------------------------------------------
class LightUp extends Light {
  alevel() {
    if (this.state.value == undefined) {return "unknown"}
    var value = String(this.state.value);
    if (value != "2") {return "light-alert"}
    else {return "ok"}
  }
  }

//-----------------------------------------------------------
class LightBelow extends Light {
  alevel() {
    if (this.state.value == undefined) {return "unknown"}
    var value = parseFloat(this.state.value);
    if (value < parseFloat(this.props.alert)) {return "light-alert"}
    else if (this.props.warn != undefined && value < parseFloat(this.props.warn)) {return "warn"}
    else {return "ok"}
  }
  }

//-----------------------------------------------------------
class LightAbove extends Light {
  alevel() {
    if (this.state.value == undefined) {return "unknown"}
    var value = parseFloat(this.state.value);
    if (value > parseFloat(this.props.alert)) {return "light-alert"}
    else if (this.props.warn != undefined && value > parseFloat(this.props.warn)) {return "warn"}
    else {return "ok"}
  }
}

//-----------------------------------------------------------
class LightEquals extends Light {
alevel() {
  if (this.state.value == undefined) {return "unknown"}
  var value = String(this.state.value);
  if (value == this.props.alert) {return "light-alert"}
  else {return "ok"}
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
      return (
        <div className="group">
            <h4><a href="https://archdash.ceda.ac.uk/current/sum">Deposit Server</a></h4>
            <table className="metrics_table">
              <tbody>
              <tr><td>Period</td><td>Files/s</td><td>MB/s</td></tr>
              <tr><td>2 Min</td><td>{this.state.filerate_2min.toFixed(2)}</td><td>{(this.state.volrate_2min/1e6).toFixed(2)}</td></tr>
              <tr><td>10 Min</td><td>{this.state.filerate_10min.toFixed(2)}</td><td>{(this.state.volrate_10min/1e6).toFixed(2)}</td></tr>
              <tr><td>60 Min</td><td>{this.state.filerate_60min.toFixed(2)}</td><td>{(this.state.volrate_60min/1e6).toFixed(2)}</td></tr>
              </tbody>
          </table>
          <LightAbove icon="inbox" name="RPCQ length" groupname="current_deposits" show_value="yes" keyname="rcpq_len" warn="1" alert="100"/>
          <LightBelow icon="inbox" name="10 min rate" groupname="current_deposits" show_value="fixed" keyname="filerate_10min" 
             warn="0.1" alert="0.01"/>
        </div>
      );
    }
  }

  //---------------------
  function Access(props) {
    return (
      <div className="group">
         <h4>Access</h4>
        <LightUp name="archive.ceda.ac.uk" groupname="uptimerobot"  keyname="archive.ceda.ac.uk" 
           link="https://archive.ceda.ac.uk" icon="desktop"/>
        
        <LightUp name="dap.ceda.ac.uk" groupname="uptimerobot"  keyname="dap.ceda.ac.uk" 
           link="https://dap.ceda.ac.uk" icon="desktop"/>
        <LightUp icon="download" name="ftp" groupname="uptimerobot"  keyname="ftp.ceda.ac.uk"/>
        <LightUp icon="download" name="anon-ftp" groupname="uptimerobot"  keyname="anon-ftp.ceda.ac.uk"/>
        <LightUp name="Artefacts" groupname="uptimerobot"  keyname="artefacts server"/>
        <LightEquals icon="eraser" name="dap-logs" groupname="checks"  keyname="dap_logs_ok" alert="false"/>
      </div>
    );
  }

  //---------------------
  function Catalogue(props) {
    return (
      <div className="group">
         <h4>Catalogue</h4>
         <LightUp name="catalogue.ceda.ac.uk" groupname="uptimerobot" keyname="catalogue.ceda.ac.uk" 
           link="https://catalogue.ceda.ac.uk" icon="desktop"/>
         <LightUp name="api.catalogue.ceda.ac.uk" groupname="uptimerobot" keyname="MOLES catalogue API server" 
           link="https://catalogue.ceda.ac.uk" icon="desktop" warn_msg="Will stop deposit if not fixed."/>
        <LightUp icon="address-book" name="Haystack" groupname="uptimerobot" keyname="Haystack"/>
      </div>
    );
  }


 //---------------------
 function FBI(props) {
  return (
    <div className="group">
       <h4>FBI</h4>
       <LightUp name="data.ceda.ac.uk" groupname="uptimerobot"  keyname="data.ceda.ac.uk" 
           link="https://data.ceda.ac.uk" icon="desktop"/> 
      <LightUp icon="address-book" name="FBI up" groupname="uptimerobot" keyname="FBI"/>
      <LightAbove icon="inbox" name="New FBI Q" groupname="current_deposits" show_value="yes" keyname="new_fbiq_len" warn="1" alert="10000"/>
      <LightBelow name="Files last 24 hrs" groupname="fbi" keyname="files_in_24hrs" show_value="on" warn="10000" alert="1000"/>  
      <LightBelow name="Total files" groupname="fbi" keyname="total_files" show_value="on" alert="100000000"/> 
      <a href={"https://dap.ceda.ac.uk/badc/ARCHIVE_INFO/archive_vol_plot.png"}>
        <img src={"https://dap.ceda.ac.uk/badc/ARCHIVE_INFO/archive_vol_plot.png"} width="240"/> </a>
    </div>
  );
}

  //---------------------
  function Arrivals(props) {
    return (
      <div className="group">
         <h4>Arrivals</h4>
         <LightUp name="arrivals.ceda.ac.uk" groupname="uptimerobot"  keyname="arrivals" 
           link="https://arrivals.ceda.ac.uk" icon="desktop"/>
        <LightUp icon="upload" name="ftp" groupname="uptimerobot"  keyname="arrivals-ftp" x={100}/>
        <LightUp icon="upload" name="rsync" groupname="uptimerobot"  keyname="arrivals-rsync" x={100} y={30}/>
        <LightEquals icon="eraser" name="deleter" groupname="checks"  keyname="arrivals_deleter_ok" x={100} y={60} alert="false"/>
        <LightAbove icon="hdd" name="processing3" groupname="checks"  keyname="/datacentre/processing3" x={100} y={90}
             alert="90" warn="50" show_value="percent" warn_msg="Tell people to clear up."/>
        <LightAbove icon="hdd" name="arrivals" groupname="checks"  keyname="/datacentre/arrivals" x={100} y={120}
             alert="90" warn="50" show_value="percent" warn_msg="Tell people to clear up."/>           
      </div>
    );
  }

  //---------------------
  function Storage(props) {
    return (
      <div className="group">
        <h4>Storage</h4>
        <LightUp name="cedaarchiveapp.ceda.ac.uk" groupname="uptimerobot"  keyname="Internal: cedaarchiveapp" 
           link="https://cedaarchiveapp.ceda.ac.uk" icon="desktop"/>
        <LightAbove icon="hdd" name="archive" groupname="checks"  keyname="archive" x="100" y={10}
             alert="95" warn="90" show_value="on"/>
        <LightAbove icon="hdd" name="opshome" groupname="checks"  keyname="/datacentre/opshome" x="100" y={40}
             alert="95" warn="90" show_value="percent"/>             
        <LightAbove icon="hdd" name="home" groupname="checks"  keyname="/home/badc" x="100" y={70}
             alert="90" warn="50" show_value="percent"/>
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
    return (
      <div className="group">
        <h4><a href="https://archdash.ceda.ac.uk/static/ingest_web_monitor/index.html?namefilter=&reclen=2&running=on&warn=on&fail=on&killed=on&died=on">Ingest control</a></h4>
        
        <LightBelow name="Crontab populated" groupname="checks" keyname="crontab_lines" 
   warn="100" alert="30"/>  
   <LightEquals name="Deposit test" groupname="checks" keyname="deposit_client_ok" alert="false"/>  
   <LightAbove name="fail" groupname="ingest" keyname="fail" show_value="on" warn="5" alert="10" />  
   <LightAbove name="warn" groupname="ingest" keyname="warn" show_value="on" warn="10" alert="30"/>  
   <LightAbove name="died" groupname="ingest" keyname="died" show_value="on" warn="1" alert="20"/>  
   <LightAbove name="killed" groupname="ingest" keyname="killed" show_value="on" warn="5" alert="10"/>  
   <LightAbove name="running" groupname="ingest" keyname="running" show_value="on" warn="25" alert="50"/>  
   <LightBelow name="ok" groupname="ingest" keyname="ok" show_value="on" warn="25" alert="50"/>
   <LightAbove name="ok-errors" groupname="ingest" keyname="ok-errors" show_value="on" warn="10" alert="50"/>
      </div>
    );
}


//---------
  function App() {
    return (
      <div>


<div className={"ggroup"}> <h3>Ingest pipeline</h3> <Arrivals/> <Ingest/> <Deposit/></div>
<div className={"ggroup"}> <h3>Info stores</h3> <Storage/> <FBI/></div>
<div className={"ggroup"}> <h3>Distribution</h3> <Catalogue/> <Access/></div>

      </div>
    );
  }
  
console.log("start react app ...")
    ReactDOM.render(<App />, document.getElementById('root'));



  