import { CopyText } from "@/components/core/components/copy-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Address, getRandomB256 } from "fuels";
import { useState } from "react";

interface B256ConversionProps extends React.HTMLAttributes<HTMLDivElement> { }

// Better see, https://docs.fuel.network/docs/fuels-ts/utilities/address-conversion/
export default function B256Conversion({ className }: B256ConversionProps) {
    const [input, setInput] = useState("")
    const [output, setOutput] = useState("")

    const handleConversion = async () => {
        // const randomB256: string = getRandomB256();
        try {
            setOutput("")
            const address = Address.fromB256(input);
            setOutput(address.bech32Address)
        } catch (e: any) {
            setOutput(e.message)
        }
    }

    return <div>
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <Button onClick={handleConversion}>
            Convert
        </Button>
        {output && <div>
            <div className="text-wrap break-words my-2">{output}</div>
            <CopyText payload={output} />
        </div>}
    </div>
}