import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import Button from 'react-bootstrap/Button';

function AcquireMap(props) {
  function getMap() {
    console.log('get map');
    axios.get('/api/map')
      .then(function (response) {
        // just create a global object for now, save in state later
        window.goal = response.data.goal;
      });
  }
  return <Button onClick={getMap}>Acquire Megaverse Map</Button>;
}

function ParseMap(props) {
  function extractCoordinates() {
    let coords = [];
    window.goal.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (col === 'POLYANET') {
          coords.push([rowIndex, colIndex]);
        }
      })
    });

    window.coords = coords;
  }

  return <Button onClick={extractCoordinates}>Extract Coordinates / Phase 1</Button>;
}

function CreateMegaverse(props) {
  function createPolyanets() {
    window.coords.forEach(coord => {
      axios.post('/api/create-polyanet', {candidateId: 'd5bae61f-59d3-40ca-98ef-5667082a3710', row: coord[0], column: coord[1]})
      .then(function (response) {
        console.log('created polyanet at coords: ', coord);
      });
    });

  }
  return <Button onClick={createPolyanets}>Add Polyanets</Button>;
}

function ParseMapPhase2(props) {
  function extractCoordinates() {
    let coords = {
      POLY: [],
      SOL: [],
      ETH: []
    }
    var text;
    window.goal.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (col === 'POLYANET') {
          coords.POLY.push([rowIndex, colIndex]);
        }
        else if (col.indexOf('SOLOON') !== -1) {
          text = col.split("_");
          coords.SOL.push([rowIndex, colIndex, text[0].toLowerCase()]);
        }
        else if (col.indexOf('COMETH') !== -1) {
          text = col.split("_");
          coords.ETH.push([rowIndex, colIndex, text[0].toLowerCase()]);
        }
      })
    });

    window.coords = coords;
  }

  return <Button onClick={extractCoordinates}>Extract Coordinates / Phase 2</Button>;
}

/* create object utility functions
   initially, I simply made all the api calls in a foreach loop, however with the second challenge 
   the number of API calls seemed to overwhelm the endpoint, resulting in random ? question marks
   I switched to this recursive approach that only makes the next call after the promise completes
   to fix that issue.
*/
window.polyIndex = 0;
function createPoly() {
  axios.post('/api/create-polyanet', {
    candidateId: 'd5bae61f-59d3-40ca-98ef-5667082a3710', 
    row: window.coords.POLY[window.polyIndex][0], 
    column: window.coords.POLY[window.polyIndex][1]
  })
  .then(function (response) {
    if (window.coords.POLY.length > (++window.polyIndex)) {
      console.log('recursively creating planets');
      createPoly();
    }
  });
}

window.solIndex = 0;
function createSol() {
  axios.post('/api/create-soloon', {
    candidateId: 'd5bae61f-59d3-40ca-98ef-5667082a3710', 
    row: window.coords.SOL[window.solIndex][0], 
    column: window.coords.SOL[window.solIndex][1],
    color: window.coords.SOL[window.solIndex][2],
  })
  .then(function (response) {
    //console.log('created SOLanet at coords: ', coord);
    if (window.coords.SOL.length > (++window.solIndex)) {
      console.log('recursively creating soloon');
      createSol();
    }
  });
}

window.ethIndex = 0;
function createEth() {
  axios.post('/api/create-cometh', {
    candidateId: 'd5bae61f-59d3-40ca-98ef-5667082a3710', 
    row: window.coords.ETH[window.ethIndex][0], 
    column: window.coords.ETH[window.ethIndex][1],
    direction: window.coords.ETH[window.ethIndex][2],
  })
  .then(function (response) {
    //console.log('created SOLanet at coords: ', coord);
    if (window.coords.ETH.length > (++window.ethIndex)) {
      console.log('recursively creating cometh');
      createEth();
    }
  });
}

function CreateMegaversePhase2(props) {
  function createCrossmintVerse() {
    // use recursive function instead of forEach loop
    createPoly();
    createSol();
    createEth();

    //POLYANETS
    // window.coords.POLY.forEach(coord => {
    //   axios.post('/api/create-polyanet', {candidateId: 'd5bae61f-59d3-40ca-98ef-5667082a3710', row: coord[0], column: coord[1]})
    //   .then(function (response) {
    //     console.log('created polyanet at coords: ', coord);
    //     //console.log(response.data);
    //   });
    // });
    //SOLOONS
    // window.coords.SOL.forEach(coord => {
    //   axios.post('/api/create-soloon', {candidateId: 'd5bae61f-59d3-40ca-98ef-5667082a3710', row: coord[0], column: coord[1], color: coord[2]})
    //   .then(function (response) {
    //     console.log('created soloon at coords: ', coord);
    //     //console.log(response.data);
    //   });
    // });
    // //COMETHS
    // window.coords.ETH.forEach(coord => {
    //   axios.post('/api/create-cometh', {candidateId: 'd5bae61f-59d3-40ca-98ef-5667082a3710', row: coord[0], column: coord[1], direction: coord[2]})
    //   .then(function (response) {
    //     console.log('created cometh at coords: ', coord);
    //     //console.log(response.data);
    //   });
    // });
  }
  return <Button onClick={createCrossmintVerse}>Create Crossmint Megaverse</Button>;
}

function App() {
  return (
    <div className="App" >
      <div className="content">
      <div className="d-grid gap-2">
      <AcquireMap/>
      <h3>Phase 1</h3>
      <ParseMap/>
      <CreateMegaverse />
      <h3>Phase 2</h3>
      <ParseMapPhase2/>
      <CreateMegaversePhase2 />
      </div>
      </div>
    </div>
  );
}

export default App;
