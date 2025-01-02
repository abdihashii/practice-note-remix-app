// Common languages with their display names
export const LANGUAGES = [
  { value: "javascript", label: "JavaScript (js)" },
  { value: "typescript", label: "TypeScript (ts)" },
  { value: "jsx", label: "React (jsx)" },
  { value: "tsx", label: "React (tsx)" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "scss", label: "SCSS/SASS" },
  { value: "json", label: "JSON" },
  { value: "python", label: "Python (py)" },
  { value: "ruby", label: "Ruby (rb)" },
  { value: "rust", label: "Rust (rs)" },
  { value: "go", label: "Go" },
  { value: "bash", label: "Bash (sh, shell)" },
  { value: "cpp", label: "C++ (cpp, c++)" },
  { value: "csharp", label: "C# (cs)" },
  { value: "java", label: "Java" },
  { value: "php", label: "PHP" },
  { value: "sql", label: "SQL" },
  { value: "markdown", label: "Markdown (md)" },
  { value: "yaml", label: "YAML (yml)" },
].sort((a, b) => a.label.localeCompare(b.label));

// Language alias mapping
export const LANGUAGE_ALIASES: Record<string, string> = {
  // JavaScript
  js: "javascript",
  node: "javascript",

  // TypeScript
  ts: "typescript",

  // React
  jsx: "javascript",
  tsx: "typescript",

  // Python
  py: "python",

  // Ruby
  rb: "ruby",

  // Shell/Bash
  sh: "bash",
  shell: "bash",
  zsh: "bash",

  // C-like
  cpp: "cpp",
  "c++": "cpp",
  h: "cpp",
  hpp: "cpp",

  // C#
  cs: "csharp",
  csharp: "csharp",

  // CSS
  scss: "scss",
  sass: "scss",
  less: "less",

  // Markup
  md: "markdown",
  html: "html",
  xml: "xml",
  yml: "yaml",

  // Databases
  postgres: "sql",
  postgresql: "sql",
  mysql: "sql",
};
