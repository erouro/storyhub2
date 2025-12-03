import React from "react";
import { useParams, Link } from "react-router-dom";
import useSWR from "swr";
import { API } from "../utils/api";

const fetcher = (url) => fetch(API + url).then(r=>r.json());

export default function StoryPage(){
  const { id } = useParams();
  const { data: story } = useSWR(id ? "/api/stories/"+id : null, fetcher);

  if (!story) return <div className="container">Loading...</div>;
  if (story.error) return <div className="container">Story not found</div>;

  return (
    <div className="container">
      <div><Link to="/">← Back</Link></div>
      <h1>{story.title}</h1>
      <div style={{color:"var(--muted)", marginBottom:12}}>{(story.categories||[]).join(", ")}</div>
      {story.thumbnail_url && <img src={story.thumbnail_url} alt="thumb" style={{width:"100%",maxHeight:360,objectFit:"cover",borderRadius:8}} />}
      <div style={{whiteSpace:"pre-wrap",lineHeight:1.6, marginTop:12}}>{story.content}</div>
    </div>
  )
}
