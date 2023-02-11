import { existsSync } from 'fs';
import { join } from 'path';

/**
 * Check if wiki exists
 * @param {string} path
 * @returns {boolean}
 */
export function wikiExists(path) {
    return existsSync(join(path, 'tiddlywiki.info'));
}
