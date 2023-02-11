import * as React from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { Command } from '@tauri-apps/api/shell';
import { listen, TauriEvent } from '@tauri-apps/api/event';
import { GlobalContext } from './context';
import { Header } from './components/Header/Header';
import { IConfig, IWikiConfig } from './models/IConfig';
import { serve_wiki } from './service';

const config: IConfig = await invoke('get_config');
const lastLoadedPath = localStorage.getItem('lastPath') || '';

function App() {
    const [loadedUrl, setLoadedUrl] = React.useState<string>();
    const [loadedWiki, setLoadedWiki] = React.useState<IWikiConfig>();
    const [context, setContext] = React.useState({ config });
    const fullContext = React.useMemo(
        () => ({
            ...context,
            setContext,
        }),
        [context]
    );
    const handleSelectionChange = React.useCallback(
        async (wiki: IWikiConfig) => {
            const url = await serve_wiki(wiki);
            setLoadedUrl(url);
            setLoadedWiki(wiki);
            localStorage.setItem('lastPath', wiki.path);
        },
        []
    );

    React.useEffect(() => {
        // serve the first wiki by default
        // if (config.wikis.length > 0) {
        //     let first = config.wikis[0];
        //     if (lastLoadedPath) {
        //         first =
        //             config.wikis.find((w) => w.path === lastLoadedPath) ||
        //             first;
        //     }
        //     serve_wiki(first).then((url) => {
        //         setLoadedUrl(url);
        //         setLoadedWiki(first);
        //         localStorage.setItem('lastPath', first.path);
        //     });
        // }
    }, []);

    return (
        <GlobalContext.Provider value={fullContext}>
            <div className="container">
                <Header onSelectionChange={handleSelectionChange} />
                {
                <iframe
                    name={(new Date()).toISOString()}
                    key={`${loadedWiki?.path}|${loadedUrl}`}
                    id="frame"
                    src={loadedUrl + `?${new Date().getTime()}`}
                    style={{ height: 1000 }}
                />
                }
            </div>
        </GlobalContext.Provider>
    );
}

export default App;
