import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const scanDirs = [
  path.join(rootDir, "src", "modules"),
  path.join(rootDir, "src", "shared"),
];

const testHelpersDir = path.join(rootDir, "src", "test");

const SKIP_FILES = new Set([
  "models.register.js",
  "routes.register.js",
  "rbac.models.js",
]);

const SKIP_SUFFIXES = [
  ".openapi.js",
  ".model.js",
  ".schemas.js",
  ".payload.js",
  "index.js",
];

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
};

function shouldSkipFile(fileName) {
  if (SKIP_FILES.has(fileName)) {
    return true;
  }
  return SKIP_SUFFIXES.some((suffix) => fileName.endsWith(suffix));
}

function getAllJsFiles(dirPath, filesArray = []) {
  if (!fs.existsSync(dirPath)) {
    return filesArray;
  }

  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllJsFiles(fullPath, filesArray);
    } else if (
      fullPath.endsWith(".js") &&
      !fullPath.endsWith(".test.js") &&
      !fullPath.endsWith(".spec.js") &&
      !fullPath.endsWith(".integration.test.js") &&
      !shouldSkipFile(file)
    ) {
      filesArray.push(fullPath);
    }
  }

  return filesArray;
}

function getTestFilePath(sourceFilePath) {
  const adjacentTest = sourceFilePath.replace(/\.js$/, ".test.js");
  if (fs.existsSync(adjacentTest)) {
    return adjacentTest;
  }

  const integrationPath = sourceFilePath.replace(
    /\.js$/,
    ".integration.test.js",
  );
  if (fs.existsSync(integrationPath)) {
    return integrationPath;
  }

  return null;
}

function detectTestCases(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const cases = [];

  const routeRegex =
    /(?:Routes|router)\.(get|post|put|delete|patch|options)\s*\(\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = routeRegex.exec(content)) !== null) {
    const method = match[1].toUpperCase();
    const route = match[2];
    cases.push({
      type: "route",
      method,
      route,
      title: `should handle ${method} ${route}`,
    });
  }

  const funcRegex = /export\s+(async\s+)?function\s+([a-zA-Z0-9_]+)/g;
  while ((match = funcRegex.exec(content)) !== null) {
    const name = match[2];
    if (name === "registerV1Routes" || name === "registerModels") {
      continue;
    }
    cases.push({
      type: "function",
      name,
      title: `should correctly execute ${name}()`,
    });
  }

  return cases;
}

function generateTestFile(sourceFilePath, suggestedCases) {
  const testFilePath = sourceFilePath.replace(/\.js$/, ".test.js");
  const testDir = path.dirname(testFilePath);

  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  const fileName = path.basename(sourceFilePath);
  const isRoutes = fileName.endsWith(".routes.js");

  const helperImportPath = path
    .relative(testDir, path.join(testHelpersDir, "create-test-app.js"))
    .replace(/\\/g, "/");

  let content = "";

  if (fs.existsSync(testFilePath)) {
    content = fs.readFileSync(testFilePath, "utf8");
    let updated = false;

    for (const c of suggestedCases) {
      if (!content.includes(c.title)) {
        const lastItIndex = content.lastIndexOf("});");
        if (lastItIndex !== -1) {
          const newTest = `\n  it('${c.title}', async () => {\n    // TODO: Implement test\n  });\n`;
          content =
            content.slice(0, lastItIndex + 3) + newTest + content.slice(lastItIndex + 3);
          updated = true;
        }
      }
    }

    if (updated) {
      fs.writeFileSync(testFilePath, content);
      return { path: testFilePath, status: "updated" };
    }
    return { path: testFilePath, status: "skipped" };
  }

  if (isRoutes) {
    content = `import request from "supertest";
import { createTestApp } from "${helperImportPath}";

describe("${fileName} API", () => {
  let app;

  beforeAll(async () => {
    app = await createTestApp();
  });

${suggestedCases
  .map(
    (c) => `  it("${c.title}", async () => {
    // const response = await request(app).${c.method?.toLowerCase() ?? "get"}("/api/v1/...");
    // expect(response.status).toBe(200);
  });`,
  )
  .join("\n\n")}
});
`;
  } else {
    content = `import { describe, it } from "vitest";

describe("${fileName}", () => {
${suggestedCases
  .map(
    (c) => `  it("${c.title}", async () => {
    // TODO: Implement test
  });`,
  )
  .join("\n\n")}
});
`;
  }

  fs.writeFileSync(testFilePath, content);
  return { path: testFilePath, status: "created" };
}

function runScanner() {
  const isGenerateMode = process.argv.slice(2).includes("--generate");

  console.log(
    `${colors.bold}${colors.cyan}--- backend-javascript Test Scanner ---${colors.reset}\n`,
  );

  let allSourceFiles = [];
  for (const dir of scanDirs) {
    allSourceFiles = getAllJsFiles(dir, allSourceFiles);
  }

  const testedFiles = [];
  const untestedFiles = [];

  for (const file of allSourceFiles) {
    const testPath = getTestFilePath(file);
    if (testPath) {
      testedFiles.push({ source: file, test: testPath });
    } else {
      untestedFiles.push(file);
    }
  }

  if (!isGenerateMode) {
    console.log(`${colors.bold}Tested (${testedFiles.length}):${colors.reset}`);
    testedFiles.forEach((f) => {
      console.log(`  ${colors.green}✓ ${path.relative(rootDir, f.source)}${colors.reset}`);
    });

    console.log(`\n${colors.bold}Untested (${untestedFiles.length}):${colors.reset}`);
    untestedFiles.forEach((f) => {
      console.log(`  ${colors.red}✗ ${path.relative(rootDir, f)}${colors.reset}`);
      const cases = detectTestCases(f);
      if (cases.length > 0) {
        console.log(
          `    ${colors.dim}Suggested: ${cases
            .slice(0, 3)
            .map((c) => c.title)
            .join(", ")}${colors.reset}`,
        );
      }
    });

    console.log(
      `\nRun ${colors.yellow}npm run test:gen${colors.reset} to scaffold missing tests next to source files.`,
    );
  } else {
    console.log(`${colors.bold}${colors.yellow}Generating tests...${colors.reset}\n`);
    let createdCount = 0;
    let updatedCount = 0;

    for (const f of untestedFiles) {
      const cases = detectTestCases(f);
      if (cases.length > 0) {
        const result = generateTestFile(f, cases);
        console.log(
          `  ${colors.green}✓ ${result.status}: ${path.relative(rootDir, result.path)}${colors.reset}`,
        );
        if (result.status === "created") {
          createdCount++;
        } else if (result.status === "updated") {
          updatedCount++;
        }
      }
    }

    for (const f of testedFiles) {
      const cases = detectTestCases(f.source);
      if (cases.length > 0) {
        const result = generateTestFile(f.source, cases);
        if (result.status === "updated") {
          console.log(
            `  ${colors.cyan}↻ Updated: ${path.relative(rootDir, result.path)}${colors.reset}`,
          );
          updatedCount++;
        }
      }
    }

    console.log(`\n${colors.bold}Summary:${colors.reset}`);
    console.log(`Created: ${createdCount}`);
    console.log(`Updated: ${updatedCount}`);
  }

  const total = testedFiles.length + untestedFiles.length;
  const coveragePercent =
    total === 0 ? 0 : Math.round((testedFiles.length / total) * 100);
  console.log(`\n${colors.bold}File coverage: ${coveragePercent}%${colors.reset}\n`);
}

runScanner();
