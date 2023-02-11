import { TiddlyWiki } from 'tiddlywiki';

function run() {
    // eslint-disable-next-line no-undef
    const argv = process.argv;
    const tw = TiddlyWiki();
    tw.boot.argv = argv.slice(2);
    tw.boot.boot();
}

run();