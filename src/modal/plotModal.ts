import MathematicaPlot from "main";
import { renderGraphPreview, renderSettings } from "./menus";
import { Editor, Modal } from "obsidian";
import { PlotSettings } from "types/plot";

type Options = {
	isEditing: boolean;
	afterSubmit: (el: HTMLElement) => void;
	onClose: () => void;
};

const defaultSettings: Options = {
	isEditing: false,
	afterSubmit: () => null,
	onClose: () => null,
};

const defaultPlotSettings = (): PlotSettings => ({
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
});

export class PlotModal extends Modal {
	editor: Editor;
	settings: PlotSettings = defaultPlotSettings();
	plugin: MathematicaPlot;
	options: Options;

	constructor(
		plugin: MathematicaPlot,
		editor: Editor,
		settings: PlotSettings | null,
		options: Partial<Options>
	) {
		super(plugin.app);
		this.plugin = plugin;
		this.editor = editor;
		if (settings) this.settings = settings;
		this.options = { ...defaultSettings, ...options };
	}

	onOpen(): void {
		const { contentEl } = this;
		this.modalEl.addClass("mathematica-plot-modal");
		contentEl.createEl("h4", { text: "Plot" });
		const flex = contentEl.createEl("div", {
			cls: "mathematica-plot-modal-content-container",
		});
		const settings = flex.createDiv();
		const preview = flex.createDiv();
		settings.addClass("mathematica-plot-modal-settings");
		preview.addClass("mathematica-plot-modal-preview");
		renderSettings(settings, this);
		renderGraphPreview(preview, this);
	}

	onClose(): void {
		this.options.onClose();
	}
}
