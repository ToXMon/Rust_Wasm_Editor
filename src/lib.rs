use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use web_sys::{console, Document, HtmlElement};

#[wasm_bindgen(start)]
pub fn start() {
    console::log_1(&"Hello from wasm-bindgen!".into());
    let window = web_sys::window().expect("no global window");
    let document = window.document().expect("should have a document");
    let body = document.body().expect("document should have a body");

    let val = document.create_element("p").expect("Failed to create element");
    val.set_inner_html("Hello from wasm!");

    body.append_child(&val).expect("Failed to append child");
}

#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

// Add more functions for video editing logic

