import { App, Editor, Modal, Setting } from "obsidian";
import { getSVGPlot } from "utils/plot";

type Interval = {
	from: string;
	to: string;
};

type CurveSettings = {
	t: Interval;
	expressions: string[];
};

type SurfaceSettings = {
	components: string[];
	u: Interval;
	v: Interval;
};

type FunctionSettings = {
	expression: string;
	domain: Interval;
};

type PlotRange = {
	x: { min: number; max: number };
	y: { min: number; max: number };
	z?: { min: number; max: number };
};

type PlotFunctionSettings = {
	type: "surface" | "curve" | "function";
	PlotLabel: string;
	PlotStyle: "Automatic";
	Filling: "None";
	FillingStyle: "None";
};

type ShowSettings = {
	PlotRange: "Automatic" | "All" | "Full";
	Ticks: "None" | "Automatic" | PlotRange;
};

type Settings = {
	show: ShowSettings;
};

export class PlotModal extends Modal {
	editor: Editor;

	constructor(app: App, editor: Editor) {
		super(app);
		this.editor = editor;
	}

	onOpen(): void {
		const { contentEl } = this;
		contentEl.createEl("h1", { text: "Plot " });
		let exp = "";
		new Setting(contentEl).setName("Label").addText((text) =>
			text.onChange((value) => {
				exp = value;
			})
		);
		new Setting(contentEl).addButton((btn) =>
			btn
				.setButtonText("Submit")
				.setCta()
				.onClick(async () => {
					this.close();
					const line = this.editor.getCursor().line;
					this.editor.setLine(line, "Loading...");

					this.editor.setLine(line, "```plot-mathematica \n```");
				})
		);
	}
	onClose(): void {}
}
