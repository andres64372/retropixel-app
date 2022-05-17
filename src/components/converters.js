export function rgbtohsl(red,green,blue){
    const r = red/255;
    const g = green/255;
    const b = blue/255;

    const cmax = Math.max(r,g,b)
    const cmin = Math.min(r,g,b)

    const delta = cmax - cmin;

    const l = (cmax+cmin)/2;
    let s;
    if(l !== 1){
        s = delta/(1-Math.abs(2*l-1))
    }else{
        s = 0;
    }
    let h = 0;

    if(delta === 0) {
        h = 0
    }
    else if(cmax === r){
        h = 60*(((g-b)/delta)%6);
    }
    else if(cmax === g){
        h = 60*((b-r)/delta+2);
    }
    else if(cmax === b){
        h = 60*((r-g)/delta+4)
    }
    return [h,100*s,100*l]
}

export function huetorgb(hue,wh){
  let r,g,b;
  const lum = 50;
  const sat = 100;
  const c = sat/100*(1-Math.abs(2*lum/100-1));
  const x = c*(1-Math.abs((hue/60)%2 - 1));
  switch (true) {
    case hue < 60:
      r = 1; g = x; b = 0;
      break;
    case hue < 120:
      r = x; g = 1; b = 0;
      break;
    case hue < 180:
      r = 0; g = 1; b = x;
      break;
    case hue < 240:
      r = 0; g = x; b = 1;
      break; 
    case hue < 300:
      r = x; g = 0; b = 1;
      break;
    case hue < 360:
      r = 1; g = 0; b = x;
      break;
    default:
      r = 0; g = 0; b = 0;
      break
  }
  r = 255*(r+wh/100*(1-r));
  g = 255*(g+wh/100*(1-g));
  b = 255*(b+wh/100*(1-b));
  r = saturation(r);
  g = saturation(g);
  b = saturation(b);
  return [r,g,b];
}

function saturation(x){
  if(x<=0){
    x=0
  }
  if(x>=255){
    x=255;
  }
  return x
}

export function init_color(data){
    const int = parseInt(data).toString(16).padStart(6,'0');
    const rgb = [parseInt(int.substring(0,2),16),parseInt(int.substring(2,4),16),parseInt(int.substring(4,6),16)]
    const hsl = rgbtohsl(rgb[0],rgb[1],rgb[2]);
    return hsl
}

export function init_white(data){
    const int = parseInt(data).toString(16).padStart(6,'0');
    const rgb = [parseInt(int.substring(0,2),16),parseInt(int.substring(2,4),16),parseInt(int.substring(4,6),16)]
    let white;
    if(Math.min(rgb[0],rgb[1],rgb[2]) === Math.max(rgb[0],rgb[1],rgb[2])){
        white=100;
    }else{
        white = parseInt(Math.min(rgb[0],rgb[1],rgb[2])*100/255);
    }
    return white
}