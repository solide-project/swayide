import { execSync } from "child_process";
import { FORC_TOMLFILE } from "./constants";

export const compile = async (sourcePath: string, toml: string = "") => {
    if (toml.startsWith("/")) {
        toml = toml.slice(1);
    }
    if (toml.toLocaleLowerCase().endsWith(FORC_TOMLFILE)) {
        toml = toml.slice(0, -9);
    }

    const compiledModules = execSync(
        `forc build --path ${sourcePath}/${toml}`,
        { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }
    );

    return ""
}