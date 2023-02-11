export interface IWikiConfig {
    path: string;
    wiki_type: string;
}

export interface IConfig {
    path_to_file: string;
    wikis: IWikiConfig[];
}