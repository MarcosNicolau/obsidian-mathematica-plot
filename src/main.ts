import { defaultGraphType } from "./modal/menus/graph/helpers";
import {
	Plugin,
	Platform,
	ExtraButtonComponent,
	parseYaml,
	MarkdownView,
} from "obsidian";
import { PlotModal } from "modal/plotModal";
import { PlotSettings } from "types/plot";
import { MathematicaPlotSettingsTab } from "settingsTab";
import { MathematicaPlotSettings } from "types/plugin";
import { renderGraph } from "graphRender";
import { isReadingView } from "utils/editor";

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
				new PlotModal(this, editor, defaultPlotSettings, {}).open();
			},
		});
		this.registerMarkdownCodeBlockProcessor(
			"plot-mathematica",
			async (source, el) => {
				const plotEl = el.createDiv({ cls: "mathematica-plot" });
				await renderGraph(plotEl, source, {
					...this.settings,
				});
				const view =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (!view || isReadingView(view)) return;
				const cursorPos = view.editor.getCursor();

				const button = new ExtraButtonComponent(plotEl)
					.setIcon("settings-2")
					.setTooltip("Edit plot settings")
					.onClick(() => {
						// This selects all the content inside the codeblock
						el.parentElement
							?.querySelector<HTMLElement>(".edit-block-button")
							?.click();

						if (view) {
							const settings: PlotSettings = parseYaml(source);
							// We need to add the default fields to the graphs
							settings.graphs = settings.graphs.map((graph) => ({
								...defaultGraphType(),
								...graph,
							}));
							new PlotModal(this, view.editor, settings, {
								isEditing: true,
								onClose: () => view.editor.setCursor(cursorPos),
							}).open();
						}
					});
				button.extraSettingsEl.addClass("mathematica-plot-edit-btn");
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
