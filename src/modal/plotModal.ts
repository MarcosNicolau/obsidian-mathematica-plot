import MathematicaPlot from "main";
import { renderGraphPreview, renderSettings } from "./menus";
import { Editor, Modal } from "obsidian";
import { PlotSettings } from "types/plot";

type Options = {
	isEditing: boolean;
	afterSubmit: (el: HTMLElement) => void;
};

const defaultSettings: Options = {
	isEditing: false,
	afterSubmit: () => null,
};
export class PlotModal extends Modal {
	editor: Editor;
	settings: PlotSettings;
	plugin: MathematicaPlot;
	options: Options;

	constructor(
		plugin: MathematicaPlot,
		editor: Editor,
		settings: PlotSettings,
		options: Partial<Options>
	) {
		super(plugin.app);
		this.plugin = plugin;
		this.editor = editor;
		this.settings = settings;
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

	onClose(): void {}
}
