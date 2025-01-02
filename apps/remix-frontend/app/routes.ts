import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("./routes/home.tsx"),
  ...prefix("notes", [
    layout("./routes/notes/layout.tsx", [
      index("./routes/notes/index.tsx"),
      route(":id", "./routes/notes/note.tsx"),
      route("/add", "./routes/notes/add-note.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
