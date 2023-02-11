/**
 * Server global state. Maintains information about currently opened wikis
 * and servers that are currently listening.
 * Listeners maintain TW state, last opened tiddlers urls (so that we can restore
 * last opened tiddlers even if the server was closed)
 */

export class State {
    constructor() {
        this.listeners = [];
        this.maxOpenWikis = 1;
        this.openWikis = [];
    }

    setOpenWiki(filePath) {
        this.openWikis.unshift(filePath);
        const listenersToClose = this.openWikis.slice(this.maxOpenWikis);
        this.openWikis = this.openWikis.slice(0, this.maxOpenWikis);
        // Close servers that we don't show to the users already
        listenersToClose.forEach((listenerPath) => {
            const l = this.getListener(listenerPath);
            if (l) {
                l.closeServer().catch((err) => console.error(err));
            }
        });
    }

    addListener(listener) {
        const path = listener.filePath;
        const alreadyExists = this.listeners.find((l) => l.filePath === path);
        if (alreadyExists) {
            this.listeners = this.listeners.map((l) =>
                l.filePath === path ? listener : l
            );
        } else {
            this.listeners.push(listener);
        }
    }

    getListener(filePath) {
        return this.listeners.find((l) => l.filePath === filePath);
    }
}
