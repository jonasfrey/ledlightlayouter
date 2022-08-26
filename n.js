import O_json_to_html from "https://unpkg.com/o_json_to_html@1.0.6/o_json_to_html.module.js"

import { O_message } from "./O_message.module.js";
import { O_message_group } from "./O_message_group.module.js";
import { O_message_group_o_user_o_message } from "./O_message_group_o_user_o_message.module.js";
import { O_user } from "./O_user.module.js";

import Vue from 'https://unpkg.com/vue@2.6.0/dist/vue.esm.browser.min.js';
var o_json_to_html = new O_json_to_html()

const n_http_server_port = 3333;
const n_websocket_server_port = 3636;
const s_host = "localhost"
const s_websocket_endpoint = `ws://${s_host}:${n_websocket_server_port}`;

var o_unique_websocket_client = null;
const o_websocket_client = new WebSocket(s_websocket_endpoint);
o_websocket_client.onmessage = function (message) {
    console.log(message)
};
window.o_websocket_client = o_websocket_client
o_websocket_client.onopen = function(e) {
    console.log("[open] Connection established");
    console.log("Sending to server");
    o_websocket_client.send("My name is John");
};
  
o_websocket_client.onmessage = function(event) {
    console.log(`[message] Data received from server: ${event.data}`);
};

o_websocket_client.onclose = function(event) {
if (event.wasClean) {
    console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
} else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    console.log('[close] Connection died');
}
};

o_websocket_client.onerror = function(error) {
console.log(`[error] ${error.message}`);
};

document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("app").append(
        o_json_to_html.f_json_to_html(
            {
                s_t:"div", 
                a_c: [
                    {
                        "v-if": "!o_session", 
                        a_c: [
                            {
                                s_t: "input", 
                                "v-model": "s_o_user_s_email"
                            }, 
                            {
                                s_t: "input", 
                                "v-model": "s_o_user_s_password", 
                            }, 
                            {
                                s_t: "button", 
                                "v-on:click" : "f_login",
                                "v-html": "'login'"
                            },
                        ]
                    }
                ]
            },
        )
    );


    window.vueObject = new Vue({
        el: '#app',
        data: function() {
            return {
                o_session: null,
                b_bool: true,
                s_o_user_s_email: '',
                s_o_user_s_password: '',   
                s_o_user_s_password_hashed_sha256: '',   
                n_f_hash_password_timeout: 0, 
                o_api: {
                    s_url: `http://${s_host}:${n_http_server_port}/`, 
                }
            }
        },
        updated: function(){
        },
        mounted:async function () {
            console.log("client.js is running")
            this.o_session = await this.f_handle_session();
            this.a_o_page = await this.f_a_o_model_name("o_page");
            this.marked = marked
        },
        watch: {
        },
        methods: {
            f_login:  async function(){
                await this.f_hash_password();
                console.log(this.s_o_user_s_password_hashed_sha256);
            },
            sha256: async function(s_string){
                // encode as UTF-8
                const msgBuffer = new TextEncoder().encode(s_string);                    
                // hash the message
                const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
                // convert ArrayBuffer to Array
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                // convert bytes to hex string                  
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

                return hashHex;
            },
            f_hash_password: async function(){
                this.s_o_user_s_password_hashed_sha256 = await this.f_hash_password(this.s_o_user_s_password);
            },
            f_handle_session: async function(){
                var o_session = JSON.parse(localStorage.getItem('s_o_session', JSON.stringify({n:2})))
                if(!o_session){
                    // no cookie set, login required

                }else{
                    // validate cookie
                    const o_data = this.f_a_o_model_name()
                    
                }
                localStorage.setItem('s_o_session', JSON.stringify({n:2}));
            },
            f_a_o_model_name: async function(
                s_model_name
                ){
                var s_model_name_array = "a_" + s_model_name; 
                var s_model_name_array_kebab_case = this.f_s_kebab_case(s_model_name_array);
                var s_api_url_suffix = "/api/"+this.f_s_kebab_case(s_model_name_array_kebab_case)
                
                var s_url =this.o_api.s_url+s_api_url_suffix 
                const o_response = await fetch(s_url);
                const data = await o_response.json();
                return data.data
            },
            f_s_kebab_case: function(
                s_string
            ){
                var a_s_part = s_string.split("_");
                return a_s_part.join("-") 
            }
        },
        computed: {
            a_o_page_filtered: function(){
                return this.a_o_page
            }
        }
    })
});
