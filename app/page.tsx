import { SwayIDE } from "@/components/sway/ide"
import { SwayProvider } from "@/components/sway/sway-provider"
import { getSwayContract } from "@/lib/server/sway-loader"
import path from "path"
import fs from "fs"

interface SearchParams {
  params: { slug: string }
  searchParams?: { [key: string]: string | undefined }
}
export default async function Home({ searchParams }: SearchParams) {
  const wasmSource = 'Forc.toml'
  const wasmDirectory = path.resolve('./public/sample', wasmSource);
  const content: string = fs.readFileSync(wasmDirectory).toString();

  const wasmSource2 = 'src/main.sw'
  const wasmDirectory2 = path.resolve('./public/sample', wasmSource2);
  const content2: string = fs.readFileSync(wasmDirectory2).toString();

  let input = {
    sources: {
      [wasmSource]: {
        content: content
      },
      [wasmSource2]: {
        content: content2
      }
    }
  }

  if (searchParams?.url) {
    input = await getSwayContract(searchParams?.url)
  }

  return <SwayProvider>
    <SwayIDE content={JSON.stringify(input)} />
  </SwayProvider>
}
