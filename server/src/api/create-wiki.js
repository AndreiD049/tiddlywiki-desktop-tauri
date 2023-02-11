import { getTiddlyWiki } from '../utils/getTiddlywiki.js';

/**
 * Creates a new wiki on path
 * @param {string} path
 */
export async function createWiki(path) {
    return new Promise((resolve, reject) => {
        try {
            const $tw = getTiddlyWiki();
            $tw.boot.argv = [path, '--init', 'server'];
            $tw.boot.boot((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            });
        } catch (err) {
            reject(err);
        }
    });
}
