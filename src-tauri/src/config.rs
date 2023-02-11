use std::{
    fs::{create_dir_all, OpenOptions, File},
    io::{ Write, BufReader},
    path::PathBuf,
};

use serde::{Deserialize, Serialize};

use crate::APP_NAME;

const CONFIG_FILE_NAME: &str = "wiki.config.json";

#[derive(Serialize, Deserialize)]
pub struct Config {
    pub path_to_file: PathBuf,
    pub wikis: Vec<WikiConfig>,
}

impl Config {
    pub fn read() -> Config {
        let path = Config::get_config_path();
        let file_result = OpenOptions::new()
            .write(true)
            .read(true)
            .create(true)
            .open(&path).map_err(|err| err.to_string());
        match file_result {
            Ok(file) => {
                let reader = BufReader::new(file);
                serde_json::from_reader::<BufReader<File>, Config>(reader).unwrap_or(Config {
                    path_to_file: path,
                    wikis: vec![],
                })
            },
            Err(_) => {
                Config {
                    path_to_file: path,
                    wikis: vec![],
                }
            }
        }
    }

    pub fn save(&self) -> Result<(), String> {
        let mut file = OpenOptions::new()
            .write(true)
            .truncate(true)
            .open(&self.path_to_file).map_err(|err| err.to_string())?;
        let content = serde_json::to_string_pretty(self).map_err(|err| err.to_string())?;
        file.write(content.as_bytes()).map_err(|err| err.to_string())?;
        Ok(())
    }

    pub fn get_config_path() -> PathBuf {
        let mut abs_path =
            tauri::api::path::config_dir().expect("Could not retrieve configuration dir.");
        abs_path.push(APP_NAME);
        create_dir_all(abs_path.clone()).expect("Could not create configuration path");
        abs_path.push(CONFIG_FILE_NAME);
        abs_path
    }

    pub fn add_wiki(&mut self, wiki: WikiConfig) -> Result<(), String> {
        self.wikis.push(wiki);
        self.save()?;
        Ok(())
    }

    pub fn get_wiki_index(&self, path: &str) -> Option<usize> {
        let mut o = self.wikis.iter();
        o.position(|w| w.path == path)
    }
}


#[derive(Serialize, Deserialize, Debug, PartialEq)]
pub enum WikiType {
    #[serde(rename = "html")]
    Html,
    #[serde(rename = "node")]
    Node,
}

impl WikiType {
    pub fn from_str(str_type: &str) -> WikiType {
        match str_type.to_lowercase().as_str() {
            "html" => WikiType::Html,
            _ => WikiType::Node
        }
    }
}

#[derive(Serialize, Deserialize)]
pub struct WikiConfig {
    pub path: String,
    pub wiki_type: WikiType
}

impl WikiConfig {
    pub fn new(path: String, wiki_type: &str) -> WikiConfig {
        WikiConfig { path, wiki_type: WikiType::from_str(wiki_type) }
    }
}
