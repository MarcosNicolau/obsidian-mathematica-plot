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
		contentEl.createEl("h4", { text: "Plot" });
		const flex = contentEl.createEl("div", {
			attr: { style: "display: flex; gap: 16px" },
		});
		const settings = flex.createDiv();
		const preview = flex.createDiv();
		renderSettings(settings, this);
		renderGraphPreview(preview, this);
	}

	onClose(): void {}
}
