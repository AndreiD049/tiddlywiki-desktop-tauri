import { TiddlyWiki } from 'tiddlywiki';

export function getTiddlyWiki() {
    const $tw = TiddlyWiki();
    $tw.utils.error = (err) => {
        throw {
            error: err,
        };
    };
    return $tw;
}
