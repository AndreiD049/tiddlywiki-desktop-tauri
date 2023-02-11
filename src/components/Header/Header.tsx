import * as React from 'react';
import { GlobalContext } from '../../context';
import { FaPlusSquare } from 'react-icons/fa';
import './Header.css';
import { IWikiConfig } from '../../models/IConfig';
import { dialog, invoke } from '@tauri-apps/api';
import { HTML_EXTS } from '../../constants';
import { getConfig } from '../../service';

interface IHeaderProps {
    onSelectionChange: (wiki: IWikiConfig) => void;
}

const lastLoadedPath = localStorage.getItem('lastPath') || '';

export const Header: React.FC<IHeaderProps> = (props) => {
    const { config, setContext } = React.useContext(GlobalContext);

    const handleAddWiki = React.useCallback(async () => {
        const file = await dialog.open({
            title: 'Select the wiki folder/.html file',
            filters: [
                {
                    name: 'All',
                    extensions: ['html', 'aspx', 'info']
                },
            ],
        })
        if (typeof file === 'string') {
            const ext = file.split('.').slice(-1)[0];
            try {
                let wikiType = 'node';
                if (HTML_EXTS.includes(ext)) {
                    wikiType = 'html';
                }  
                await invoke('add_wiki', {
                    path: file,
                    wikiType,
                });
                const config = await getConfig();
                if (setContext) {
                    setContext((prev) => ({
                        ...prev,
                        config,
                    }));
                }
            } catch (err) {
                alert(err);
            }
        }
    }, [setContext]);

    const handleSelectWiki = React.useCallback((ev: React.ChangeEvent<HTMLSelectElement>) => {
        const target = ev.target;
        const value = target.value;
        const selectedWiki = config.wikis.find((w) => w.path === value);
        if (selectedWiki) {
            props.onSelectionChange(selectedWiki);
        }
    }, [config])

    return <div className="header">
        <div className='headerMenuLeft'>
            <div className='headerWikiSelect'>
            <label htmlFor='wikiSelect'>Selected Wiki</label>
            <select defaultValue={lastLoadedPath} id="wikiSelect" onChange={handleSelectWiki}>
                {
                    config.wikis.map((wiki) => (<option key={wiki.path}>{wiki.path}</option>))
                }
            </select>
            </div>
            <button className='headerButton' onClick={handleAddWiki}><FaPlusSquare /> Add</button>
        </div>
    </div>;
};
