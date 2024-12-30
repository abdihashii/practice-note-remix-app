import { Link } from "react-router";
import type { Route } from "./+types";

export default function NotePage({ params }: Route.ComponentProps) {
  return (
    <div>
      <h1>Note {params.id}</h1>
      <div className="flex flex-col">
        <Link to="/notes">Back to notes</Link>
        <Link to="/">Home</Link>
      </div>
    </div>
  );
}
