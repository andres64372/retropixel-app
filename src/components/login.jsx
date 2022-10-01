import React from 'react';
import {useState} from 'react';
import {useNavigate} from "react-router-dom"
import Cookies from 'universal-cookie';
import config from '../components/settings.json'
import logo from '../logo.png'

const cookies = new Cookies();
const host = config.SERVER_URL; 

function Login(){
    const history = useNavigate();
    const [Disabled,SetDisabled] = useState(true)
    const [Invalid,SetInvalid] = useState(false)
    const [Loading,SetLoading] = useState(false)
    const [Cred,SetCred] = useState({
        userid:'',password:''
    })

    function change(e){
        const newCred = {...Cred,[e.target.name]:e.target.value};
        if(newCred.userid === '' || newCred.password === ''){
            SetDisabled(true)
        }else{
            SetDisabled(false)
        }
        SetCred(newCred)
    }

    function submit(e){
      SetLoading(true)
      e.preventDefault();
      fetch(`${host}/login`,{
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(Cred)
      })
      .then(response => response.json())
      .then(data => {
          if(data.status){
              cookies.set('token',data.token)
              cookies.set('refresh',data.refresh,{maxAge:3600*24*365*100})
              history('/index');
          }else{
              SetInvalid(true);
          }
          SetLoading(false)
      })
    }
    return(
    <div className="container">
        <div className="row justify-content-center" style={{textAlign: 'center'}}>
          <img alt="" src={logo} className="rounded-circle my-5" style={{width: '200px'}} />
        </div>
        <div className="row d-flex justify-content-center mt-5">
          {Loading
          ?
          <div className="spinner-grow text-info" role="status">
            <span className="sr-only"></span>
          </div>
          :
          null
          }
        </div>
        <div className="row justify-content-center my-5">
          <form onSubmit={submit}>
            <div className="row">
              <div className="mb-3 col-12 col-md-6">
                <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
                <input name="userid" type="text" className="form-control rounded-pill col-12" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={change}/>
              </div>
              <div className="mb-3 col-12 col-md-6">
                <label htmlFor="exampleInputPassword1" className="form-label">Contraseña</label>
                <input name="password" type="password" className="form-control rounded-pill col-12" id="exampleInputPassword1" onChange={change}/>
              </div>
            </div>
            <div className="justify-content-right" style={{textAlign: 'right'}}>
              <button type="submit" className="btn btn-info rounded-pill" disabled={Disabled}>Ingresar</button>
            </div>
            <p style={{color: 'red'}} hidden={!Invalid}>Datos erroneos</p>
          </form>
          <div className="row align-items-center my-5"> 
            <div className="alert alert-info" role="alert">
              Al ingresar autorizas el uso de cookies
            </div>
          </div>
          <div>
            <p>Aun no tienes cuenta? <a href="/register">Registrate</a></p>
          </div>
        </div>
    </div>
    );
}

export default Login