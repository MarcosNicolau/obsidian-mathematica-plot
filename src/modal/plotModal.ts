import { graphPreview } from "./helpers";
import {
	Menu2D,
	Menu3D,
	displayGeneralSettings,
	displayRasterSettings,
} from "modal/helpers";
import { App, Editor, Modal } from "obsidian";
import { Settings } from "types/plot";

export class PlotModal extends Modal {
	editor: Editor;
	settings: Settings = {
		curves2D: [],
		curves3D: [],
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
		scalarFields2D: [
			{
				expression: "x^2",
				options: { plotStyle: "Red" },
				plotRange: { x: { min: "0", max: "10" } },
			},
		],
		scalarFields3D: [],
		surfaces: [],
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
		displayRasterSettings(settings, this.settings, this.renderMenu);
		displayGeneralSettings(settings, this.settings);
		displayGeneralSettings(settings, this.settings);
		graphPreview(preview, this);
	}

	onClose(): void {}

	renderMenu(dimensions: string, el: HTMLElement) {
		el.innerHTML = "";
		if (dimensions === "2D") Menu2D(el, this, this.editor, this.settings);
		if (dimensions === "3D") Menu3D(el, this, this.editor, this.settings);
	}
}
