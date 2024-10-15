const API_URL = "http://localhost:8000";

interface SearchResponse {
  error: string | null;
  searchResults: any[];
}

export const searchNotes = async (searchQuery: string) => {
  const resp = await fetch(`${API_URL}/search?q=${searchQuery}`);

  if (!resp.ok) {
  }

  const { error, searchResults }: SearchResponse = await resp.json();

  if (error) {
    console.log(error);
  }

  return searchResults;
};
