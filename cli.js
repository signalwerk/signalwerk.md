#!/usr/bin/env node
import { mdToHtml, mdProcessor } from "./src/index.js";
import fs from "fs";
import path from "path";

const [, , ...args] = process.argv; // get the command line arguments

// parse the arguments
const parseArg = (argName) => {
  const argIndex = args.findIndex((arg) => arg.startsWith(`--${argName}=`));
  if (argIndex !== -1) {
    return args[argIndex].split("=")[1];
  }
  return null;
};

const language = parseArg("language") || "en";
const mainFile = args.find((arg) => !arg.startsWith("--"));

console.log(`Language: ${language}`);
console.log(`Main file: ${mainFile || "Not specified"}`);

if (!mainFile) {
  console.log("No main file specified. Exiting.");
  process.exit(1);
}

const processor = mdProcessor({
  
  // components: {
  //   "custom-block": {
  //     props: {
  //       src: "custom",
  //     },
  //     processor: {
  //       html: DocumentationPage,
  //     },
  //   },
  // },
});

const md = fs.readFileSync(mainFile, "utf8");

// Get the file name and extension of the input file
const inputFileName = path.basename(mainFile);
const inputFileExtension = path.extname(mainFile);

// Replace the file extension with a new extension
const outputFileName = inputFileName.replace(inputFileExtension, ".html");

// Generate the output file path by replacing the input file name with the output file name
const outputFilePath = mainFile.replace(inputFileName, outputFileName);

const html = mdToHtml(md, { processor, language });
fs.writeFileSync(outputFilePath, html);
