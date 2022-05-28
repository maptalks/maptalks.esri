const serviceQueue = [];

/**
 * push service to queue
 * @param {*} service 
 */
export function pushService(service) {
    if (hasService(service)) {
        _deleteService(service);
    }
    serviceQueue.push(service);
}

export function hasService(service, queryId) {
    return serviceQueue.filter(s => {
        const c1 = s.id === service.id, c2 = s.queryId === queryId;
        if (queryId) {
            return c1 && c2;
        }
        return c1;
    }).length > 0;
}

/**
 * out service from queue
 * @param {*} service 
 */
export function outService(service) {
    _deleteService(service);
}


function _deleteService(service) {
    for (let i = serviceQueue.length - 1; i >= 0; i--) {
        const s = serviceQueue[i];
        if (!s) {
            continue;
        }
        if (s.id === service.id) {
            serviceQueue.splice(i, 1);
        }
    }
}
