import { buildBase64URL, parseCodeBlock } from "./utils/plot";
import { Plugin, Platform } from "obsidian";
import { PlotModal } from "modal/plotModal";
import { getBase64Plot } from "utils/plot";
import { Settings } from "types/plot";

interface MyPluginSettings {
	useCloud: boolean;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	useCloud: false,
};

const defaultPlotSettings: Settings = {
	raster: {
		type: "2D",
		background: "None",
		dimensions: {
			height: "Automatic",
			width: "250",
		},
	},
	general: {
		axes: "True",
		axesLabel: "{x, y}",
		frame: "False",
		boxed: "True",
	},
	graphs: [],
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
				new PlotModal(this.app, editor, defaultPlotSettings).open();
			},
		});
		this.registerMarkdownCodeBlockProcessor(
			"plot-mathematica",
			async (source, el) => {
				el.innerHTML = "Loading...";
				const { code, error: error1 } = parseCodeBlock(source);
				if (error1) return (el.innerHTML = error1);
				const { base64, error: error2 } = await getBase64Plot(
					code,
					false
				);
				if (error2) return (el.innerHTML = error2);
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
