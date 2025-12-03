import React from "react";
import useSWR from "swr";
import StoryCard from "../components/StoryCard";
import { API } from "../utils/api";

const fetcher = (url) => fetch(API + url).then(r=>r.json());

export default function Home(){
  const { data: stories } = useSWR("/api/stories", fetcher);

  if (!stories) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h2>New Stories</h2>
      <div style={{display:"grid", gap:12}}>
        {stories.map(s => <StoryCard key={s.id} story={s} />)}
      </div>
    </div>
  )
}
