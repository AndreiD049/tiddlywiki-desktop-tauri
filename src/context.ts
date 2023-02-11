import React from "react";
import { IConfig } from "./models/IConfig";

export interface IGlobalContext {
    config: IConfig;
    setContext?: React.Dispatch<React.SetStateAction<IGlobalContext>>;
}

export const GlobalContext = React.createContext<IGlobalContext>({
    config: {
        path_to_file: '',
        wikis: []
    }
});