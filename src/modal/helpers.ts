import { PlotModal } from "modal/plotModal";
import { Editor, Setting } from "obsidian";
import { GeneralSettings, Settings } from "types/plot";
import { buildBase64URL, getBase64Plot, parseCodeBlock } from "utils/plot";

export const displayRasterSettings = (
	el: HTMLElement,
	settings: Settings,
	renderMenu: (value: string, el: HTMLElement) => void
) => {
	el.createEl("h5", { text: "Raster settings" });
	new Setting(el).setName("Type").addDropdown((component) => {
		component.addOptions({
			"2D": "2D",
			"3D": "3D",
		});
		component.onChange((value) => {
			settings.raster.type = "2D";
			renderMenu(value, el.createDiv());
		});
	});
	new Setting(el.createDiv())
		.addText((text) =>
			text
				.setValue(settings.raster.background)
				.onChange((value) => (settings.raster.background = value))
		)
		.setName("Background");
	new Setting(el.createDiv())
		.addText((text) =>
			text
				.setValue(settings.raster.dimensions.height)
				.onChange(
					(value) => (settings.raster.dimensions.height = value)
				)
		)
		.setName("Height");
	new Setting(el.createDiv())
		.addText((text) =>
			text
				.setValue(settings.raster.dimensions.width)
				.onChange((value) => (settings.raster.dimensions.width = value))
		)
		.setName("Width");
};

const generalSettings: {
	[key in keyof GeneralSettings]: {
		name: string;
		isToggle?: boolean;
		value?: string;
		desc?: string;
	};
} = {
	axes: {
		desc: "",
		isToggle: true,
		name: "Axes",
	},
	axesLabel: {
		desc: "",
		name: "AxesLabel",
	},
	boxed: {
		desc: "",
		isToggle: true,
		name: "Boxed",
	},
	frame: {
		desc: "",
		isToggle: true,
		name: "Frame",
	},
	frameLabel: {
		name: "FrameLabel",
	},
};

export const displayGeneralSettings = (el: HTMLElement, settings: Settings) => {
	el.createEl("h5", { text: "Plot settings" });
	Object.entries(generalSettings).forEach((setting, index) => {
		const fieldName = setting[0];
		const value = setting[1];
		// This is to ensure a line gets in the header only for the first field.
		const elToDisplay = index == 0 ? el : el.createDiv();
		if (value.isToggle) {
			new Setting(elToDisplay)
				.addToggle((toggle) =>
					toggle.setValue(true).onChange(
						//@ts-expect-error we know that the field name belongs to the general setting options fro
						(value) => (settings.general[fieldName] = value)
					)
				)
				.setName(value.name)
				.setDesc(value.desc || "");
		} else
			new Setting(elToDisplay)
				.addText((text) =>
					text.setValue(value.value || "").onChange(
						//@ts-expect-error we know that the field name belongs to the general setting options fro
						(value) => (settings.general[fieldName] = value)
					)
				)
				.setName(value.name)
				.setDesc(value.desc || "");
	});
};

export const graphPreview = async (
	el: HTMLElement,
	{ settings }: PlotModal
) => {
	el.setAttr(
		"style",
		"width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: space-between"
	);
	const content = el.createDiv();
	const graph = el.createDiv();

	content.createEl("h5", { text: "Graph preview" });
	content.createEl("p", { text: "A preview of what your graph looks like" });
	el.createEl("button", {
		text: "Render preview",
		attr: { style: "width: 100%;" },
	}).onClickEvent((e) => {
		e.preventDefault();
		renderPreview();
	});
	const renderPreview = async () => {
		graph.innerHTML = "Loading...";
		const { code, error: error1 } = parseCodeBlock(
			JSON.stringify(settings)
		);
		if (error1) return (graph.innerHTML = error1);
		const { base64, error: error2 } = await getBase64Plot(code);
		if (error2) return (graph.innerHTML = error2);
		graph.innerHTML = "";
		const src = buildBase64URL(base64, "png");
		const img = document.createElement("img");
		img.src = src;
		graph.appendChild(img);
	};
};

type Menu = (
	el: HTMLElement,
	modal: PlotModal,
	editor: Editor,
	settings: Settings
) => void;

export const Menu2D: Menu = (el, modal, editor, settings) => {
	new Setting(el)
		.addText((text) => text.setValue("None"))
		.setName("Background")
		.setDesc("Plot background");
	new Setting(el.createDiv())
		.addText((text) => text)
		.setName("functions")
		.setDesc("Add your functions");

	new Setting(el).addButton((btn) =>
		btn
			.setButtonText("Submit")
			.setCta()
			.onClick(async () => {
				modal.close();
				const line = editor.getCursor().line;
				editor.setLine(
					line,
					`\`\`\`plot-mathematica \n ${JSON.stringify(
						settings,
						null,
						4
					)}\`\`\``
				);
			})
	);
};

export const Menu3D: Menu = (el, modal, editor) => {};
