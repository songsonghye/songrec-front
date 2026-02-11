import type { Keyword } from "./keyword";

export interface RequestDetail{
    id: number;
    userId:number;
    title:string;
    thumbnailUrl:string;
    keywords:Keyword[];
}
