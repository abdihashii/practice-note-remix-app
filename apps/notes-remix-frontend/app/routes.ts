import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("./routes/home.tsx"),
  route("notes", "./routes/notes/index.tsx"),
  route("notes/:id", "./routes/notes/note.tsx"),
] satisfies RouteConfig;
