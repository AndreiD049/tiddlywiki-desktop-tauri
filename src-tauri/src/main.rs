#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
mod config;

use std::path::Path;
use config::{Config, WikiConfig};
use tauri::api::process::Command;

pub const APP_NAME: &str = "tiddlywikirs";

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn serve_wiki(path: String, wiki_type: String) -> Result<String, String>  {
    let config = Config::read();
    let index = config.get_wiki_index(&path).unwrap_or(config.wikis.len());
    let port = 4105 + index;
    if wiki_type == "node" {
        // kill previous running process
        kill_children();
        let path = Path::new(&path);
        let parent_dir = path.parent().unwrap().to_str().unwrap();
        let (_rx, _child) = Command::new_sidecar("node")
            .expect("Could not find binary sidecar 'node'")
            .args(vec![parent_dir, "--listen", format!("port={}", port as u16).as_str(), "root-tiddler=$:/core/save/lazy-images"])
            .spawn()
            .expect(format!("Could not launch binary sidecar 'node' with parameters {}", parent_dir).as_str());
        Ok(format!("http://localhost:{}", port))
    } else {
        // kill previous running process
        kill_children();
        let file_name = match Path::new(&path).file_name() {
            Some(f) => f.to_str().unwrap_or("index.html"),
            None => "index.html"
        };
        // start binary
        let (_rx, _child) = Command::new_sidecar("dav-server")
            .expect("Could not find binary sidecar 'node'")
            .args(vec!["--file", &path, "--port", &port.to_string()])
            .spawn()
            .expect(format!("Could not launch binary sidecar 'node' with parameters {}", &path).as_str());
        Ok(format!("http://localhost:{}/{}", port, file_name))
    }
}

fn kill_children() {
    tauri::api::process::kill_children();
}

#[tauri::command]
fn add_wiki(path: String, wiki_type: String) -> Result<bool, String> {
    let mut config = Config::read();
    let wiki = WikiConfig::new(path, wiki_type.as_str());
    config.add_wiki(wiki).map(|_val| true)
}

#[tauri::command]
fn get_config() -> Config {
    Config::read()
}


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            serve_wiki,
            add_wiki,
            get_config,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use std::fs;

    use crate::{config::{Config, WikiType}, add_wiki};

    fn delete_config() {
        let path = Config::get_config_path();
        fs::remove_file(path).expect("Could not delete file");
    }

    #[test]
    fn it_works() {
        delete_config();
        let config = Config::read();
        config.save().expect("msg");
        assert!(config.wikis.len() == 0);
    }

    #[test]
    fn add_wiki_test() {
        delete_config();
        add_wiki("test_config2".into(), "node".into()).expect("msg");
        add_wiki("test_config3".into(), "html".into()).expect("msg");
        add_wiki("test_config3".into(), "unknown".into()).expect("msg");
        let config = Config::read();
        assert_eq!(config.wikis.len(), 3);
        assert_eq!(config.wikis.last().unwrap().wiki_type, WikiType::Node);
    }
}
