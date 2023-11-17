import { GeneralSettings, Settings } from "types/plot";
import { Setting } from "obsidian";

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
	el.createEl("h5", { text: "General settings" });
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
