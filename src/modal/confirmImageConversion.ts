import MathematicaPlot from "main";
import { Editor, Modal } from "obsidian";

export class ConfirmImageConversionModal extends Modal {
	editor: Editor;
	plugin: MathematicaPlot;

	constructor(plugin: MathematicaPlot, editor: Editor) {
		super(plugin.app);
		this.plugin = plugin;
		this.editor = editor;
	}

	onOpen(): void {
		const { contentEl } = this;
		contentEl.createEl("h4", { text: "Are you sure?" });
		contentEl.createEl("p", {
			text: "You will convert this codeblock into an image and you won't be able to edit them later",
		});
		const checkbox = contentEl.createEl("option", {
			text: "Don't show this again",
		});
		const confirmBtn = contentEl.createEl("button", { text: "Confirm" });
		confirmBtn.click = () => {
			if (checkbox.selected) {
				this.plugin.settings.showConfirmImageModal = false;
				this.plugin.saveSettings();
			}
			this.convertCodeblockToImage();
		};
	}

	convertCodeblockToImage() {}
}
