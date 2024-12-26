import axios from "axios";

export interface GetMessageFromJetStreamReq {
    stream_name: string | null;
}

export interface Message {
    id: string
    data: string
    subject: string
    received: string
    "sequence": number
}

export interface GetMessageFromJetStreamResponse {
    total : number;
    messages : Message[];

}


export const GetMessageFormJetStream =   async (req : GetMessageFromJetStreamReq) : Promise<GetMessageFromJetStreamResponse> => {
   try {
       const result =  await  axios.post("http://localhost:8080/api/jetstream/messages",req);
       return result.data;
   }catch(err) {
       console.log(err);
       throw err;
   }
}

export interface GetStreamReq {
    id: string;
}

export interface Consumer{
    name: string;
}



export interface Stream {
    name: string;
    total_message: number;
    size: string;
    created: string;
    last_message: string;
    consumers?: Consumer[];
}


export interface Key{
    key : string,
    value: string
}

export interface GetKeyRequest {
    bucket : string | null
}

export interface GetKeyResponse {
    keys : Key[],
    total: number
}

export const GetStreamFromJetStream = async () : Promise<Stream[]> => {
    try {
        const result =  await  axios.get("http://localhost:8080/api/jetstream/streams");
        return result.data;
    }catch(err) {
        console.log(err);
        throw err;
    }
}

export const GetBucketFromJetStream = async () : Promise<Stream[]> => {     
    try {
        const result =  await  axios.get("http://localhost:8080/api/jetstream/buckets");
        return result.data;
    }catch(err) {
        console.log(err);
        throw err;
    }
}

export const GetKeyFromBucket = async(req: GetKeyRequest) : Promise<GetKeyResponse> => {
    try {
        const result =  await  axios.post("http://localhost:8080/api/jetstream/keys",req);
        return result.data;
    }catch(err) {
        console.log(err);
        throw err;      
    }
}