import { CopyText } from "@/components/core/components/copy-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@fuels/react";
import { useState } from "react";

interface SignMessageProps extends React.HTMLAttributes<HTMLDivElement> { }

export default function SignMessage({ className }: SignMessageProps) {
    const { wallet } = useWallet();

    const [message, setMessage] = useState("")
    const [output, setOutput] = useState("")

    async function handleSignMessage() {
        console.log("Request signature of message!");
        if (!wallet) {
            throw new Error("Current wallet is not authorized for this connection!");
        }

        try {
            setOutput("")
            const signedMessage = await wallet.signMessage(message);
            setOutput(signedMessage)
        } catch (e: any) {
            setOutput(e.message)
        }
    }

    return <div>
        <Input value={message} onChange={(e) => setMessage(e.target.value)} />
        <Button onClick={handleSignMessage}>
            Convert
        </Button>
        {output && <div>
            <div className="text-wrap break-words my-2">{output}</div>
            <CopyText payload={output} />
        </div>}
    </div>
}