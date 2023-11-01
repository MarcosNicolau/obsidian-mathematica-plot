import { Plugin } from "obsidian";
import { getSVGPlot } from "utils/plot";

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
};

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: "plot-graph",
			name: "Plot Graph",
			editorCallback: (editor, ctx) => {
				editor.setValue(
					`![image](data:image/jpeg;base64,${getSVGPlot(
						"Plot3D[x^4 + y^4 - 5 x^2*y^2, {x, -3, 3}, {y, -3, 3}, PlotStyle -> Opacity[0.4], Background -> None]"
					).replace(/\s/g, "")})`
				);
			},
		});
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
