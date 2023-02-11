import { invoke } from "@tauri-apps/api";
import { IConfig, IWikiConfig } from "./models/IConfig";

export async function getConfig(): Promise<IConfig> {
    return invoke('get_config');
}

export async function serve_wiki(wiki: IWikiConfig): Promise<string> {
    return invoke('serve_wiki', {
        path: wiki.path,
        wikiType: wiki.wiki_type
    });
}