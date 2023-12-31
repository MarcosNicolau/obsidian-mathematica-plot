import { GeneralSettings } from "types/plot";
import { Setting } from "obsidian";
import { PlotModal } from "modal/plotModal";

type GeneralSettingsFields = {
	name: string;
	value?: string;
	desc?: string;
};

const generalSettings: {
	[key in keyof GeneralSettings]: GeneralSettingsFields;
} = {
	axes: {
		desc: "Whether to draw axes",
		name: "Axes",
	},
	axesLabel: {
		desc: "",
		name: "Axes Label",
	},
	plotLabel: {
		name: "Label",
		desc: "Overall label for the plot",
	},
	frame: {
		desc: "Whether to put a frame around the plot",
		name: "Frame",
	},
	frameLabel: {
		name: "Frame Label",
	},
	boxed: {
		desc: "Whether to draw the bounding box for 3d graphics",
		name: "Boxed",
	},
} as const;

export const renderGeneralSettings = (el: HTMLElement, modal: PlotModal) => {
	const settings = modal.settings;
	el.createEl("h5", { text: "General settings" });
	Object.entries(generalSettings).forEach(
		(
			setting: [keyof typeof generalSettings, GeneralSettingsFields],
			index
		) => {
			const fieldName = setting[0];
			const value = setting[1];
			// This is to ensure a line gets in the header only for the first field.
			const elToDisplay = index == 0 ? el : el.createDiv();
			new Setting(elToDisplay)
				.addText((text) =>
					text
						.setValue(settings.general[fieldName] || "")
						.onChange(
							(value) => (settings.general[fieldName] = value)
						)
				)
				.setName(value.name)
				.setDesc(value.desc || "");
		}
	);
};
