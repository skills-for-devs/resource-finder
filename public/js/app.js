'use strict';


console.log('loaded');
let newVariable = document.getElementById('loginfailed');
if(newVariable){
  let variable = document.getElementById('loginbox');
  variable.setAttribute('style', 'display: none;');
} else {
  let variable = document.getElementById('signup');
  variable.setAttribute('style', 'display: none;');
}

