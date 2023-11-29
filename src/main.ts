import { buildBase64URL, parseCodeBlock } from "./utils/plot";
import { Plugin, Platform } from "obsidian";
import { PlotModal } from "modal/plotModal";
import { getBase64Plot } from "utils/plot";
import { Settings } from "types/plot";

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
};

const defaultPlotSettings: Settings = {
	general: {
		axes: "True",
		axesLabel: "{x, y}",
		frame: false,
		boxed: true,
	},
	raster: {
		type: "2D",
		background: "None",
		dimensions: {
			height: "250",
			width: "200",
		},
	},
	graphs: {
		dim2: [
			{
				id: "graph_0",
				type: "plot",
				plot: {
					expression: "x^2",
					plotRange: { x: { min: "0", max: "10" } },
				},
				options: { plotStyle: "Red" },
			},
		],
		dim3: [],
	},
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
				const { base64, error: error2 } = await getBase64Plot(code);
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
