import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';

const timeout = function(s) {
    return new Promise(function(_, reject) {
        setTimeout(function() {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};

export const AJAX = async function(url, payload = undefined) {
    try {
        const fetchRequest = payload ?
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            }) :
            fetch(url);
        const response = await Promise.race([fetchRequest, timeout(TIMEOUT_SEC)]);
        const data = await response.json();
        if (!response.ok) throw new Error(`${data.message} ${response.status}`);
        return data;
    } catch (err) {
        throw err;
    }
};

// export const getJSON = async function(url) {
//     try {
//         const response = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
//         const data = await response.json();
//         if (!response.ok) throw new Error(`${data.message} ${response.status}`);
//         return data;
//     } catch (err) {
//         throw err;
//     }
// };

// export const sendJSON = async function(url, payload) {
//     try {
//         const response = await Promise.race([
//             fetch(url, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(payload),
//             }),
//             timeout(TIMEOUT_SEC),
//         ]);
//         const data = await response.json();
//         if (!response.ok) throw new Error(`${data.message} ${response.status}`);
//         return data;
//     } catch (err) {
//         throw err;
//     }
// };