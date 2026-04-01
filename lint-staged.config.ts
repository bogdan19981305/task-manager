const buildCommand = (prefix: string, script: string, files: string[]) => {
  if (!files.length) return null;

  const normalizedFiles = files
    .map((file) => file.replace(new RegExp(`^${prefix}/`), ""))
    .join(" ");

  return `npm --prefix ${prefix} run ${script} -- ${normalizedFiles}`;
};

export default {
  "frontend/**/*.{js,jsx,ts,tsx}": (files: string[]) => {
    const commands = [
      buildCommand("frontend", "lint:fix", files),
      buildCommand("frontend", "format", files),
    ].filter(Boolean);

    return commands;
  },

  "backend/**/*.{js,ts}": (files: string[]) => {
    const commands = [
      buildCommand("backend", "lint:fix", files),
      buildCommand("backend", "format", files),
    ].filter(Boolean);

    return commands;
  },

  "*.{json,md,yml,yaml}": ["prettier --write"],
};
