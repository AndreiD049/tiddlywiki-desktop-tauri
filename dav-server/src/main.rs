use std::{env, net::SocketAddr, path::PathBuf};

use dav_server::warp::{dav_file, dav_dir};

const USAGE: &str = "Usage: dav-server --file|--dir <file_or_directory> --port <port>";

#[tokio::main]
async fn main() {
    let args: Vec<String> = env::args().collect();
    let flag = args.get(1).expect(USAGE);
    if flag != "--file" && flag != "--dir" {
        panic!("{}", USAGE);
    }
    let path = PathBuf::from(args.get(2).expect(USAGE));
    let port_flag = args.get(3).expect(USAGE);
    if port_flag != "--port" {
        panic!("{}", USAGE);
    }
    let port: u16 = args.get(4).expect(USAGE).parse().expect(USAGE);
    if flag == "--file" {
        serve_file(path, port).await;
    } else {
        serve_dir(path, port).await;
    }
}

async fn serve_file(file: PathBuf, port: u16) {
    let addr: SocketAddr = ([127, 0, 0, 1], port).into();

    println!("Listening on {:?} serving {:?}", addr, file.as_os_str());
    let warpdav = dav_file(file);
    warp::serve(warpdav).run(addr).await;
}

async fn serve_dir(dir: PathBuf, port: u16) {
    let addr: SocketAddr = ([127, 0, 0, 1], port).into();

    println!("Listening on {:?} serving {:?}", addr, dir.as_os_str());
    let warpdav = dav_dir(dir, true, true);
    warp::serve(warpdav).run(addr).await;
}
