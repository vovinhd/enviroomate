
import * as _ from "lodash";

function component() {
    let el = document.createElement('div');
    el.innerHTML = _.join(['Hello', 'webpack'], ' ');
    return el;
}

document.body.appendChild(component());

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log("SW registered: ", registration);
        }).catch(registrationError => {
            console.log("SW Registration failed! ", registrationError);
        });
    });
}