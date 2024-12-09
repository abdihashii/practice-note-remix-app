import { spawnSync } from "child_process";
import { readFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = join(__dirname, "..");

// Determine the correct remove command based on platform
const isWindows = process.platform === "win32";
const rmCommand = isWindows ? "rmdir" : "rm";
const rmArgs = isWindows ? ["/s", "/q"] : ["-rf"];

// Common directories to clean
const dirsToRemove = ["node_modules", "dist", "build", ".cache"];

try {
  // Clean root directory first
  console.log("Cleaning root directory...");
  for (const dir of dirsToRemove) {
    const dirPath = join(rootDir, dir);
    if (existsSync(dirPath)) {
      const result = spawnSync(rmCommand, [...rmArgs, dir], {
        cwd: rootDir,
        stdio: "inherit",
        shell: true,
      });

      if (result.error) {
        console.error(`Error cleaning ${dir} in root:`, result.error);
        process.exit(1);
      }
    }
  }

  // Read package.json to get workspaces
  const pkgJson = JSON.parse(
    readFileSync(join(rootDir, "package.json"), "utf-8")
  );

  // Validate workspaces configuration
  if (!pkgJson.workspaces || !Array.isArray(pkgJson.workspaces)) {
    console.error("No valid workspaces configuration found in package.json");
    process.exit(1);
  }

  // Get workspace patterns
  const workspacePatterns = pkgJson.workspaces;

  // Process each workspace pattern
  for (const pattern of workspacePatterns) {
    const baseDir = pattern.replace("/*", "");
    const fullPath = join(rootDir, baseDir);

    // Skip if base directory doesn't exist
    if (!existsSync(fullPath)) {
      console.log(`Skipping ${baseDir} - directory not found`);
      continue;
    }

    // Get all subdirectories
    const subdirs = readdirSync(fullPath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    // Clean each subdirectory
    for (const subdir of subdirs) {
      const projectPath = join(fullPath, subdir);
      console.log(`Cleaning ${baseDir}/${subdir}...`);

      for (const dir of dirsToRemove) {
        const dirPath = join(projectPath, dir);
        if (existsSync(dirPath)) {
          const result = spawnSync(rmCommand, [...rmArgs, dir], {
            cwd: projectPath,
            stdio: "inherit",
            shell: true,
          });

          if (result.error) {
            console.error(
              `Error cleaning ${dir} in ${baseDir}/${subdir}:`,
              result.error
            );
            process.exit(1);
          }
        }
      }
    }
  }

  console.log("All workspaces and root directory cleaned successfully!");
} catch (error) {
  console.error("Error during cleanup:", error);
  process.exit(1);
}
