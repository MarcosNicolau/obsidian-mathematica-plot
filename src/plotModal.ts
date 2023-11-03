import { App, Editor, Modal, Setting } from "obsidian";

export class PlotModal extends Modal {
	editor: Editor;

	constructor(app: App, editor: Editor) {
		super(app);
		this.editor = editor;
	}

	onOpen(): void {
		const { contentEl } = this;
		contentEl.createEl("h1", { text: "Plot " });
		new Setting(contentEl)
			.setName("Dimensions")
			.addDropdown((component) => {
				component.addOptions({
					"2D": "2D",
					"3D": "3D",
				});
				component.onChange((value) => this.renderMenu(value, el));
			});
		const el = contentEl.createDiv();
		this.renderMenu("2D", el);
	}

	onClose(): void {}

	renderMenu(dimensions: string, el: HTMLElement) {
		el.innerHTML = "";
		if (dimensions === "2D") {
			new Setting(el).addButton((btn) =>
				btn
					.setButtonText("Submit")
					.setCta()
					.onClick(async () => {
						this.close();
						const line = this.editor.getCursor().line;
						this.editor.setLine(
							line,
							`\`\`\`plot-mathematica \n ${JSON.stringify(
								{
									type: "2D",
									surface: [
										{ expression: "x^2 + 2", color: "Red" },
									],
									something_else: "h",
								},
								null,
								4
							)}\`\`\``
						);
					})
			);
		}
	}
}
