import { Setting } from "obsidian";
import { Graph3D, Interval, Options3D, PlotSettings } from "types/plot";

export type OptionsFields = {
	[key in keyof Omit<Options3D, "others">]?: string;
};

export const renderOptions =
	(optionsFields: OptionsFields) =>
	(el: HTMLElement, settings: PlotSettings, options: Graph3D["options"]) => {
		el.createEl("h5", {
			text: `Plot Options ${settings.raster.type}`,
		});
		Object.entries(optionsFields).forEach(
			(entry: [keyof Options3D, string], index) =>
				new Setting(index === 0 ? el : el.createDiv())
					.setName(entry[1])
					.addText((component) =>
						component
							.setValue(options[entry[0]] || "")
							.onChange((value) => {
								options[entry[0]] = value;
							})
					)
		);
		new Setting(el.createDiv())
			.setName("Others")
			.setDesc(
				"Add any other option for the plot following the mathematica syntax"
			)
			.addTextArea((component) =>
				component.setValue(options.others || "").onChange((value) => {
					options.others = value;
				})
			);
	};

export const renderIntervalForm = (
	el: HTMLElement,
	variable: string,
	interval: Interval
) => {
	new Setting(el.createDiv())
		.setName(`${variable} min`)
		.addText((component) =>
			component.setValue(interval.min).onChange((value) => {
				interval.min = value;
			})
		);
	new Setting(el.createDiv())
		.setName(`${variable} max`)
		.addText((component) =>
			component.setValue(interval.max).onChange((value) => {
				interval.max = value;
			})
		);
};
