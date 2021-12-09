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
            top: this.props.y, 
            left: this.props.x,
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
            top: this.props.y, 
            left: this.props.x,
            position: "absolute",
            padding: "5px",
            fontFamily: "Arial"
          };
      return (
        <div style={mystyle}>
            <a href={this.props.link}>
          <h3>{this.props.name}</h3></a>
          <svg height="50px" width="100px">
              <ellipse cx="50" cy="100" rx="220" ry="30" style={mystyle} /></svg>
        </div>
      );
    }
  }



  function App() {
    return (
      <div>
        <Upmon name="dap.ceda.ac.uk" img="images/dap_s.png" link="https://dap.ceda.ac.uk" 
          x="400px" y="650px"/>
        <Upmon name="catalogue.ceda.ac.uk" img="images/cat_s.png" x="200px" y="650px"/>
        <Upmon name="arrivals" img="images/arrivals_s.png" x="100px" y="100" link="https://arrivals.ceda.ac.uk"/>
        <Upmon name="data.ceda.ac.uk" img="images/data_s.png" y="650px" x="0px"/>
        <Upmon name="ftp.ceda.ac.uk" x="600px" y="650px"/>
        <Upmon name="FBI" y="500px" x="0px"/>
        <Upmon name="Haystack"  y="500px" x="200px"/>
        <Upmon name="archive.ceda.ac.uk" img="images/archive_s.png" y="650px" x="800px"/>
       <Disk name="/datacentre/arrivals" x="100px" y="200px" alert="90" warn="20"/>
      </div>
    );
  }
  

  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );


  