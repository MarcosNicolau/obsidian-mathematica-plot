import { Plugin, Platform } from "obsidian";
import { PlotModal } from "modal/plotModal";
import { PlotSettings } from "types/plot";
import { MathematicaPlotSettingsTab } from "settingsTab";
import { MathematicaPlotSettings } from "types/plugin";
import { renderGraph } from "graphRender";

const DEFAULT_SETTINGS: MathematicaPlotSettings = {
	useCloud: false,
	wolframScriptPath: "",
};

const defaultPlotSettings: PlotSettings = {
	raster: {
		dim: "2D",
		background: "None",
		size: {
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
			async (source, el) =>
				renderGraph(el, source, {
					...this.settings,
				})
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
