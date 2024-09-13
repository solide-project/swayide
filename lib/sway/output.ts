import fs from 'fs';
import path from 'path';
import { glob, globSync, globStream, globStreamSync, Glob } from 'glob'

import { Sources } from './input';

export interface CompileOutput {
    output: Sources
}
export const getFilesRecursive = (directory: string, baseDir: string = ""): Sources => {
    let results: Sources = {};
    const list = fs.readdirSync(directory);

    console.log('directory', directory);

    list.forEach(file => {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);

        if (stat && stat.isDirectory()) {
            results = { ...getFilesRecursive(filePath), ...results };
        } else {
            results[filePath] = {
                content: fs.readFileSync(filePath).toString()
            }
        }
    });

    console.log('results', results);
    return results;
}

export const getOutput = (outputDir: string, tomlDir = ""): Sources => {
    let results: Sources = {};

    if (tomlDir) {
        const { dir } = path.parse(tomlDir);
        tomlDir = dir;

        if (tomlDir.startsWith("/")) {
            tomlDir = tomlDir.slice(1);
        }
    }

    const abiList = globSync(`${outputDir}/debug/*-abi.json`);
    results = addToSources(abiList, tomlDir, results);

    const storageList = globSync(`${outputDir}/debug/*-storage_slots.json`);
    results = addToSources(storageList, tomlDir, results);

    const byteList = globSync(`${outputDir}/debug/*.bin`);
    results = addToSources(byteList, tomlDir, results, "hex"
    );

    return results;
}

const addToSources = (files: string[], relativePath: string, results: Sources, format: BufferEncoding = "utf-8") => {
    files.forEach(file => {
        const { base } = path.parse(file);
        let outPath = `${relativePath}/out/debug/${base}`;
        if (outPath.startsWith("/")) {
            outPath = outPath.slice(1);
        }
        // const i = fs.readFileSync(file).toString("hex")

        results[outPath] = {
            content: fs.readFileSync(file).toString(format)
        }
    });

    return results;
}

export function checkFolderExists(directory: string, interval: number = 5000, attempts: number = 10): Promise<void> {
    return new Promise((resolve, reject) => {
        let attemptsLeft = attempts;

        const checkInterval = setInterval(() => {
            if (fs.existsSync(directory)) {
                clearInterval(checkInterval);
                console.log(`Directory exists: ${directory}`);
                resolve();
            } else {
                attemptsLeft -= 1;
                console.log(`Directory does not exist yet: ${directory}. Attempts left: ${attemptsLeft}`);
                if (attemptsLeft <= 0) {
                    clearInterval(checkInterval);
                    console.log(`Max attempts reached. Continuing...`);
                    resolve();
                }
            }
        }, interval);
    });
}