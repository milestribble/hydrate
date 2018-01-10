import document from "document";
import  {peerSocket} from "messaging";
import * as fs from "fs";
import { vibration } from "haptics";

console.log("Ionic Started");

const btnAddVol = document.getElementById("btn-tr")
const btnMinusVol = document.getElementById("btn-br")
const btnLog = document.getElementById("btn-bl")
const modal = document.getElementById("send-log")
const statusIcon = document.getElementById("status-icon")
const loadingPage = document.getElementById("loadinginstance")
const modalText1 = document.getElementById("modal-text-1")
const modalText2 = document.getElementById("modal-text-2")
let volume = 16
let timeout

const renderVolume = () => {
  document.getElementById("volume").text = `${volume}oz`
}

peerSocket.onopen = () => {
  
  setTimeout(()=>{loadingPage.style.display = 'none'}, 1000)
  renderVolume()
  
  peerSocket.onmessage = (evt) => {
    if(evt.data.volume){
      volume = parseInt(evt.data.volume)
      renderVolume()
    }
    if(evt.data.status === "success"){
      clearTimeout(timeout)
      modalText1.text = "Way to"
      modalText2.text = "hydrate!"
      setTimeout(()=>{statusIcon.href = "images/save-press.png"}, 1500)
      modal.animate("disable")
      setTimeout(()=>{statusIcon.href = "images/loading.png"}, 2500)
    } else if (evt.data.status === "invalid_token" || evt.data.status === "expired_token"){
      clearTimeout(timeout)
      modalText1.text = "Please login"
      modalText2.text = "in app settings"
      setTimeout(() => {modal.animate("disable")}, 2500)
    }
  } 
}

// peerSocket.onerror = (error) => {
//   console.log(`peer socket error ${error}`)
// }

btnAddVol.onactivate = () => {
  vibration.start("bump")
  volume += 1
  renderVolume()
}

btnMinusVol.onactivate = () => {
  vibration.start("bump")
  volume -=1
  renderVolume()
}

btnLog.onactivate = (evt) => {
  modalText1.text = "Way to"
  modalText2.text = "hydrate!"
  vibration.start("bump")
  modal.animate("enable")
  timeout = setTimeout(() => {
    modalText1.text = "Sorry, please"
    modalText2.text = "try again"
    setTimeout(modal.animate("disable"), 2000)
  }, 3000)

  if (peerSocket.readyState === peerSocket.OPEN) {
   let waterMessage = {oz: volume}
   peerSocket.send(waterMessage)
   console.log('socket message sent')
  } else {
    console.log("peerSocket not open")
  }
}
