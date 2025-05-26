'use client';
import { useParams } from "next/navigation";

export default function Post(){
    const params = useParams();
    const id = params.id;
    
    return <div>Post {id}</div>
}