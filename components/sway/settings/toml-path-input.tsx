import { Input } from "@/components/ui/input"
import { useSway } from "@/components/sway/sway-provider";

interface TomlPathInputProps extends React.HTMLAttributes<HTMLDivElement> { }

export function TomlPathInput({ className }: TomlPathInputProps) {
    const move = useSway();

    return <Input className={className}
        placeholder="Entry Toml"
        value={move.tomlPath}
        onChange={(e) => move.setTomlPath(e.target.value)} />
}