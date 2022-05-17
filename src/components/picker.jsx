import React from 'react';
import {useState,useRef,useEffect} from 'react';
import '../App.css'
import light from '../light.png';
import unreach from '../unreach.png'
import ColorPicker from '@radial-color-picker/react-color-picker';
import '@radial-color-picker/react-color-picker/dist/react-color-picker.min.css';
import Collapse from 'react-bootstrap/Collapse'
import { IoMdColorPalette } from 'react-icons/io';
import '../Picker.css'
import { Switch,Slider } from '@mui/material';
import {huetorgb,rgbtohsl,init_color,init_white} from './converters.js'
import Cookies from 'universal-cookie';

const cookies = new Cookies();

function Picker(props){

    const init = init_color(props.color);
    const [White,setWhite] = useState(init_white(props.color));
    const [open,setOpen] = useState(false);
    const [Hue,SetHue] = useState(parseInt(init[0]));
    const [Lum,SetLum] = useState(parseInt(init[2]));
    const [Sat,SetSat] = useState(parseInt(init[1]));
    const [On,SetOn] = useState(props.check)

    const hue = useRef(parseInt(init[0]));
    const lum = useRef(White);

    useEffect(()=>{
        SetOn(props.check)
    },[props.check])
    
    const checked = (evt) => {
        const topic = `${props.id}/OnOff`;
        const payload = evt.target.checked ? 'true':'false';
        SetOn(evt.target.checked)
        fetch(`${props.host}set?topic=${topic}&payload=${payload}`,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies.get('token')}`
            },
        })
    }

    const changeColor = () => {
        const rgb = huetorgb(hue.current,lum.current)
        const hsl = rgbtohsl(rgb[0],rgb[1],rgb[2])
        SetHue(hsl[0])
        SetLum(hsl[2])
        SetSat(hsl[1])
    }

    const color = () => {
        let rgb = huetorgb(hue.current,lum.current)
        for(let i in rgb) {
            rgb[i] = parseInt(rgb[i])
            if(rgb[i].toString(16).length<2){
                rgb[i]+='0';
            }
        }
        const hex = rgb[0].toString(16) + rgb[1].toString(16) + rgb[2].toString(16)
        const topic = `${props.id}/Color`;
        const payload = parseInt(hex,16);
        fetch(`${props.host}set?topic=${topic}&payload=${payload}`,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies.get('token')}`
            }
        })
    }
    return(
        <div className="container">
            <div className="card rounded-pill p-3 my-4">
                <div className="row">
                    <div className="col-5 col-md-3 col-lg-4">
                        <div style={{boxShadow: On?`0 0 30px hsl(${init[0]},${init[1]}%,${init[2]}%)`:'none',backgroundColor:'white'}} className="bulb"> 
                        <img style={{width:"70%", height:"70%"}} alt="" src={props.online?light:unreach}></img>
                        </div>
                    </div>
                    <div className="col-7 col-md-9 col-lg-8">
                        <Switch color="primary" checked={On} onChange={checked} disabled={!props.online}/>
                        <p>{props.name}</p>
                        <button style={{color:"white",border:"1px solid white",backgroundColor:"transparent"}} onClick={() => setOpen(!open)} className="btn rounded-pill shadow-none"><IoMdColorPalette />Color</button>
                    </div>
                </div>
            </div>
            <Collapse in={open}>
                <div className="row justify-content-center mb-5">
                    <label htmlFor="sat" className="form-label">Saturation</label>
                    <Slider value={White} sx={{color:"white",width:"80%"}} onChange={(evt) => {lum.current=evt.target.value;setWhite(evt.target.value);changeColor()}} onChangeCommitted={color} min={0} max={100} />
                    <div style={{width:'fit-content'}}><ColorPicker step={10} disabled={!props.online} variant="persistent" onInput={(evt) => {hue.current = 10*parseInt(evt/10);changeColor()}} onChange={color} hue={Hue} luminosity={Lum} saturation={Sat}/></div>
                </div>
            </Collapse>
        </div>
    );
}

export default Picker;