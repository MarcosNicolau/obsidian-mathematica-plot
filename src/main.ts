import { Plugin } from "obsidian";
import { PlotModal } from "plotModal";
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
				new PlotModal(this.app, editor).open();
			},
		});
		this.registerMarkdownCodeBlockProcessor(
			"plot-mathematica",
			async (source, el, ctx) => {
				console.log("hello world");
				el.innerHTML = "LOADING...";
				const plot = await getSVGPlot(
					`Show[ParametricPlot3D[{v*Cos[u], v*Sin[u], Sqrt[1 - v^2]},{u, 0, 2Pi}, {v, 0 ,1}, PlotRange -> {-2, 2}, Background -> Transparent], ParametricPlot3D[{Cos[u], Sin[u], 0}, {u, 0 , 2Pi}]]`
				);
				const image = `<img src="data:image/png;base64,${plot.replace(
					/\s/g,
					""
				)}" />`;
				el.innerHTML = image;
			}
		);
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
