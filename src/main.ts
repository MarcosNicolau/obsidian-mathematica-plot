import { buildBase64URL, parseCodeBlock } from "./utils/plot";
import { Plugin, Platform } from "obsidian";
import { PlotModal } from "plotModal";
import { getBase64Plot } from "utils/plot";

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
};

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		if (Platform.isMobile) return;
		await this.loadSettings();
		this.addCommand({
			id: "plot-graph",
			name: "Plot Graph",
			editorCallback: (editor) => {
				new PlotModal(this.app, editor).open();
			},
		});
		this.registerMarkdownCodeBlockProcessor(
			"plot-mathematica",
			async (source, el) => {
				el.innerHTML = "Loading...";
				const mathematicaCode = parseCodeBlock(source);
				const { base64, error } = await getBase64Plot(mathematicaCode);

				console.log("error is: ", error);

				if (error) return (el.innerHTML = error);
				el.innerHTML = "";
				const src = buildBase64URL(base64, "png");
				const img = document.createElement("img");
				img.src = src;
				el.appendChild(img);
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
