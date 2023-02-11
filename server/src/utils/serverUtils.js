import { getPermaView } from './convertListener.js';

export async function getServerConnections(server) {
    return new Promise((resolve, reject) => {
        server.getConnections((err, count) => {
            if (err) {
                reject(err);
            }
            resolve(count);
        });
    });
}

/**
 * @param {import('http').Server[]} servers
 */
export async function tryCloseServer(listener) {
    const server = listener.server;
    if (!server) return;
    const connections = await getServerConnections(server);
    if (connections === 0) {
        return new Promise((resolve, reject) => {
            listener.url = getPermaView(listener);
            console.log(`Set permaview of ${listener.path} to ${listener.url}`)
            server.close((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                console.log(`Closed ${listener.path}`);
                resolve();
                listener.url = getPermaView(listener);
                listener.server = null;
                listener.tw = null;
            });
        });
    }
}