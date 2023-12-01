import MathematicaPlot from "main";
import { App, PluginSettingTab, Setting } from "obsidian";

export class MathematicaPlotSettingsTab extends PluginSettingTab {
	plugin: MathematicaPlot;

	constructor(app: App, plugin: MathematicaPlot) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
		containerEl.createEl("h3").setText("Settings");
		new Setting(containerEl)
			.setName("Use cloud")
			.setDesc(
				"Whether to pass --cloud option. If you don't have the wolfram engine set it to true."
			)
			.addToggle((component) =>
				component
					.setValue(this.plugin.settings.useCloud)
					.onChange(async (value) => {
						this.plugin.settings.useCloud = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
