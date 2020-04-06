import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Imagelinkform from './components/Imagelinkform/Imagelinkform';
import Rank from './components/Rank/Rank';
import Facerecognition from './components/Facerecognition/Facerecognition';
import './App.css';
 

const app = new Clarifai.App({
 apiKey: '8277da7b86cd45d2b4daa156298931ae'
});
 
const particlesOptions = {
  particles: {
    number: {
      value: 150,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialstate = {
   input:'',
      imageurl: '',
      box : {},
      route: 'signin',
      isSignedIn: false,
      user : {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: new Date()

      }
}

class App extends Component {
  constructor(){
    super();
    this.state = initialstate;
    
  }

loadUser = (data) => {
  this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
  }})
}

  calculateFaceLocation = (data) =>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) =>{
    this.setState({box : box});
  }

  onInputChange = (event) => {
    this.setState({input:event.target.value});
  }

 onButtonSubmit = () => {
  this.setState({imageurl: this.state.input})
  app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
      .then(response => {
        if(response) {
          fetch('http://localhost:3000/image',{
            method:'put',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({
            id: this.state.user.id
          })
        })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user,{entries: count}))
          })
          
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  
 }

 onRouteChange = (route) => {
  if(route === 'signout'){
    this.setState(initialstate)
  }else if(route === 'home') {
    this.setState({isSignedIn:true})
  }  
  this.setState({route: route})
 }

  render() {
    return (
      <div className="App">
        <Particles className='particles'
         params={particlesOptions} 
        />
        <Navigation isSignedIn= {this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        { this.state.route === 'home' 
        ?<div> 
        <Logo />
        <Rank name={this.state.user.name} entries={this.state.user.entries}/>
        <Imagelinkform 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit}
          />
          <Facerecognition box={this.state.box} imageurl = {this.state.imageurl}/>
      </div> 
      :(
        this.state.route === 'signin' 
        ? <Signin loadUser={this.loadUser} onRouteChange = {this.onRouteChange}/>
        : <Register loadUser={this.loadUser} onRouteChange = {this.onRouteChange}/>
        )

        
      }

      </div>
    );
  }
}

export default App;
