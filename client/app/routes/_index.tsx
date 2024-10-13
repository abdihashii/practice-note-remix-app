import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";

import { Note } from "~/types";

import Layout from "~/components/Layout/Layout";
import MainContent from "~/components/MainComponent";

export const meta: MetaFunction = () => {
  return [
    { title: "Notes App" },
    { name: "description", content: "Notes App" },
  ];
};

export default function Index() {
  const [notes, setNotes] = useState<Note[]>([
    // Example notes
    {
      id: "1",
      title: "First Note",
      content: "This is the content of the first note.",
    },
    {
      id: "2",
      title: "Second Note",
      content: "This is the content of the second note.",
    },
    // Add more notes as needed
  ]);

  return (
    <Layout>
      <MainContent notes={notes} />
    </Layout>
  );
}
