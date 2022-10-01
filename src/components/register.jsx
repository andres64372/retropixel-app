import React from 'react';
import {useState} from 'react';
import {useNavigate} from "react-router-dom";
import Cookies from 'universal-cookie';
import config from './settings.json';
import toast from 'react-hot-toast';

const cookies = new Cookies();
const host = config.SERVER_URL; 

function Register(){
    const history = useNavigate();
    const [Disabled,SetDisabled] = useState(true)
    const [Invalid,SetInvalid] = useState(false)
    const [Loading,SetLoading] = useState(false)
    const [Cred,SetCred] = useState({
        name:'',last:'',email:'',password:'',password2:''
    })

    function change(e){
        const newCred = {...Cred,[e.target.name]:e.target.value};
        if(newCred.password.length <= 8 || newCred.name === '' || newCred.last === '' || newCred.email === '' || newCred.password === '' || newCred.password !== newCred.password2){
            SetDisabled(true)
        }else{
            SetDisabled(false)
        }
        SetCred(newCred)
    }

    function submit(e){
      SetLoading(true)
      e.preventDefault();
      fetch(`${host}/register`,{
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(Cred)
      })
      .then(response => response.json())
      .then(data => {
          if(data.status){
              toast.success('Revisa la bandeja principal de tu correo para activar tu cuenta')
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
          <img alt="" src="https://i.ibb.co/yR7KjSK/Logo.png" className="rounded-circle my-5" style={{width: '200px'}} />
        </div>
        <div className="row d-flex justify-content-center mt-5">
          {Loading
          ?
          <div className="spinner-grow" role="status">
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
                <label htmlFor="exampleInputEmail1" className="form-label">Nombres</label>
                <input name="name" type="text" className="form-control rounded-pill" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={change}/>
              </div>
              <div className="mb-3 col-12 col-md-6">
                <label htmlFor="exampleInputEmail1" className="form-label">Apellidos</label>
                <input name="last" type="text" className="form-control rounded-pill" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={change}/>
              </div>
              <div className="mb-3 col-12 col-md-6">
                <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
                <input name="email" type="text" className="form-control rounded-pill" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={change}/>
              </div>
              <div className="mb-3 col-12 col-md-6">
                <label htmlFor="exampleInputPassword1" className="form-label">Contraseña</label>
                <input name="password" type="password" className="form-control rounded-pill" id="exampleInputPassword1" onChange={change}/>
              </div>
              <div className="mb-3 col-12 col-md-6">
                <label htmlFor="exampleInputPassword1" className="form-label">Confirma tu Contraseña</label>
                <input name="password2" type="password" className="form-control rounded-pill" id="exampleInputPassword2" onChange={change}/>
              </div>
            </div>
            <div className="justify-content-right" style={{textAlign: 'right'}}>
              <button type="submit" className="btn btn-primary rounded-pill" disabled={Disabled}>Registrate</button>
            </div>
            <p style={{color: 'red'}} hidden={!Invalid}>Datos erroneos</p>
          </form>
          <div className="row align-items-center my-5"> 
            <div className="alert alert-primary" role="alert">
              En tu contraseña debes incluir al menos 8 caracteres, un caracter numerico y la combinacion de mayusculas y minusculas 
            </div>
          </div>
        </div>
    </div>
    );
}

export default Register