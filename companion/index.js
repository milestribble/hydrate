import  {peerSocket, messaging} from "messaging";
import { settingsStorage } from "settings";

console.log("Companion Started");
let accessToken
getAccessToken(settingsStorage.getItem("user"))

function addWater(accessToken, evt) {
  console.log(`accessToken: ${accessToken}`)
  let date = new Date()
  let year = date.getFullYear().toString()
  let month = date.getMonth()+1>10?date.getMonth()+1:'0'+(date.getMonth()+1).toString()
  let day = date.getDate()>9?date.getDate():'0'+(date.getDate()).toString()
  
  fetch(`https://api.fitbit.com/1/user/-/foods/log/water.json?amount=${evt.data.oz}&date=${year}-${month}-${day}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Accept-Language": "en_US"
    }
  })
  .then((res) => {
      return res.json()
    })
  .then((res) => {
    let status
    console.log(JSON.stringify(res))
    if(res.errors){
      res.errors.forEach(error => {
        if (error.errorType) {
          status = {status: error.errorType}
        }
      })
    }

    if (res.waterLog) {
      console.log("Water log saved to account")
      status = {status: "success"} 
    }
    
    if ((res.errors || res.waterLog) && peerSocket.readyState === peerSocket.OPEN) {
      peerSocket.send(status);
    }
  })
  .catch(err => console.log(`error: ${err}`))
}

settingsStorage.onchange = evt => {
  console.log("settings change: ", evt.key)
  if (evt.key === "user") {
    getAccessToken(settingsStorage.getItem("user"))
  } 
  if (evt.key === 'volume') {
    if (peerSocket.readyState === peerSocket.OPEN) {
      let data = JSON.parse(evt.newValue)
      peerSocket.send({"volume": data.name});
    }
  }
}

function restoreSettings() {
  for (let index = 0; index < settingsStorage.length; index++) {
    let key = settingsStorage.key(index);
    // console.log(`key: ${key}`)
    
    if (key && key === "oauth") {
      let data = JSON.parse(settingsStorage.getItem(key))
      // console.log("58:", JSON.stringify(data))
      return data.access_token
    }
  }
}

// Message socket opens
peerSocket.onopen = () => {  
  console.log("socket open")
  let volumeData = JSON.parse(settingsStorage.getItem("volume"))
  if (volumeData) {
    peerSocket.send({"volume": parseInt(volumeData.name)})
  }
 
  peerSocket.onmessage = (evt) => {
    console.log("socket message received")
    addWater(accessToken, evt)
  } 
}

function getAccessToken(userId) {
  fetch(`https://fitbit-auth.herokuapp.com/access/${userId}`)
    .then(res => res.text())
    .then(res => {
      accessToken = res
      console.log(`accessToken: ${accessToken}`)
  })
}

