import { renderGraphPreview, renderSettings } from "./menus";
import { App, Editor, Modal } from "obsidian";
import { Settings } from "types/plot";

export class PlotModal extends Modal {
	editor: Editor;
	settings: Settings;

	constructor(app: App, editor: Editor, settings: Settings) {
		super(app);
		this.editor = editor;
		this.settings = settings;
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
