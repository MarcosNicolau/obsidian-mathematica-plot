import {
	graphPreview,
	displayGeneralSettings,
	displayRasterSettings,
} from "./menus";
import { App, Editor, Modal } from "obsidian";
import { Settings } from "types/plot";

export class PlotModal extends Modal {
	editor: Editor;
	settings: Settings = {
		general: {
			axes: true,
			frame: true,
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
					type: "scalarField",
					scalarField: {
						expression: "x^2",
						options: { plotStyle: "Red" },
						plotRange: { x: { min: "0", max: "10" } },
					},
				},
			],
			dim3: [],
		},
	};

	constructor(app: App, editor: Editor) {
		super(app);
		this.editor = editor;
	}

	onOpen(): void {
		const { contentEl } = this;
		contentEl.createEl("h4", { text: "Plot" });
		const flex = contentEl.createEl("div", {
			attr: { style: "display: flex; gap: 16px" },
		});
		const settings = flex.createDiv();
		const preview = flex.createDiv();
		displayGeneralSettings(settings, this.settings);
		displayRasterSettings(settings, this);
		graphPreview(preview, this);
	}

	onClose(): void {}
}
