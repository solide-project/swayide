import { IDESettings } from "@/components/core/components/ide-settings"
import { TomlPathInput } from "@/components/sway/settings/toml-path-input"

interface SwaySettingsProps extends React.HTMLAttributes<HTMLDivElement> { }

export function SwaySettings({ className }: SwaySettingsProps) {
    return <IDESettings>
        <div className="flex items-center justify-between">
            <div className="font-semibold">Test Path</div>
            <TomlPathInput />
        </div>
    </IDESettings>
}