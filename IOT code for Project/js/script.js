

const temperatureElement = document.getElementById('temperature');
const spo2Element = document.getElementById('spo2');
const HeartrateElement = document.getElementById('heartrate');
const change=document.getElementById("changeText");

const ws = new WebSocket('ws://localhost:3000'); // Connect to your WebSocket server

let flag = 0; // Initialize the flag variable outside of the event handler
let count = 0;
ws.onmessage = (event) => {
    // Assuming you receive the JSON data from the server as 'jsonData'
    const jsonData = JSON.parse(event.data);
    const result = jsonData.result;
    const currentData = jsonData.data;
    temperatureElement.textContent = currentData.temperature +" "+String.fromCharCode(8451)+"-" ;
    spo2Element.textContent=currentData.SpO2+"%";
    HeartrateElement.textContent = currentData.pulse;
    if(result){
        change.textContent=result;
        flag=1;
        count++;
        const infobipSettings = {
            url: "https://l32xg2.api.infobip.com/sms/2/text/advanced",
            method: "POST",
            headers: {
                "Authorization": "3c911094719a985531a5c96fbcb4f0c8-d2d1c93d-3c9e-4f12-9337-963d2f2f2cf6",
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            data: JSON.stringify({
                "messages": [
                    {
                        "destinations": [
                            {
                                "to": "+916383142169" // Replace with the recipient's phone number
                            }
                        ],
                        "from": "InfoSMS",
                        "text": "Seizure detected! Please check on the patient." // Customize the SMS message
                    }
                ]
            }),
        };

        $.ajax(infobipSettings)
            .done(function (response) {
                console.log("Infobip API response: " + response);
            })
            .fail(function (error) {
                console.error("Infobip API error: " + JSON.stringify(error));
            });
    }
    else if(flag==1) {
        change.textContent="Last seizure duration : "+(count*3)+" seconds";
    }
    else{
        change.textContent="";
    }

};

// Note: You don't need the previous fetch code for reading JSON data here

