import { getPermaView } from './utils/convertListener.js';
import { getTiddlyWiki } from './utils/getTiddlywiki.js';

export class Listener {
    constructor(filePath, address) {
        this.filePath = filePath;
        this.address = address;
        this.permaViewUrl = '';
        this.$tw = null;
        this.server = null;
    }

    async listen() {
        if (this.server && this.server.listening) return this;
        return new Promise((resolve, reject) => {
            this.$tw = getTiddlyWiki();
            try {
                this.$tw.boot.argv = [
                    this.filePath,
                    '--listen',
                    `host=${this.address.host}`,
                    `port=${this.address.port}`,
                    'root-tiddler=$:/core/save/lazy-all',
                ];
                this.$tw.hooks.addHook(
                    'th-server-command-post-start',
                    (tw, server) => {
                        this.server = server;
                        server.on('error', (err) => reject(err));
                        server.on('listening', () => resolve(this));
                    }
                );
                this.$tw.boot.boot((err) => {
                    if (err) {
                        reject(err);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    async closeServer() {
        if (!this.server) {
            this.$tw = null;
            return;
        }
        return new Promise((resolve, reject) => {
            if (this.server.closeAllConnections) {
                this.server.closeAllConnections();
            }
            this.server.close((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                this.permaViewUrl = getPermaView(this);
                this.$tw = null;
                this.server = null;
                resolve();
            })
        });
    }

    getTiddler(name) {
        if (!this.$tw || !this.$tw.wiki) return null;
        return this.$tw.wiki.getTiddler(name);
    }

    /**
     * Get the payload that is safe to be returned over http
     * without circular JSON errors
     */
    getPayload() {
        return {
            ...this,
            $tw: undefined,
            server: undefined,
        };
    }
}
