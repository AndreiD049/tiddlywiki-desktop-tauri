export interface IListener {
    address: {
        host: string;
        port: number;
    };
    filePath: string;
    permaViewUrl: string;
}