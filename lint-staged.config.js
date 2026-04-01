const quoteFiles = (files, prefix) =>
  files
    .map((file) => file.replace(new RegExp(`^${prefix}/`), ""))
    .map((file) => `"${file}"`)
    .join(" ");

export default {
  "frontend/**/*.{js,jsx,ts,tsx}": (files) => {
    const args = quoteFiles(files, "frontend");

    return [
      `cd frontend && npx eslint --max-warnings=0 --fix ${args}`,
      `cd frontend && npx prettier --write ${args}`,
    ];
  },

  "backend/**/*.{js,ts}": (files) => {
    const args = quoteFiles(files, "backend");

    return [
      `cd backend && npx eslint --max-warnings=0 --fix ${args}`,
      `cd backend && npx prettier --write ${args}`,
    ];
  },

  "*.{json,md,yml,yaml}": ["npx prettier --write"],
};
