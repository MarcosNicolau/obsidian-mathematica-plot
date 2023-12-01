import { buildBase64URL, parseCodeBlock } from "./utils/plot";
import { Plugin, Platform } from "obsidian";
import { PlotModal } from "modal/plotModal";
import { getBase64Plot } from "utils/plot";
import { PlotSettings } from "types/plot";
import { MathematicaPlotSettingsTab } from "settingsTab";
import { MathematicaPlotSettings } from "types/plugin";

const DEFAULT_SETTINGS: MathematicaPlotSettings = {
	useCloud: false,
};

const defaultPlotSettings: PlotSettings = {
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

export default class MathematicaPlot extends Plugin {
	settings: MathematicaPlotSettings;

	async onload() {
		if (Platform.isMobile) return;
		await this.loadSettings();
		this.addCommand({
			id: "plot-graph",
			name: "Plot Graph",
			editorCallback: (editor) => {
				new PlotModal(this, editor, defaultPlotSettings).open();
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
					this.settings.useCloud
				);
				if (error2) return (el.innerHTML = error2);
				el.innerHTML = "";
				const src = buildBase64URL(base64, "png");
				const img = document.createElement("img");
				img.src = src;
				el.appendChild(img);
			}
		);
		this.addSettingTab(new MathematicaPlotSettingsTab(this.app, this));
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
