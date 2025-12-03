import React from "react";
import { Link } from "react-router-dom";

export default function StoryCard({story}){
  return (
    <Link to={"/story/"+story.id} style={{textDecoration:"none", color:"inherit"}}>
      <article className="card" style={{display:"flex",gap:12}}>
        <div style={{flex:1}}>
          <div style={{marginBottom:8}}>
            {story.categories?.map((c,i)=> <span key={i} className="pill" style={{marginRight:6}}>{c}</span>)}
          </div>
          <h3 style={{margin:"6px 0"}}>{story.title}</h3>
          <p style={{margin:0,color:"var(--muted)"}}>{story.excerpt}</p>
        </div>
      </article>
    </Link>
  )
}
