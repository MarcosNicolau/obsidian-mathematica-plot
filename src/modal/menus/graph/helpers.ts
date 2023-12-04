import { Setting } from "obsidian";
import {
	Graph,
	GraphTypes,
	Interval,
	Options3D,
	PlotSettings,
	PlotType,
} from "types/plot";

export type OptionsFields = {
	[key in keyof Omit<Options3D, "others">]?: string;
};

export const renderOptions =
	(optionsFields: OptionsFields) =>
	(el: HTMLElement, settings: PlotSettings, options: Graph["options"]) => {
		el.createEl("h5", {
			text: `Plot Options ${settings.raster.dim}`,
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

export const defaultGraphType = (): PlotType => ({
	plot: {
		expression: "",
		plotRange: { x: { min: "", max: "" }, y: { min: "", max: "" } },
	},
	parametricPlot: {
		components: [],
		domain: { u: { min: "", max: "" }, v: { min: "", max: "" } },
	},
	regionPlot: {
		expression: "",
		domain: {
			x: { min: "", max: "" },
			y: { min: "", max: "" },
			z: { min: "", max: "" },
		},
	},
});

export const defaultGraph = (id: string, type: GraphTypes): Graph => ({
	id,
	type,
	options: {},
	...defaultGraphType(),
});

export const graphTypesOptions: { [key in GraphTypes]: string } = {
	plot: "Plot",
	parametricPlot: "Parametric Plot",
	regionPlot: "Region Plot",
};
