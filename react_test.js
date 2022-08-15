'use strict';



class Upmon extends React.Component {
    constructor(props) {
      super(props);
      this.state = {up: null};
    }
  
    componentDidMount() {
      this.timerID = setInterval(
        () => this.tick(),
        1000
      );
    }
  
    componentWillUnmount() {
      clearInterval(this.timerID);
    }
  
    tick() {
      this.setState({
        up: grabstore.uptimerobot[this.props.name]
      });
    }
  
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
  class Disk extends React.Component {
    constructor(props) {
      super(props);
      this.state = {full: null};
    }
  
    componentDidMount() {
      this.timerID = setInterval(
        () => this.tick(),
        1000
      );
    }
  
    componentWillUnmount() {
      clearInterval(this.timerID);
    }
  
    tick() {
      this.setState({
        full: grabstore.checks[this.props.name]
      });
    }
  
    render() {
        var colour;
        if (this.state.full == undefined) {colour="gray"}
        else if (this.state.full > this.props.alert) {colour="red"} 
        else if (this.state.full > this.props.warn) {colour="orange"}
        else {colour = "green"}
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
          {this.props.name}<br/>
          <svg height="40px" width="150px">
              <ellipse cx="75" cy="40" rx="75" ry="20" style={mystyle} /></svg></a>
        </div>
      );
    }
  }


  //-----------------------------------------------------------
  class Light extends React.Component {
    constructor(props) {
      super(props);
      this.state = {value: null};
    }
  
    componentDidMount() {
      this.timerID = setInterval(
        () => this.tick(),
        1000
      );
    }
  
    componentWillUnmount() {
      clearInterval(this.timerID);
    }
  
    tick() {
      var value=undefined 
      console.log(this.props)
      if (this.props.groupname != undefined) {value = grabstore[this.props.groupname][this.props.keyname];}
       else {value = grabstore[this.props.keyname]}   
      this.setState({"value": value});
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
      return (
        <div style={mystyle}>
          <svg height="20px" width="20px"><circle cx="10" cy="13" r={radius} fill={colour} /></svg>
              {this.props.name}
        </div>
      );
    }
  }


//------------------------------------------------------------------
  class DepositState extends React.Component {
    constructor(props) {
      super(props);
      this.state = {rcpq_len: undefined, filerate_2min: -1, volrate_2min: -1,
                    filerate_10min: -1, volrate_10min: -1,
                    filerate_60min: -1, volrate_60min: -1};
    }
  
    componentDidMount() {
      this.timerID = setInterval(
        () => this.tick(),
        1000
      );
    }
  
    componentWillUnmount() {
      clearInterval(this.timerID);
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
            <h2>Deposit Server</h2>
            <table>
              <tr><td>Sample period</td><td>File rate /s</td><td>Volume rate MB/s</td></tr>
              <tr><td>2 Min rate</td><td>{this.state.filerate_2min.toFixed(2)}</td><td>{(this.state.volrate_2min/1e6).toFixed(2)}</td></tr>
              <tr><td>10 Min rate</td><td>{this.state.filerate_10min.toFixed(2)}</td><td>{(this.state.volrate_10min/1e6).toFixed(2)}</td></tr>
              <tr><td>60 Min rate</td><td>{this.state.filerate_60min.toFixed(2)}</td><td>{(this.state.volrate_60min/1e6).toFixed(2)}</td></tr>
          </table>
          <Light name="RPCQ length" groupname="current_deposits"  keyname="rcpq_len" warn="1" alert="100"/>
          </a>
        </div>
      );
    }
  }

  function Catalogue(props) {
    return (
      <div>
        <Light name="Haystack" groupname="uptimerobot"  keyname="Haystack" x={props.x} y={props.y}/>
        <Upmon name="catalogue.ceda.ac.uk" img="images/cat_s.png" x={props.x} y={props.y+100}/>
      </div>
    );
  }

  function App() {
    return (
      <div>

<svg height="1000" width="900">
  <polygon  fill="pink" points="200,10 200,900 400,1000 600,900 600,10 "  />
</svg>

        <Upmon name="dap.ceda.ac.uk" img="images/dap_s.png" link="https://dap.ceda.ac.uk" 
          x="400" y="700"/>
        <Upmon name="ftp.ceda.ac.uk" x="250" y="700"/>

        <Disk name="/datacentre/archive" x="350" y="600" alert="90" warn="20"/>

        <Upmon name="arrivals" img="images/arrivals_s.png" x="250px" y="130px" link="https://arrivals.ceda.ac.uk"/>
        <Disk name="/datacentre/arrivals" x="250" y="280" alert="90" warn="20"/>

        <Upmon name="FBI" x="650" y="670"/>
        <Light name="FBI" groupname="uptimerobot" keyname="FBI" x="700"/>
        <Upmon name="data.ceda.ac.uk" img="images/data_s.png" x="650" y="800"/>
 
        <Catalogue x="700" y="700"/>
 
        <Upmon name="archive.ceda.ac.uk" img="images/archive_s.png" y="650" x="1200"/>
        
        <Disk name="/datacentre/processing3" x="420" y="280" alert="90" warn="20"/>
        <Disk name="/gws" x="420" y="180" alert="90" warn="20"/>

        <DepositState x="250" y="380"/>
        <Light name="ftp" groupname="uptimerobot"  keyname="ftp.ceda.ac.uk"/>
        <Light name="arrivals" groupname="checks"  keyname="/datacentre/arrivals" warn="20" alert="90"/>
        <Light name="processing" groupname="checks"  keyname="/datacentre/processing3" warn="20" alert="90"/>
      </div>
    );
  }
  

  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );


  