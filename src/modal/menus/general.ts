import { GeneralSettings } from "types/plot";
import { Setting } from "obsidian";
import { PlotModal } from "modal/plotModal";

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
		name: "Axes",
	},
	axesLabel: {
		desc: "",
		name: "Axes Label",
	},
	plotLabel: {
		name: "Label",
	},
	frame: {
		desc: "",
		isToggle: true,
		name: "Frame",
	},
	frameLabel: {
		name: "Frame Label",
	},
	boxed: {
		desc: "",
		isToggle: true,
		name: "Boxed",
	},
};

export const renderGeneralSettings = (el: HTMLElement, modal: PlotModal) => {
	const settings = modal.settings;
	el.createEl("h5", { text: "General settings" });
	Object.entries(generalSettings).forEach((setting, index) => {
		const fieldName = setting[0];
		const value = setting[1];
		// This is to ensure a line gets in the header only for the first field.
		const elToDisplay = index == 0 ? el : el.createDiv();
		if (value.isToggle) {
			new Setting(elToDisplay)
				.addToggle((toggle) =>
					//@ts-expect-error the value type is checked based on the toggle or not
					toggle.setValue(settings.general[fieldName]).onChange(
						//@ts-expect-error we know that the field name belongs to the general setting options fro
						(value) => (settings.general[fieldName] = value)
					)
				)
				.setName(value.name)
				.setDesc(value.desc || "");
		} else
			new Setting(elToDisplay)
				.addText((text) =>
					//@ts-expect-error the value type is checked based on the toggle or not
					text.setValue(settings.general[fieldName] || "").onChange(
						//@ts-expect-error we know that the field name belongs to the general setting options fro
						(value) => (settings.general[fieldName] = value)
					)
				)
				.setName(value.name)
				.setDesc(value.desc || "");
	});
};
