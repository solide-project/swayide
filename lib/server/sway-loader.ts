import { GithubResolver } from "@resolver-engine/imports/build/resolvers/githubresolver"

import { ContractPaths, ContractDependency } from "@/lib/core"
import { GITHUBUSERCONTENT_REGEX, fetchGithubAPI, fetchGithubSource, parseGitHubUrl, resolve } from "./utils"
import path from "path"

export const getSwayContract = async (url: string) => {
    const loader = new SwayLoader(url)
    return await loader.generateSource()
}

class SwayLoader {
    source: string
    constructor(source: string) {
        this.source = source
    }

    async generateSource(): Promise<any | string> {
        const parts = parseGitHubUrl(this.source)
        const url = `https://api.github.com/repos/${parts.entity}/${parts.repo}/contents/${parts.path}`
        const content = await fetchGithubAPI(url)

        const tomlFile = content.find(i => i.name.toLocaleLowerCase() === "forc.toml" && i.type === "file")
        const sourcesFolder = content.find(i => i.name.toLocaleLowerCase() === "src" && i.type === "dir")
        const isValidProject = tomlFile && sourcesFolder

        if (!isValidProject) {
            return "Invalid Move Project"
        }

        const tomlContent = await fetchGithubSource(tomlFile?.html_url)

        let dependencies: ContractDependency[] = []
        let sources: any = {}

        const cargoFile = content.find(i => i.name.toLocaleLowerCase() === "cargo.toml" && i.type === "file")
        if (cargoFile) {
            const content = await fetchGithubSource(cargoFile?.html_url)
            sources[cargoFile.path] = {
                content: content
            }
        }

        try {
            dependencies = await loadSources(sourcesFolder?.url)
            dependencies.forEach((dependency) => {
                const { paths, originalContents } = dependency
                const sourceKey = paths.isHttp() ? paths.folderPath : paths.filePath
                sources[sourceKey] = { content: originalContents || "" }
            })
        } catch (error: any) {
            return "Error loading dependencies"
        }

        return {
            language: "Move",
            settings: {
                compilationTarget: {
                    [tomlFile.path]: "Forc.toml"
                }
            },
            sources: {
                ...sources,
                [tomlFile.path]: {
                    content: tomlContent,
                },
            },
        }
    }
}


async function loadSources(
    sources: string
): Promise<ContractDependency[]> {
    const files: ContractDependency[] = [];

    async function fetchContents(url: string): Promise<void> {
        const contents = await fetchGithubAPI(url)

        for (const item of contents) {
            if (item.type === 'file') {
                const source = await fetchGithubSource(item.download_url)
                files.push({
                    fileContents: source,
                    originalContents: source,
                    paths: new ContractPaths(item.path, ""),
                });
            } else if (item.type === 'dir') {
                await fetchContents(item.url);
            }
        }
    }

    await fetchContents(sources);
    return files;
}