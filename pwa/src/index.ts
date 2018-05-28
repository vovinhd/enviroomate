
import * as _ from "lodash";
import './styles.scss';
import 'materialize-css/sass/materialize.scss'

function component() {
    let el = document.createElement('div');
    el.innerHTML = _.join(['Hello', 'webpack'], ' ');
    el.classList.add('hello');
    return el;
}

document.body.appendChild(component());

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            registration.pushManager.subscribe({userVisibleOnly: true});
            console.log("SW registered: ", registration);
        }).catch(registrationError => {
            console.log("SW Registration failed! ", registrationError);
        });
    });
}
