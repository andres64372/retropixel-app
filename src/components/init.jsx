import React from 'react';
import {useState,useEffect} from 'react';
import {useNavigate} from "react-router-dom"
import Cookies from 'universal-cookie';
import config from '../components/settings.json'
import offline from '../offline.png'

const cookies = new Cookies();
const host = config.SERVER_URL; 

function Init(){
    const history = useNavigate();
    const [Offline,SetOffline] = useState(false)

    useEffect(() => {
        if(cookies.get('refresh')){
            const token = cookies.get('refresh');
            fetch(`${host}/refresh`,{
              method:'POST',
              body: JSON.stringify({token: token})
            })
            .then(response => response.json())
            .then(data => {
                cookies.set('token',data.token)
                history('/index');
            })
            .catch(_ => {
              SetOffline(true)
            })
        }else{
          history('/login');
        }
    },[history])

    return(
    <div className="container">
        {Offline ?
        <div style={{alignSelf: 'flex-center'}} className="container d-flex justify-content-center">
            <img style={{width:"50%", height:"50%"}} alt="" src={offline}></img>
        </div>
        :
        <div style={{alignSelf: 'flex-center'}} className="container d-flex justify-content-center">
              
        </div>
        }
    </div>
    );
}

export default Init