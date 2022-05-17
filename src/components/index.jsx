import React from 'react';
import {useEffect,useState} from 'react';
import {useHistory} from "react-router-dom"
import Picker from '../components/picker.jsx';
import socketIOClient from "socket.io-client";
import offline from '../Offline.svg'
import Cookies from 'universal-cookie';
import config from '../components/settings.json'

const cookies = new Cookies();
const host = config.SERVER_URL; 

function Index(){
    const history = useHistory();
    const [Device,SetDevice] = useState([])
    const [Deviceid,SetDeviceid] = useState([])
    const [Offline,SetOffline] = useState(false)

    function logout(){
        cookies.remove('token');
        cookies.remove('refresh');
        history.push('/');
    }

    function manage(payload){
        SetDevice(prev => ({...prev,[payload.id]:{...prev[payload.id],[payload.branch]:payload.state}}))
    }

    useEffect(()=>{
        const client = socketIOClient(host);
        client.on('connect_error', err => {
            SetOffline(true)
        });
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
            SetOffline(false)
            })
            .catch(error => {
                SetOffline(true)
            });
        })
    },[])
    if(Offline){
        return(
            <div style={{alignSelf: 'flex-center'}} className="container d-flex justify-content-center">
                <img style={{width:"50%", height:"50%"}} alt="" src={offline}></img>
            </div>
        )
    }
    return (
    <div style={{alignSelf: 'flex-center'}} className="container mt-3">
        <button className="btn btn-secondary rounded-pill" onClick={logout}>Salir</button>
        { Deviceid.length > 0 
        ? <div className="row">
        {Deviceid.map(device =>(
            <div className="col-12 col-lg-6" key={device}>
                <Picker host={host} id={device} name={Device[device].name} check={Device[device].OnOff} color={Device[device].Color} online={Device[device].Online}/>
            </div>
        ))}
        </div>
        : <div className="row d-flex justify-content-center mt-5">
            <div className="spinner-grow" role="status">
                <span className="sr-only"></span>
            </div>
        </div>
        }
    </div>
    );
}

export default Index;