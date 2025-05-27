export default function Test(){
    const MONGODB_URI = process.env.MONGODB_URI;


    return(
        <p>{MONGODB_URI}</p>
    )
}