import React from 'react';
import {useEffect,useState} from 'react';
import {useNavigate} from "react-router-dom"
import Picker from '../components/picker.jsx';
import socketIOClient from "socket.io-client";

import Cookies from 'universal-cookie';
import config from '../components/settings.json'
import offline from '../offline.png'

const cookies = new Cookies();
const host = config.SERVER_URL; 

function Index(){
    const history = useNavigate();
    const [Device,SetDevice] = useState([])
    const [Deviceid,SetDeviceid] = useState([])
    const [Offline,SetOffline] = useState(false)

    function logout(){
        cookies.remove('token');
        cookies.remove('refresh');
        history('/');
    }

    function manage(payload){
        SetDevice(prev => ({...prev,[payload.id]:{...prev[payload.id],[payload.branch]:payload.state}}))
    }

    useEffect(()=>{
        const client = socketIOClient(host);
        window.addEventListener("offline", () => {
            SetOffline(true);
        });
        window.addEventListener("online", () => {
            SetOffline(false);
        });
        // client.on('connect_error', err => {
        //     SetOffline(true)
        // });
        client.on('connect', ()=>{
            fetch(`${host}devices`,{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.get('token')}`
                },
            })
            .then(res => res.json())
            .then(response => {      
            for(let device of response.list){
                client.on(device,manage)
            }  
            SetDevice(response.states)
            SetDeviceid(response.list)
            // SetOffline(false)
            })
            // .catch(error => {
            //     SetOffline(true)
            // });
        })
    },[])
    if(Offline){
        return(
            <div className="container">
                <div className="row align-items-center" style={{height: '100vh'}}>
                    <div className="col-12 col-md-6 container d-flex justify-content-center">
                        <img style={{width:"90%"}} alt="" src={offline}></img>
                    </div>
                </div>
            </div>
            // <span className="align-middle">
            //     <div className="container d-flex justify-content-center">
            //         <img style={{width:"50%", height:"50%"}} alt="" src={offline}></img>
            //     </div>
            // </span>
        )
    }
    return (
    <div style={{alignSelf: 'flex-center'}} className="container mt-3">
        <button className="btn btn-info rounded-pill" onClick={logout}>Salir</button>
        { Deviceid.length > 0 
        ? <div className="row">
        {Deviceid.map(device =>(
            <div className="col-12 col-lg-6" key={device}>
                <Picker host={host} id={device} name={Device[device].name} check={Device[device].OnOff} color={Device[device].Color} online={Device[device].Online}/>
            </div>
        ))}
        </div>
        : <div className="row d-flex justify-content-center mt-5">
            <div className="spinner-grow text-info" role="status">
                <span className="sr-only"></span>
            </div>
        </div>
        }
    </div>
    );
}

export default Index;