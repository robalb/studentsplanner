
// https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors

const linearBlend=(p,c0,c1)=>{
  var i=parseInt,r=Math.round,P=1-p,[a,b,c,d]=c0.split(","),[e,f,g,h]=c1.split(","),x=d||h,j=x?","+(!d?h:!h?d:r((parseFloat(d)*P+parseFloat(h)*p)*1000)/1000+")"):")";
  return"rgb"+(x?"a(":"(")+r(i(a[3]=="a"?a.slice(5):a.slice(4))*P+i(e[3]=="a"?e.slice(5):e.slice(4))*p)+","+r(i(b)*P+i(f)*p)+","+r(i(c)*P+i(g)*p)+d;
}

const linearShade=(p,c)=>{
  var i=parseInt,r=Math.round,[a,b,c,d]=c.split(","),P=p<0,t=P?0:255*p,P=P?1+p:1-p;
  return"rgb"+(d?"a(":"(")+r(i(a[3]=="a"?a.slice(5):a.slice(4))*P+t)+","+r(i(b)*P+t)+","+r(i(c)*P+t)+(d?","+d:")");
}

const logBlend=(p,c0,c1)=>{
  var i=parseInt,r=Math.round,P=1-p,[a,b,c,d]=c0.split(","),[e,f,g,h]=c1.split(","),x=d||h,j=x?","+(!d?h:!h?d:r((parseFloat(d)*P+parseFloat(h)*p)*1000)/1000+")"):")";
  return"rgb"+(x?"a(":"(")+r((P*i(a[3]=="a"?a.slice(5):a.slice(4))**2+p*i(e[3]=="a"?e.slice(5):e.slice(4))**2)**0.5)+","+r((P*i(b)**2+p*i(f)**2)**0.5)+","+r((P*i(c)**2+p*i(g)**2)**0.5)+d;
}

const logShade=(p,c)=>{
  var i=parseInt,r=Math.round,[a,b,c,d]=c.split(","),P=p<0,t=P?0:p*255**2,P=P?1+p:1-p;
  return"rgb"+(d?"a(":"(")+r((P*i(a[3]=="a"?a.slice(5):a.slice(4))**2+t)**0.5)+","+r((P*i(b)**2+t)**0.5)+","+r((P*i(c)**2+t)**0.5)+(d?","+d:")");
}

const RGB = {
  linearBlend,
  linearShade,
  logBlend,
  logShade
}

const colorsList = [
  // http://www.flatcolorsui.com/
  // https://materialuicolors.co/
  'rgb(209, 204, 192)',
  'rgb(51, 217, 178)',
  'rgb(52, 172, 224)',
  'rgb(112, 111, 211)',
  'rgb(255, 82, 82)',
  'rgb(255, 121, 63)',
  'rgb(255, 177, 66)',
  'rgb(255, 215, 0)'
]

export default {RGB, colorsList}

