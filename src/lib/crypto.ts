import { env } from "@/env";
import { AES, enc } from "crypto-js";

export function encrypt(data:string|object){

    if(typeof data === 'string'){
        return AES.encrypt(data, env.SECRET_KEY).toString();
    }

    return AES.encrypt(JSON.stringify(data), env.SECRET_KEY).toString();
}

export function decrypt(data:string, type?:'string'|'json'){

    if(type === 'string'){
        return AES.decrypt(data, env.SECRET_KEY).toString();
    }
    
    return JSON.parse(AES.decrypt(data, env.SECRET_KEY).toString(enc.Utf8));
}