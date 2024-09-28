import { CopyText } from "@/components/core/components/copy-text";
import { Button } from "@/components/ui/button";
import { getRandomB256 } from "fuels";
import { useState } from "react";

interface RandomB56Props extends React.HTMLAttributes<HTMLDivElement> { }

export default function RandomB56({ className }: RandomB56Props) {
    const [output, setOutput] = useState("")

    const handleGeneration = async () => {
        setOutput(getRandomB256())
    }

    return <div>
        <Button onClick={handleGeneration}>
            Random B256
        </Button>
        {output && <div>
            <div className="text-wrap break-words my-2">{output}</div>
            <CopyText payload={output} />
        </div>}
    </div>
}