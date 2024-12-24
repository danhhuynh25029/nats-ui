import axios from "axios";

export interface GetMessageFromJetStreamReq {
    stream_name: string;
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
       const result =  await  axios.post("http://localhost:8080/api/jetstream/message",req);
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

export interface GetStreamResponse {
    total : number;
    subjects : Stream[];
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



